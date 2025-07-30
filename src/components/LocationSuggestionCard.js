import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Linking, Image } from 'react-native';
import DESIGN_SYSTEM from '../constants/designSystem';

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
    backgroundColor: DESIGN_SYSTEM.colors.surface.card,
    borderRadius: DESIGN_SYSTEM.borderRadius.lg,
    padding: DESIGN_SYSTEM.spacing.lg,
    marginBottom: DESIGN_SYSTEM.spacing.lg,
    overflow: 'hidden',
    ...DESIGN_SYSTEM.shadows.card,
  },
  header: {
    flexDirection: 'column',
    marginBottom: DESIGN_SYSTEM.spacing.lg,
    padding: 0,
  },
  title: {
    fontSize: DESIGN_SYSTEM.typography.fontSize.title,
    fontWeight: DESIGN_SYSTEM.typography.fontWeight.semibold,
    color: DESIGN_SYSTEM.colors.text.primary,
    marginBottom: DESIGN_SYSTEM.spacing.sm,
    letterSpacing: DESIGN_SYSTEM.typography.letterSpacing.tight,
  },
  distance: {
    fontSize: DESIGN_SYSTEM.typography.fontSize.small,
    color: DESIGN_SYSTEM.colors.text.tertiary,
    fontWeight: DESIGN_SYSTEM.typography.fontWeight.light,
  },
  placeInfo: {
    marginBottom: DESIGN_SYSTEM.spacing.lg,
  },
  placeName: {
    fontSize: DESIGN_SYSTEM.typography.fontSize.subtitle,
    fontWeight: DESIGN_SYSTEM.typography.fontWeight.medium,
    color: DESIGN_SYSTEM.colors.text.primary,
    marginBottom: DESIGN_SYSTEM.spacing.sm,
    letterSpacing: DESIGN_SYSTEM.typography.letterSpacing.normal,
  },
  address: {
    fontSize: DESIGN_SYSTEM.typography.fontSize.body,
    color: DESIGN_SYSTEM.colors.text.secondary,
    marginBottom: DESIGN_SYSTEM.spacing.lg,
    fontWeight: DESIGN_SYSTEM.typography.fontWeight.light,
    lineHeight: DESIGN_SYSTEM.typography.fontSize.body * DESIGN_SYSTEM.typography.lineHeight.relaxed,
  },
  details: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: DESIGN_SYSTEM.spacing.lg,
  },
  rating: {
    fontSize: DESIGN_SYSTEM.typography.fontSize.small,
    color: DESIGN_SYSTEM.colors.text.primary,
    fontWeight: DESIGN_SYSTEM.typography.fontWeight.regular,
  },
  type: {
    fontSize: DESIGN_SYSTEM.typography.fontSize.small,
    color: DESIGN_SYSTEM.colors.interactiveText,
    backgroundColor: DESIGN_SYSTEM.colors.interactive,
    paddingHorizontal: DESIGN_SYSTEM.spacing.lg,
    paddingVertical: DESIGN_SYSTEM.spacing.xs,
    borderRadius: DESIGN_SYSTEM.borderRadius.full,
    fontWeight: DESIGN_SYSTEM.typography.fontWeight.medium,
  },
  placeImage: {
    width: '100%',
    height: 120,
    borderRadius: DESIGN_SYSTEM.borderRadius.md,
    marginBottom: DESIGN_SYSTEM.spacing.lg,
  },
  actions: {
    flexDirection: 'row',
    gap: DESIGN_SYSTEM.spacing.lg,
    marginBottom: DESIGN_SYSTEM.spacing.lg,
    marginTop: DESIGN_SYSTEM.spacing.lg,
  },
  actionButton: {
    backgroundColor: DESIGN_SYSTEM.colors.interactive,
    paddingHorizontal: DESIGN_SYSTEM.spacing.lg,
    paddingVertical: DESIGN_SYSTEM.spacing.sm,
    borderRadius: DESIGN_SYSTEM.borderRadius.full,
    ...DESIGN_SYSTEM.shadows.subtle,
  },
  actionText: {
    fontSize: DESIGN_SYSTEM.typography.fontSize.small,
    color: DESIGN_SYSTEM.colors.interactiveText,
    fontWeight: DESIGN_SYSTEM.typography.fontWeight.medium,
  },
  hours: {
    marginTop: DESIGN_SYSTEM.spacing.lg,
    paddingTop: DESIGN_SYSTEM.spacing.lg,
    borderTopWidth: 1,
    borderTopColor: DESIGN_SYSTEM.colors.surface.divider,
  },
  hoursTitle: {
    fontSize: DESIGN_SYSTEM.typography.fontSize.small,
    color: DESIGN_SYSTEM.colors.text.primary,
    fontWeight: DESIGN_SYSTEM.typography.fontWeight.medium,
    marginBottom: DESIGN_SYSTEM.spacing.sm,
    textTransform: 'uppercase',
    letterSpacing: DESIGN_SYSTEM.typography.letterSpacing.wide,
  },
  hoursContainer: {
    marginTop: DESIGN_SYSTEM.spacing.xs,
  },
  hoursLine: {
    fontSize: DESIGN_SYSTEM.typography.fontSize.small,
    color: DESIGN_SYSTEM.colors.text.secondary,
    lineHeight: DESIGN_SYSTEM.typography.fontSize.small * DESIGN_SYSTEM.typography.lineHeight.normal,
    fontWeight: DESIGN_SYSTEM.typography.fontWeight.light,
    marginBottom: DESIGN_SYSTEM.spacing.xs,
  },
  description: {
    fontSize: DESIGN_SYSTEM.typography.fontSize.caption,
    color: DESIGN_SYSTEM.colors.text.secondary,
    marginTop: DESIGN_SYSTEM.spacing.sm,
    fontStyle: 'italic',
    lineHeight: DESIGN_SYSTEM.typography.fontSize.caption * DESIGN_SYSTEM.typography.lineHeight.normal,
  },
});

export default LocationSuggestionCard;