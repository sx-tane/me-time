import React from 'react';
import { TouchableOpacity, View, Text, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import colors from '../constants/colors';
import { getShadowStyles } from '../utils/platformDetection';

export const PlaceCard = ({ place }) => (
  <TouchableOpacity style={styles.placeCard} activeOpacity={0.8}>
    <View style={styles.placeCardContent}>
      <Ionicons name={place.icon} size={24} color={colors.secondary} />
      <View style={styles.placeInfo}>
        <Text style={styles.placeName}>{place.name}</Text>
        <Text style={styles.placeDistance}>{place.distance}</Text>
      </View>
    </View>
  </TouchableOpacity>
);

const styles = StyleSheet.create({
  placeCard: {
    backgroundColor: colors.card,
    borderRadius: 15,
    padding: 20,
    marginBottom: 15,
    ...getShadowStyles({
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 1 },
      shadowOpacity: 0.05,
      shadowRadius: 5,
      elevation: 2,
    }),
  },
  placeCardContent: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  placeInfo: {
    marginLeft: 15,
    flex: 1,
  },
  placeName: {
    fontSize: 18,
    fontWeight: '600',
    color: colors.text,
  },
  placeDistance: {
    fontSize: 14,
    color: colors.lightText,
    marginTop: 2,
  },
});