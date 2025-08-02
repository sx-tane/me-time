import Constants from 'expo-constants';

interface EnvironmentConfig {
  GOOGLE_PLACES_API_KEY: string;
  GOOGLE_MAPS_API_KEY: string;
  OPENAI_API_KEY: string;
  OPENAI_MODEL: string;
  API_BASE_URL: string;
  MAPS_API_BASE_URL: string;
  CACHE_TTL_HOURS: number;
  MAX_PHOTOS_PER_PLACE: number;
  DEFAULT_SEARCH_RADIUS: number;
  MAX_SEARCH_RESULTS: number;
  ENABLE_DEBUG_LOGS: boolean;
}

interface ConfigEnvironments {
  development: EnvironmentConfig;
  production: EnvironmentConfig;
}

const config: ConfigEnvironments = {
  development: {
    GOOGLE_PLACES_API_KEY: process.env.EXPO_PUBLIC_GOOGLE_PLACES_API_KEY || '',
    GOOGLE_MAPS_API_KEY: process.env.EXPO_PUBLIC_GOOGLE_MAPS_API_KEY || '',
    OPENAI_API_KEY: process.env.EXPO_PUBLIC_OPENAI_API_KEY || '',
    OPENAI_MODEL: process.env.EXPO_PUBLIC_OPENAI_MODEL || 'gpt-4o-mini',
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
    OPENAI_API_KEY: process.env.EXPO_PUBLIC_OPENAI_API_KEY || '',
    OPENAI_MODEL: process.env.EXPO_PUBLIC_OPENAI_MODEL || 'gpt-4o-mini',
    API_BASE_URL: 'https://places.googleapis.com/v1',
    MAPS_API_BASE_URL: 'https://maps.googleapis.com/maps/api',
    CACHE_TTL_HOURS: 24,
    MAX_PHOTOS_PER_PLACE: 3,
    DEFAULT_SEARCH_RADIUS: 3000,
    MAX_SEARCH_RESULTS: 20,
    ENABLE_DEBUG_LOGS: false,
  }
};

const getCurrentConfig = (): EnvironmentConfig => {
  const releaseChannel = (Constants.expoConfig as any)?.releaseChannel;
  
  if (releaseChannel === 'production') {
    return config.production;
  }
  
  return config.development;
};

const currentConfig = getCurrentConfig();

// Debug: Log API key status (first 10 chars only for security)
console.log('🔧 Environment Debug:');
console.log('📍 Google Places API Key:', currentConfig.GOOGLE_PLACES_API_KEY ? `${currentConfig.GOOGLE_PLACES_API_KEY.substring(0, 10)}...` : 'NOT SET');
console.log('🗺️ Google Maps API Key:', currentConfig.GOOGLE_MAPS_API_KEY ? `${currentConfig.GOOGLE_MAPS_API_KEY.substring(0, 10)}...` : 'NOT SET');
console.log('🤖 OpenAI API Key:', currentConfig.OPENAI_API_KEY ? `${currentConfig.OPENAI_API_KEY.substring(0, 10)}...` : 'NOT SET');
console.log('🏗️ Release Channel:', (Constants.expoConfig as any)?.releaseChannel || 'development');
console.log('💡 Debug Mode:', currentConfig.ENABLE_DEBUG_LOGS);

export default currentConfig;