import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Linking, Image } from 'react-native';
import { COLORS } from '../constants/colors';

const LocationSuggestionCard = ({ suggestion, onPress, style }) => {
  const { locationSuggestion } = suggestion;
  
  if (!locationSuggestion?.place) {
    return null;
  }

  const { place, distance } = locationSuggestion;

  const handleOpenMaps = () => {
    if (place.googleMapsUrl) {
      Linking.openURL(place.googleMapsUrl);
    } else if (place.location) {
      const url = `https://www.google.com/maps/search/?api=1&query=${place.location.lat},${place.location.lng}`;
      Linking.openURL(url);
    }
  };

  const handleCall = () => {
    if (place.phone) {
      Linking.openURL(`tel:${place.phone}`);
    }
  };

  const handleWebsite = () => {
    if (place.website) {
      Linking.openURL(place.website);
    }
  };

  const formatDistance = (dist) => {
    if (dist < 1) {
      return `${Math.round(dist * 1000)}m away`;
    }
    return `${dist.toFixed(1)}km away`;
  };

  const formatRating = (rating) => {
    if (!rating) return '';
    return `⭐ ${rating.toFixed(1)}`;
  };

  return (
    <TouchableOpacity style={[styles.container, style]} onPress={onPress}>
      <View style={styles.header}>
        <Text style={styles.title}>{suggestion.title}</Text>
        <Text style={styles.distance}>{formatDistance(distance)}</Text>
      </View>
      
      <View style={styles.placeInfo}>
        <Text style={styles.placeName}>{place.name}</Text>
        <Text style={styles.address}>{place.address}</Text>
        
        <View style={styles.details}>
          {place.rating && (
            <Text style={styles.rating}>{formatRating(place.rating)}</Text>
          )}
          {place.types && place.types.length > 0 && (
            <Text style={styles.type}>
              {place.types[0].replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase())}
            </Text>
          )}
        </View>
      </View>

      {place.photos && place.photos.length > 0 && (
        <Image 
          source={{ uri: place.photos[0].url }} 
          style={styles.placeImage}
          resizeMode="cover"
        />
      )}

      <View style={styles.actions}>
        <TouchableOpacity style={styles.actionButton} onPress={handleOpenMaps}>
          <Text style={styles.actionText}>directions</Text>
        </TouchableOpacity>
        
        {place.phone && (
          <TouchableOpacity style={styles.actionButton} onPress={handleCall}>
            <Text style={styles.actionText}>call</Text>
          </TouchableOpacity>
        )}
        
        {place.website && (
          <TouchableOpacity style={styles.actionButton} onPress={handleWebsite}>
            <Text style={styles.actionText}>website</Text>
          </TouchableOpacity>
        )}
      </View>

      {place.openingHours && place.openingHours.length > 0 && (
        <View style={styles.hours}>
          <Text style={styles.hoursTitle}>hours</Text>
          <Text style={styles.hoursText} numberOfLines={2}>
            {place.openingHours.slice(0, 2).join(', ')}
          </Text>
        </View>
      )}
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: COLORS.card,
    borderRadius: 2,
    padding: 24,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: COLORS.divider,
    elevation: 0,
  },
  header: {
    flexDirection: 'column',
    marginBottom: 20,
  },
  title: {
    fontSize: 18,
    fontWeight: '300',
    color: COLORS.text,
    marginBottom: 4,
    letterSpacing: 0.5,
  },
  distance: {
    fontSize: 12,
    color: COLORS.lightText,
    fontWeight: '300',
    textTransform: 'lowercase',
  },
  placeInfo: {
    marginBottom: 20,
  },
  placeName: {
    fontSize: 16,
    fontWeight: '400',
    color: COLORS.text,
    marginBottom: 6,
    letterSpacing: 0.3,
  },
  address: {
    fontSize: 13,
    color: COLORS.lightText,
    marginBottom: 12,
    fontWeight: '300',
  },
  details: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 16,
  },
  rating: {
    fontSize: 12,
    color: COLORS.secondary,
    fontWeight: '300',
  },
  type: {
    fontSize: 11,
    color: COLORS.lightText,
    backgroundColor: 'transparent',
    paddingHorizontal: 0,
    paddingVertical: 0,
    borderRadius: 0,
    fontWeight: '300',
    textTransform: 'lowercase',
  },
  placeImage: {
    width: '100%',
    height: 100,
    borderRadius: 0,
    marginBottom: 16,
    opacity: 0.8,
  },
  actions: {
    flexDirection: 'row',
    gap: 12,
    marginBottom: 12,
    marginTop: 8,
  },
  actionButton: {
    backgroundColor: 'transparent',
    paddingHorizontal: 0,
    paddingVertical: 4,
    borderRadius: 0,
    borderWidth: 0,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.divider,
  },
  actionText: {
    fontSize: 11,
    color: COLORS.text,
    fontWeight: '300',
    textTransform: 'lowercase',
  },
  hours: {
    marginTop: 16,
    paddingTop: 12,
    borderTopWidth: 1,
    borderTopColor: COLORS.divider,
  },
  hoursTitle: {
    fontSize: 11,
    color: COLORS.text,
    fontWeight: '300',
    marginBottom: 4,
    textTransform: 'lowercase',
  },
  hoursText: {
    fontSize: 11,
    color: COLORS.lightText,
    lineHeight: 16,
    fontWeight: '300',
  },
});

export default LocationSuggestionCard;