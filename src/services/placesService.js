import AsyncStorage from '@react-native-async-storage/async-storage';
import * as Location from 'expo-location';
import config from '../config/environment';

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
    try {
      return await this._fetchWithNewPlacesAPI(latitude, longitude, radius, types, maxResults);
    } catch (newApiError) {
      console.warn('New Places API failed, falling back to legacy API:', newApiError);
      return await this._fetchWithLegacyAPI(latitude, longitude, radius, types, maxResults);
    }
  }

  async _fetchWithNewPlacesAPI(latitude, longitude, radius, types, maxResults) {
    const url = 'https://places.googleapis.com/v1/places:searchNearby';
    
    const fieldMask = 'places.displayName,places.formattedAddress,places.internationalPhoneNumber,places.websiteUri,places.rating,places.googleMapsUri,places.regularOpeningHours,places.photos,places.location,places.types';

    const requestBody = {
      includedTypes: types,
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

    const response = await fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'X-Goog-Api-Key': GOOGLE_PLACES_API_KEY,
        'X-Goog-FieldMask': fieldMask
      },
      body: JSON.stringify(requestBody)
    });

    if (!response.ok) {
      throw new Error(`New Places API error: ${response.status}`);
    }

    const data = await response.json();
    return this._formatNewAPIResults(data.places || []);
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
    return places.map(place => ({
      id: place.displayName?.text || 'unknown',
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