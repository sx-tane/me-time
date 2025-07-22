import Constants from 'expo-constants';

const config = {
  development: {
    GOOGLE_PLACES_API_KEY: process.env.EXPO_PUBLIC_GOOGLE_PLACES_API_KEY || '',
    GOOGLE_MAPS_API_KEY: process.env.EXPO_PUBLIC_GOOGLE_MAPS_API_KEY || '',
    API_BASE_URL: 'https://places.googleapis.com/v1',
    MAPS_API_BASE_URL: 'https://maps.googleapis.com/maps/api',
    CACHE_TTL_HOURS: 24,
    MAX_PHOTOS_PER_PLACE: 3,
    DEFAULT_SEARCH_RADIUS: 3000,
    MAX_SEARCH_RESULTS: 20,
    ENABLE_DEBUG_LOGS: true,
  },
  
  production: {
    GOOGLE_PLACES_API_KEY: process.env.EXPO_PUBLIC_GOOGLE_PLACES_API_KEY || '',
    GOOGLE_MAPS_API_KEY: process.env.EXPO_PUBLIC_GOOGLE_MAPS_API_KEY || '',
    API_BASE_URL: 'https://places.googleapis.com/v1',
    MAPS_API_BASE_URL: 'https://maps.googleapis.com/maps/api',
    CACHE_TTL_HOURS: 24,
    MAX_PHOTOS_PER_PLACE: 3,
    DEFAULT_SEARCH_RADIUS: 3000,
    MAX_SEARCH_RESULTS: 20,
    ENABLE_DEBUG_LOGS: false,
  }
};

const getCurrentConfig = () => {
  const releaseChannel = Constants.expoConfig?.releaseChannel;
  
  if (releaseChannel === 'production') {
    return config.production;
  }
  
  return config.development;
};

export default getCurrentConfig();