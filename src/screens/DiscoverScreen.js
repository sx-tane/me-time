import React, { useState, useEffect } from 'react';
import { View, Text, SafeAreaView, ScrollView, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import * as Location from 'expo-location';
import { PlaceCard } from '../components/PlaceCard';
import { GentleButton } from '../components/GentleButton';
import { peacefulSpots } from '../constants/suggestions';
import colors from '../constants/colors';

export const DiscoverScreen = () => {
  const [locationPermission, setLocationPermission] = useState(false);

  useEffect(() => {
    checkLocationPermission();
  }, []);

  const checkLocationPermission = async () => {
    const { status } = await Location.requestForegroundPermissionsAsync();
    setLocationPermission(status === 'granted');
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollContent}>
        <Text style={styles.screenTitle}>Peaceful spots nearby</Text>
        <Text style={styles.subtitle}>
          Take your time getting there. Or don't go at all.
        </Text>
        
        {peacefulSpots.map((spot) => (
          <PlaceCard key={spot.id} place={spot} />
        ))}
        
        {!locationPermission && (
          <View style={styles.permissionCard}>
            <Ionicons name="location-outline" size={24} color={colors.lightText} />
            <Text style={styles.permissionText}>
              Location helps find spots near you, but it's totally optional
            </Text>
            <GentleButton
              title="Enable location"
              onPress={checkLocationPermission}
              variant="secondary"
              style={{ marginTop: 10 }}
            />
          </View>
        )}
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
  screenTitle: {
    fontSize: 28,
    fontWeight: '700',
    color: colors.text,
    marginBottom: 10,
    marginTop: 20,
  },
  subtitle: {
    fontSize: 16,
    color: colors.lightText,
    marginBottom: 30,
  },
  permissionCard: {
    backgroundColor: '#F5F5F5',
    borderRadius: 15,
    padding: 20,
    marginTop: 20,
    alignItems: 'center',
  },
  permissionText: {
    fontSize: 14,
    color: colors.lightText,
    textAlign: 'center',
    marginTop: 10,
  },
});