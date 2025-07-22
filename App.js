import React, { useState, useEffect } from 'react';
import { View, Text, StatusBar, SafeAreaView, ScrollView, StyleSheet } from 'react-native';
import * as Location from 'expo-location';
import AsyncStorage from '@react-native-async-storage/async-storage';

import { SuggestionCard } from './src/components/SuggestionCard';
import LocationSuggestionCard from './src/components/LocationSuggestionCard';
import MindfulContainer from './src/components/MindfulContainer';
import PeacefulLoader from './src/components/PeacefulLoader';
import { getTodaysSuggestion, getNewSuggestion, getAIEnhancedInterestingSpots } from './src/services/suggestionService';
import { STORAGE_KEYS } from './src/constants/storage';
import colors from './src/constants/colors';

export default function App() {
  const [suggestion, setSuggestion] = useState(null);
  const [interestingSpots, setInterestingSpots] = useState([]);
  const [loading, setLoading] = useState(true);
  const [spotsLoading, setSpotsLoading] = useState(true);
  const [locationPermission, setLocationPermission] = useState(false);

  useEffect(() => {
    initializeApp();
  }, []);

  const initializeApp = async () => {
    await checkLocationPermission();
    await loadTodaysSuggestion();
    await loadInterestingSpots();
  };

  const checkLocationPermission = async () => {
    const { status } = await Location.requestForegroundPermissionsAsync();
    setLocationPermission(status === 'granted');
  };

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

  const loadInterestingSpots = async () => {
    if (!locationPermission) return;
    
    try {
      setSpotsLoading(true);
      const spots = await getAIEnhancedInterestingSpots([], { maxResults: 6 });
      setInterestingSpots(spots);
    } catch (error) {
      console.error('Error loading interesting spots:', error);
    } finally {
      setSpotsLoading(false);
    }
  };

  const handleSkip = async () => {
    const newSuggestion = await getNewSuggestion();
    setSuggestion(newSuggestion);
    await AsyncStorage.setItem(STORAGE_KEYS.CURRENT_SUGGESTION, JSON.stringify(newSuggestion));
  };

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor={colors.background} />
      <ScrollView contentContainerStyle={styles.scrollContent}>
        <MindfulContainer fadeIn slideIn delay={0}>
          <Text style={styles.greeting}>Today's me time</Text>
        </MindfulContainer>
        
        <MindfulContainer fadeIn slideIn delay={200} style={styles.suggestionSection}>
          {loading ? (
            <PeacefulLoader 
              message="Finding something gentle for you..." 
              variant="breathing"
            />
          ) : (
            <SuggestionCard suggestion={suggestion} onSkip={handleSkip} />
          )}
        </MindfulContainer>

        <MindfulContainer fadeIn slideIn delay={400} style={styles.spotsSection}>
          <Text style={styles.sectionTitle}>✨ Interesting spots nearby</Text>
          
          {!locationPermission ? (
            <View style={styles.permissionCard}>
              <Text style={styles.permissionText}>Enable location to discover interesting spots within walking distance</Text>
            </View>
          ) : spotsLoading ? (
            <PeacefulLoader 
              message="Discovering interesting spots nearby..." 
              variant="floating"
            />
          ) : (
            <View>
              {interestingSpots.length > 0 ? (
                <>
                  <Text style={styles.spotsSubtitle}>{interestingSpots.length} places to spark curiosity nearby</Text>
                  {interestingSpots.map((spot, index) => (
                    <LocationSuggestionCard 
                      key={`interesting_${index}`} 
                      suggestion={spot} 
                      style={styles.spotCard}
                    />
                  ))}
                </>
              ) : (
                <Text style={styles.noSpotsText}>No interesting spots found nearby. Try walking to a different area!</Text>
              )}
            </View>
          )}
        </MindfulContainer>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  scrollContent: {
    paddingHorizontal: 24,
    paddingBottom: 60,
  },
  greeting: {
    fontSize: 28,
    fontWeight: '700',
    color: colors.text,
    letterSpacing: -0.5,
    marginTop: 24,
    marginBottom: 32,
    textAlign: 'center',
  },
  suggestionSection: {
    marginBottom: 32,
  },
  spotsSection: {
    marginBottom: 20,
  },
  sectionTitle: {
    fontSize: 22,
    fontWeight: '600',
    color: colors.text,
    marginBottom: 16,
    letterSpacing: -0.3,
  },
  spotsSubtitle: {
    fontSize: 14,
    color: colors.lightText,
    marginBottom: 20,
    fontStyle: 'italic',
  },
  spotCard: {
    marginBottom: 16,
  },
  permissionCard: {
    backgroundColor: colors.surface,
    borderRadius: 16,
    padding: 20,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: colors.border,
  },
  permissionText: {
    fontSize: 16,
    color: colors.text,
    textAlign: 'center',
    lineHeight: 22,
  },
  noSpotsText: {
    fontSize: 16,
    color: colors.lightText,
    textAlign: 'center',
    fontStyle: 'italic',
    marginTop: 20,
  },
});