import * as Location from 'expo-location';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { STORAGE_KEYS } from '../constants/storage';

class LocationService {
  constructor() {
    this.lastKnownLocation = null;
    this.locationUpdateInterval = null;
  }

  async requestPermissions() {
    try {
      const { status } = await Location.requestForegroundPermissionsAsync();
      return status === 'granted';
    } catch (error) {
      console.error('Error requesting location permissions:', error);
      return false;
    }
  }

  async getCurrentLocation(useCache = true) {
    try {
      console.log('Getting current location, useCache:', useCache);
      
      if (useCache && this.lastKnownLocation) {
        const now = Date.now();
        const locationAge = now - this.lastKnownLocation.timestamp;
        const fiveMinutes = 5 * 60 * 1000;
        
        if (locationAge < fiveMinutes) {
          console.log('Using cached location');
          return {
            latitude: this.lastKnownLocation.latitude,
            longitude: this.lastKnownLocation.longitude
          };
        }
      }

      console.log('Requesting location permissions...');
      const hasPermission = await this.requestPermissions();
      console.log('Location permission granted:', hasPermission);
      
      if (!hasPermission) {
        const cachedLocation = await this.getCachedLocation();
        if (cachedLocation) {
          console.log('Using fallback cached location');
          return cachedLocation;
        }
        throw new Error('Location permission denied and no cached location available');
      }

      console.log('Getting current position...');
      const location = await Location.getCurrentPositionAsync({
        accuracy: Location.Accuracy.Balanced,
        maximumAge: 300000, // 5 minutes
      });

      const coords = {
        latitude: location.coords.latitude,
        longitude: location.coords.longitude
      };

      this.lastKnownLocation = {
        ...coords,
        timestamp: Date.now()
      };

      await this.cacheLocation(coords);
      return coords;
    } catch (error) {
      console.error('Error getting current location:', error);
      
      const cachedLocation = await this.getCachedLocation();
      if (cachedLocation) {
        return cachedLocation;
      }
      
      throw error;
    }
  }

  async cacheLocation(location) {
    try {
      const locationData = {
        ...location,
        timestamp: Date.now()
      };
      await AsyncStorage.setItem(STORAGE_KEYS.LAST_LOCATION, JSON.stringify(locationData));
    } catch (error) {
      console.error('Error caching location:', error);
    }
  }

  async getCachedLocation() {
    try {
      const cached = await AsyncStorage.getItem(STORAGE_KEYS.LAST_LOCATION);
      if (cached) {
        const locationData = JSON.parse(cached);
        const now = Date.now();
        const oneDay = 24 * 60 * 60 * 1000;
        
        if (now - locationData.timestamp < oneDay) {
          return {
            latitude: locationData.latitude,
            longitude: locationData.longitude
          };
        }
      }
    } catch (error) {
      console.error('Error getting cached location:', error);
    }
    return null;
  }

  async isLocationAvailable() {
    try {
      const permissionStatus = await Location.getForegroundPermissionsAsync();
      return permissionStatus.status === 'granted';
    } catch (error) {
      return false;
    }
  }

  calculateDistance(lat1, lon1, lat2, lon2) {
    const R = 6371; // Earth's radius in kilometers
    const dLat = this.degToRad(lat2 - lat1);
    const dLon = this.degToRad(lon2 - lon1);
    const a = 
      Math.sin(dLat/2) * Math.sin(dLat/2) +
      Math.cos(this.degToRad(lat1)) * Math.cos(this.degToRad(lat2)) * 
      Math.sin(dLon/2) * Math.sin(dLon/2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
    return R * c; // Distance in kilometers
  }

  degToRad(deg) {
    return deg * (Math.PI/180);
  }

  startLocationUpdates(callback, interval = 300000) { // 5 minutes default
    if (this.locationUpdateInterval) {
      clearInterval(this.locationUpdateInterval);
    }

    this.locationUpdateInterval = setInterval(async () => {
      try {
        const location = await this.getCurrentLocation(false);
        callback(location);
      } catch (error) {
        console.error('Location update error:', error);
      }
    }, interval);
  }

  stopLocationUpdates() {
    if (this.locationUpdateInterval) {
      clearInterval(this.locationUpdateInterval);
      this.locationUpdateInterval = null;
    }
  }

  async clearLocationCache() {
    try {
      await AsyncStorage.removeItem(STORAGE_KEYS.LAST_LOCATION);
      this.lastKnownLocation = null;
    } catch (error) {
      console.error('Error clearing location cache:', error);
    }
  }
}

export default new LocationService();