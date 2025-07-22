import React, { useState, useEffect } from 'react';
import { View, Text, SafeAreaView, ScrollView, TouchableOpacity, StyleSheet } from 'react-native';
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

export const HomeScreen = ({ navigation }) => {
  const [suggestion, setSuggestion] = useState(null);
  const [locationSuggestion, setLocationSuggestion] = useState(null);
  const [loading, setLoading] = useState(true);
  const [loadingLocation, setLoadingLocation] = useState(false);

  useEffect(() => {
    loadTodaysSuggestion();
    loadLocationSuggestion();
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

  const loadLocationSuggestion = async () => {
    try {
      setLoadingLocation(true);
      const locSuggestion = await getLocationBasedSuggestion();
      setLocationSuggestion(locSuggestion);
    } catch (error) {
      console.error('Error loading location suggestion:', error);
    } finally {
      setLoadingLocation(false);
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
        <MindfulContainer fadeIn slideIn delay={0}>
          <View style={styles.header}>
            <Text style={styles.greeting}>Today's me time</Text>
            <TouchableOpacity onPress={() => navigation.navigate('Settings')}>
              <Ionicons name="settings-outline" size={24} color={colors.text} />
            </TouchableOpacity>
          </View>
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

        {suggestion?.locationSuggestion && (
          <MindfulContainer fadeIn slideIn delay={400} contemplativeEntry>
            <View style={styles.locationSection}>
              <Text style={styles.sectionTitle}>🌍 Nearby Interesting Spot</Text>
              <LocationSuggestionCard 
                suggestion={suggestion}
                style={styles.locationCard}
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
                  variant="floating"
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
});