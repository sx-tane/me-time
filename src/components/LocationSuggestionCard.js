import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Linking, Image } from 'react-native';
import { COLORS, ROUNDED_DESIGN } from '../constants/colors';

const LocationSuggestionCard = ({ suggestion, onPress, style }) => {
  // Handle both formats: old (with locationSuggestion) and new (direct place)
  const locationSuggestion = suggestion.locationSuggestion || suggestion;
  const place = locationSuggestion.place || suggestion.place;
  const distance = locationSuggestion.distance || suggestion.distance;
  
  if (!place) {
    console.error('LocationSuggestionCard: place is undefined!', { suggestion, locationSuggestion });
    return null;
  }


  const handleOpenMaps = () => {
    if (place.googleMapsUrl) {
      Linking.openURL(place.googleMapsUrl);
    } else if (place.location && place.name) {
      // Handle both lat/lng and latitude/longitude formats
      const lat = place.location.lat || place.location.latitude;
      const lng = place.location.lng || place.location.longitude;
      if (lat && lng) {
        // Use place name and coordinates for better results
        const encodedName = encodeURIComponent(place.name);
        const url = `https://www.google.com/maps/search/?api=1&query=${encodedName}&query_place_id=${place.id || ''}`;
        // Fallback to coordinates-based search if name-based doesn't work well
        const coordinatesUrl = `https://www.google.com/maps/search/?api=1&query=${lat},${lng}`;
        
        // Try with place name first for better UX
        Linking.openURL(url).catch(() => {
          // If that fails, fall back to coordinates
          Linking.openURL(coordinatesUrl);
        });
      }
    }
  };

  const handleCall = (e) => {
    e.stopPropagation();
    if (place.phone) {
      Linking.openURL(`tel:${place.phone}`);
    }
  };

  const handleWebsite = (e) => {
    e.stopPropagation();
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
    <TouchableOpacity style={[styles.container, style]} onPress={handleOpenMaps}>
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

      {(place.phone || place.website) && (
        <View style={styles.actions}>
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
      )}

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
    borderRadius: ROUNDED_DESIGN.radius.gentle,
    padding: ROUNDED_DESIGN.spacing.spacious,
    marginBottom: ROUNDED_DESIGN.spacing.comfortable,
    overflow: 'hidden',
    ...ROUNDED_DESIGN.shadows.gentle,
  },
  header: {
    flexDirection: 'column',
    marginBottom: ROUNDED_DESIGN.spacing.spacious,
    padding: 0,
  },
  title: {
    fontSize: ROUNDED_DESIGN.typography.large,
    fontWeight: '400',
    color: COLORS.text,
    marginBottom: ROUNDED_DESIGN.spacing.gentle,
    letterSpacing: -0.2,
  },
  distance: {
    fontSize: ROUNDED_DESIGN.typography.small,
    color: COLORS.mutedText,
    fontWeight: '300',
  },
  placeInfo: {
    marginBottom: ROUNDED_DESIGN.spacing.comfortable,
  },
  placeName: {
    fontSize: 17,
    fontWeight: '500',
    color: COLORS.text,
    marginBottom: ROUNDED_DESIGN.spacing.gentle,
    letterSpacing: 0.1,
  },
  address: {
    fontSize: ROUNDED_DESIGN.typography.body,
    color: COLORS.lightText,
    marginBottom: ROUNDED_DESIGN.spacing.comfortable,
    fontWeight: '300',
    lineHeight: 22,
  },
  details: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: ROUNDED_DESIGN.spacing.spacious,
  },
  rating: {
    fontSize: ROUNDED_DESIGN.typography.small,
    color: COLORS.text,
    fontWeight: '400',
  },
  type: {
    fontSize: ROUNDED_DESIGN.typography.small,
    color: COLORS.mutedText,
    backgroundColor: COLORS.buttonBg,
    paddingHorizontal: ROUNDED_DESIGN.spacing.comfortable,
    paddingVertical: ROUNDED_DESIGN.spacing.minimal,
    borderRadius: ROUNDED_DESIGN.radius.full,
    fontWeight: '300',
  },
  placeImage: {
    width: '100%',
    height: 120,
    borderRadius: ROUNDED_DESIGN.radius.minimal,
    marginBottom: ROUNDED_DESIGN.spacing.spacious,
  },
  actions: {
    flexDirection: 'row',
    gap: ROUNDED_DESIGN.spacing.comfortable,
    marginBottom: ROUNDED_DESIGN.spacing.comfortable,
    marginTop: ROUNDED_DESIGN.spacing.comfortable,
  },
  actionButton: {
    backgroundColor: COLORS.buttonBg,
    paddingHorizontal: ROUNDED_DESIGN.spacing.spacious,
    paddingVertical: ROUNDED_DESIGN.spacing.gentle,
    borderRadius: ROUNDED_DESIGN.radius.full,
  },
  actionText: {
    fontSize: ROUNDED_DESIGN.typography.small,
    color: COLORS.text,
    fontWeight: '400',
  },
  hours: {
    marginTop: ROUNDED_DESIGN.spacing.comfortable,
    paddingTop: ROUNDED_DESIGN.spacing.comfortable,
    borderTopWidth: 1,
    borderTopColor: COLORS.divider,
  },
  hoursTitle: {
    fontSize: ROUNDED_DESIGN.typography.small,
    color: COLORS.text,
    fontWeight: '400',
    marginBottom: ROUNDED_DESIGN.spacing.gentle,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  hoursContainer: {
    marginTop: 4,
  },
  hoursLine: {
    fontSize: ROUNDED_DESIGN.typography.small,
    color: COLORS.lightText,
    lineHeight: 18,
    fontWeight: '300',
    marginBottom: ROUNDED_DESIGN.spacing.minimal,
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