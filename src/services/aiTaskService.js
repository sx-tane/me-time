import OpenAI from 'openai';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { STORAGE_KEYS } from '../constants/storage';
import config from '../config/environment';

class AITaskService {
  constructor() {
    this.isConfigured = !!config.OPENAI_API_KEY && config.OPENAI_API_KEY !== '';
    
    if (this.isConfigured) {
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
        activityLevel = 'gentle'
      } = options;

      // If OpenAI is not configured, return a fallback task
      if (!this.isConfigured) {
        console.log('❌ OpenAI not configured, using fallback task');
        console.log('📝 API Key check:', config.OPENAI_API_KEY ? 'Key exists' : 'No key found');
        return this.getFallbackTask(options);
      }
      
      console.log('✅ OpenAI configured, generating AI task');

      const prompt = this.buildTaskPrompt(keywords, location, timeOfDay, mood, activityLevel);
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
            content: `You are a helpful wellness guide creating simple, easy-to-understand relaxation activities.
            Create practical tasks with clear, straightforward language. Avoid complex metaphors or overly poetic descriptions.
            Focus on activities that are easy to do and understand.
            Always respond in JSON format with: {"title": "task title", "description": "brief description", "timeEstimate": "time range", "category": "category name", "icon": "icon name"}
            Keep titles short (3-6 words) and descriptions clear and specific.`
          },
          {
            role: 'user',
            content: prompt
          }
        ],
        max_tokens: 250,
        temperature: 1.0  // Maximum creativity for variety
      });

      const content = response.choices[0].message.content;
      if (config.ENABLE_DEBUG_LOGS) {
        console.log('📥 OpenAI response:', content);
      }
      let task;
      
      try {
        // Extract JSON from markdown code block if present
        let jsonString = content;
        const codeBlockMatch = content.match(/```(?:json)?\s*([\s\S]*?)```/);
        if (codeBlockMatch) {
          jsonString = codeBlockMatch[1].trim();
        }
        
        task = JSON.parse(jsonString);
      } catch (parseError) {
        console.error('Failed to parse AI response:', parseError);
        // Fallback if JSON parsing fails
        task = {
          title: "Take three mindful breaths",
          description: "Focus on your breathing and let your thoughts settle",
          timeEstimate: "1-2 min",
          category: "mindful",
          icon: "heart-outline"
        };
      }

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

  buildTaskPrompt(keywords, location, timeOfDay, mood, activityLevel) {
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
    const categories = ['mindful', 'sensory', 'movement', 'reflection', 'discovery', 'rest', 'creative', 'nature', 'social'];
    const categoryHints = {
      'mindful': 'Focus on breathing, meditation, awareness, or mindfulness',
      'sensory': 'Use your five senses - touch, sight, sound, smell, taste',
      'movement': 'Include gentle movement, stretching, walking, or physical activity',
      'reflection': 'Involve thinking, journaling, contemplation, or self-reflection',
      'discovery': 'Explore something new, learn, observe, or investigate',
      'rest': 'Focus on relaxation, resting, taking breaks, or slowing down',
      'creative': 'Express creativity through art, music, writing, or imagination',
      'nature': 'Connect with nature, plants, outdoors, or natural elements',
      'social': 'Connect with others, community, or social interaction'
    };
    
    // Pick a random category to ensure variety
    const forcedCategory = categories[Math.floor(randomSeed * categories.length)];
    const categoryHint = categoryHints[forcedCategory];
    
    const selectedStyle = promptStyles[Math.floor(randomSeed * promptStyles.length)];
    const selectedFormat = taskFormats[Math.floor((randomSeed * 7) % taskFormats.length)];
    
    let prompt = `Create ${selectedFormat} that is ${selectedStyle} for someone wanting to feel more peaceful. `;
    prompt += `IMPORTANT: This task should be in the "${forcedCategory}" category. ${categoryHint}. `;
    
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
      'social': ['Smile at Someone', 'Text a Friend', 'Have a Brief Chat', 'Express Appreciation']
    };
    
    const examples = categoryExamples[forcedCategory] || [];
    const randomExample = examples[Math.floor(Math.random() * examples.length)];
    
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
    - Example of ${forcedCategory} task: "${randomExample}"
    
    Categories: mindful, sensory, movement, reflection, discovery, rest, creative, nature, social
    Use simple Ionicons icon names like: sunny, moon, heart, walk, leaf, eye, ear, book, etc.
    
    IMPORTANT: Create diverse, unique titles that match the "${forcedCategory}" category. 
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
}

export default new AITaskService();