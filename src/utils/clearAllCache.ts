import AsyncStorage from '@react-native-async-storage/async-storage';
import aiTaskService from '../services/aiTaskService';
import locationService from '../services/locationService';
import placesService from '../services/placesService';
import { STORAGE_KEYS } from '../constants/storage';
import logger from './logger';

interface CacheStats {
  totalAsyncStorageKeys: number;
  cacheKeys: number;
  aiTaskCacheStats: any;
  cacheKeysList: string[];
}

export const clearAllCache = async (): Promise<boolean> => {
  try {
    logger.debug('Starting cache clear...');
    
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
      logger.debug(`Cleared ${cacheKeys.length} cache entries from AsyncStorage`);
    }
    
    // Clear in-memory caches
    aiTaskService.clearCache();
    logger.debug('Cleared AI task service cache');
    
    locationService.clearCache();
    logger.debug('Cleared location service cache');
    
    await placesService.clearCache();
    logger.debug('Cleared places service cache');
    
    logger.debug('All caches cleared successfully');
    return true;
  } catch (error) {
    logger.error('Error clearing cache:', error);
    throw error;
  }
};

// Debug function to show cache stats
export const getCacheStats = async (): Promise<CacheStats | null> => {
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
    logger.error('Error getting cache stats:', error);
    return null;
  }
};