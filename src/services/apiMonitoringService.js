import AsyncStorage from '@react-native-async-storage/async-storage';
import config from '../config/environment';

class APIMonitoringService {
  constructor() {
    this.sessionStats = {
      openai: { requests: 0, tokens: 0, cost: 0 },
      places: { requests: 0, cached: 0, cost: 0 },
      total: { requests: 0, cost: 0 }
    };
  }

  async trackOpenAIUsage(tokens) {
    this.sessionStats.openai.requests++;
    this.sessionStats.openai.tokens += tokens;
    // GPT-4o-mini pricing: ~$0.00015 per 1K tokens
    this.sessionStats.openai.cost += (tokens * 0.00015) / 1000;
    this.sessionStats.total.requests++;
    this.sessionStats.total.cost += this.sessionStats.openai.cost;

    await this._persistDailyStats('openai', { 
      tokens, 
      cost: (tokens * 0.00015) / 1000 
    });

    if (config.ENABLE_DEBUG_LOGS) {
      console.log(`💰 OpenAI cost: $${this.sessionStats.openai.cost.toFixed(6)}`);
    }
  }

  async trackPlacesUsage(cached = false) {
    this.sessionStats.places.requests++;
    if (cached) {
      this.sessionStats.places.cached++;
    } else {
      // Google Places API pricing: ~$0.017 per request
      this.sessionStats.places.cost += 0.017;
      this.sessionStats.total.cost += 0.017;
      
      await this._persistDailyStats('places', { cost: 0.017 });
    }
    
    this.sessionStats.total.requests++;

    if (config.ENABLE_DEBUG_LOGS) {
      const savings = this.sessionStats.places.cached * 0.017;
      console.log(`🗺️ Places cost: $${this.sessionStats.places.cost.toFixed(4)}, saved: $${savings.toFixed(4)}`);
    }
  }

  async _persistDailyStats(api, usage) {
    try {
      const today = new Date().toDateString();
      const key = `api_stats_${api}_${today}`;
      
      const existing = await AsyncStorage.getItem(key);
      const stats = existing ? JSON.parse(existing) : { requests: 0, tokens: 0, cost: 0 };
      
      stats.requests++;
      if (usage.tokens) stats.tokens += usage.tokens;
      if (usage.cost) stats.cost += usage.cost;
      
      await AsyncStorage.setItem(key, JSON.stringify(stats));
    } catch (error) {
      console.error('Error persisting API stats:', error);
    }
  }

  getSessionStats() {
    return {
      ...this.sessionStats,
      savings: {
        places: this.sessionStats.places.cached * 0.017,
        total: this.sessionStats.places.cached * 0.017
      }
    };
  }

  async getDailyStats(date = new Date().toDateString()) {
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

  async getWeeklyStats() {
    const stats = [];
    const today = new Date();
    
    for (let i = 0; i < 7; i++) {
      const date = new Date(today);
      date.setDate(today.getDate() - i);
      const dayStats = await this.getDailyStats(date.toDateString());
      stats.push({
        date: date.toDateString(),
        ...dayStats
      });
    }
    
    return stats;
  }

  async checkBudgetAlert(dailyBudget = 1.0) {
    const todayStats = await this.getDailyStats();
    if (!todayStats) return false;

    const totalCost = todayStats.openai.cost + todayStats.places.cost;
    
    if (totalCost > dailyBudget * 0.8) {
      console.warn(`⚠️ API costs approaching daily budget: $${totalCost.toFixed(4)}/$${dailyBudget}`);
      return true;
    }
    
    return false;
  }

  reset() {
    this.sessionStats = {
      openai: { requests: 0, tokens: 0, cost: 0 },
      places: { requests: 0, cached: 0, cost: 0 },
      total: { requests: 0, cost: 0 }
    };
  }
}

export default new APIMonitoringService();