import AsyncStorage from '@react-native-async-storage/async-storage';
import config from '../config/environment';

interface APIStats {
  requests: number;
  tokens?: number;
  cost: number;
  cached?: number;
}

interface SessionStats {
  openai: APIStats;
  places: APIStats;
  total: APIStats;
}

interface DailyStats {
  openai: APIStats;
  places: APIStats;
}

interface WeeklyStatsItem extends DailyStats {
  date: string;
}

interface SessionStatsWithSavings extends SessionStats {
  savings: {
    places: number;
    total: number;
  };
}

interface APIUsage {
  tokens?: number;
  cost?: number;
}

class APIMonitoringService {
  private sessionStats: SessionStats;

  constructor() {
    this.sessionStats = {
      openai: { requests: 0, tokens: 0, cost: 0 },
      places: { requests: 0, cached: 0, cost: 0 },
      total: { requests: 0, cost: 0 }
    };
  }

  async trackOpenAIUsage(tokens: number): Promise<void> {
    this.sessionStats.openai.requests++;
    this.sessionStats.openai.tokens = (this.sessionStats.openai.tokens || 0) + tokens;
    // GPT-4o-mini pricing: ~$0.00015 per 1K tokens
    const cost = (tokens * 0.00015) / 1000;
    this.sessionStats.openai.cost += cost;
    this.sessionStats.total.requests++;
    this.sessionStats.total.cost += cost;

    await this._persistDailyStats('openai', { 
      tokens, 
      cost 
    });

    if (config.ENABLE_DEBUG_LOGS) {
      console.log(`💰 OpenAI cost: $${this.sessionStats.openai.cost.toFixed(6)}`);
    }
  }

  async trackPlacesUsage(cached = false): Promise<void> {
    this.sessionStats.places.requests++;
    if (cached) {
      this.sessionStats.places.cached = (this.sessionStats.places.cached || 0) + 1;
    } else {
      // Google Places API pricing: ~$0.017 per request
      this.sessionStats.places.cost += 0.017;
      this.sessionStats.total.cost += 0.017;
      
      await this._persistDailyStats('places', { cost: 0.017 });
    }
    
    this.sessionStats.total.requests++;

    if (config.ENABLE_DEBUG_LOGS) {
      const savings = (this.sessionStats.places.cached || 0) * 0.017;
      console.log(`🗺️ Places cost: $${this.sessionStats.places.cost.toFixed(4)}, saved: $${savings.toFixed(4)}`);
    }
  }

  private async _persistDailyStats(api: string, usage: APIUsage): Promise<void> {
    try {
      const today = new Date().toDateString();
      const key = `api_stats_${api}_${today}`;
      
      const existing = await AsyncStorage.getItem(key);
      const stats: APIStats = existing ? JSON.parse(existing) : { requests: 0, tokens: 0, cost: 0 };
      
      stats.requests++;
      if (usage.tokens) stats.tokens = (stats.tokens || 0) + usage.tokens;
      if (usage.cost) stats.cost += usage.cost;
      
      await AsyncStorage.setItem(key, JSON.stringify(stats));
    } catch (error) {
      console.error('Error persisting API stats:', error);
    }
  }

  getSessionStats(): SessionStatsWithSavings {
    return {
      ...this.sessionStats,
      savings: {
        places: (this.sessionStats.places.cached || 0) * 0.017,
        total: (this.sessionStats.places.cached || 0) * 0.017
      }
    };
  }

  async getDailyStats(date: string = new Date().toDateString()): Promise<DailyStats | null> {
    try {
      const openaiStats = await AsyncStorage.getItem(`api_stats_openai_${date}`);
      const placesStats = await AsyncStorage.getItem(`api_stats_places_${date}`);
      
      return {
        openai: openaiStats ? JSON.parse(openaiStats) : { requests: 0, tokens: 0, cost: 0 },
        places: placesStats ? JSON.parse(placesStats) : { requests: 0, cost: 0 }
      };
    } catch (error) {
      console.error('Error getting daily stats:', error);
      return null;
    }
  }

  async getWeeklyStats(): Promise<WeeklyStatsItem[]> {
    const stats: WeeklyStatsItem[] = [];
    const today = new Date();
    
    for (let i = 0; i < 7; i++) {
      const date = new Date(today);
      date.setDate(today.getDate() - i);
      const dayStats = await this.getDailyStats(date.toDateString());
      if (dayStats) {
        stats.push({
          date: date.toDateString(),
          ...dayStats
        });
      }
    }
    
    return stats;
  }

  async checkBudgetAlert(dailyBudget = 1.0): Promise<boolean> {
    const todayStats = await this.getDailyStats();
    if (!todayStats) return false;

    const totalCost = todayStats.openai.cost + todayStats.places.cost;
    
    if (totalCost > dailyBudget * 0.8) {
      console.warn(`⚠️ API costs approaching daily budget: $${totalCost.toFixed(4)}/$${dailyBudget}`);
      return true;
    }
    
    return false;
  }

  reset(): void {
    this.sessionStats = {
      openai: { requests: 0, tokens: 0, cost: 0 },
      places: { requests: 0, cached: 0, cost: 0 },
      total: { requests: 0, cost: 0 }
    };
  }
}

export default new APIMonitoringService();