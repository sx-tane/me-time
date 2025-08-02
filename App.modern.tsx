import React, { useState, useEffect } from 'react';
import type { JSX } from 'react';
import { 
  View, 
  Text, 
  StatusBar, 
  SafeAreaView, 
  ScrollView, 
  StyleSheet, 
  TouchableOpacity,
  Animated,
  Dimensions
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';

import { DESIGN_SYSTEM, GRADIENTS } from './src/constants/designSystem';
import { 
  ModernCard, 
  ModernButton, 
  SectionHeader,
  ProgressBar,
  FAB 
} from './src/components/ModernComponents';
import { getTodaysSuggestion, getNewSuggestion } from './src/services/suggestionService';
import { notificationService } from './src/services/notificationService';
import { STORAGE_KEYS } from './src/constants/storage';
import { EnhancedSuggestion, LoadingStage, ScreenType, LocationSuggestion } from './src/types';

const { width: SCREEN_WIDTH } = Dimensions.get('window');

export default function App(): JSX.Element {
  const [suggestion, setSuggestion] = useState<EnhancedSuggestion | null>(null);
  const [previousSuggestion, setPreviousSuggestion] = useState<EnhancedSuggestion | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [skipLoading, setSkipLoading] = useState<boolean>(false);
  const [loadingStage, setLoadingStage] = useState<LoadingStage>(null);
  const [currentScreen, setCurrentScreen] = useState<ScreenType>('home');
  
  // Animation values
  const fadeAnim = new Animated.Value(0);
  const slideAnim = new Animated.Value(30);
  const scaleAnim = new Animated.Value(0.9);

  useEffect(() => {
    initializeApp();
    
    // Entrance animations
    Animated.parallel([
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 600,
        useNativeDriver: true,
      }),
      Animated.timing(slideAnim, {
        toValue: 0,
        duration: 500,
        useNativeDriver: true,
      }),
      Animated.spring(scaleAnim, {
        toValue: 1,
        friction: 8,
        tension: 40,
        useNativeDriver: true,
      }),
    ]).start();
  }, []);

  const initializeApp = async (): Promise<void> => {
    await loadTodaysSuggestion();
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
      setLoadingStage('generating');
      
      await new Promise(resolve => setTimeout(resolve, 1200));
      setLoadingStage('locations');
      await new Promise(resolve => setTimeout(resolve, 800));
      
      const newSuggestion = await getNewSuggestion(suggestion);
      
      setLoadingStage('finalizing');
      await new Promise(resolve => setTimeout(resolve, 600));
      
      setPreviousSuggestion(suggestion);
      setSuggestion(newSuggestion);
      await AsyncStorage.setItem(STORAGE_KEYS.CURRENT_SUGGESTION, JSON.stringify(newSuggestion));
    } catch (error) {
      console.error('Error in handleSkip:', error);
    } finally {
      setSkipLoading(false);
      setLoadingStage(null);
    }
  };

  const renderHeader = (): JSX.Element => (
    <Animated.View 
      style={[
        styles.header,
        {
          opacity: fadeAnim,
          transform: [{ translateY: slideAnim }],
        },
      ]}
    >
      <View style={styles.headerContent}>
        <View>
          <Text style={styles.greeting}>Good morning</Text>
          <Text style={styles.headerTitle}>Your me-time awaits</Text>
        </View>
        <TouchableOpacity 
          style={styles.settingsButton} 
          onPress={() => setCurrentScreen('settings')}
          activeOpacity={0.7}
        >
          <View style={styles.settingsButtonInner}>
            <Ionicons name="settings-outline" size={20} color={DESIGN_SYSTEM.colors.text.primary} />
          </View>
        </TouchableOpacity>
      </View>
    </Animated.View>
  );

  const renderSuggestionCard = (): JSX.Element => (
    <Animated.View
      style={[
        styles.suggestionSection,
        {
          opacity: fadeAnim,
          transform: [
            { translateY: slideAnim },
            { scale: scaleAnim },
          ],
        },
      ]}
    >
      <ModernCard gradient style={styles.mainCard}>
        {/* Decorative gradient */}
        <LinearGradient
          colors={GRADIENTS.primary}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
          style={styles.cardGradient}
        />
        
        {/* Category badge */}
        <View style={styles.categoryBadge}>
          <Ionicons 
            name={(suggestion?.icon as any) || 'leaf-outline'} 
            size={16} 
            color={DESIGN_SYSTEM.colors.primary} 
          />
          <Text style={styles.categoryText}>{suggestion?.category || 'Wellness'}</Text>
        </View>
        
        {/* Main content */}
        <Text style={styles.suggestionTitle}>{suggestion?.title}</Text>
        <Text style={styles.suggestionDescription}>{suggestion?.description}</Text>
        
        {/* Duration and difficulty */}
        <View style={styles.metaRow}>
          <View style={styles.metaItem}>
            <Ionicons name="time-outline" size={16} color={DESIGN_SYSTEM.colors.text.tertiary} />
            <Text style={styles.metaText}>{suggestion?.duration || '15 min'}</Text>
          </View>
          <View style={styles.metaItem}>
            <Ionicons name="fitness-outline" size={16} color={DESIGN_SYSTEM.colors.text.tertiary} />
            <Text style={styles.metaText}>{suggestion?.difficulty || 'Easy'}</Text>
          </View>
        </View>
        
        {/* Progress indicator */}
        {skipLoading && (
          <View style={styles.progressSection}>
            <Text style={styles.progressText}>
              {loadingStage === 'generating' && 'Creating your perfect activity...'}
              {loadingStage === 'locations' && 'Finding nearby spots...'}
              {loadingStage === 'finalizing' && 'Almost ready...'}
            </Text>
            <ProgressBar progress={
              loadingStage === 'generating' ? 0.33 :
              loadingStage === 'locations' ? 0.66 :
              loadingStage === 'finalizing' ? 0.9 : 0
            } />
          </View>
        )}
        
        {/* Action buttons */}
        <View style={styles.cardActions}>
          <ModernButton
            title="Skip"
            variant="secondary"
            onPress={handleSkip}
            loading={skipLoading}
            disabled={skipLoading}
            style={{ flex: 1, marginRight: DESIGN_SYSTEM.spacing[3] }}
          />
          <ModernButton
            title="Let's go"
            variant="primary"
            icon="arrow-forward"
            style={{ flex: 1 }}
          />
        </View>
      </ModernCard>
    </Animated.View>
  );

  const renderLocationSection = (): JSX.Element => (
    <Animated.View
      style={[
        styles.locationSection,
        {
          opacity: fadeAnim,
          transform: [{ translateY: Animated.multiply(slideAnim, 1.5) }],
        },
      ]}
    >
      <SectionHeader 
        title="Nearby spots" 
        subtitle="Perfect places for your activity"
        action="View all"
        onActionPress={() => {}}
      />
      
      <ScrollView 
        horizontal 
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.locationScroll}
      >
        {suggestion?.locationSuggestions?.map((location: LocationSuggestion, index: number) => (
          <TouchableOpacity 
            key={index} 
            style={styles.locationCard}
            activeOpacity={0.9}
          >
            <LinearGradient
              colors={GRADIENTS.subtle}
              start={{ x: 0, y: 0 }}
              end={{ x: 0, y: 1 }}
              style={styles.locationCardBg}
            >
              <Ionicons 
                name={(location.icon as any) || 'location-outline'} 
                size={32} 
                color={DESIGN_SYSTEM.colors.primary}
                style={styles.locationIcon}
              />
              <Text style={styles.locationName}>{location.name}</Text>
              <Text style={styles.locationDistance}>{location.distance} away</Text>
              <View style={styles.locationRating}>
                <Ionicons name="star" size={12} color="#FFD700" />
                <Text style={styles.locationRatingText}>{location.rating || '4.5'}</Text>
              </View>
            </LinearGradient>
          </TouchableOpacity>
        ))}
      </ScrollView>
    </Animated.View>
  );

  if (loading) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.loadingContainer}>
          <Animated.View
            style={{
              transform: [{
                rotate: fadeAnim.interpolate({
                  inputRange: [0, 1],
                  outputRange: ['0deg', '360deg'],
                }),
              }],
            }}
          >
            <Ionicons 
              name="flower-outline" 
              size={48} 
              color={DESIGN_SYSTEM.colors.primary[500]} 
            />
          </Animated.View>
          <Text style={styles.loadingText}>Preparing your wellness journey...</Text>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor={DESIGN_SYSTEM.colors.background.secondary} />
      
      <ScrollView 
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {renderHeader()}
        {renderSuggestionCard()}
        {suggestion?.locationSuggestions && renderLocationSection()}
      </ScrollView>
      
      {/* Floating Action Button */}
      <FAB icon="add" onPress={() => {}} />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: DESIGN_SYSTEM.colors.background.secondary,
  },
  scrollContent: {
    paddingBottom: DESIGN_SYSTEM.spacing[20],
  },
  loadingContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  loadingText: {
    marginTop: DESIGN_SYSTEM.spacing[6],
    fontSize: DESIGN_SYSTEM.typography.fontSize.base,
    color: DESIGN_SYSTEM.colors.text.secondary,
  },
  
  // Header styles
  header: {
    paddingHorizontal: DESIGN_SYSTEM.spacing[6],
    paddingTop: DESIGN_SYSTEM.spacing[8],
    paddingBottom: DESIGN_SYSTEM.spacing[6],
  },
  headerContent: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  greeting: {
    fontSize: DESIGN_SYSTEM.typography.fontSize.sm,
    color: DESIGN_SYSTEM.colors.text.tertiary,
    marginBottom: DESIGN_SYSTEM.spacing[1],
  },
  headerTitle: {
    fontSize: DESIGN_SYSTEM.typography.fontSize['2xl'],
    fontWeight: DESIGN_SYSTEM.typography.fontWeight.semiBold,
    color: DESIGN_SYSTEM.colors.text.primary,
    letterSpacing: DESIGN_SYSTEM.typography.letterSpacing.tight,
  },
  settingsButton: {
    width: 44,
    height: 44,
    borderRadius: DESIGN_SYSTEM.borderRadius.full,
    backgroundColor: DESIGN_SYSTEM.colors.background.primary,
    alignItems: 'center',
    justifyContent: 'center',
    ...DESIGN_SYSTEM.shadows.sm,
  },
  settingsButtonInner: {
    width: '100%',
    height: '100%',
    alignItems: 'center',
    justifyContent: 'center',
  },
  
  // Suggestion card styles
  suggestionSection: {
    paddingHorizontal: DESIGN_SYSTEM.spacing[6],
    marginBottom: DESIGN_SYSTEM.spacing[8],
  },
  mainCard: {
    position: 'relative',
    overflow: 'hidden',
    padding: DESIGN_SYSTEM.spacing[8],
  },
  cardGradient: {
    position: 'absolute',
    top: -50,
    right: -50,
    width: 200,
    height: 200,
    borderRadius: 100,
    opacity: 0.1,
  },
  categoryBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    alignSelf: 'flex-start',
    backgroundColor: DESIGN_SYSTEM.colors.primary[50],
    paddingHorizontal: DESIGN_SYSTEM.spacing[3],
    paddingVertical: DESIGN_SYSTEM.spacing[2],
    borderRadius: DESIGN_SYSTEM.borderRadius.full,
    marginBottom: DESIGN_SYSTEM.spacing[4],
  },
  categoryText: {
    fontSize: DESIGN_SYSTEM.typography.fontSize.xs,
    fontWeight: DESIGN_SYSTEM.typography.fontWeight.medium,
    color: DESIGN_SYSTEM.colors.primary[600],
    marginLeft: DESIGN_SYSTEM.spacing[1],
    textTransform: 'uppercase',
    letterSpacing: DESIGN_SYSTEM.typography.letterSpacing.wide,
  },
  suggestionTitle: {
    fontSize: DESIGN_SYSTEM.typography.fontSize['3xl'],
    fontWeight: DESIGN_SYSTEM.typography.fontWeight.bold,
    color: DESIGN_SYSTEM.colors.text.primary,
    marginBottom: DESIGN_SYSTEM.spacing[3],
    lineHeight: DESIGN_SYSTEM.typography.fontSize['3xl'] * DESIGN_SYSTEM.typography.lineHeight.tight,
  },
  suggestionDescription: {
    fontSize: DESIGN_SYSTEM.typography.fontSize.md,
    color: DESIGN_SYSTEM.colors.text.secondary,
    lineHeight: DESIGN_SYSTEM.typography.fontSize.md * DESIGN_SYSTEM.typography.lineHeight.relaxed,
    marginBottom: DESIGN_SYSTEM.spacing[6],
  },
  metaRow: {
    flexDirection: 'row',
    marginBottom: DESIGN_SYSTEM.spacing[6],
  },
  metaItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginRight: DESIGN_SYSTEM.spacing[6],
  },
  metaText: {
    fontSize: DESIGN_SYSTEM.typography.fontSize.sm,
    color: DESIGN_SYSTEM.colors.text.secondary,
    marginLeft: DESIGN_SYSTEM.spacing[2],
  },
  progressSection: {
    marginBottom: DESIGN_SYSTEM.spacing[6],
  },
  progressText: {
    fontSize: DESIGN_SYSTEM.typography.fontSize.sm,
    color: DESIGN_SYSTEM.colors.text.secondary,
    marginBottom: DESIGN_SYSTEM.spacing[3],
  },
  cardActions: {
    flexDirection: 'row',
  },
  
  // Location section styles
  locationSection: {
    paddingTop: DESIGN_SYSTEM.spacing[4],
  },
  locationScroll: {
    paddingHorizontal: DESIGN_SYSTEM.spacing[6],
  },
  locationCard: {
    width: 140,
    height: 160,
    marginRight: DESIGN_SYSTEM.spacing[4],
    borderRadius: DESIGN_SYSTEM.borderRadius.xl,
    overflow: 'hidden',
    ...DESIGN_SYSTEM.shadows.base,
  },
  locationCardBg: {
    flex: 1,
    padding: DESIGN_SYSTEM.spacing[5],
    alignItems: 'center',
    justifyContent: 'center',
  },
  locationIcon: {
    marginBottom: DESIGN_SYSTEM.spacing[3],
  },
  locationName: {
    fontSize: DESIGN_SYSTEM.typography.fontSize.base,
    fontWeight: DESIGN_SYSTEM.typography.fontWeight.medium,
    color: DESIGN_SYSTEM.colors.text.primary,
    textAlign: 'center',
    marginBottom: DESIGN_SYSTEM.spacing[1],
  },
  locationDistance: {
    fontSize: DESIGN_SYSTEM.typography.fontSize.xs,
    color: DESIGN_SYSTEM.colors.text.tertiary,
    marginBottom: DESIGN_SYSTEM.spacing[2],
  },
  locationRating: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  locationRatingText: {
    fontSize: DESIGN_SYSTEM.typography.fontSize.xs,
    color: DESIGN_SYSTEM.colors.text.secondary,
    marginLeft: DESIGN_SYSTEM.spacing[1],
  },
});