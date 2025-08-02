// Core application types

export interface Suggestion {
  id: number;
  text: string;
  type: 'discovery' | 'mindful' | 'movement' | 'reflection' | 'sensory' | 'rest';
  icon: string;
}

export interface PeacefulSpot {
  id: number;
  name: string;
  type: 'cafe' | 'nature' | 'library' | 'viewpoint' | 'bookstore';
  distance: string;
  icon: string;
}

export interface Location {
  latitude: number;
  longitude: number;
}

export interface LocationCoords {
  lat: number;
  lng: number;
  latitude?: number;
  longitude?: number;
}

export interface PlacePhoto {
  url: string;
  width: number;
  height: number;
}

export interface Place {
  id: string;
  name: string;
  address: string;
  phone: string | null;
  website: string | null;
  rating: number | null;
  googleMapsUrl: string | null;
  openingHours: string[];
  location: LocationCoords | null;
  types: string[];
  photos: PlacePhoto[];
}

export interface GetNearbyPlacesOptions {
  latitude: number;
  longitude: number;
  radius?: number;
  types?: string[];
  maxResults?: number;
  bypassCache?: boolean;
}

export interface CacheData<T = any> {
  data: T;
  timestamp: number;
}

export interface NotificationConfig {
  id: string;
  title: string;
  body: string;
  data?: Record<string, any>;
  trigger?: {
    seconds?: number;
    repeats?: boolean;
    hour?: number;
    minute?: number;
  };
}

export interface ApiMonitoringData {
  placesApiCalls: number;
  openaiApiCalls: number;
  cachedRequests: number;
  totalCosts: number;
  dailyLimits: {
    places: number;
    openai: number;
  };
  lastReset: string;
}

export interface RateLimitConfig {
  maxRequests: number;
  windowMs: number;
  requests: number[];
}

export interface EnvironmentConfig {
  GOOGLE_PLACES_API_KEY: string | null;
  GOOGLE_MAPS_API_KEY: string | null;
  OPENAI_API_KEY: string | null;
  CACHE_TTL_HOURS: number;
  MAX_PHOTOS_PER_PLACE: number;
  ENABLE_DEBUG_LOGS: boolean;
}

export type SuggestionType = Suggestion['type'];
export type PlaceType = PeacefulSpot['type'] | 'restaurant' | 'tourist_attraction' | 'park' | 'museum' | 'cafe' | 'shopping_mall' | 'spa' | 'gym' | 'art_gallery' | 'botanical_garden' | 'store' | 'church' | 'hospital' | 'pharmacy' | 'bank' | 'atm' | 'gas_station' | 'school' | 'university' | 'bakery' | 'establishment' | 'point_of_interest';

// React Native specific types
export interface Dimensions {
  width: number;
  height: number;
}

export interface AnimationConfig {
  duration: number;
  easing?: 'linear' | 'ease' | 'ease-in' | 'ease-out' | 'ease-in-out';
  delay?: number;
  toValue?: number;
}

// Component prop types
export interface ComponentStyle {
  [key: string]: any;
}

export interface ButtonProps {
  title: string;
  onPress: () => void;
  style?: ComponentStyle;
  textStyle?: ComponentStyle;
  disabled?: boolean;
  loading?: boolean;
}

export interface LoaderProps {
  visible: boolean;
  text?: string;
  steps?: string[];
  currentStep?: number;
}

export interface SettingsData {
  notifications: boolean;
  locationPermission: boolean;
  theme: 'light' | 'dark' | 'auto';
  language: string;
}

// Enhanced suggestion type with location and AI data
export interface EnhancedSuggestion extends Suggestion {
  description?: string;
  timeEstimate?: string;
  duration?: string;
  difficulty?: string;
  category?: string;
  title?: string;
  source?: 'ai' | 'fallback' | 'static';
  locationSuggestion?: LocationSuggestion;
  locationSuggestions?: LocationSuggestion[];
}

export interface LocationSuggestion {
  place: Place;
  suitabilityScore?: number;
  reason?: string;
  distance?: string;
  name?: string;
  icon?: string;
  rating?: number;
}

// Loading states
export type LoadingStage = 'generating' | 'locations' | 'finalizing' | null;

// Screen types
export type ScreenType = 'home' | 'settings';

// Component props for React Native components
export interface ViewStyle {
  [key: string]: any;
}

export interface TextStyle extends ViewStyle {}

export interface ImageStyle extends ViewStyle {}