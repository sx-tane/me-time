import OpenAI from 'openai';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { STORAGE_KEYS } from '../constants/storage';
import config from '../config/environment';
import { AIResponseParser } from '../utils/aiResponseParser';
import apiRateLimiter from '../utils/apiRateLimiter';
import apiMonitoringService from './apiMonitoringService';
import { EnhancedSuggestion, Place, LocationSuggestion } from '../types';

// OpenAI API types
interface OpenAIUsage {
  prompt_tokens: number;
  completion_tokens: number;
  total_tokens: number;
}

interface OpenAIResponse {
  choices: Array<{
    message: {
      content: string;
    };
  }>;
  usage?: OpenAIUsage;
}

// Task generation types
interface TaskGenerationOptions {
  keywords?: string[];
  location?: Place | null;
  timeOfDay?: string;
  mood?: string;
  activityLevel?: string;
  weather?: string | null;
  season?: string | null;
  energyLevel?: string | null;
  context?: string;
}

interface ScenarioTemplate {
  keywords: string[];
  mood: string;
  activityLevel: string;
  preferredCategories: string[];
  timeEstimate: string;
  context: string;
}

interface TokenUsage {
  total: number;
  today: number;
  requests: number;
}

interface TokenUsageStats extends TokenUsage {
  estimatedCost: number;
}

interface CachedTask {
  task: EnhancedSuggestion;
  timestamp: number;
}

interface UserPreferences {
  preferredCategories?: string[];
  keywords?: string[];
  timeAvailable?: string;
}

type Season = 'spring' | 'summer' | 'autumn' | 'winter';
type EnergyLevel = 'low' | 'balanced' | 'energetic' | 'tired';
type Mood = 'peaceful' | 'energizing' | 'curious' | 'contemplative' | 'calming' | 'grounded' | 'balanced';
type ActivityLevel = 'gentle' | 'moderate';
type ScenarioType = 'work_break' | 'commute' | 'waiting' | 'home_evening' | 'social_gathering' | 'outdoor_space' | 'indoor_cozy' | 'morning_start' | 'stress_relief';

class AITaskService {
  private isConfigured: boolean;
  private tokenUsage: TokenUsage;
  private batchQueue: any[];
  private batchTimer: NodeJS.Timeout | null;
  private openai?: OpenAI;
  private cache: Map<string, CachedTask>;

  constructor() {
    this.isConfigured = !!config.OPENAI_API_KEY && config.OPENAI_API_KEY !== '';
    this.tokenUsage = { total: 0, today: 0, requests: 0 };
    this.batchQueue = [];
    this.batchTimer = null;
    
    if (this.isConfigured) {
      // Set rate limits for OpenAI (60 requests per minute)
      apiRateLimiter.setLimit('openai', 60, 60000);
      
      this.openai = new OpenAI({
        apiKey: config.OPENAI_API_KEY,
        dangerouslyAllowBrowser: true // For React Native/Expo
      });
    } else {
      console.warn('OpenAI API key not configured. AI task generation will use fallback tasks.');
    }
    
    this.cache = new Map();
  }

  async generateZenTask(options: TaskGenerationOptions = {}): Promise<EnhancedSuggestion> {
    console.log('🤖 generateZenTask called with options:', options);
    try {
      const {
        keywords = [],
        location = null,
        timeOfDay = 'any',
        mood = 'peaceful',
        activityLevel = 'gentle',
        weather = null,
        season = null,
        energyLevel = null
      } = options;

      // Auto-detect contextual factors if not provided
      const contextualSeason = season || this._getCurrentSeason();
      const contextualEnergyLevel = energyLevel || this._getEnergyLevelFromTimeAndMood(timeOfDay, mood);

      // If OpenAI is not configured, return a fallback task
      if (!this.isConfigured) {
        console.log('❌ OpenAI not configured, using fallback task');
        console.log('📝 API Key check:', config.OPENAI_API_KEY ? 'Key exists' : 'No key found');
        return this.getFallbackTask(options);
      }
      
      // Check rate limit before making API call
      await apiRateLimiter.checkLimit('openai');
      
      console.log('✅ OpenAI configured, generating AI task');

      const prompt = this.buildTaskPrompt(keywords, location, timeOfDay, mood, activityLevel, weather, contextualSeason, contextualEnergyLevel, options);
      const cacheKey = this.generateCacheKey(prompt);
      
      // Reduce cache time to prevent repetitive suggestions
      const cached = this.cache.get(cacheKey);
      if (cached && (Date.now() - cached.timestamp) < 60000) { // 1 minute cache only
        return cached.task;
      }

      if (config.ENABLE_DEBUG_LOGS) {
        console.log('🚀 Calling OpenAI API with prompt:', prompt.substring(0, 100) + '...');
      }
      
      if (!this.openai) {
        throw new Error('OpenAI client not initialized');
      }
      
      const response = await this.openai.chat.completions.create({
        model: config.OPENAI_MODEL,
        messages: [
          {
            role: 'system',
            content: `You create simple wellness activities. Respond with JSON only:
{"title":"Short title","description":"What to do","timeEstimate":"X-Y min","category":"mindful|sensory|movement|reflection|discovery|rest|creative|nature|social|connection|learning|play|service|gratitude","icon":"heart|leaf|walk|book|eye|ear|moon|sunny|star|water|flower|hand"}
Keep it simple and clear.`
          },
          {
            role: 'user',
            content: prompt
          }
        ],
        max_tokens: 150, // Allow slightly longer responses for variety
        temperature: 0.9  // Higher temperature for more variety
      }) as OpenAIResponse;

      const content = response.choices[0].message.content;
      if (config.ENABLE_DEBUG_LOGS) {
        console.log('📥 OpenAI response:', content);
      }
      
      // Track token usage
      this._trackTokenUsage(response.usage);
      await apiMonitoringService.trackOpenAIUsage(response.usage?.total_tokens || 0);
      
      // Use the new parser for safer parsing
      const task = AIResponseParser.parse(content);

      // Add unique ID and timestamp
      const enhancedTask: EnhancedSuggestion = {
        ...task,
        id: `ai_${Date.now()}_${Math.random().toString(36).substr(2, 9)}` as any,
        source: 'ai',
        generatedAt: new Date().toISOString()
      } as EnhancedSuggestion & { generatedAt: string };

      // Cache the result
      this.cache.set(cacheKey, {
        task: enhancedTask,
        timestamp: Date.now()
      });

      return enhancedTask;
    } catch (error) {
      console.error('❌ Error generating AI task:', error);
      console.log('🔄 Falling back to fallback task');
      return this.getFallbackTask(options);
    }
  }

  buildTaskPrompt(
    keywords: string[], 
    location: Place | null, 
    timeOfDay: string, 
    mood: string, 
    activityLevel: string, 
    weather: string | null = null, 
    season: string | null = null, 
    energyLevel: string = 'balanced', 
    options: TaskGenerationOptions = {}
  ): string {
    // Add variety by including random creativity prompts
    const creativityPrompts = [
      'Create a unique wellness activity. ',
      'Design an original mindfulness practice. ',
      'Invent a fresh wellness moment. ',
      'Think of an uncommon but simple wellness activity. ',
      'Create a creative wellness practice. '
    ];
    
    let prompt = creativityPrompts[Math.floor(Math.random() * creativityPrompts.length)];
    
    // Add context if provided
    if (options.context) {
      prompt += `The person is ${options.context}. `;
    }
    
    // Add location context
    if (location) {
      prompt += `They are at ${location.name || 'a location'}. `;
    }
    
    // Add keywords if provided
    if (keywords.length > 0) {
      prompt += `Focus on: ${keywords.slice(0, 3).join(', ')}. `;
    }
    
    // Add varied time and mood context
    if (timeOfDay !== 'any') {
      const timeVariations = {
        'morning': ['early morning', 'morning time', 'start of day', 'dawn'],
        'afternoon': ['midday', 'afternoon', 'middle of the day', 'daytime'],
        'evening': ['evening time', 'end of day', 'twilight', 'dusk']
      };
      const variations = timeVariations[timeOfDay as keyof typeof timeVariations] || [timeOfDay];
      const timeDesc = variations[Math.floor(Math.random() * variations.length)];
      prompt += `This is for ${timeDesc}. `;
    }
    
    const moodVariations = {
      'calming': ['calm', 'peaceful', 'serene', 'tranquil', 'relaxed'],
      'peaceful': ['peaceful', 'calm', 'centered', 'balanced', 'harmonious'],
      'energizing': ['energized', 'refreshed', 'revitalized', 'renewed', 'invigorated']
    };
    const variations = moodVariations[mood as keyof typeof moodVariations] || [mood];
    const moodDesc = variations[Math.floor(Math.random() * variations.length)];
    prompt += `The person wants to feel ${moodDesc}. `;
    
    // Add energy level guidance
    if (energyLevel === 'low' || energyLevel === 'tired') {
      prompt += 'Make it very gentle and restful. ';
    } else if (energyLevel === 'energetic') {
      prompt += 'Make it more engaging but still peaceful. ';
    }
    
    // Add randomness to prevent repetition
    const randomElement = Math.floor(Math.random() * 1000);
    prompt += `Be creative and original (${randomElement}). `;
    
    // Varied requirements
    prompt += `
    Requirements:
    - Takes 1-15 minutes
    - Easy to understand and do immediately
    - Uses simple, clear language
    - Helps create peace and calm
    - Title should be 3-6 words
    - Description should be 1-2 short sentences
    - AVOID repeating common activities like basic breathing exercises
    - Focus on unique, interesting approaches
    
    Choose from these categories: mindful, sensory, movement, reflection, discovery, rest, creative, nature, social, connection, learning, play, service, gratitude
    Use simple icons: heart, leaf, walk, book, eye, ear, moon, sunny, star, water, flower, hand`;

    return prompt;
  }

  generateCacheKey(prompt: string): string {
    // Include timestamp to prevent repetitive tasks
    const timeComponent = Math.floor(Date.now() / (1000 * 60 * 5)); // Changes every 5 minutes
    const baseKey = btoa(prompt + timeComponent).replace(/[^a-zA-Z0-9]/g, '').substr(0, 50);
    return baseKey;
  }

  getFallbackTask(options: TaskGenerationOptions = {}): EnhancedSuggestion {
    const { timeOfDay = 'any', mood = 'peaceful' } = options;
    const currentHour = new Date().getHours();
    
    const morningTasks: Partial<EnhancedSuggestion>[] = [
      {
        title: "Morning breaths",
        description: "Take three deep breaths and set an intention for your day.",
        timeEstimate: "2-5 min",
        category: "mindful",
        icon: "sunny"
      },
      {
        title: "Gentle stretch",
        description: "Stretch your body and notice how you feel.",
        timeEstimate: "5-10 min",
        category: "movement",
        icon: "walk"
      }
    ];
    
    const afternoonTasks: Partial<EnhancedSuggestion>[] = [
      {
        title: "Afternoon pause",
        description: "Step away from tasks and take a moment to reset.",
        timeEstimate: "2-5 min",
        category: "rest",
        icon: "moon"
      },
      {
        title: "Window watching",
        description: "Look outside and observe what you see.",
        timeEstimate: "3-5 min",
        category: "discovery",
        icon: "eye"
      }
    ];
    
    const eveningTasks: Partial<EnhancedSuggestion>[] = [
      {
        title: "Evening gratitude",
        description: "Think of three good things from today.",
        timeEstimate: "3-5 min",
        category: "gratitude",
        icon: "star"
      },
      {
        title: "Let go",
        description: "Take deep breaths and release today's tensions.",
        timeEstimate: "2-5 min",
        category: "mindful",
        icon: "heart"
      }
    ];
    
    const generalTasks: Partial<EnhancedSuggestion>[] = [
      {
        title: "Notice breathing",
        description: "Watch your natural breath for a moment.",
        timeEstimate: "1-3 min",
        category: "mindful",
        icon: "heart"
      },
      {
        title: "Feel your feet",
        description: "Focus on your feet touching the ground.",
        timeEstimate: "1-2 min",
        category: "sensory",
        icon: "walk"
      },
      {
        title: "Find beauty",
        description: "Look for one beautiful thing nearby.",
        timeEstimate: "2-5 min",
        category: "discovery",
        icon: "eye"
      },
      {
        title: "Listen around",
        description: "Notice three different sounds you hear.",
        timeEstimate: "2-5 min",
        category: "sensory",
        icon: "ear"
      },
      {
        title: "Think values",
        description: "Consider what matters most to you right now.",
        timeEstimate: "3-5 min",
        category: "reflection",
        icon: "heart"
      },
      {
        title: "Learn something",
        description: "Find one interesting fact about something nearby.",
        timeEstimate: "2-5 min",
        category: "learning",
        icon: "book"
      },
      {
        title: "Change perspective",
        description: "Look at something from a different angle.",
        timeEstimate: "2-4 min",
        category: "play",
        icon: "eye"
      },
      {
        title: "Small kindness",
        description: "Do something small to help someone.",
        timeEstimate: "3-10 min",
        category: "service",
        icon: "hand"
      },
      {
        title: "Three good things",
        description: "Name three things you're grateful for.",
        timeEstimate: "2-3 min",
        category: "gratitude",
        icon: "star"
      }
    ];

    let taskPool: Partial<EnhancedSuggestion>[];
    if (currentHour < 10) {
      taskPool = [...morningTasks, ...generalTasks];
    } else if (currentHour < 17) {
      taskPool = [...afternoonTasks, ...generalTasks];
    } else {
      taskPool = [...eveningTasks, ...generalTasks];
    }

    const task = taskPool[Math.floor(Math.random() * taskPool.length)];
    return {
      ...task,
      id: `fallback_${Date.now()}_${Math.random().toString(36).substr(2, 9)}` as any,
      text: task.description || '',
      type: (task.category || 'mindful') as EnhancedSuggestion['type'],
      source: 'fallback',
      generatedAt: new Date().toISOString()
    } as EnhancedSuggestion & { generatedAt: string };
  }

  async generateTasksForLocation(place: Place, keywords: string[] = [], count: number = 3): Promise<EnhancedSuggestion[]> {
    try {
      const tasks: EnhancedSuggestion[] = [];
      
      for (let i = 0; i < count; i++) {
        const locationKeywords = [
          ...keywords,
          place.name,
          ...(place.types || []).slice(0, 2)
        ];
        
        const task = await this.generateZenTask({
          keywords: locationKeywords,
          location: place,
          mood: i === 0 ? 'peaceful' : i === 1 ? 'curious' : 'contemplative'
        });
        
        const enhancedTask: EnhancedSuggestion = {
          ...task,
          locationSuggestion: {
            place: place,
            distance: 'nearby',
            relevance: 'Suggested location'
          } as LocationSuggestion
        };
        
        tasks.push(enhancedTask);
        
        // Small delay to avoid rate limiting
        await new Promise(resolve => setTimeout(resolve, 100));
      }
      
      return tasks;
    } catch (error) {
      console.error('Error generating location-based tasks:', error);
      return [];
    }
  }

  async generateDailyZenTasks(userPreferences: UserPreferences = {}): Promise<EnhancedSuggestion[]> {
    try {
      const {
        preferredCategories = ['mindful', 'nature', 'reflection'],
        keywords = [],
        timeAvailable = 'short'
      } = userPreferences;

      const tasks: EnhancedSuggestion[] = [];
      
      for (const category of preferredCategories) {
        const task = await this.generateZenTask({
          keywords: [...keywords, category],
          mood: category === 'mindful' ? 'peaceful' : category === 'nature' ? 'grounded' : 'contemplative',
          activityLevel: timeAvailable === 'short' ? 'gentle' : 'moderate'
        });
        
        tasks.push(task);
        
        // Small delay between requests
        await new Promise(resolve => setTimeout(resolve, 200));
      }
      
      return tasks;
    } catch (error) {
      console.error('Error generating daily zen tasks:', error);
      return [];
    }
  }

  clearCache(): void {
    this.cache.clear();
  }

  getCacheStats(): { size: number; keys: string[] } {
    return {
      size: this.cache.size,
      keys: Array.from(this.cache.keys()).slice(0, 10) // First 10 for debugging
    };
  }

  private _trackTokenUsage(usage?: OpenAIUsage): void {
    if (usage) {
      this.tokenUsage.total += usage.total_tokens;
      this.tokenUsage.today += usage.total_tokens;
      this.tokenUsage.requests += 1;
      
      if (config.ENABLE_DEBUG_LOGS) {
        console.log(`📊 Token usage - Request: ${usage.total_tokens}, Total: ${this.tokenUsage.total}, Today: ${this.tokenUsage.today}`);
      }
    }
  }

  async generateBatchTasks(prompts: TaskGenerationOptions[]): Promise<EnhancedSuggestion[]> {
    if (!this.isConfigured) {
      return prompts.map(() => this.getFallbackTask());
    }

    try {
      const batchPromises = prompts.map(async (prompt, index) => {
        // Add small delay between requests to avoid rate limits
        await new Promise(resolve => setTimeout(resolve, index * 50));
        return this.generateZenTask(prompt);
      });

      const results = await Promise.all(batchPromises);
      console.log(`🔄 Generated ${results.length} tasks in batch`);
      return results;
    } catch (error) {
      console.error('Batch generation error:', error);
      return prompts.map(() => this.getFallbackTask());
    }
  }

  getTokenUsageStats(): TokenUsageStats {
    return {
      ...this.tokenUsage,
      estimatedCost: this.tokenUsage.total * 0.00015 / 1000 // Rough estimate for gpt-4o-mini
    };
  }

  resetDailyUsage(): void {
    this.tokenUsage.today = 0;
  }

  private _getCurrentSeason(): Season {
    const now = new Date();
    const month = now.getMonth() + 1; // getMonth() returns 0-11
    
    if (month >= 3 && month <= 5) return 'spring';
    if (month >= 6 && month <= 8) return 'summer';
    if (month >= 9 && month <= 11) return 'autumn';
    return 'winter';
  }

  private _getEnergyLevelFromTimeAndMood(timeOfDay: string, mood: string): EnergyLevel {
    // Simple heuristic to suggest energy level based on time and mood
    const currentHour = new Date().getHours();
    
    if (mood === 'energizing' || mood === 'curious') return 'energetic';
    if (mood === 'calming' || mood === 'peaceful') return 'balanced';
    if (mood === 'contemplative') return 'balanced';
    
    // Time-based defaults
    if (currentHour < 8 || currentHour > 20) return 'low';
    if (currentHour >= 8 && currentHour <= 12) return 'energetic';
    if (currentHour >= 13 && currentHour <= 17) return 'balanced';
    if (currentHour >= 18 && currentHour <= 20) return 'tired';
    
    return 'balanced';
  }

  async generateScenarioBasedTask(scenario: ScenarioType, options: TaskGenerationOptions = {}): Promise<EnhancedSuggestion> {
    console.log('🎭 Generating scenario-based task for:', scenario);
    
    const scenarioTemplates: Record<ScenarioType, ScenarioTemplate> = {
      'work_break': {
        keywords: ['work', 'break', 'refresh', 'reset'],
        mood: 'energizing',
        activityLevel: 'gentle',
        preferredCategories: ['movement', 'sensory', 'rest', 'mindful'],
        timeEstimate: '2-10 min',
        context: 'taking a break from work to refresh and refocus'
      },
      'commute': {
        keywords: ['travel', 'journey', 'movement', 'transition'],
        mood: 'peaceful',
        activityLevel: 'gentle',
        preferredCategories: ['mindful', 'reflection', 'learning', 'sensory'],
        timeEstimate: '5-30 min',
        context: 'making the most of travel time for personal well-being'
      },
      'waiting': {
        keywords: ['patience', 'present', 'opportunity', 'moment'],
        mood: 'peaceful',
        activityLevel: 'gentle',
        preferredCategories: ['mindful', 'reflection', 'gratitude', 'sensory'],
        timeEstimate: '1-15 min',
        context: 'transforming waiting time into a moment of peace'
      },
      'home_evening': {
        keywords: ['home', 'comfort', 'relaxation', 'unwind'],
        mood: 'calming',
        activityLevel: 'gentle',
        preferredCategories: ['rest', 'creative', 'gratitude', 'reflection'],
        timeEstimate: '10-30 min',
        context: 'creating a peaceful evening routine at home'
      },
      'social_gathering': {
        keywords: ['people', 'connection', 'community', 'sharing'],
        mood: 'balanced',
        activityLevel: 'moderate',
        preferredCategories: ['social', 'connection', 'gratitude', 'play'],
        timeEstimate: '2-10 min',
        context: 'finding moments of mindfulness in social situations'
      },
      'outdoor_space': {
        keywords: ['nature', 'fresh air', 'outdoors', 'natural'],
        mood: 'grounded',
        activityLevel: 'moderate',
        preferredCategories: ['nature', 'movement', 'sensory', 'discovery'],
        timeEstimate: '5-30 min',
        context: 'connecting with nature and the outdoors'
      },
      'indoor_cozy': {
        keywords: ['indoor', 'cozy', 'comfort', 'shelter'],
        mood: 'peaceful',
        activityLevel: 'gentle',
        preferredCategories: ['creative', 'rest', 'learning', 'reflection'],
        timeEstimate: '10-45 min',
        context: 'creating comfort and peace in indoor spaces'
      },
      'morning_start': {
        keywords: ['morning', 'beginning', 'energy', 'intention'],
        mood: 'energizing',
        activityLevel: 'moderate',
        preferredCategories: ['mindful', 'movement', 'gratitude', 'reflection'],
        timeEstimate: '5-20 min',
        context: 'starting the day with intention and positive energy'
      },
      'stress_relief': {
        keywords: ['calm', 'stress', 'relief', 'peace'],
        mood: 'calming',
        activityLevel: 'gentle',
        preferredCategories: ['mindful', 'rest', 'sensory', 'movement'],
        timeEstimate: '3-15 min',
        context: 'finding immediate relief from stress and tension'
      }
    };

    const template = scenarioTemplates[scenario];
    if (!template) {
      console.log('⚠️ Unknown scenario, using default task generation');
      return this.generateZenTask(options);
    }

    // Merge template with provided options
    const scenarioOptions: TaskGenerationOptions = {
      ...template,
      ...options,
      keywords: [...template.keywords, ...(options.keywords || [])],
      context: template.context
    };

    // Generate task with scenario-specific context
    return this.generateZenTask(scenarioOptions);
  }
}

export default new AITaskService();