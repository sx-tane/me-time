import OpenAI from 'openai';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { STORAGE_KEYS } from '../constants/storage';
import config from '../config/environment';
import { AIResponseParser } from '../utils/aiResponseParser';
import apiRateLimiter from '../utils/apiRateLimiter';
import apiMonitoringService from './apiMonitoringService';

class AITaskService {
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

  async generateZenTask(options = {}) {
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
      
      // Check cache first - very short cache time for more variety
      const cached = this.cache.get(cacheKey);
      if (cached && (Date.now() - cached.timestamp) < 60000) { // 1 minute cache
        // Add 70% chance to bypass cache for more variety
        if (Math.random() > 0.3) {
          console.log('🔄 Bypassing cache for variety');
        } else {
          return cached.task;
        }
      }

      if (config.ENABLE_DEBUG_LOGS) {
        console.log('🚀 Calling OpenAI API with prompt:', prompt.substring(0, 100) + '...');
      }
      const response = await this.openai.chat.completions.create({
        model: config.OPENAI_MODEL,
        messages: [
          {
            role: 'system',
            content: `Wellness guide. Create relaxation task. Respond only with JSON:
{"title":"3-6 words","description":"1-2 sentences","timeEstimate":"X-Y min","category":"mindful|sensory|movement|reflection|discovery|rest|creative|nature|social|connection|learning|play|service|gratitude","icon":"heart|flower|walk|book|compass|moon|brush|leaf|people|star|sunny|ear|eye|water|fitness|handshake|school|game|ribbon|gift"}
Be concise.`
          },
          {
            role: 'user',
            content: prompt
          }
        ],
        max_tokens: 150, // Reduced from 250 to save costs
        temperature: 0.8  // Reduced from 1.0 for better cost efficiency
      });

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
      task.id = `ai_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
      task.source = 'ai';
      task.generatedAt = new Date().toISOString();

      // Cache the result
      this.cache.set(cacheKey, {
        task,
        timestamp: Date.now()
      });

      return task;
    } catch (error) {
      console.error('❌ Error generating AI task:', error);
      console.log('🔄 Falling back to fallback task');
      return this.getFallbackTask(options);
    }
  }

  buildTaskPrompt(keywords, location, timeOfDay, mood, activityLevel, weather = null, season = null, energyLevel = 'balanced', options = {}) {
    // Create varied but clear prompts with diverse categories
    const randomSeed = Math.random();
    const promptStyles = [
      'simple and clear',
      'practical and direct', 
      'easy to understand',
      'straightforward and helpful',
      'accessible and friendly',
      'clear and actionable',
      'simple and effective',
      'direct and meaningful'
    ];
    
    const taskFormats = [
      'a simple activity', 
      'an easy practice',
      'a brief exercise',
      'a quick moment',
      'a simple routine',
      'an easy way to',
      'a quick practice',
      'a simple approach to'
    ];
    
    // Force diverse categories by rotating through them
    const categories = ['mindful', 'sensory', 'movement', 'reflection', 'discovery', 'rest', 'creative', 'nature', 'social', 'connection', 'learning', 'play', 'service', 'gratitude'];
    const categoryHints = {
      'mindful': 'Focus on breathing, meditation, awareness, or mindfulness',
      'sensory': 'Use your five senses - touch, sight, sound, smell, taste',
      'movement': 'Include gentle movement, stretching, walking, or physical activity',
      'reflection': 'Involve thinking, journaling, contemplation, or self-reflection',
      'discovery': 'Explore something new, learn, observe, or investigate',
      'rest': 'Focus on relaxation, resting, taking breaks, or slowing down',
      'creative': 'Express creativity through art, music, writing, or imagination',
      'nature': 'Connect with nature, plants, outdoors, or natural elements',
      'social': 'Connect with others, community, or social interaction',
      'connection': 'Build meaningful bonds with yourself, others, or your environment',
      'learning': 'Acquire new knowledge, skills, or understanding through gentle exploration',
      'play': 'Engage in lighthearted, joyful activities that bring spontaneity and fun',
      'service': 'Contribute to others well-being through small acts of kindness or helpfulness',
      'gratitude': 'Recognize and appreciate the positive aspects of life and experiences'
    };
    
    // Pick a random category to ensure variety
    const forcedCategory = categories[Math.floor(randomSeed * categories.length)];
    const categoryHint = categoryHints[forcedCategory];
    
    const selectedStyle = promptStyles[Math.floor(randomSeed * promptStyles.length)];
    const selectedFormat = taskFormats[Math.floor((randomSeed * 7) % taskFormats.length)];
    
    let prompt = `Create ${selectedFormat} that is ${selectedStyle} for someone wanting to feel more peaceful. `;
    prompt += `IMPORTANT: This task should be in the "${forcedCategory}" category. ${categoryHint}. `;
    
    // Add context if provided (for scenario-based tasks)
    if (options.context) {
      prompt += `Context: They are ${options.context}. `;
    }
    
    // Add contextual variety
    if (keywords.length > 0) {
      prompt += `Include these elements: ${keywords.join(', ')}. `;
    }
    
    if (location) {
      const locationTypes = location.types || [];
      prompt += `They are at ${location.name || 'a place'}`;
      if (locationTypes.length > 0) {
        prompt += ` (${locationTypes[0]})`;
      }
      prompt += '. ';
    }
    
    // Add simple time context
    const timeDescriptions = {
      'morning': 'in the morning',
      'afternoon': 'in the afternoon',
      'evening': 'in the evening',
      'any': 'anytime'
    };
    
    const timeDesc = timeDescriptions[timeOfDay] || 'anytime';
    prompt += `This is for ${timeDesc}. `;
    prompt += `The person wants to feel ${mood} and prefers ${activityLevel} activities. `;
    
    // Add weather context if available
    if (weather) {
      const weatherTasks = {
        'sunny': 'enjoying natural light and warmth',
        'rainy': 'finding comfort indoors and appreciating cozy moments',
        'cloudy': 'embracing soft, gentle energy',
        'stormy': 'creating inner calm despite external energy',
        'snowy': 'appreciating winter beauty and stillness',
        'foggy': 'working with mysterious, contemplative atmosphere',
        'windy': 'feeling connected to natural movement and change'
      };
      const weatherHint = weatherTasks[weather.toLowerCase()] || 'adapting to current weather conditions';
      prompt += `The weather is ${weather}, so consider ${weatherHint}. `;
    }
    
    // Add seasonal context if available
    if (season) {
      const seasonalTasks = {
        'spring': 'renewal, growth, fresh beginnings, and emerging life',
        'summer': 'abundance, energy, outdoor connection, and vibrant life',
        'autumn': 'reflection, gratitude, letting go, and natural transitions',
        'winter': 'rest, introspection, cozy comfort, and inner warmth'
      };
      const seasonHint = seasonalTasks[season.toLowerCase()] || 'connecting with the current season';
      prompt += `It's ${season}, so incorporate themes of ${seasonHint}. `;
    }
    
    // Add energy level context
    const energyAdjustments = {
      'low': 'very gentle, restorative activities that require minimal effort',
      'tired': 'calming, restful practices that help rejuvenate',
      'balanced': 'moderate activities that maintain steady energy',
      'energetic': 'more engaging activities that channel positive energy',
      'restless': 'movement-based or engaging tasks that help settle energy',
      'overwhelmed': 'grounding, simplifying activities that create calm'
    };
    const energyHint = energyAdjustments[energyLevel] || 'activities matching their current energy';
    prompt += `Their energy level is ${energyLevel}, so suggest ${energyHint}. `;
    
    // Add category-specific examples and variety hints
    const categoryExamples = {
      'mindful': ['Three Deep Breaths', 'Notice Your Surroundings', 'Body Scan Check-in', 'Moment of Gratitude'],
      'sensory': ['Listen to Sounds Around You', 'Feel Different Textures', 'Notice Colors and Light', 'Taste Something Mindfully'],
      'movement': ['Gentle Neck Rolls', 'Ankle Circles', 'Shoulder Blade Squeezes', 'Hip Sway Meditation'],
      'reflection': ['Write Three Thoughts', 'Reflect on Today', 'Consider Your Goals', 'Think About Growth'],
      'discovery': ['Find Something New Nearby', 'Learn One Small Fact', 'Observe People Watching', 'Notice Architecture'],
      'rest': ['Sit and Simply Be', 'Close Your Eyes', 'Progressive Muscle Relaxation', 'Rest Your Mind'],
      'creative': ['Doodle or Sketch', 'Hum a Melody', 'Write a Short Poem', 'Imagine a Story'],
      'nature': ['Find a Plant to Observe', 'Feel Natural Textures', 'Watch Clouds', 'Listen to Birds'],
      'social': ['Smile at Someone', 'Text a Friend', 'Have a Brief Chat', 'Express Appreciation'],
      'connection': ['Send a Caring Message', 'Connect with Your Values', 'Share a Memory', 'Practice Self-Compassion'],
      'learning': ['Read About Something New', 'Ask Someone a Question', 'Watch How Something Works', 'Practice a New Word'],
      'play': ['Make a Silly Face', 'Create a Simple Game', 'Dance to One Song', 'Tell Yourself a Joke'],
      'service': ['Hold a Door Open', 'Pick Up Litter', 'Compliment Someone', 'Offer Help to Someone'],
      'gratitude': ['List Three Good Things', 'Thank Someone Mentally', 'Appreciate Your Body', 'Notice Daily Blessings']
    };
    
    const examples = categoryExamples[forcedCategory] || [];
    const randomExample = examples[Math.floor(Math.random() * examples.length)];
    
    // Add category-specific task variations for richer diversity
    const categoryVariations = {
      'mindful': ['breathing awareness', 'present moment focus', 'mindful observation', 'body awareness', 'mental clarity'],
      'sensory': ['tactile exploration', 'visual awareness', 'sound meditation', 'taste mindfulness', 'aromatherapy moment'],
      'movement': ['gentle stretching', 'walking meditation', 'body mobilization', 'posture awareness', 'energy flow'],
      'reflection': ['self-inquiry', 'thought observation', 'memory appreciation', 'value exploration', 'insight gathering'],
      'discovery': ['curiosity practice', 'learning moment', 'observation skill', 'exploration activity', 'wonder cultivation'],
      'rest': ['relaxation technique', 'tension release', 'calming practice', 'peace creation', 'stillness embrace'],
      'creative': ['artistic expression', 'imagination exercise', 'creative flow', 'inspiration seeking', 'beauty creation'],
      'nature': ['natural connection', 'outdoor awareness', 'earth appreciation', 'seasonal noticing', 'life observation'],
      'social': ['human connection', 'community building', 'relationship nurturing', 'kindness sharing', 'empathy practice'],
      'connection': ['relationship deepening', 'self-bonding', 'value alignment', 'heart opening', 'belonging cultivation'],
      'learning': ['knowledge seeking', 'skill building', 'understanding growth', 'wisdom gathering', 'curiosity feeding'],
      'play': ['joyful exploration', 'lighthearted activity', 'fun discovery', 'playful experiment', 'spontaneous joy'],
      'service': ['kindness offering', 'help providing', 'care giving', 'contribution making', 'support extending'],
      'gratitude': ['appreciation practice', 'thankfulness cultivation', 'blessing recognition', 'abundance noticing', 'joy acknowledgment']
    };
    
    const variations = categoryVariations[forcedCategory] || ['mindful activity'];
    const selectedVariation = variations[Math.floor(Math.random() * variations.length)];
    
    prompt += `
    Requirements:
    - Takes 1-30 minutes
    - Easy to understand and do
    - Helps with relaxation and peace
    - Use simple, clear language
    - Avoid overly poetic or metaphorical language
    - Make the title unique and varied (3-8 words) - avoid generic titles
    - Keep description practical and specific
    - MUST be in the "${forcedCategory}" category
    - Focus on: ${selectedVariation}
    - Example of ${forcedCategory} task: "${randomExample}"
    
    Categories: mindful, sensory, movement, reflection, discovery, rest, creative, nature, social, connection, learning, play, service, gratitude
    Use simple Ionicons icon names like: sunny, moon, heart, walk, leaf, eye, ear, book, handshake, school, game, ribbon, gift, etc.
    
    IMPORTANT: Create diverse, unique titles that match the "${forcedCategory}" category and focus on ${selectedVariation}. 
    Avoid repetitive suggestions and make each one feel distinct and purposeful.`;

    return prompt;
  }

  generateCacheKey(prompt) {
    // Include timestamp in cache key for more variety
    const timeWindow = Math.floor(Date.now() / 120000); // 2-minute windows
    const baseKey = btoa(prompt + timeWindow).replace(/[^a-zA-Z0-9]/g, '').substr(0, 50);
    return baseKey;
  }

  getFallbackTask(options = {}) {
    const { timeOfDay = 'any', mood = 'peaceful' } = options;
    const currentHour = new Date().getHours();
    
    const morningTasks = [
      {
        title: "Greet the morning mindfully",
        description: "Take three deep breaths and set a gentle intention for your day",
        timeEstimate: "2-5 min",
        category: "mindful",
        icon: "sunny-outline"
      },
      {
        title: "Morning stretch",
        description: "Gently stretch your body and notice how you feel today",
        timeEstimate: "5-10 min",
        category: "movement",
        icon: "body-outline"
      }
    ];
    
    const afternoonTasks = [
      {
        title: "Mindful afternoon pause",
        description: "Step away from your tasks and take a moment to reset",
        timeEstimate: "2-5 min",
        category: "rest",
        icon: "pause-outline"
      },
      {
        title: "Look out a window",
        description: "Find a window and observe the world outside for a few moments",
        timeEstimate: "3-5 min",
        category: "discovery",
        icon: "telescope-outline"
      }
    ];
    
    const eveningTasks = [
      {
        title: "Evening gratitude",
        description: "Think of three things from today that brought you peace",
        timeEstimate: "3-5 min",
        category: "reflection",
        icon: "moon-outline"
      },
      {
        title: "Release the day",
        description: "Take a few deep breaths and let go of today's tensions",
        timeEstimate: "2-5 min",
        category: "mindful",
        icon: "sparkles-outline"
      }
    ];
    
    const generalTasks = [
      {
        title: "Notice your breathing",
        description: "Take a moment to observe your natural breath without changing it",
        timeEstimate: "1-3 min",
        category: "mindful",
        icon: "heart-outline"
      },
      {
        title: "Feel your feet on the ground",
        description: "Focus on the sensation of being grounded and present",
        timeEstimate: "1-2 min",
        category: "sensory",
        icon: "footsteps-outline"
      },
      {
        title: "Look for something beautiful nearby",
        description: "Notice one beautiful detail in your current surroundings",
        timeEstimate: "2-5 min",
        category: "discovery",
        icon: "eye-outline"
      },
      {
        title: "Listen to the sounds around you",
        description: "Identify three different sounds in your environment",
        timeEstimate: "2-5 min",
        category: "sensory",
        icon: "ear-outline"
      },
      {
        title: "Connect with your values",
        description: "Think about what matters most to you right now",
        timeEstimate: "3-5 min",
        category: "connection",
        icon: "heart"
      },
      {
        title: "Learn something new",
        description: "Look up one interesting fact about something around you",
        timeEstimate: "2-5 min",
        category: "learning",
        icon: "school-outline"
      },
      {
        title: "Play with perspective",
        description: "Look at something from three different angles or viewpoints",
        timeEstimate: "2-4 min",
        category: "play",
        icon: "camera-outline"
      },
      {
        title: "Offer a small kindness",
        description: "Do one small thing to help or brighten someone's day",
        timeEstimate: "3-10 min",
        category: "service",
        icon: "heart-circle-outline"
      },
      {
        title: "Appreciate this moment",
        description: "Name three things you're grateful for right now",
        timeEstimate: "2-3 min",
        category: "gratitude",
        icon: "star-outline"
      }
    ];

    let taskPool;
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
      id: `fallback_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      source: 'fallback',
      generatedAt: new Date().toISOString()
    };
  }

  async generateTasksForLocation(place, keywords = [], count = 3) {
    try {
      const tasks = [];
      
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
        
        tasks.push({
          ...task,
          locationSuggestion: {
            place: place,
            distance: place.distance || 0
          }
        });
        
        // Small delay to avoid rate limiting
        await new Promise(resolve => setTimeout(resolve, 100));
      }
      
      return tasks;
    } catch (error) {
      console.error('Error generating location-based tasks:', error);
      return [];
    }
  }

  async generateDailyZenTasks(userPreferences = {}) {
    try {
      const {
        preferredCategories = ['mindful', 'nature', 'reflection'],
        keywords = [],
        timeAvailable = 'short'
      } = userPreferences;

      const tasks = [];
      
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

  clearCache() {
    this.cache.clear();
  }

  getCacheStats() {
    return {
      size: this.cache.size,
      keys: Array.from(this.cache.keys()).slice(0, 10) // First 10 for debugging
    };
  }

  _trackTokenUsage(usage) {
    if (usage) {
      this.tokenUsage.total += usage.total_tokens;
      this.tokenUsage.today += usage.total_tokens;
      this.tokenUsage.requests += 1;
      
      if (config.ENABLE_DEBUG_LOGS) {
        console.log(`📊 Token usage - Request: ${usage.total_tokens}, Total: ${this.tokenUsage.total}, Today: ${this.tokenUsage.today}`);
      }
    }
  }

  async generateBatchTasks(prompts) {
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

  getTokenUsageStats() {
    return {
      ...this.tokenUsage,
      estimatedCost: this.tokenUsage.total * 0.00015 / 1000 // Rough estimate for gpt-4o-mini
    };
  }

  resetDailyUsage() {
    this.tokenUsage.today = 0;
  }

  _getCurrentSeason() {
    const now = new Date();
    const month = now.getMonth() + 1; // getMonth() returns 0-11
    
    if (month >= 3 && month <= 5) return 'spring';
    if (month >= 6 && month <= 8) return 'summer';
    if (month >= 9 && month <= 11) return 'autumn';
    return 'winter';
  }

  _getEnergyLevelFromTimeAndMood(timeOfDay, mood) {
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

  async generateScenarioBasedTask(scenario, options = {}) {
    console.log('🎭 Generating scenario-based task for:', scenario);
    
    const scenarioTemplates = {
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
    const scenarioOptions = {
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