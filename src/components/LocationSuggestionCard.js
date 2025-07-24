import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Linking, Image } from 'react-native';
import { COLORS, ROUNDED_DESIGN } from '../constants/colors';

const LocationSuggestionCard = ({ suggestion, onPress, style }) => {
  // Handle both formats: old (with locationSuggestion) and new (direct place)
  const locationSuggestion = suggestion.locationSuggestion || suggestion;
  const place = locationSuggestion.place || suggestion.place;
  const distance = locationSuggestion.distance || suggestion.distance;
  
  if (!place) {
    return null;
  }


  const handleOpenMaps = () => {
    if (place.googleMapsUrl) {
      Linking.openURL(place.googleMapsUrl);
    } else if (place.location) {
      // Handle both lat/lng and latitude/longitude formats
      const lat = place.location.lat || place.location.latitude;
      const lng = place.location.lng || place.location.longitude;
      if (lat && lng) {
        const url = `https://www.google.com/maps/search/?api=1&query=${lat},${lng}`;
        Linking.openURL(url);
      }
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
        <Text style={styles.title}>{place.name}</Text>
        {distance !== undefined && (
          <Text style={styles.distance}>{formatDistance(distance)}</Text>
        )}
      </View>
      
      <View style={styles.placeInfo}>
        {place.address && (
          <Text style={styles.address}>{place.address}</Text>
        )}
        
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
          <Text style={styles.hoursTitle}>opening hours</Text>
          <View style={styles.hoursContainer}>
            {place.openingHours.map((hours, index) => (
              <Text key={index} style={styles.hoursLine}>
                {hours}
              </Text>
            ))}
          </View>
        </View>
      )}
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: COLORS.card,
    borderRadius: ROUNDED_DESIGN.radius.soft,
    padding: ROUNDED_DESIGN.spacing.spacious,
    marginBottom: ROUNDED_DESIGN.spacing.comfortable,
    borderWidth: 1,
    borderColor: COLORS.border,
    ...ROUNDED_DESIGN.shadows.soft,
  },
  header: {
    flexDirection: 'column',
    marginBottom: ROUNDED_DESIGN.spacing.comfortable,
    padding: ROUNDED_DESIGN.spacing.gentle,
    backgroundColor: COLORS.tertiary,
    borderRadius: ROUNDED_DESIGN.radius.gentle,
  },
  title: {
    fontSize: 19,
    fontWeight: '400',
    color: COLORS.text,
    marginBottom: ROUNDED_DESIGN.spacing.minimal,
    letterSpacing: 0.2,
  },
  distance: {
    fontSize: 12,
    color: COLORS.lightText,
    fontWeight: '300',
    textTransform: 'lowercase',
  },
  placeInfo: {
    marginBottom: ROUNDED_DESIGN.spacing.comfortable,
    padding: ROUNDED_DESIGN.spacing.gentle,
    backgroundColor: COLORS.surface,
    borderRadius: ROUNDED_DESIGN.radius.gentle,
    ...ROUNDED_DESIGN.shadows.gentle,
  },
  placeName: {
    fontSize: 17,
    fontWeight: '500',
    color: COLORS.text,
    marginBottom: ROUNDED_DESIGN.spacing.gentle,
    letterSpacing: 0.1,
  },
  address: {
    fontSize: 14,
    color: COLORS.lightText,
    marginBottom: ROUNDED_DESIGN.spacing.comfortable,
    fontWeight: '300',
    lineHeight: 20,
  },
  details: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: ROUNDED_DESIGN.spacing.comfortable,
    padding: ROUNDED_DESIGN.spacing.gentle,
    backgroundColor: COLORS.accent + '15',
    borderRadius: ROUNDED_DESIGN.radius.gentle,
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
  hoursContainer: {
    marginTop: 4,
  },
  hoursLine: {
    fontSize: 11,
    color: COLORS.lightText,
    lineHeight: 16,
    fontWeight: '300',
    marginBottom: 2,
  },
  description: {
    fontSize: 13,
    color: COLORS.lightText,
    marginTop: 8,
    fontStyle: 'italic',
    lineHeight: 18,
  },
});

export default LocationSuggestionCard;