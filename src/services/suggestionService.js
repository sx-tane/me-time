import AsyncStorage from '@react-native-async-storage/async-storage';
import { suggestions } from '../constants/suggestions';
import { STORAGE_KEYS } from '../constants/storage';
import placesService from './placesService';
import locationService from './locationService';
import aiTaskService from './aiTaskService';
import locationHistoryService from './locationHistoryService';
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
    
    console.log('\u2705 Today\'s suggestion ready:', newSuggestion?.text);
    console.log('🎯 FINAL SUGGESTION DEBUG:', {
      taskCategory: newSuggestion.type,
      hasLocationSuggestion: !!newSuggestion.locationSuggestion,
      hasLocationSuggestions: !!newSuggestion.locationSuggestions,
      locationsCount: newSuggestion.locationSuggestions?.length || 0,
      firstPlaceName: newSuggestion.locationSuggestion?.place?.name,
      firstPlacePhotos: newSuggestion.locationSuggestion?.place?.photos?.length || 0,
      firstPlaceMapsUrl: !!newSuggestion.locationSuggestion?.place?.googleMapsUrl,
      suggestionId: newSuggestion.id,
      locationsBypassCache: 'enabled for task-specific suggestions'
    });
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

// Enhanced skip functionality to ensure different suggestions and locations
export const getNewSuggestion = async (currentSuggestion = null) => {
  // Clear AI cache to ensure fresh generation
  aiTaskService.clearCache();
  
  // IMPORTANT: Clear location cache so new task gets fresh location suggestions
  console.log('🧹 Clearing location cache for fresh suggestions matching new task');
  await placesService.clearCache();
  
  console.log('\ud83d\udd04 Generating new suggestion, current:', currentSuggestion?.text);
  if (currentSuggestion?.locationSuggestions) {
    console.log('📍 Current locations:', currentSuggestion.locationSuggestions.map(ls => ls.place.name));
  }
  
  let attempts = 0;
  let newSuggestion;
  
  // Try up to 3 times to get a different suggestion
  do {
    newSuggestion = await getNewAISuggestion();
    attempts++;
    
    // Check if suggestion is different from current (text or category)
    const isDifferentText = !currentSuggestion || newSuggestion?.text !== currentSuggestion?.text;
    const isDifferentCategory = !currentSuggestion || newSuggestion.type !== currentSuggestion.type;
    
    if (isDifferentText || isDifferentCategory) {
      console.log('✅ Generated different suggestion:', {
        newText: newSuggestion?.text,
        newType: newSuggestion.type,
        currentText: currentSuggestion?.text,
        currentType: currentSuggestion?.type,
        attempt: attempts
      });
      break;
    }
    
    console.log(`🔄 Attempt ${attempts}: Similar suggestion, trying again...`);
    
    // Add a small delay between attempts
    if (attempts < 3) {
      await new Promise(resolve => setTimeout(resolve, 200));
    }
  } while (attempts < 3);
  
  console.log('\u2728 Final new suggestion ready:', newSuggestion?.text);
  return newSuggestion;
};

export const enrichSuggestionWithLocation = async (suggestion) => {
  console.log('\ud83d\uddfa Enriching suggestion with location:', suggestion?.text);  
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

    // Enhanced task-location matching with priority scoring
    const categoryToPlaceTypes = {
      'mindful': {
        primary: ['spa', 'garden', 'library'], // Most relevant
        secondary: ['park', 'museum', 'cafe'], // Somewhat relevant
        fallback: ['church', 'art_gallery'] // General peaceful places
      },
      'sensory': {
        primary: ['botanical_garden', 'flower_shop', 'bakery'],
        secondary: ['park', 'art_gallery', 'museum'],
        fallback: ['cafe', 'restaurant']
      },
      'movement': {
        primary: ['fitness_center', 'sports_complex', 'trail'],
        secondary: ['park', 'tourist_attraction'],
        fallback: ['shopping_mall']
      },
      'reflection': {
        primary: ['library', 'museum', 'art_gallery'],
        secondary: ['park', 'book_store', 'cafe'],
        fallback: ['church', 'garden']
      },
      'discovery': {
        primary: ['tourist_attraction', 'museum', 'art_gallery'],
        secondary: ['shopping_mall', 'landmark'],
        fallback: ['park', 'cafe']
      },
      'rest': {
        primary: ['spa', 'garden', 'park'],
        secondary: ['library', 'cafe'],
        fallback: ['museum']
      },
      'creative': {
        primary: ['art_gallery', 'craft_store', 'studio'],
        secondary: ['museum', 'library'],
        fallback: ['cafe', 'book_store']
      },
      'nature': {
        primary: ['park', 'botanical_garden', 'garden'],
        secondary: ['tourist_attraction'],
        fallback: ['spa']
      },
      'social': {
        primary: ['cafe', 'restaurant', 'community_center'],
        secondary: ['shopping_mall', 'park'],
        fallback: ['museum', 'art_gallery']
      },
      'connection': {
        primary: ['community_center', 'church', 'cafe'],
        secondary: ['park', 'library', 'garden'],
        fallback: ['museum', 'art_gallery']
      },
      'learning': {
        primary: ['library', 'museum', 'school'],
        secondary: ['art_gallery', 'book_store', 'tourist_attraction'],
        fallback: ['cafe', 'community_center']
      },
      'play': {
        primary: ['park', 'game_store', 'arcade'],
        secondary: ['shopping_mall', 'tourist_attraction', 'beach'],
        fallback: ['cafe', 'community_center']
      },
      'service': {
        primary: ['community_center', 'church', 'park'],
        secondary: ['library', 'school', 'hospital'],
        fallback: ['cafe', 'shopping_mall']
      },
      'gratitude': {
        primary: ['church', 'garden', 'park'],
        secondary: ['museum', 'art_gallery', 'library'],
        fallback: ['cafe', 'tourist_attraction']
      }
    };

    // Get task-specific places with priority levels
    const taskPlaceTypes = categoryToPlaceTypes[suggestion.type] || {
      primary: ['park', 'cafe'],
      secondary: ['museum', 'library'],
      fallback: ['restaurant']
    };
    
    // Combine all place types for search
    const allPlaceTypes = [
      ...taskPlaceTypes.primary,
      ...taskPlaceTypes.secondary,
      ...taskPlaceTypes.fallback
    ];
    
    // Add some general variety (but less dominant)
    const varietyTypes = ['tourist_attraction', 'landmark'];
    const searchTypes = [...new Set([...allPlaceTypes, ...varietyTypes])];
    
    // Progressive search with expanding radius for variety
    console.log('🔍 Searching for task-relevant places:', searchTypes.slice(0, 8));
    console.log('🎯 Task type:', suggestion.type);
    
    let nearbyPlaces = [];
    const searchRadii = [1000, 1500, 2500]; // Progressive expansion
    
    for (const radius of searchRadii) {
      const places = await placesService.getNearbyInterestingPlaces({
        latitude: userLocation.latitude,
        longitude: userLocation.longitude,
        radius: radius,
        types: searchTypes,
        maxResults: 50, // Increased to get more places for pagination
        bypassCache: true
      });
      
      if (places && places.length > 0) {
        nearbyPlaces = places;
        console.log(`📍 Found ${places.length} places within ${radius}m`);
        break;
      }
    }
    console.log('🏢 Found nearby places:', nearbyPlaces?.length || 0);

    if (!nearbyPlaces || nearbyPlaces.length === 0) {
      // If no specific places found, try with broader search (also bypass cache)
      console.log('🔄 No specific places found, trying broader search...');
      const broadPlaces = await placesService.getNearbyInterestingPlaces({
        latitude: userLocation.latitude,
        longitude: userLocation.longitude,
        radius: 2000, // Even broader search
        types: ['establishment', 'point_of_interest'],
        maxResults: 5,
        bypassCache: true // Also bypass cache for broader search
      });
      
      if (!broadPlaces || broadPlaces.length === 0) {
        return suggestion;
      }
      
      nearbyPlaces.push(...broadPlaces);
    }

    // Enhanced scoring system: task relevance + quality + novelty
    const getLocationScore = (place) => {
      let score = 0;
      const placeTypes = place.types || [];
      
      // Task relevance scoring (40% of total score)
      const primaryMatch = placeTypes.some(type => taskPlaceTypes.primary.includes(type));
      const secondaryMatch = placeTypes.some(type => taskPlaceTypes.secondary.includes(type));
      const fallbackMatch = placeTypes.some(type => taskPlaceTypes.fallback.includes(type));
      
      if (primaryMatch) score += 40;
      else if (secondaryMatch) score += 25;
      else if (fallbackMatch) score += 15;
      
      // Quality scoring (30% of total score)
      if (place.rating) {
        score += (place.rating / 5.0) * 30;
      }
      
      // Novelty bonus (20% of total score) - avoid recently shown places
      if (!locationHistoryService.isRecentlyShown(place.id)) {
        score += 20;
      }
      
      // Interesting place bonus (10% of total score)
      const interestingTypes = ['tourist_attraction', 'museum', 'art_gallery', 'landmark'];
      if (placeTypes.some(type => interestingTypes.includes(type))) {
        score += 10;
      }
      
      console.log(`📊 ${place.name}: ${score.toFixed(1)} (task:${primaryMatch?'P':secondaryMatch?'S':fallbackMatch?'F':'N'}, rating:${place.rating||'N/A'}, recent:${locationHistoryService.isRecentlyShown(place.id)?'Y':'N'})`);
      return score;
    };
    
    const prioritizedPlaces = nearbyPlaces
      .map(place => ({ ...place, score: getLocationScore(place) }))
      .sort((a, b) => b.score - a.score);

    // Diversify selection: pick best places from different types/areas
    const topPlaces = [];
    const usedTypes = new Set();
    const minDistance = 200; // Minimum distance between selected places (meters)
    
    for (const place of prioritizedPlaces) {
      if (topPlaces.length >= 25) break; // Increased limit for pagination
      
      // Check type diversity
      const placeMainType = place.types?.[0] || 'unknown';
      const typeCount = Array.from(usedTypes).filter(type => type === placeMainType).length;
      
      // Check geographic diversity
      const tooCloseToExisting = topPlaces.some(selected => {
        if (!place.location || !selected.location) return false;
        const distance = locationService.calculateDistance(
          place.location.lat, place.location.lng,
          selected.location.lat, selected.location.lng
        );
        return distance < minDistance;
      });
      
      // Select if diverse enough or if we need more options  
      // Relaxed diversity requirements to get more places for pagination
      if ((typeCount < 4 && !tooCloseToExisting) || topPlaces.length < 15) {
        topPlaces.push(place);
        usedTypes.add(placeMainType);
        
        // Track this location to avoid showing it again soon
        locationHistoryService.addLocationId(place.id);
      }
    }
    
    console.log('🎯 ENHANCED LOCATION SELECTION:', {
      taskType: suggestion.type,
      totalFound: nearbyPlaces?.length || 0,
      prioritizedCount: prioritizedPlaces.length,
      finalSelected: topPlaces.length,
      selectedPlaces: topPlaces.map(p => `${p.name} (${p.score?.toFixed(1)} pts)`)
    });

    // Create simple place type description (no task info to avoid confusion)
    const getPlaceTypeDescription = (place) => {
      const placeTypes = place.types || [];
      
      if (placeTypes.includes('tourist_attraction') || placeTypes.includes('landmark')) {
        return 'Tourist attraction';
      } else if (placeTypes.includes('museum') || placeTypes.includes('art_gallery')) {
        return 'Cultural venue';
      } else if (placeTypes.includes('park') || placeTypes.includes('garden')) {
        return 'Peaceful location';
      } else if (placeTypes.includes('cafe') || placeTypes.includes('restaurant')) {
        return 'Food & drinks';
      } else {
        return 'Nearby place';
      }
    };

    // Create location suggestions for all top places
    const locationSuggestions = topPlaces.map(place => ({
      place: place,
      userLocation: userLocation,
      distance: locationService.calculateDistance(
        userLocation.latitude,
        userLocation.longitude,
        place.location?.lat || 0,
        place.location?.lng || 0
      ),
      relevance: getPlaceTypeDescription(place)
    }));

    const result = {
      ...suggestion,
      locationSuggestion: locationSuggestions[0], // Keep first for backward compatibility
      locationSuggestions: locationSuggestions // New array of multiple locations
    };

    console.log('✅ FINAL LOCATION RESULT:', {
      taskTitle: suggestion?.text,
      locationSuggestionsCount: locationSuggestions.length,
      locationNames: locationSuggestions.map(ls => ls.place.name),
      hasSingleLocationSuggestion: !!result.locationSuggestion,
      hasMultipleLocationSuggestions: !!result.locationSuggestions && result.locationSuggestions.length > 0
    });

    return result;
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