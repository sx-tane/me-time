import React, { useState, useEffect } from 'react';
import { View, Text, SafeAreaView, ScrollView, TouchableOpacity, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { SuggestionCard } from '../components/SuggestionCard';
import { getTodaysSuggestion, getNewSuggestion } from '../services/suggestionService';
import { STORAGE_KEYS } from '../constants/storage';
import colors from '../constants/colors';

export const HomeScreen = ({ navigation }) => {
  const [suggestion, setSuggestion] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadTodaysSuggestion();
  }, []);

  const loadTodaysSuggestion = async () => {
    try {
      const todaysSuggestion = await getTodaysSuggestion();
      setSuggestion(todaysSuggestion);
    } catch (error) {
      console.error('Error loading suggestion:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSkip = async () => {
    const newSuggestion = await getNewSuggestion();
    setSuggestion(newSuggestion);
    await AsyncStorage.setItem(STORAGE_KEYS.CURRENT_SUGGESTION, JSON.stringify(newSuggestion));
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollContent}>
        <View style={styles.header}>
          <Text style={styles.greeting}>Today's me time</Text>
          <TouchableOpacity onPress={() => navigation.navigate('Settings')}>
            <Ionicons name="settings-outline" size={24} color={colors.text} />
          </TouchableOpacity>
        </View>
        
        {loading ? (
          <View style={styles.loadingContainer}>
            <Text style={styles.loadingText}>Finding something gentle...</Text>
          </View>
        ) : (
          <SuggestionCard suggestion={suggestion} onSkip={handleSkip} />
        )}
        
        <TouchableOpacity 
          style={styles.discoverButton}
          onPress={() => navigation.navigate('Discover')}
        >
          <Ionicons name="compass-outline" size={24} color={colors.primary} />
          <Text style={styles.discoverButtonText}>Discover peaceful spots nearby</Text>
        </TouchableOpacity>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  scrollContent: {
    paddingHorizontal: 20,
    paddingBottom: 40,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 20,
    marginBottom: 30,
  },
  greeting: {
    fontSize: 28,
    fontWeight: '700',
    color: colors.text,
  },
  loadingContainer: {
    padding: 50,
    alignItems: 'center',
  },
  loadingText: {
    fontSize: 18,
    color: colors.lightText,
  },
  discoverButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 40,
    padding: 20,
    backgroundColor: colors.card,
    borderRadius: 15,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 5,
    elevation: 2,
  },
  discoverButtonText: {
    marginLeft: 10,
    fontSize: 16,
    color: colors.text,
    fontWeight: '500',
  },
});