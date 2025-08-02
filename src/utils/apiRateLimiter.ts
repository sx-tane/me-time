import { RateLimitConfig } from '../types';

interface RateLimitInfo {
  maxRequests: number;
  windowMs: number;
  requests: number[];
}

interface RateLimitStats {
  remaining: number;
  resetTime: number;
  used: number;
  limit: number;
}

class APIRateLimiter {
  private limits: Map<string, RateLimitInfo>;
  private requests: Map<string, number[]>;

  constructor() {
    this.limits = new Map();
    this.requests = new Map();
  }

  setLimit(apiName: string, maxRequests: number, windowMs: number): void {
    this.limits.set(apiName, {
      maxRequests,
      windowMs,
      requests: []
    });
  }

  async checkLimit(apiName: string): Promise<boolean> {
    if (!this.limits.has(apiName)) {
      return true; // No limits set
    }

    const limit = this.limits.get(apiName)!; // Safe because we checked above
    const now = Date.now();
    
    // Clean expired requests
    limit.requests = limit.requests.filter(time => 
      now - time < limit.windowMs
    );

    if (limit.requests.length >= limit.maxRequests) {
      const oldestRequest = limit.requests[0];
      const waitTime = limit.windowMs - (now - oldestRequest);
      
      console.log(`⏱️ Rate limit reached for ${apiName}, waiting ${waitTime}ms`);
      await new Promise(resolve => setTimeout(resolve, waitTime));
      
      // Re-check after waiting
      return this.checkLimit(apiName);
    }

    limit.requests.push(now);
    return true;
  }

  getStats(apiName: string): RateLimitStats | null {
    const limit = this.limits.get(apiName);
    if (!limit) return null;

    const now = Date.now();
    const recentRequests = limit.requests.filter(time => 
      now - time < limit.windowMs
    );

    return {
      remaining: limit.maxRequests - recentRequests.length,
      resetTime: recentRequests.length > 0 ? 
        recentRequests[0] + limit.windowMs : now,
      used: recentRequests.length,
      limit: limit.maxRequests
    };
  }
}

export default new APIRateLimiter();