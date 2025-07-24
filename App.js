import React, { useState, useEffect } from 'react';
import { View, Text, StatusBar, SafeAreaView, ScrollView, StyleSheet, TouchableOpacity } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';

import { SuggestionCard } from './src/components/SuggestionCard';
import LocationSuggestionCard from './src/components/LocationSuggestionCard';
import LocationCarousel from './src/components/LocationCarousel';
import MindfulContainer from './src/components/MindfulContainer';
import PeacefulLoader from './src/components/PeacefulLoader';
import StepByStepLoader from './src/components/StepByStepLoader';
import LocationVarietyDebug from './src/components/LocationVarietyDebug';
import { SettingsScreen } from './src/components/SettingsScreen';
import { getTodaysSuggestion, getNewSuggestion } from './src/services/suggestionService';
import { notificationService } from './src/services/notificationService';
import { STORAGE_KEYS } from './src/constants/storage';
import colors, { ROUNDED_DESIGN } from './src/constants/colors';

export default function App() {
  const [suggestion, setSuggestion] = useState(null);
  const [previousSuggestion, setPreviousSuggestion] = useState(null);
  const [loading, setLoading] = useState(true);
  const [skipLoading, setSkipLoading] = useState(false);
  const [loadingStage, setLoadingStage] = useState(null);
  const [currentScreen, setCurrentScreen] = useState('home');

  useEffect(() => {
    initializeApp();
  }, []);

  const initializeApp = async () => {
    await loadTodaysSuggestion();
    // Initialize notifications if they're enabled
    const notificationsEnabled = await AsyncStorage.getItem(STORAGE_KEYS.NOTIFICATIONS_ENABLED);
    if (notificationsEnabled === 'true') {
      await notificationService.scheduleAllNotifications();
    }
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


  const handleSkip = async () => {
    try {
      setSkipLoading(true);
      
      // Stage 1: Generating new task
      setLoadingStage('generating');
      console.log('🤖 Stage 1: Generating task...');
      await new Promise(resolve => setTimeout(resolve, 1200));
      
      // Stage 2: Finding locations
      setLoadingStage('locations');
      console.log('🗺️ Stage 2: Finding locations...');
      await new Promise(resolve => setTimeout(resolve, 800));
      
      const newSuggestion = await getNewSuggestion(suggestion);
      
      // Stage 3: Finalizing
      setLoadingStage('finalizing');
      console.log('✨ Stage 3: Finalizing...');
      await new Promise(resolve => setTimeout(resolve, 600));
      
      // Store previous suggestion for variety analysis
      setPreviousSuggestion(suggestion);
      setSuggestion(newSuggestion);
      await AsyncStorage.setItem(STORAGE_KEYS.CURRENT_SUGGESTION, JSON.stringify(newSuggestion));
      
      console.log('✅ Skip complete with new suggestion:', newSuggestion?.title);
    } catch (error) {
      console.error('❌ Error in handleSkip:', error);
    } finally {
      setSkipLoading(false);
      setLoadingStage(null);
    }
  };

  const openSettings = () => {
    setCurrentScreen('settings');
  };

  const closeSettings = () => {
    setCurrentScreen('home');
  };

  if (currentScreen === 'settings') {
    return <SettingsScreen onBack={closeSettings} />;
  }

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor={colors.background} />
      <ScrollView contentContainerStyle={styles.scrollContent}>
        <MindfulContainer fadeIn slideIn delay={0}>
          <View style={styles.header}>
            <Text style={styles.greeting}>Today's me time</Text>
            <TouchableOpacity style={styles.settingsButton} onPress={openSettings}>
              <Text style={styles.settingsButtonText}>⚙️</Text>
            </TouchableOpacity>
          </View>
        </MindfulContainer>
        
        <MindfulContainer fadeIn slideIn delay={200} style={styles.suggestionSection}>
          {loading ? (
            <PeacefulLoader 
              message="Finding something gentle for you..." 
              variant="breathing"
            />
          ) : skipLoading ? (
            <StepByStepLoader 
              stage={loadingStage}
              message="Creating your perfect me-time moment..."
              showSteps={true}
            />
          ) : (
            <SuggestionCard 
              suggestion={suggestion} 
              onSkip={handleSkip} 
              skipLoading={skipLoading}
              loadingStage={loadingStage}
            />
          )}
        </MindfulContainer>

        {/* Location suggestions section - Swipeable carousel */}
        {!loading && suggestion?.locationSuggestions && suggestion.locationSuggestions.length > 0 && (
          <MindfulContainer fadeIn slideIn delay={300}>
            <LocationCarousel 
              locationSuggestions={suggestion.locationSuggestions}
              suggestion={suggestion}
            />
          </MindfulContainer>
        )}

        {/* Debug component for development */}
        {__DEV__ && (
          <LocationVarietyDebug 
            currentSuggestion={suggestion}
            previousSuggestion={previousSuggestion}
            visible={true}
          />
        )}

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
    paddingHorizontal: ROUNDED_DESIGN.spacing.spacious,
    paddingBottom: ROUNDED_DESIGN.spacing.expansive + 12,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: ROUNDED_DESIGN.spacing.spacious,
    marginBottom: ROUNDED_DESIGN.spacing.generous,
    paddingHorizontal: ROUNDED_DESIGN.spacing.gentle,
  },
  greeting: {
    fontSize: 30,
    fontWeight: '500',
    color: colors.text,
    letterSpacing: -0.3,
    flex: 1,
    textAlign: 'center',
  },
  settingsButton: {
    padding: ROUNDED_DESIGN.spacing.comfortable,
    borderRadius: ROUNDED_DESIGN.radius.soft,
    backgroundColor: colors.tertiary,
    ...ROUNDED_DESIGN.shadows.gentle,
  },
  settingsButtonText: {
    fontSize: 20,
  },
  suggestionSection: {
    marginBottom: ROUNDED_DESIGN.spacing.generous,
  },
  sectionTitle: {
    fontSize: 24,
    fontWeight: '500',
    letterSpacing: -0.2,
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
});