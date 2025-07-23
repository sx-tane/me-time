import AsyncStorage from '@react-native-async-storage/async-storage';
import { aiTaskService } from '../services/aiTaskService';
import { locationService } from '../services/locationService';
import { placesService } from '../services/placesService';
import { STORAGE_KEYS } from '../constants/storage';

export const clearAllCache = async () => {
  try {
    console.log('Starting cache clear...');
    
    // Clear AsyncStorage data
    const keysToRemove = [
      STORAGE_KEYS.CURRENT_SUGGESTION,
      STORAGE_KEYS.LAST_SUGGESTION_DATE,
      STORAGE_KEYS.SEEN_SUGGESTIONS,
      STORAGE_KEYS.LAST_LOCATION,
      STORAGE_KEYS.LOCATION_PLACES,
    ];
    
    // Get all AsyncStorage keys and filter for cache-related ones
    const allKeys = await AsyncStorage.getAllKeys();
    const cacheKeys = allKeys.filter(key => 
      key.includes('places_cache_') || 
      key.includes('@me_time_cache') ||
      keysToRemove.includes(key)
    );
    
    // Remove all cache keys
    if (cacheKeys.length > 0) {
      await AsyncStorage.multiRemove(cacheKeys);
      console.log(`Cleared ${cacheKeys.length} cache entries from AsyncStorage`);
    }
    
    // Clear in-memory caches
    aiTaskService.clearCache();
    console.log('Cleared AI task service cache');
    
    await locationService.clearLocationCache();
    console.log('Cleared location service cache');
    
    await placesService.clearCache();
    console.log('Cleared places service cache');
    
    console.log('All caches cleared successfully');
    return true;
  } catch (error) {
    console.error('Error clearing cache:', error);
    throw error;
  }
};

// Debug function to show cache stats
export const getCacheStats = async () => {
  try {
    const allKeys = await AsyncStorage.getAllKeys();
    const cacheKeys = allKeys.filter(key => 
      key.includes('cache') || 
      key.includes(STORAGE_KEYS.LAST_LOCATION) ||
      key.includes(STORAGE_KEYS.LOCATION_PLACES)
    );
    
    const stats = {
      totalAsyncStorageKeys: allKeys.length,
      cacheKeys: cacheKeys.length,
      aiTaskCacheStats: aiTaskService.getCacheStats(),
      cacheKeysList: cacheKeys
    };
    
    return stats;
  } catch (error) {
    console.error('Error getting cache stats:', error);
    return null;
  }
};