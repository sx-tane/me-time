import aiTaskService from '../services/aiTaskService';
import placesService from '../services/placesService';
import locationService from '../services/locationService';

export const testAPIs = async () => {
  const results = {
    openai: { working: false, error: null, sample: null },
    places: { working: false, error: null, sample: null },
    location: { working: false, error: null, sample: null }
  };

  // Test OpenAI API
  try {
    console.log('🧪 Testing OpenAI API...');
    const task = await aiTaskService.generateZenTask({
      timeOfDay: 'morning',
      mood: 'peaceful'
    });
    results.openai.working = !!task && !!task.title;
    results.openai.sample = task?.title;
    console.log('✅ OpenAI working:', results.openai.working);
  } catch (error) {
    results.openai.error = error.message;
    console.log('❌ OpenAI error:', error.message);
  }

  // Test Location Service
  try {
    console.log('🧪 Testing Location service...');
    const location = await locationService.getCurrentLocation();
    results.location.working = !!location && !!location.latitude;
    results.location.sample = location;
    console.log('✅ Location working:', results.location.working);
  } catch (error) {
    results.location.error = error.message;
    console.log('❌ Location error:', error.message);
  }

  // Test Google Places API (if location works)
  if (results.location.working) {
    try {
      console.log('🧪 Testing Google Places API...');
      const places = await placesService.getNearbyInterestingPlaces({
        latitude: results.location.sample.latitude,
        longitude: results.location.sample.longitude,
        radius: 1000,
        types: ['park', 'cafe', 'restaurant'],
        maxResults: 5
      });
      results.places.working = Array.isArray(places);
      results.places.sample = places?.length || 0;
      console.log('✅ Places working:', results.places.working, '- Found:', results.places.sample, 'places');
    } catch (error) {
      results.places.error = error.message;
      console.log('❌ Places error:', error.message);
    }
  }

  return results;
};

export const getAPIStatus = () => {
  return {
    openaiConfigured: !!process.env.EXPO_PUBLIC_OPENAI_API_KEY,
    placesConfigured: !!process.env.EXPO_PUBLIC_GOOGLE_PLACES_API_KEY,
    mapsConfigured: !!process.env.EXPO_PUBLIC_GOOGLE_MAPS_API_KEY
  };
};