import AsyncStorage from '@react-native-async-storage/async-storage';
import * as Location from 'expo-location';
import { Platform } from 'react-native';
import config from '../config/environment';
import { isWeb } from '../utils/platformDetection';

const GOOGLE_PLACES_API_KEY = config.GOOGLE_PLACES_API_KEY;
const GOOGLE_MAPS_API_KEY = config.GOOGLE_MAPS_API_KEY;
const CACHE_TTL_HOURS = config.CACHE_TTL_HOURS;
const MAX_PHOTOS = config.MAX_PHOTOS_PER_PLACE;
const DEFAULT_PHOTO_WIDTH = 800;
const DEFAULT_PHOTO_HEIGHT = 600;

class PlacesService {
  constructor() {
    this.cache = new Map();
    this.pendingRequests = new Map();
  }

  async getUserLocation() {
    try {
      const { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== 'granted') {
        throw new Error('Location permission denied');
      }

      const location = await Location.getCurrentPositionAsync({});
      return {
        latitude: location.coords.latitude,
        longitude: location.coords.longitude
      };
    } catch (error) {
      console.error('Error getting user location:', error);
      throw error;
    }
  }

  async getNearbyInterestingPlaces(options = {}) {
    const {
      latitude,
      longitude,
      radius = 5000,
      types = ['restaurant', 'tourist_attraction', 'park', 'museum', 'cafe', 'shopping_mall'],
      maxResults = 10
    } = options;

    const cacheKey = `nearby_${latitude}_${longitude}_${radius}_${types.join(',')}_${maxResults}`;
    
    const cachedResult = await this.getCachedResult(cacheKey);
    if (cachedResult) {
      return cachedResult;
    }

    if (this.pendingRequests.has(cacheKey)) {
      return await this.pendingRequests.get(cacheKey);
    }

    const requestPromise = this._fetchNearbyPlaces(latitude, longitude, radius, types, maxResults);
    this.pendingRequests.set(cacheKey, requestPromise);

    try {
      const result = await requestPromise;
      await this.setCachedResult(cacheKey, result);
      return result;
    } finally {
      this.pendingRequests.delete(cacheKey);
    }
  }

  async _fetchNearbyPlaces(latitude, longitude, radius, types, maxResults) {
    if (config.ENABLE_DEBUG_LOGS) {
      console.log('🗺️ Platform detection - isWeb:', isWeb);
      console.log('🗺️ Platform.OS:', Platform?.OS);
      console.log('🗺️ Process:', typeof process !== 'undefined' ? process.platform : 'undefined');
      console.log('🗺️ Navigator:', typeof navigator !== 'undefined' ? navigator.userAgent : 'undefined');
    }
    
    // Only use demo data if we're on web AND API keys aren't configured
    const isActuallyWeb = isWeb && typeof navigator !== 'undefined' && 
                          navigator.userAgent && (!GOOGLE_PLACES_API_KEY || !GOOGLE_MAPS_API_KEY);
    
    if (isActuallyWeb) {
      console.log('🌐 Web environment with missing API keys detected, using demo places data');
      return this._getDemoPlacesForWeb(latitude, longitude, types, maxResults);
    }
    
    console.log('📱 Platform with API keys configured, using real Places API');
    try {
      return await this._fetchWithNewPlacesAPI(latitude, longitude, radius, types, maxResults);
    } catch (newApiError) {
      console.warn('New Places API failed, falling back to legacy API:', newApiError);
      return await this._fetchWithLegacyAPI(latitude, longitude, radius, types, maxResults);
    }
  }

  async _fetchWithNewPlacesAPI(latitude, longitude, radius, types, maxResults) {
    const url = 'https://places.googleapis.com/v1/places:searchNearby';
    
    if (!GOOGLE_PLACES_API_KEY) {
      throw new Error('Google Places API key not configured');
    }
    
    const fieldMask = 'places.displayName,places.formattedAddress,places.rating,places.location,places.types';

    // Comprehensive mapping for Google Places API v1 types
    const typeMapping = {
      'park': 'park',
      'garden': 'park', 
      'spa': 'spa',
      'cafe': 'cafe',
      'restaurant': 'restaurant',
      'museum': 'museum',
      'library': 'library',
      'tourist_attraction': 'tourist_attraction',
      'shopping_mall': 'shopping_mall',
      'fitness_center': 'gym',
      'art_gallery': 'art_gallery',
      'botanical_garden': 'park',
      'gym': 'gym',
      'store': 'store',
      'shopping_center': 'shopping_mall',
      'book_store': 'book_store',
      'church': 'church',
      'hospital': 'hospital',
      'pharmacy': 'pharmacy',
      'bank': 'bank',
      'atm': 'atm',
      'gas_station': 'gas_station',
      'school': 'school',
      'university': 'university',
      'trail': 'park',  // Map trail to park since Google Places API doesn't support 'trail'
      'walking_path': 'park'  // Also map walking_path to park for consistency
    };

    // Convert requested types to valid Google Places API types
    const validTypes = types
      .map(type => typeMapping[type] || type)
      .filter((type, index, self) => self.indexOf(type) === index); // Remove duplicates

    if (config.ENABLE_DEBUG_LOGS) {
      console.log('🏷️ Original types:', types);
      console.log('🏷️ Mapped types:', validTypes);
    }

    const requestBody = {
      includedTypes: validTypes,
      maxResultCount: Math.min(maxResults, 20),
      locationRestriction: {
        circle: {
          center: {
            latitude: latitude,
            longitude: longitude
          },
          radius: radius
        }
      },
      languageCode: 'en'
    };

    // If no valid types mapped, use broader search categories
    if (validTypes.length === 0) {
      requestBody.includedTypes = ['establishment', 'point_of_interest'];
      // Remove includedTypes and use includedPrimaryTypes for broader search
      delete requestBody.includedTypes;
      requestBody.includedPrimaryTypes = ['establishment'];
    }

    console.log('Making Places API request:', { types, location: { latitude, longitude }, radius });
    if (config.ENABLE_DEBUG_LOGS) {
      console.log('📨 Request body:', JSON.stringify(requestBody, null, 2));
    }
    console.log('🔑 API key configured:', !!GOOGLE_PLACES_API_KEY);

    const response = await fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'X-Goog-Api-Key': GOOGLE_PLACES_API_KEY,
        'X-Goog-FieldMask': fieldMask
      },
      body: JSON.stringify(requestBody)
    });

    console.log('📥 Places API response status:', response.status);
    
    if (!response.ok) {
      const errorText = await response.text();
      console.error('Places API error:', response.status, errorText);
      throw new Error(`New Places API error: ${response.status} - ${errorText}`);
    }

    const data = await response.json();
    if (config.ENABLE_DEBUG_LOGS && data.places?.length > 0) {
      console.log('📊 Raw API response sample:', JSON.stringify(data.places[0], null, 2));
    }
    console.log('📊 API returned', data.places?.length || 0, 'places');
    let formattedResults = this._formatNewAPIResults(data.places || []);
    console.log('✨ Formatted results count:', formattedResults.length);
    
    // If no results, try a broader search with common place types
    if (formattedResults.length === 0 && validTypes.length > 0) {
      console.log('🔄 No results found, trying broader search...');
      const broadRequestBody = {
        maxResultCount: Math.min(maxResults, 10),
        locationRestriction: requestBody.locationRestriction,
        languageCode: 'en'
      };
      
      // Try without any type restrictions for maximum results
      if (radius > 2000) {
        broadRequestBody.rankPreference = 'DISTANCE';
      }
      
      const broadResponse = await fetch(url, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'X-Goog-Api-Key': GOOGLE_PLACES_API_KEY,
          'X-Goog-FieldMask': fieldMask
        },
        body: JSON.stringify(broadRequestBody)
      });
      
      if (broadResponse.ok) {
        const broadData = await broadResponse.json();
        formattedResults = this._formatNewAPIResults(broadData.places || []);
        console.log('🎯 Broader search found:', formattedResults.length, 'places');
      } else {
        console.warn('🔄 Broader search also failed:', broadResponse.status);
      }
    }
    
    return formattedResults;
  }

  async _fetchWithLegacyAPI(latitude, longitude, radius, types, maxResults) {
    const typeStr = types.join('|');
    const url = `https://maps.googleapis.com/maps/api/place/nearbysearch/json?location=${latitude},${longitude}&radius=${radius}&type=${typeStr}&key=${GOOGLE_MAPS_API_KEY}`;

    const response = await fetch(url);
    if (!response.ok) {
      throw new Error(`Legacy Places API error: ${response.status}`);
    }

    const data = await response.json();
    if (data.status !== 'OK') {
      throw new Error(`Legacy API status: ${data.status}`);
    }

    return this._formatLegacyAPIResults(data.results.slice(0, maxResults));
  }

  _formatNewAPIResults(places) {
    return places.map((place, index) => ({
      id: place.id || `place_${Date.now()}_${index}`,
      name: place.displayName?.text || 'Unknown Place',
      address: place.formattedAddress || '',
      phone: place.internationalPhoneNumber || null,
      website: place.websiteUri || null,
      rating: place.rating || null,
      googleMapsUrl: place.googleMapsUri || null,
      openingHours: place.regularOpeningHours?.weekdayDescriptions || [],
      location: place.location ? {
        lat: place.location.latitude,
        lng: place.location.longitude
      } : null,
      types: place.types || [],
      photos: this._formatPhotosFromNewAPI(place.photos || [])
    }));
  }

  _formatLegacyAPIResults(places) {
    return places.map(place => ({
      id: place.place_id,
      name: place.name,
      address: place.vicinity || '',
      phone: null,
      website: null,
      rating: place.rating || null,
      googleMapsUrl: null,
      openingHours: [],
      location: place.geometry ? {
        lat: place.geometry.location.lat,
        lng: place.geometry.location.lng
      } : null,
      types: place.types || [],
      photos: this._formatPhotosFromLegacyAPI(place.photos || [])
    }));
  }

  _formatPhotosFromNewAPI(photos) {
    return photos.slice(0, MAX_PHOTOS).map(photo => ({
      url: `https://places.googleapis.com/v1/${photo.name}/media?key=${GOOGLE_PLACES_API_KEY}&maxHeightPx=${DEFAULT_PHOTO_HEIGHT}&maxWidthPx=${DEFAULT_PHOTO_WIDTH}`,
      width: DEFAULT_PHOTO_WIDTH,
      height: DEFAULT_PHOTO_HEIGHT
    }));
  }

  _formatPhotosFromLegacyAPI(photos) {
    return photos.slice(0, MAX_PHOTOS).map(photo => ({
      url: `https://maps.googleapis.com/maps/api/place/photo?maxwidth=${DEFAULT_PHOTO_WIDTH}&photoreference=${photo.photo_reference}&key=${GOOGLE_MAPS_API_KEY}`,
      width: DEFAULT_PHOTO_WIDTH,
      height: DEFAULT_PHOTO_HEIGHT
    }));
  }

  async getCachedResult(key) {
    try {
      const cached = await AsyncStorage.getItem(`places_cache_${key}`);
      if (cached) {
        const { data, timestamp } = JSON.parse(cached);
        const now = Date.now();
        const ttl = CACHE_TTL_HOURS * 60 * 60 * 1000;
        
        if (now - timestamp < ttl) {
          return data;
        } else {
          await AsyncStorage.removeItem(`places_cache_${key}`);
        }
      }
    } catch (error) {
      console.error('Cache read error:', error);
    }
    return null;
  }

  async setCachedResult(key, data) {
    try {
      const cacheData = {
        data,
        timestamp: Date.now()
      };
      await AsyncStorage.setItem(`places_cache_${key}`, JSON.stringify(cacheData));
    } catch (error) {
      console.error('Cache write error:', error);
    }
  }

  async getRandomInterestingPlace(userLocation) {
    try {
      const places = await this.getNearbyInterestingPlaces({
        latitude: userLocation.latitude,
        longitude: userLocation.longitude,
        radius: 3000,
        maxResults: 20
      });

      if (places.length === 0) {
        return null;
      }

      const highRatedPlaces = places.filter(place => 
        place.rating && place.rating >= 4.0
      );

      const placesToChooseFrom = highRatedPlaces.length > 0 ? highRatedPlaces : places;
      const randomIndex = Math.floor(Math.random() * placesToChooseFrom.length);
      
      return placesToChooseFrom[randomIndex];
    } catch (error) {
      console.error('Error getting random place:', error);
      return null;
    }
  }

  _getDemoPlacesForWeb(latitude, longitude, types, maxResults) {
    // Demo places data for web platform
    const demoPlaces = [
      {
        id: 'demo_park_1',
        name: 'Serenity Garden Park',
        address: '123 Peaceful Lane, Nearby',
        phone: null,
        website: 'https://example.com/serenity-park',
        rating: 4.8,
        googleMapsUrl: null,
        openingHours: ['Monday: 6:00 AM – 10:00 PM', 'Tuesday: 6:00 AM – 10:00 PM', 'Wednesday: 6:00 AM – 10:00 PM'],
        location: { lat: latitude + 0.005, lng: longitude + 0.003 },
        types: ['park', 'garden'],
        photos: []
      },
      {
        id: 'demo_cafe_1',
        name: 'Mindful Moments Café',
        address: '456 Zen Street, Downtown',
        phone: '+1 234-567-8901',
        website: 'https://example.com/mindful-cafe',
        rating: 4.6,
        googleMapsUrl: null,
        openingHours: ['Monday: 7:00 AM – 8:00 PM', 'Tuesday: 7:00 AM – 8:00 PM'],
        location: { lat: latitude - 0.003, lng: longitude + 0.004 },
        types: ['cafe', 'restaurant'],
        photos: []
      },
      {
        id: 'demo_library_1',
        name: 'Central Peace Library',
        address: '789 Quiet Avenue',
        phone: '+1 234-567-8902',
        website: null,
        rating: 4.9,
        googleMapsUrl: null,
        openingHours: ['Monday: 9:00 AM – 9:00 PM', 'Tuesday: 9:00 AM – 9:00 PM'],
        location: { lat: latitude + 0.002, lng: longitude - 0.006 },
        types: ['library'],
        photos: []
      },
      {
        id: 'demo_museum_1',
        name: 'Museum of Tranquil Arts',
        address: '321 Culture Boulevard',
        phone: '+1 234-567-8903',
        website: 'https://example.com/tranquil-museum',
        rating: 4.7,
        googleMapsUrl: null,
        openingHours: ['Monday: 10:00 AM – 6:00 PM', 'Tuesday: 10:00 AM – 6:00 PM'],
        location: { lat: latitude - 0.004, lng: longitude - 0.002 },
        types: ['museum', 'art_gallery'],
        photos: []
      },
      {
        id: 'demo_spa_1',
        name: 'Blissful Wellness Spa',
        address: '555 Relaxation Road',
        phone: '+1 234-567-8904',
        website: 'https://example.com/blissful-spa',
        rating: 4.9,
        googleMapsUrl: null,
        openingHours: ['Monday: 9:00 AM – 10:00 PM', 'Tuesday: 9:00 AM – 10:00 PM'],
        location: { lat: latitude + 0.006, lng: longitude - 0.004 },
        types: ['spa', 'health'],
        photos: []
      },
      {
        id: 'demo_garden_1',
        name: 'Zen Botanical Gardens',
        address: '888 Flora Way',
        phone: null,
        website: null,
        rating: 4.8,
        googleMapsUrl: null,
        openingHours: ['Monday: 8:00 AM – 7:00 PM', 'Tuesday: 8:00 AM – 7:00 PM'],
        location: { lat: latitude - 0.007, lng: longitude + 0.005 },
        types: ['botanical_garden', 'park'],
        photos: []
      }
    ];

    // Filter places based on requested types
    let filteredPlaces = demoPlaces;
    if (types && types.length > 0) {
      console.log('🔍 Filtering demo places for types:', types);
      filteredPlaces = demoPlaces.filter(place => {
        const matches = place.types.some(placeType => 
          types.some(requestedType => 
            placeType.includes(requestedType) || requestedType.includes(placeType)
          )
        );
        if (matches) {
          console.log(`✅ ${place.name} matches (types: ${place.types.join(', ')})`);
        }
        return matches;
      });
      console.log(`📊 Found ${filteredPlaces.length} matching places`);
    }

    // If no places match the types, return some default places
    if (filteredPlaces.length === 0) {
      filteredPlaces = demoPlaces.slice(0, 3);
    }

    // Return up to maxResults places
    return filteredPlaces.slice(0, maxResults);
  }

  async clearCache() {
    try {
      const keys = await AsyncStorage.getAllKeys();
      const cacheKeys = keys.filter(key => key.startsWith('places_cache_'));
      if (cacheKeys.length > 0) {
        await AsyncStorage.multiRemove(cacheKeys);
      }
    } catch (error) {
      console.error('Error clearing cache:', error);
    }
  }
}

export default new PlacesService();