import OpenAI from 'openai';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { STORAGE_KEYS } from '../constants/storage';
import config from '../config/environment';

class AITaskService {
  constructor() {
    this.openai = new OpenAI({
      apiKey: config.OPENAI_API_KEY,
      dangerouslyAllowBrowser: true // For React Native/Expo
    });
    this.cache = new Map();
  }

  async generateZenTask(options = {}) {
    try {
      const {
        keywords = [],
        location = null,
        timeOfDay = 'any',
        mood = 'peaceful',
        activityLevel = 'gentle'
      } = options;

      const prompt = this.buildTaskPrompt(keywords, location, timeOfDay, mood, activityLevel);
      const cacheKey = this.generateCacheKey(prompt);
      
      // Check cache first
      const cached = this.cache.get(cacheKey);
      if (cached && (Date.now() - cached.timestamp) < 3600000) { // 1 hour cache
        return cached.task;
      }

      const response = await this.openai.chat.completions.create({
        model: config.OPENAI_MODEL,
        messages: [
          {
            role: 'system',
            content: `You are a mindful wellness guide creating gentle, zen-inspired tasks for moments of self-care. 
            Focus on simple, present-moment activities that promote inner peace and mindfulness.
            Always respond in JSON format with: {"title": "task title", "description": "brief description", "timeEstimate": "time range", "category": "category name", "icon": "icon name"}`
          },
          {
            role: 'user',
            content: prompt
          }
        ],
        max_tokens: 200,
        temperature: 0.8
      });

      const content = response.choices[0].message.content;
      let task;
      
      try {
        task = JSON.parse(content);
      } catch (parseError) {
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
      console.error('Error generating AI task:', error);
      return this.getFallbackTask(options);
    }
  }

  buildTaskPrompt(keywords, location, timeOfDay, mood, activityLevel) {
    let prompt = `Create a zen-inspired mindful task for someone seeking inner peace. `;
    
    if (keywords.length > 0) {
      prompt += `Incorporate these keywords/interests: ${keywords.join(', ')}. `;
    }
    
    if (location) {
      prompt += `They are near: ${location.name || 'a peaceful location'}. `;
    }
    
    prompt += `Time of day: ${timeOfDay}. `;
    prompt += `Desired mood: ${mood}. `;
    prompt += `Activity level: ${activityLevel}. `;
    
    prompt += `The task should be:
    - Simple and achievable in 1-30 minutes
    - Focused on mindfulness or gentle self-care
    - Suitable for the current context
    - Inspire inner peace and presence
    - Use gentle, non-prescriptive language
    
    Choose an appropriate category from: mindful, sensory, movement, reflection, discovery, rest, creative, nature, social
    Choose an appropriate Ionicons icon name.`;

    return prompt;
  }

  generateCacheKey(prompt) {
    return btoa(prompt).replace(/[^a-zA-Z0-9]/g, '').substr(0, 50);
  }

  getFallbackTask(options = {}) {
    const fallbackTasks = [
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

    const task = fallbackTasks[Math.floor(Math.random() * fallbackTasks.length)];
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