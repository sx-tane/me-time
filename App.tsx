import React, { useState, useEffect } from 'react';
import type { JSX } from 'react';
import { View, Text, StatusBar, SafeAreaView, ScrollView, StyleSheet, TouchableOpacity } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Ionicons } from '@expo/vector-icons';

import { SuggestionCard } from './src/components/SuggestionCard';
import LocationSuggestionCard from './src/components/LocationSuggestionCard';
import LocationCarousel from './src/components/LocationCarousel';
import MindfulContainer from './src/components/MindfulContainer';
import PeacefulLoader from './src/components/PeacefulLoader';
import StepByStepLoader from './src/components/StepByStepLoader';
import LocationVarietyDebug from './src/components/LocationVarietyDebug';
import { SettingsScreen } from './src/components/SettingsScreen';
import BlobBackground from './src/components/BlobBackground';
import { getTodaysSuggestion, getNewSuggestion } from './src/services/suggestionService';
import { notificationService } from './src/services/notificationService';
import { STORAGE_KEYS } from './src/constants/storage';
import DESIGN_SYSTEM, { COLORS, ROUNDED_DESIGN } from './src/constants/designSystem';
import { EnhancedSuggestion, LoadingStage, ScreenType } from './src/types';

export default function App(): JSX.Element {
  const [suggestion, setSuggestion] = useState<EnhancedSuggestion | null>(null);
  const [previousSuggestion, setPreviousSuggestion] = useState<EnhancedSuggestion | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [skipLoading, setSkipLoading] = useState<boolean>(false);
  const [loadingStage, setLoadingStage] = useState<LoadingStage>(null);
  const [currentScreen, setCurrentScreen] = useState<ScreenType>('home');

  useEffect(() => {
    initializeApp();
  }, []);

  const initializeApp = async (): Promise<void> => {
    await loadTodaysSuggestion();
    // Initialize notifications if they're enabled
    const notificationsEnabled = await AsyncStorage.getItem(STORAGE_KEYS.NOTIFICATIONS_ENABLED);
    if (notificationsEnabled === 'true') {
      await notificationService.scheduleAllNotifications();
    }
  };

  const loadTodaysSuggestion = async (): Promise<void> => {
    try {
      const todaysSuggestion = await getTodaysSuggestion();
      setSuggestion(todaysSuggestion);
    } catch (error) {
      console.error('Error loading suggestion:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSkip = async (): Promise<void> => {
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

  const openSettings = (): void => {
    setCurrentScreen('settings');
  };

  const closeSettings = (): void => {
    setCurrentScreen('home');
  };

  if (currentScreen === 'settings') {
    return <SettingsScreen onBack={closeSettings} />;
  }

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor={DESIGN_SYSTEM.colors.background.primary} />
      <BlobBackground />
      <ScrollView contentContainerStyle={styles.scrollContent}>
        <MindfulContainer fadeIn slideIn delay={0}>
          <View style={styles.header}>
            <Text style={styles.greeting}>keep track of{"\n"}your wellness{"\n"}with ease</Text>
            <TouchableOpacity style={styles.settingsButton} onPress={openSettings}>
              <Ionicons name="settings-outline" size={20} color={DESIGN_SYSTEM.colors.interactiveText} />
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
    backgroundColor: DESIGN_SYSTEM.colors.background.primary,
  },
  scrollContent: {
    paddingHorizontal: DESIGN_SYSTEM.spacing.xl,
    paddingBottom: DESIGN_SYSTEM.spacing.hero,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginTop: DESIGN_SYSTEM.spacing.hero,
    marginBottom: DESIGN_SYSTEM.spacing.hero,
    paddingHorizontal: DESIGN_SYSTEM.spacing.md,
  },
  greeting: {
    fontSize: DESIGN_SYSTEM.typography.fontSize.display,
    fontWeight: DESIGN_SYSTEM.typography.fontWeight.heavy,
    color: DESIGN_SYSTEM.colors.text.primary,
    letterSpacing: DESIGN_SYSTEM.typography.letterSpacing.tight,
    lineHeight: DESIGN_SYSTEM.typography.fontSize.display * DESIGN_SYSTEM.typography.lineHeight.tight,
    flex: 1,
    textAlign: 'left',
  },
  settingsButton: {
    width: 44,
    height: 44,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: DESIGN_SYSTEM.borderRadius.lg,
    backgroundColor: DESIGN_SYSTEM.colors.interactive,
    ...DESIGN_SYSTEM.shadows.card,
  },
  suggestionSection: {
    marginBottom: DESIGN_SYSTEM.spacing.hero,
  },
  sectionTitle: {
    fontSize: DESIGN_SYSTEM.typography.fontSize.heading,
    fontWeight: DESIGN_SYSTEM.typography.fontWeight.bold,
    color: DESIGN_SYSTEM.colors.text.primary,
    marginBottom: DESIGN_SYSTEM.spacing.lg,
    letterSpacing: DESIGN_SYSTEM.typography.letterSpacing.tight,
    lineHeight: DESIGN_SYSTEM.typography.fontSize.heading * DESIGN_SYSTEM.typography.lineHeight.tight,
  },
  spotsSubtitle: {
    fontSize: DESIGN_SYSTEM.typography.fontSize.subtitle,
    color: DESIGN_SYSTEM.colors.text.secondary,
    marginBottom: DESIGN_SYSTEM.spacing.xl,
    fontWeight: DESIGN_SYSTEM.typography.fontWeight.medium,
    lineHeight: DESIGN_SYSTEM.typography.fontSize.subtitle * DESIGN_SYSTEM.typography.lineHeight.relaxed,
  },
  spotCard: {
    marginBottom: DESIGN_SYSTEM.spacing.md,
  },
});