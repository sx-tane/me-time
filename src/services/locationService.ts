import * as Location from 'expo-location';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { STORAGE_KEYS } from '../constants/storage';

interface LocationCoords {
  latitude: number;
  longitude: number;
}

interface CachedLocation extends LocationCoords {
  timestamp: number;
}

type LocationCallback = (location: LocationCoords) => void;

class LocationService {
  private lastKnownLocation: CachedLocation | null;
  private locationUpdateInterval: NodeJS.Timeout | null;

  constructor() {
    this.lastKnownLocation = null;
    this.locationUpdateInterval = null;
  }

  async requestPermissions(): Promise<boolean> {
    try {
      console.log('📱 Requesting location permissions...');
      const { status } = await Location.requestForegroundPermissionsAsync();
      
      if (status === 'granted') {
        console.log('✅ Location permission granted!');
        return true;
      } else {
        console.log('❌ Location permission denied');
        console.log('💡 To see real places near you:');
        console.log('   1. Go to device Settings');
        console.log('   2. Find this app in Apps/Privacy');
        console.log('   3. Enable Location permission');
        console.log('   4. Restart the app');
        return false;
      }
    } catch (error) {
      console.error('Error requesting location permissions:', error);
      return false;
    }
  }

  async getCurrentLocation(useCache = true): Promise<LocationCoords> {
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
      });

      const coords: LocationCoords = {
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

  async cacheLocation(location: LocationCoords): Promise<void> {
    try {
      const locationData: CachedLocation = {
        ...location,
        timestamp: Date.now()
      };
      await AsyncStorage.setItem(STORAGE_KEYS.LAST_LOCATION, JSON.stringify(locationData));
    } catch (error) {
      console.error('Error caching location:', error);
    }
  }

  async getCachedLocation(): Promise<LocationCoords | null> {
    try {
      const cached = await AsyncStorage.getItem(STORAGE_KEYS.LAST_LOCATION);
      if (cached) {
        const locationData: CachedLocation = JSON.parse(cached);
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

  async isLocationAvailable(): Promise<boolean> {
    try {
      const permissionStatus = await Location.getForegroundPermissionsAsync();
      return permissionStatus.status === 'granted';
    } catch (error) {
      return false;
    }
  }

  calculateDistance(lat1: number, lon1: number, lat2: number, lon2: number): number {
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

  private degToRad(deg: number): number {
    return deg * (Math.PI/180);
  }

  startLocationUpdates(callback: LocationCallback, interval = 300000): void { // 5 minutes default
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

  stopLocationUpdates(): void {
    if (this.locationUpdateInterval) {
      clearInterval(this.locationUpdateInterval);
      this.locationUpdateInterval = null;
    }
  }

  clearCache(): void {
    this.lastKnownLocation = null;
  }
}

export default new LocationService();