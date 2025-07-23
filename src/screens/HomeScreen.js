import React, { useState, useEffect, useCallback } from 'react';
import { View, Text, SafeAreaView, ScrollView, TouchableOpacity, StyleSheet, Alert } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { SuggestionCard } from '../components/SuggestionCard';
import LocationSuggestionCard from '../components/LocationSuggestionCard';
import MindfulContainer from '../components/MindfulContainer';
import PeacefulLoader from '../components/PeacefulLoader';
import ChillButton from '../components/ChillButton';
import { getTodaysSuggestion, getNewSuggestion, getLocationBasedSuggestion } from '../services/suggestionService';
import { STORAGE_KEYS } from '../constants/storage';
import colors from '../constants/colors';
import { clearAllCache } from '../utils/clearAllCache';

export const HomeScreen = ({ navigation }) => {
  const [suggestion, setSuggestion] = useState(null);
  const [locationSuggestion, setLocationSuggestion] = useState(null);
  const [additionalSuggestions, setAdditionalSuggestions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [loadingLocation, setLoadingLocation] = useState(false);
  const [loadingAdditional, setLoadingAdditional] = useState(false);
  const [skipLoading, setSkipLoading] = useState(false);
  const [enrichingLocation, setEnrichingLocation] = useState(false);

  useEffect(() => {
    loadTodaysSuggestion();
    loadLocationSuggestion();
    loadAdditionalSuggestions();
  }, []);

  const loadTodaysSuggestion = async () => {
    try {
      const todaysSuggestion = await getTodaysSuggestion();
      console.log('🏠 HomeScreen: Loaded suggestion with location?', !!todaysSuggestion?.locationSuggestion);
      if (todaysSuggestion?.locationSuggestion) {
        console.log('📍 Location data:', {
          place: todaysSuggestion.locationSuggestion.place?.name,
          distance: todaysSuggestion.locationSuggestion.distance,
          hasCoordinates: !!todaysSuggestion.locationSuggestion.place?.location
        });
      }
      setSuggestion(todaysSuggestion);
      
      // If suggestion doesn't have location, try to enrich it with loading feedback
      if (!todaysSuggestion?.locationSuggestion && todaysSuggestion?.id !== 'error_fallback') {
        setEnrichingLocation(true);
        setTimeout(async () => {
          try {
            console.log('🔄 Checking for location enrichment...');
            const enrichedSuggestion = await getTodaysSuggestion();
            if (enrichedSuggestion?.locationSuggestion) {
              console.log('✅ Location enrichment successful, updating UI');
              setSuggestion(enrichedSuggestion);
            }
          } catch (err) {
            console.log('⚠️ Location enrichment check failed:', err.message);
          } finally {
            setEnrichingLocation(false);
          }
        }, 2000); // Give location service time to enrich
      }
    } catch (error) {
      console.error('Error loading suggestion:', error);
      // Set a simple fallback suggestion
      setSuggestion({
        id: 'error_fallback',
        text: 'Take a moment to breathe',
        type: 'mindful',
        icon: 'heart-outline',
        description: 'Sometimes the best me-time is simply being present',
        timeEstimate: '1-3 min',
        source: 'fallback'
      });
    } finally {
      setLoading(false);
    }
  };

  const loadLocationSuggestion = useCallback(async () => {
    try {
      setLoadingLocation(true);
      const locSuggestion = await getLocationBasedSuggestion();
      console.log('🏠 HomeScreen: Loaded separate location suggestion?', !!locSuggestion);
      setLocationSuggestion(locSuggestion);
    } catch (error) {
      console.error('Error loading location suggestion:', error);
      // Location suggestions are optional, so we just log the error
    } finally {
      setLoadingLocation(false);
    }
  }, []);

  const loadAdditionalSuggestions = useCallback(async () => {
    try {
      setLoadingAdditional(true);
      
      // Generate 2-3 different suggestions to show variety
      const additionalTasks = [];
      for (let i = 0; i < 3; i++) {
        try {
          const newSuggestion = await getNewSuggestion();
          if (newSuggestion && !additionalTasks.find(s => s.text === newSuggestion.text)) {
            additionalTasks.push(newSuggestion);
          }
          // Small delay between requests
          await new Promise(resolve => setTimeout(resolve, 200));
        } catch (error) {
          console.log('Error generating additional suggestion:', i, error.message);
        }
      }
      
      console.log('🎯 HomeScreen: Loaded additional suggestions:', additionalTasks.length);
      setAdditionalSuggestions(additionalTasks);
    } catch (error) {
      console.error('Error loading additional suggestions:', error);
    } finally {
      setLoadingAdditional(false);
    }
  }, []);

  const handleSkip = useCallback(async () => {
    try {
      setSkipLoading(true);
      setLoading(true);
      // Clear AI task cache to get fresh suggestions
      await clearAllCache();
      const newSuggestion = await getNewSuggestion(suggestion);
      setSuggestion(newSuggestion);
      await AsyncStorage.setItem(STORAGE_KEYS.CURRENT_SUGGESTION, JSON.stringify(newSuggestion));
      // Also reload location suggestion if main suggestion doesn't have location
      if (!newSuggestion?.locationSuggestion) {
        loadLocationSuggestion();
      }
      // Reload additional suggestions for variety
      loadAdditionalSuggestions();
    } catch (error) {
      console.error('Error getting new suggestion:', error);
      Alert.alert('Unable to get new suggestion', 'Please try again in a moment.');
    } finally {
      setLoading(false);
      setSkipLoading(false);
    }
  }, [suggestion, loadLocationSuggestion, loadAdditionalSuggestions]);

  const handleClearCache = async () => {
    Alert.alert(
      'Clear Cache',
      'This will clear all cached data and refresh suggestions. Continue?',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Clear',
          onPress: async () => {
            try {
              await clearAllCache();
              // Reload everything
              setLoading(true);
              setSuggestion(null); // Clear current suggestion to force refresh
              setLocationSuggestion(null); // Clear location suggestion
              setAdditionalSuggestions([]); // Clear additional suggestions
              setEnrichingLocation(false); // Clear enriching state
              await loadTodaysSuggestion();
              await loadLocationSuggestion();
              await loadAdditionalSuggestions();
              Alert.alert('Success', 'Cache cleared successfully!');
            } catch (error) {
              console.error('Error clearing cache:', error);
              Alert.alert('Error', 'Failed to clear cache. Please try again.');
            }
          }
        }
      ]
    );
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollContent}>
        <MindfulContainer fadeIn slideIn delay={0}>
          <View style={styles.header}>
            <Text style={styles.greeting}>Today's me time</Text>
            <View style={styles.headerButtons}>
              <TouchableOpacity onPress={handleClearCache} style={styles.headerButton}>
                <Ionicons name="refresh-outline" size={24} color={colors.text} />
              </TouchableOpacity>
              <TouchableOpacity onPress={() => navigation.navigate('Settings')} style={styles.headerButton}>
                <Ionicons name="settings-outline" size={24} color={colors.text} />
              </TouchableOpacity>
            </View>
          </View>
        </MindfulContainer>
        
        <MindfulContainer fadeIn slideIn delay={200} style={styles.suggestionSection}>
          {loading ? (
            <PeacefulLoader 
              message={
                skipLoading 
                  ? "Finding a new gentle moment for you..." 
                  : enrichingLocation 
                    ? "Creating your personalized suggestion..."
                    : "Finding something gentle for you..."
              } 
              variant="breathing"
            />
          ) : (
            <SuggestionCard suggestion={suggestion} onSkip={handleSkip} skipLoading={skipLoading} />
          )}
        </MindfulContainer>

        {!loading && suggestion?.locationSuggestion && (
          <MindfulContainer fadeIn slideIn delay={400} contemplativeEntry>
            <View style={styles.locationSection}>
              <Text style={styles.sectionTitle}>🌍 Nearby Peaceful Spot</Text>
              <LocationSuggestionCard 
                suggestion={suggestion}
                style={styles.locationCard}
              />
            </View>
          </MindfulContainer>
        )}

        {!loading && enrichingLocation && !suggestion?.locationSuggestion && (
          <MindfulContainer fadeIn slideIn delay={400} contemplativeEntry>
            <View style={styles.locationSection}>
              <Text style={styles.sectionTitle}>🗺️ Finding Peaceful Spots</Text>
              <PeacefulLoader 
                message="Discovering nearby places for your moment..." 
                variant="ripple"
              />
            </View>
          </MindfulContainer>
        )}

        {!loading && locationSuggestion && !suggestion?.locationSuggestion && (
          <MindfulContainer fadeIn slideIn delay={600} contemplativeEntry>
            <View style={styles.locationSection}>
              <Text style={styles.sectionTitle}>🗺️ Explore Nearby</Text>
              {loadingLocation ? (
                <PeacefulLoader 
                  message="Discovering peaceful spots nearby..." 
                  variant="ripple"
                />
              ) : (
                <LocationSuggestionCard 
                  suggestion={locationSuggestion}
                  style={styles.locationCard}
                />
              )}
            </View>
          </MindfulContainer>
        )}

        {loadingLocation && !locationSuggestion && !suggestion?.locationSuggestion && (
          <MindfulContainer fadeIn slideIn delay={600} contemplativeEntry>
            <View style={styles.locationSection}>
              <Text style={styles.sectionTitle}>🌟 Finding Nearby Inspiration</Text>
              <PeacefulLoader 
                message="Scanning for gentle places nearby..." 
                variant="pulse"
              />
            </View>
          </MindfulContainer>
        )}

        {!loading && additionalSuggestions.length > 0 && (
          <MindfulContainer fadeIn slideIn delay={700} contemplativeEntry>
            <View style={styles.additionalSection}>
              <Text style={styles.sectionTitle}>✨ Other Ideas for You</Text>
              <View style={styles.additionalSuggestions}>
                {additionalSuggestions.slice(0, 3).map((addSuggestion, index) => (
                  <TouchableOpacity 
                    key={addSuggestion.id} 
                    style={styles.miniSuggestionCard}
                    onPress={() => {
                      setSuggestion(addSuggestion);
                      AsyncStorage.setItem(STORAGE_KEYS.CURRENT_SUGGESTION, JSON.stringify(addSuggestion));
                    }}
                  >
                    <View style={styles.miniSuggestionContent}>
                      <Ionicons 
                        name={addSuggestion.icon || 'heart-outline'} 
                        size={20} 
                        color={colors.primary} 
                        style={styles.miniSuggestionIcon}
                      />
                      <Text style={styles.miniSuggestionText} numberOfLines={2}>
                        {addSuggestion.text}
                      </Text>
                      <Text style={styles.miniSuggestionTime}>
                        {addSuggestion.timeEstimate}
                      </Text>
                    </View>
                  </TouchableOpacity>
                ))}
              </View>
            </View>
          </MindfulContainer>
        )}

        {loadingAdditional && additionalSuggestions.length === 0 && (
          <MindfulContainer fadeIn slideIn delay={700} contemplativeEntry>
            <View style={styles.locationSection}>
              <Text style={styles.sectionTitle}>💫 Creating More Ideas</Text>
              <PeacefulLoader 
                message="Generating personalized suggestions..." 
                variant="breathing"
              />
            </View>
          </MindfulContainer>
        )}
        
        <MindfulContainer fadeIn delay={800} style={styles.discoverSection}>
          <ChillButton 
            title="Discover peaceful spots nearby"
            variant="secondary"
            size="large"
            onPress={() => navigation.navigate('Discover')}
            style={styles.discoverButton}
            breathe={true}
            contemplativePress={true}
          >
            <View style={styles.discoverButtonContent}>
              <Ionicons name="compass-outline" size={24} color={colors.primary} />
              <Text style={styles.discoverButtonText}>Discover peaceful spots nearby</Text>
            </View>
          </ChillButton>
        </MindfulContainer>
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
    paddingHorizontal: 24,
    paddingBottom: 60,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 24,
    marginBottom: 32,
  },
  greeting: {
    fontSize: 28,
    fontWeight: '700',
    color: colors.text,
    letterSpacing: -0.5,
  },
  headerButtons: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  headerButton: {
    marginLeft: 16,
    padding: 4,
  },
  suggestionSection: {
    marginBottom: 20,
  },
  discoverSection: {
    marginTop: 32,
  },
  discoverButton: {
    marginTop: 8,
  },
  discoverButtonContent: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  discoverButtonText: {
    marginLeft: 12,
    fontSize: 16,
    color: colors.primary,
    fontWeight: '500',
  },
  locationSection: {
    marginTop: 24,
    marginBottom: 16,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: '600',
    color: colors.text,
    marginBottom: 18,
    letterSpacing: -0.3,
  },
  locationCard: {
    marginBottom: 0,
  },
  additionalSection: {
    marginTop: 24,
    marginBottom: 16,
  },
  additionalSuggestions: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    gap: 12,
  },
  miniSuggestionCard: {
    backgroundColor: colors.surface,
    borderRadius: 16,
    padding: 16,
    width: '31%', // 3 cards per row with gaps
    minHeight: 100,
    borderWidth: 1,
    borderColor: colors.surface,
    shadowColor: colors.primary,
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 2,
  },
  miniSuggestionContent: {
    alignItems: 'center',
    justifyContent: 'space-between',
    height: '100%',
  },
  miniSuggestionIcon: {
    marginBottom: 8,
  },
  miniSuggestionText: {
    fontSize: 12,
    fontWeight: '600',
    color: colors.text,
    textAlign: 'center',
    lineHeight: 16,
    flex: 1,
  },
  miniSuggestionTime: {
    fontSize: 10,
    color: colors.textSecondary,
    marginTop: 4,
    textAlign: 'center',
  },
});