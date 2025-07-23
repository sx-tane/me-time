import AsyncStorage from '@react-native-async-storage/async-storage';
import { suggestions } from '../constants/suggestions';
import { STORAGE_KEYS } from '../constants/storage';
import placesService from './placesService';
import locationService from './locationService';
import aiTaskService from './aiTaskService';
import { contemplate, MINDFUL_DELAYS } from './mindfulTiming';

export const getTodaysSuggestion = async () => {
  console.log('🌅 Getting today\'s suggestion...');
  try {
    const today = new Date().toDateString();
    const lastDate = await AsyncStorage.getItem(STORAGE_KEYS.LAST_SUGGESTION_DATE);
    
    if (lastDate === today) {
      const savedSuggestion = await AsyncStorage.getItem(STORAGE_KEYS.CURRENT_SUGGESTION);
      if (savedSuggestion) {
        console.log('✅ Found cached suggestion');
        const parsedSuggestion = JSON.parse(savedSuggestion);
        console.log('📍 Cached suggestion has location?', !!parsedSuggestion?.locationSuggestion);
        
        // If cached suggestion doesn't have location, try to enrich it
        if (!parsedSuggestion?.locationSuggestion) {
          try {
            console.log('🗺 Cached suggestion missing location, enriching now...');
            const enrichedSuggestion = await enrichSuggestionWithLocation(parsedSuggestion);
            // Save the enriched version back to cache
            await AsyncStorage.setItem(STORAGE_KEYS.CURRENT_SUGGESTION, JSON.stringify(enrichedSuggestion));
            return enrichedSuggestion;
          } catch (locationError) {
            console.warn('⚠️ Failed to enrich cached suggestion with location:', locationError.message);
          }
        }
        
        return parsedSuggestion;
      }
    }

    console.log('🆕 Need new suggestion, generating with AI...');
    const newSuggestion = await getNewAISuggestion();
    console.log('💾 Saving new suggestion to storage');
    
    await AsyncStorage.setItem(STORAGE_KEYS.CURRENT_SUGGESTION, JSON.stringify(newSuggestion));
    await AsyncStorage.setItem(STORAGE_KEYS.LAST_SUGGESTION_DATE, today);
    
    console.log('✅ Today\'s suggestion ready:', newSuggestion.text);
    return newSuggestion;
  } catch (error) {
    console.error('❌ Error getting suggestion:', error);
    console.log('🔄 Using AI fallback task');
    // Use AI fallback task instead of static suggestion
    const fallbackTask = aiTaskService.getFallbackTask();
    console.log('✅ Fallback task ready:', fallbackTask.title);
    return fallbackTask;
  }
};

export const getNewAISuggestion = async () => {
  console.log('🤖 Generating new AI suggestion...');
  try {
    // Get current time context
    const currentHour = new Date().getHours();
    let timeOfDay = 'any';
    let mood = 'peaceful';
    
    if (currentHour < 10) {
      timeOfDay = 'morning';
      mood = 'energizing';
    } else if (currentHour < 17) {
      timeOfDay = 'afternoon';
      mood = 'balanced';
    } else {
      timeOfDay = 'evening';
      mood = 'calming';
    }

    // Generate AI task
    console.log('📊 Generating zen task with context:', { timeOfDay, mood, activityLevel: 'gentle' });
    const aiTask = await aiTaskService.generateZenTask({
      timeOfDay,
      mood,
      activityLevel: 'gentle'
    });
    console.log('✅ AI task generated:', aiTask);
    
    if (!aiTask || !aiTask.title) {
      throw new Error('Invalid AI task generated');
    }
    
    // Convert AI task to suggestion format
    let suggestion = {
      id: aiTask.id,
      text: aiTask.title,
      type: aiTask.category,
      icon: aiTask.icon,
      description: aiTask.description,
      timeEstimate: aiTask.timeEstimate,
      source: aiTask.source || 'ai'
    };
    
    // Enrich with location after generating task (but don't let location errors break the suggestion)
    try {
      console.log('🗺 Enriching suggestion with location...');
      suggestion = await enrichSuggestionWithLocation(suggestion);
      console.log('✅ Final suggestion with location:', suggestion);
    } catch (locationError) {
      console.warn('⚠️ Location enrichment failed, continuing with basic suggestion:', locationError.message);
    }
    
    return suggestion;
  } catch (error) {
    console.error('❌ Error generating new AI suggestion:', error);
    console.log('🔄 Using fallback task');
    const fallbackTask = aiTaskService.getFallbackTask();
    
    // Convert fallback task to suggestion format
    return {
      id: fallbackTask.id,
      text: fallbackTask.title,
      type: fallbackTask.category,
      icon: fallbackTask.icon,
      description: fallbackTask.description,
      timeEstimate: fallbackTask.timeEstimate,
      source: 'fallback'
    };
  }
};

// Enhanced skip functionality to ensure different suggestions
export const getNewSuggestion = async (currentSuggestion = null) => {
  // Clear AI cache to ensure fresh generation
  aiTaskService.clearCache();
  
  let attempts = 0;
  let newSuggestion;
  
  // Try up to 3 times to get a different suggestion
  do {
    newSuggestion = await getNewAISuggestion();
    attempts++;
    
    // If we get a different suggestion, break
    if (!currentSuggestion || newSuggestion.text !== currentSuggestion.text) {
      break;
    }
    
    // Add a small delay between attempts
    if (attempts < 3) {
      await new Promise(resolve => setTimeout(resolve, 100));
    }
  } while (attempts < 3);
  
  return newSuggestion;
};

export const enrichSuggestionWithLocation = async (suggestion) => {
  console.log('🗺 Enriching suggestion with location:', suggestion.text);  
  try {
    const isLocationAvailable = await locationService.isLocationAvailable();
    console.log('📍 Location availability:', isLocationAvailable);
    if (!isLocationAvailable) {
      console.log('⚠️ Location not available, returning original suggestion');
      return suggestion;
    }

    const userLocation = await locationService.getCurrentLocation();
    console.log('📍 User location:', userLocation);
    if (!userLocation) {
      console.log('⚠️ Could not get user location');
      return suggestion;
    }

    // Expand place types to show more diverse, interesting locations
    // Include both task-specific places AND general interesting spots
    const categoryToPlaceTypes = {
      'mindful': ['park', 'garden', 'spa', 'library', 'museum', 'cafe'],
      'sensory': ['park', 'botanical_garden', 'flower_shop', 'bakery', 'art_gallery', 'museum'],
      'movement': ['park', 'trail', 'fitness_center', 'sports_complex', 'tourist_attraction'],
      'reflection': ['library', 'museum', 'art_gallery', 'book_store', 'park', 'cafe'],
      'discovery': ['tourist_attraction', 'point_of_interest', 'museum', 'art_gallery', 'shopping_mall'],
      'rest': ['park', 'cafe', 'library', 'spa', 'garden'],
      'creative': ['art_gallery', 'museum', 'craft_store', 'studio', 'library'],
      'nature': ['park', 'botanical_garden', 'garden', 'tourist_attraction'],
      'social': ['cafe', 'restaurant', 'community_center', 'park', 'shopping_mall']
    };

    // Get task-specific places
    const taskSpecificTypes = categoryToPlaceTypes[suggestion.type] || ['park', 'cafe', 'museum'];
    
    // Add general interesting places for variety
    const generalInterestingTypes = [
      'tourist_attraction', 'museum', 'art_gallery', 'park', 'cafe', 
      'restaurant', 'shopping_mall', 'library', 'church', 'landmark'
    ];
    
    // Combine both sets for maximum variety
    const allPlaceTypes = [...new Set([...taskSpecificTypes, ...generalInterestingTypes])];
    
    // Search with expanded radius for more options
    console.log('🔍 Searching for diverse places:', allPlaceTypes.slice(0, 8)); // Log first 8 for readability
    const nearbyPlaces = await placesService.getNearbyInterestingPlaces({
      latitude: userLocation.latitude,
      longitude: userLocation.longitude,
      radius: 1500, // Expanded to 1.5km for more interesting options
      types: allPlaceTypes,
      maxResults: 10 // Get more options to choose from
    });
    console.log('🏢 Found nearby places:', nearbyPlaces?.length || 0);

    if (!nearbyPlaces || nearbyPlaces.length === 0) {
      // If no specific places found, try with broader search
      console.log('🔄 No specific places found, trying broader search...');
      const broadPlaces = await placesService.getNearbyInterestingPlaces({
        latitude: userLocation.latitude,
        longitude: userLocation.longitude,
        radius: 2000, // Even broader search
        types: ['establishment', 'point_of_interest'],
        maxResults: 5
      });
      
      if (!broadPlaces || broadPlaces.length === 0) {
        return suggestion;
      }
      
      nearbyPlaces.push(...broadPlaces);
    }

    // Prioritize interesting places over generic ones
    const prioritizedPlaces = nearbyPlaces.sort((a, b) => {
      const interestingTypes = ['tourist_attraction', 'museum', 'art_gallery', 'landmark'];
      const aIsInteresting = a.types?.some(type => interestingTypes.includes(type));
      const bIsInteresting = b.types?.some(type => interestingTypes.includes(type));
      
      if (aIsInteresting && !bIsInteresting) return -1;
      if (!aIsInteresting && bIsInteresting) return 1;
      
      // If both are interesting or both are not, sort by rating then distance
      if (a.rating && b.rating) {
        return b.rating - a.rating; // Higher rating first
      }
      return 0; // Keep original order (distance-based)
    });

    // Pick the best place (prioritized by interest and rating)
    const nearbyPlace = prioritizedPlaces[0];

    // Create more contextual relevance text
    const getRelevanceText = (place, task) => {
      const placeTypes = place.types || [];
      
      if (placeTypes.includes('tourist_attraction') || placeTypes.includes('landmark')) {
        return `Interesting spot for: ${task.text}`;
      } else if (placeTypes.includes('museum') || placeTypes.includes('art_gallery')) {
        return `Cultural venue for: ${task.text}`;
      } else if (placeTypes.includes('park') || placeTypes.includes('garden')) {
        return `Peaceful location for: ${task.text}`;
      } else if (placeTypes.includes('cafe') || placeTypes.includes('restaurant')) {
        return `Cozy spot for: ${task.text}`;
      } else {
        return `Perfect for: ${task.text}`;
      }
    };

    return {
      ...suggestion,
      locationSuggestion: {
        place: nearbyPlace,
        userLocation: userLocation,
        distance: locationService.calculateDistance(
          userLocation.latitude,
          userLocation.longitude,
          nearbyPlace.location?.lat || 0,
          nearbyPlace.location?.lng || 0
        ),
        relevance: getRelevanceText(nearbyPlace, suggestion)
      }
    };
  } catch (error) {
    console.error('❌ Error enriching suggestion with location:', error);
    console.log('🔄 Returning original suggestion');
    return suggestion;
  }
};

export const getSuggestionsByLocation = async (options = {}) => {
  try {
    const {
      radius = 400, // Default to 400m radius for walking distance
      types = ['restaurant', 'tourist_attraction', 'park', 'museum', 'cafe'],
      maxResults = 10
    } = options;

    const userLocation = await locationService.getCurrentLocation();
    if (!userLocation) {
      return [];
    }

    const places = await placesService.getNearbyInterestingPlaces({
      latitude: userLocation.latitude,
      longitude: userLocation.longitude,
      radius,
      types,
      maxResults
    });

    return places.map(place => ({
      id: `location_${place.id}`,
      title: `Visit ${place.name}`,
      description: place.address || 'A nearby interesting place',
      category: 'location',
      timeEstimate: '30min - 2hrs',
      place: place,
      distance: locationService.calculateDistance(
        userLocation.latitude,
        userLocation.longitude,
        place.location?.lat || 0,
        place.location?.lng || 0
      )
    }));
  } catch (error) {
    console.error('Error getting location-based suggestions:', error);
    return [];
  }
};

export const getPeacefulSpotsNearby = async (options = {}) => {
  try {
    const {
      radius = 400, // 400m radius for walking distance to peaceful spots
      maxResults = 15
    } = options;
    
    const peacefulTypes = [
      'park', 'garden', 'library', 'museum', 'art_gallery', 
      'cafe', 'spa', 'cemetery', 'botanical_garden'
    ];

    const userLocation = await locationService.getCurrentLocation();
    if (!userLocation) {
      return [];
    }

    const places = await placesService.getNearbyInterestingPlaces({
      latitude: userLocation.latitude,
      longitude: userLocation.longitude,
      radius,
      types: peacefulTypes,
      maxResults
    });

    return places.map(place => ({
      id: `peaceful_${place.id}`,
      title: `Find peace at ${place.name}`,
      description: place.address || 'A peaceful nearby place',
      category: 'peaceful',
      timeEstimate: '20min - 1hr',
      place: place,
      distance: locationService.calculateDistance(
        userLocation.latitude,
        userLocation.longitude,
        place.location?.lat || 0,
        place.location?.lng || 0
      )
    }));
  } catch (error) {
    console.error('Error getting peaceful spots:', error);
    return [];
  }
};

export const getInterestingSpotsNearby = async (options = {}) => {
  try {
    const {
      radius = 400, // 400m radius for walking distance to interesting spots
      maxResults = 15
    } = options;
    
    const interestingTypes = [
      'tourist_attraction', 'amusement_park', 'aquarium', 'zoo',
      'shopping_mall', 'store', 'restaurant', 'night_club', 'movie_theater',
      'bowling_alley', 'gym', 'stadium'
    ];

    const userLocation = await locationService.getCurrentLocation();
    if (!userLocation) {
      return [];
    }

    const places = await placesService.getNearbyInterestingPlaces({
      latitude: userLocation.latitude,
      longitude: userLocation.longitude,
      radius,
      types: interestingTypes,
      maxResults
    });

    return places.map(place => ({
      id: `interesting_${place.id}`,
      title: `Explore ${place.name}`,
      description: place.address || 'An interesting nearby place',
      category: 'interesting',
      timeEstimate: '30min - 2hrs',
      place: place,
      distance: locationService.calculateDistance(
        userLocation.latitude,
        userLocation.longitude,
        place.location?.lat || 0,
        place.location?.lng || 0
      )
    }));
  } catch (error) {
    console.error('Error getting interesting spots:', error);
    return [];
  }
};

export const getLocationBasedSuggestion = async () => {
  try {
    const locationSuggestions = await getSuggestionsByLocation({ maxResults: 5 });
    if (locationSuggestions.length === 0) {
      return null;
    }
    
    const randomIndex = Math.floor(Math.random() * locationSuggestions.length);
    return locationSuggestions[randomIndex];
  } catch (error) {
    console.error('Error getting location-based suggestion:', error);
    return null;
  }
};

export const getAIEnhancedPeacefulSpots = async (keywords = [], options = {}) => {
  try {
    const {
      maxResults = 5,
      includeAITasks = true
    } = options;

    // Get peaceful spots within 1km
    const peacefulSpots = await getPeacefulSpotsNearby({ maxResults });
    
    if (!includeAITasks || peacefulSpots.length === 0) {
      return peacefulSpots;
    }

    // Enhance each spot with AI-generated tasks
    const enhancedSpots = await Promise.all(
      peacefulSpots.slice(0, 5).map(async (spot) => {
        try {
          const aiTasks = await aiTaskService.generateTasksForLocation(
            spot.place, 
            keywords, 
            2
          );
          
          return {
            ...spot,
            aiGeneratedTasks: aiTasks
          };
        } catch (error) {
          console.error('Error generating AI tasks for spot:', error);
          return spot;
        }
      })
    );

    return enhancedSpots;
  } catch (error) {
    console.error('Error getting AI-enhanced peaceful spots:', error);
    return [];
  }
};

export const getAIEnhancedInterestingSpots = async (keywords = [], options = {}) => {
  try {
    const {
      maxResults = 5,
      includeAITasks = true
    } = options;

    // Get interesting spots within 1km
    const interestingSpots = await getInterestingSpotsNearby({ maxResults });
    
    if (!includeAITasks || interestingSpots.length === 0) {
      return interestingSpots;
    }

    // Enhance each spot with AI-generated tasks
    const enhancedSpots = await Promise.all(
      interestingSpots.slice(0, 5).map(async (spot) => {
        try {
          const aiTasks = await aiTaskService.generateTasksForLocation(
            spot.place, 
            keywords, 
            2
          );
          
          return {
            ...spot,
            aiGeneratedTasks: aiTasks
          };
        } catch (error) {
          console.error('Error generating AI tasks for spot:', error);
          return spot;
        }
      })
    );

    return enhancedSpots;
  } catch (error) {
    console.error('Error getting AI-enhanced interesting spots:', error);
    return [];
  }
};

export const generateZenTasksForCurrentMoment = async (keywords = []) => {
  try {
    await contemplate(MINDFUL_DELAYS.breathe, 'centering_for_task_generation');
    
    const currentHour = new Date().getHours();
    let timeOfDay = 'any';
    let mood = 'peaceful';
    
    if (currentHour < 10) {
      timeOfDay = 'morning';
      mood = 'energizing';
    } else if (currentHour < 17) {
      timeOfDay = 'afternoon';
      mood = 'balanced';
    } else {
      timeOfDay = 'evening';
      mood = 'calming';
    }

    const tasks = await aiTaskService.generateDailyZenTasks({
      keywords,
      timeOfDay,
      preferredCategories: ['mindful', 'sensory', 'reflection']
    });

    await contemplate(MINDFUL_DELAYS.softReveal, 'presenting_tasks');
    
    return tasks;
  } catch (error) {
    console.error('Error generating zen tasks:', error);
    return [];
  }
};

export const debugAPIStatus = async () => {
  console.log('🔍 DEBUG: API Status Check');
  
  const status = {
    environment: {
      openaiKey: !!process.env.EXPO_PUBLIC_OPENAI_API_KEY,
      placesKey: !!process.env.EXPO_PUBLIC_GOOGLE_PLACES_API_KEY,
      mapsKey: !!process.env.EXPO_PUBLIC_GOOGLE_MAPS_API_KEY
    },
    tests: {
      openai: null,
      location: null,
      places: null
    }
  };

  // Test OpenAI
  try {
    const task = await aiTaskService.generateZenTask({ timeOfDay: 'any' });
    status.tests.openai = { working: !!task?.title, sample: task?.title };
  } catch (error) {
    status.tests.openai = { working: false, error: error.message };
  }

  // Test Location
  try {
    const location = await locationService.getCurrentLocation();
    status.tests.location = { working: !!location?.latitude, coordinates: location };
  } catch (error) {
    status.tests.location = { working: false, error: error.message };
  }

  // Test Places (if location works)
  if (status.tests.location?.working) {
    try {
      const places = await placesService.getNearbyInterestingPlaces({
        latitude: status.tests.location.coordinates.latitude,
        longitude: status.tests.location.coordinates.longitude,
        radius: 1000,
        types: ['establishment'],
        maxResults: 3
      });
      status.tests.places = { working: true, found: places?.length || 0 };
    } catch (error) {
      status.tests.places = { working: false, error: error.message };
    }
  }

  console.log('📊 API Status:', JSON.stringify(status, null, 2));
  return status;
};

export const searchSpotsForTask = async (task) => {
  try {
    const userLocation = await locationService.getCurrentLocation();
    if (!userLocation) {
      return [];
    }

    // Map task categories to relevant place types
    const categoryToPlaceTypes = {
      'mindful': ['park', 'garden', 'spa', 'library'],
      'sensory': ['park', 'botanical_garden', 'flower_shop', 'bakery', 'beach'],
      'movement': ['park', 'trail', 'fitness_center', 'sports_complex', 'walking_path'],
      'reflection': ['library', 'museum', 'art_gallery', 'book_store', 'quiet_cafe'],
      'discovery': ['tourist_attraction', 'point_of_interest', 'museum', 'art_gallery', 'historic_site'],
      'rest': ['park', 'cafe', 'library', 'spa', 'quiet_area'],
      'creative': ['art_gallery', 'museum', 'craft_store', 'studio', 'creative_space'],
      'nature': ['park', 'botanical_garden', 'garden', 'trail'],
      'social': ['cafe', 'restaurant', 'community_center', 'park', 'plaza']
    };

    const placeTypes = categoryToPlaceTypes[task.category] || ['park', 'cafe', 'point_of_interest'];
    
    // Search for places with a slightly larger radius for more options
    const places = await placesService.getNearbyInterestingPlaces({
      latitude: userLocation.latitude,
      longitude: userLocation.longitude,
      radius: 1000, // 1km radius
      types: placeTypes,
      maxResults: 5
    });

    // Convert places to suggestion format with task context
    const taskRelatedSpots = places.map(place => ({
      id: `task_spot_${place.id}`,
      title: `${task.title} at ${place.name}`,
      description: `${task.description} - Perfect location: ${place.name}`,
      category: task.category,
      timeEstimate: task.timeEstimate,
      place: place,
      distance: locationService.calculateDistance(
        userLocation.latitude,
        userLocation.longitude,
        place.location?.lat || 0,
        place.location?.lng || 0
      ),
      taskContext: task
    }));

    return taskRelatedSpots;
  } catch (error) {
    console.error('Error searching spots for task:', error);
    return [];
  }
};