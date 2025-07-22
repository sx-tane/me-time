import AsyncStorage from '@react-native-async-storage/async-storage';
import { suggestions } from '../constants/suggestions';
import { STORAGE_KEYS } from '../constants/storage';

export const getTodaysSuggestion = async () => {
  try {
    const today = new Date().toDateString();
    const lastDate = await AsyncStorage.getItem(STORAGE_KEYS.LAST_SUGGESTION_DATE);
    
    if (lastDate === today) {
      const savedSuggestion = await AsyncStorage.getItem(STORAGE_KEYS.CURRENT_SUGGESTION);
      if (savedSuggestion) {
        return JSON.parse(savedSuggestion);
      }
    }

    const newSuggestion = await getNewSuggestion();
    await AsyncStorage.setItem(STORAGE_KEYS.CURRENT_SUGGESTION, JSON.stringify(newSuggestion));
    await AsyncStorage.setItem(STORAGE_KEYS.LAST_SUGGESTION_DATE, today);
    
    return newSuggestion;
  } catch (error) {
    console.error('Error getting suggestion:', error);
    return suggestions[0];
  }
};

export const getNewSuggestion = async () => {
  try {
    const seenIds = await AsyncStorage.getItem(STORAGE_KEYS.SEEN_SUGGESTIONS);
    const seen = seenIds ? JSON.parse(seenIds) : [];
    
    const available = suggestions.filter(s => !seen.includes(s.id));
    const selected = available.length > 0 
      ? available[Math.floor(Math.random() * available.length)]
      : suggestions[Math.floor(Math.random() * suggestions.length)];
    
    const newSeen = [...seen, selected.id];
    if (newSeen.length >= suggestions.length) {
      await AsyncStorage.setItem(STORAGE_KEYS.SEEN_SUGGESTIONS, JSON.stringify([]));
    } else {
      await AsyncStorage.setItem(STORAGE_KEYS.SEEN_SUGGESTIONS, JSON.stringify(newSeen));
    }
    
    return selected;
  } catch (error) {
    return suggestions[0];
  }
};