import AsyncStorage from '@react-native-async-storage/async-storage';
import { suggestions } from '../constants/suggestions';
import { STORAGE_KEYS } from '../constants/storage';
import placesService from './placesService';
import locationService from './locationService';
import aiTaskService from './aiTaskService';
import { contemplate, MINDFUL_DELAYS } from './mindfulTiming';

export const getTodaysSuggestion = async () => {
  try {
    // Take a moment to center before retrieving suggestion
    await contemplate(MINDFUL_DELAYS.breathe, 'centering');

    const today = new Date().toDateString();
    const lastDate = await AsyncStorage.getItem(STORAGE_KEYS.LAST_SUGGESTION_DATE);
    
    if (lastDate === today) {
      const savedSuggestion = await AsyncStorage.getItem(STORAGE_KEYS.CURRENT_SUGGESTION);
      if (savedSuggestion) {
        // Brief pause to let the suggestion settle
        await contemplate(MINDFUL_DELAYS.softReveal, 'reveal_existing');
        return JSON.parse(savedSuggestion);
      }
    }

    // Contemplative pause before generating new suggestion
    await contemplate(MINDFUL_DELAYS.contemplation, 'generating_new');
    
    const newSuggestion = await getNewSuggestion();
    await AsyncStorage.setItem(STORAGE_KEYS.CURRENT_SUGGESTION, JSON.stringify(newSuggestion));
    await AsyncStorage.setItem(STORAGE_KEYS.LAST_SUGGESTION_DATE, today);
    
    return newSuggestion;
  } catch (error) {
    console.error('Error getting suggestion:', error);
    // Even in error, provide a gentle moment before fallback
    await contemplate(MINDFUL_DELAYS.gentlePress, 'error_recovery');
    return suggestions[0];
  }
};

export const getNewSuggestion = async () => {
  try {
    const seenIds = await AsyncStorage.getItem(STORAGE_KEYS.SEEN_SUGGESTIONS);
    const seen = seenIds ? JSON.parse(seenIds) : [];
    
    const available = suggestions.filter(s => !seen.includes(s.id));
    let selected = available.length > 0 
      ? available[Math.floor(Math.random() * available.length)]
      : suggestions[Math.floor(Math.random() * suggestions.length)];
    
    selected = await enrichSuggestionWithLocation(selected);
    
    const newSeen = [...seen, selected.id];
    if (newSeen.length >= suggestions.length) {
      await AsyncStorage.setItem(STORAGE_KEYS.SEEN_SUGGESTIONS, JSON.stringify([]));
    } else {
      await AsyncStorage.setItem(STORAGE_KEYS.SEEN_SUGGESTIONS, JSON.stringify(newSeen));
    }
    
    return selected;
  } catch (error) {
    return suggestions[0];
  }
};

export const enrichSuggestionWithLocation = async (suggestion) => {
  try {
    const isLocationAvailable = await locationService.isLocationAvailable();
    if (!isLocationAvailable) {
      return suggestion;
    }

    const userLocation = await locationService.getCurrentLocation();
    if (!userLocation) {
      return suggestion;
    }

    const nearbyPlace = await placesService.getRandomInterestingPlace(userLocation);
    if (!nearbyPlace) {
      return suggestion;
    }

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
        )
      }
    };
  } catch (error) {
    console.error('Error enriching suggestion with location:', error);
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
      'cafe', 'spa', 'place_of_worship', 'cemetery', 'botanical_garden'
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
    // Contemplate the local environment
    await contemplate(MINDFUL_DELAYS.reflection, 'exploring_locality');
    
    const locationSuggestions = await getSuggestionsByLocation({ maxResults: 5 });
    if (locationSuggestions.length === 0) {
      return null;
    }
    
    // Take a moment to consider the options
    await contemplate(MINDFUL_DELAYS.thoughtfulAction, 'considering_options');
    
    const randomIndex = Math.floor(Math.random() * locationSuggestions.length);
    return locationSuggestions[randomIndex];
  } catch (error) {
    console.error('Error getting location-based suggestion:', error);
    // Gentle pause even in error
    await contemplate(MINDFUL_DELAYS.acknowledgment, 'error_handling');
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