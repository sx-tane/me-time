import AsyncStorage from '@react-native-async-storage/async-storage';

class LocationHistoryService {
  constructor() {
    this.memoryHistory = new Set(); // In-memory for session
    this.maxHistorySize = 10;
  }

  async getRecentLocationIds() {
    try {
      const stored = await AsyncStorage.getItem('recent_location_ids');
      const storedIds = stored ? JSON.parse(stored) : [];
      return [...storedIds, ...Array.from(this.memoryHistory)];
    } catch (error) {
      console.error('Error getting recent location IDs:', error);
      return Array.from(this.memoryHistory);
    }
  }

  async addLocationId(locationId) {
    try {
      // Add to memory
      this.memoryHistory.add(locationId);
      
      // Keep memory size manageable
      if (this.memoryHistory.size > this.maxHistorySize) {
        const oldestId = this.memoryHistory.values().next().value;
        this.memoryHistory.delete(oldestId);
      }

      // Add to storage
      const stored = await AsyncStorage.getItem('recent_location_ids');
      const storedIds = stored ? JSON.parse(stored) : [];
      
      if (!storedIds.includes(locationId)) {
        storedIds.unshift(locationId); // Add to beginning
        
        // Keep only recent entries
        const recentIds = storedIds.slice(0, this.maxHistorySize);
        await AsyncStorage.setItem('recent_location_ids', JSON.stringify(recentIds));
      }
    } catch (error) {
      console.error('Error adding location ID to history:', error);
    }
  }

  async clearHistory() {
    try {
      this.memoryHistory.clear();
      await AsyncStorage.removeItem('recent_location_ids');
    } catch (error) {
      console.error('Error clearing location history:', error);
    }
  }

  isRecentlyShown(locationId) {
    return this.memoryHistory.has(locationId);
  }
}

export default new LocationHistoryService();