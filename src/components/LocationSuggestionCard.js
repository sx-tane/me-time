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
          <Text style={styles.actionText}>📍 Directions</Text>
        </TouchableOpacity>
        
        {place.phone && (
          <TouchableOpacity style={styles.actionButton} onPress={handleCall}>
            <Text style={styles.actionText}>📞 Call</Text>
          </TouchableOpacity>
        )}
        
        {place.website && (
          <TouchableOpacity style={styles.actionButton} onPress={handleWebsite}>
            <Text style={styles.actionText}>🌐 Website</Text>
          </TouchableOpacity>
        )}
      </View>

      {place.openingHours && place.openingHours.length > 0 && (
        <View style={styles.hours}>
          <Text style={styles.hoursTitle}>Opening Hours:</Text>
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
    backgroundColor: COLORS.WHITE,
    borderRadius: 20,
    padding: 20,
    marginBottom: 20,
    shadowColor: COLORS.BLACK,
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 5,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 12,
  },
  title: {
    fontSize: 20,
    fontWeight: '600',
    color: COLORS.DARK_BLUE,
    flex: 1,
    marginRight: 10,
  },
  distance: {
    fontSize: 14,
    color: COLORS.ACCENT,
    fontWeight: '500',
  },
  placeInfo: {
    marginBottom: 12,
  },
  placeName: {
    fontSize: 18,
    fontWeight: '700',
    color: COLORS.BLACK,
    marginBottom: 4,
  },
  address: {
    fontSize: 14,
    color: COLORS.GRAY,
    marginBottom: 8,
  },
  details: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  rating: {
    fontSize: 14,
    color: COLORS.ACCENT,
    fontWeight: '600',
  },
  type: {
    fontSize: 12,
    color: COLORS.GRAY,
    backgroundColor: COLORS.LIGHT_BLUE + '20',
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 8,
  },
  placeImage: {
    width: '100%',
    height: 120,
    borderRadius: 12,
    marginBottom: 12,
  },
  actions: {
    flexDirection: 'row',
    gap: 8,
    marginBottom: 8,
  },
  actionButton: {
    backgroundColor: COLORS.ACCENT + '10',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: COLORS.ACCENT + '30',
  },
  actionText: {
    fontSize: 12,
    color: COLORS.ACCENT,
    fontWeight: '500',
  },
  hours: {
    marginTop: 8,
    paddingTop: 8,
    borderTopWidth: 1,
    borderTopColor: COLORS.LIGHT_BLUE + '30',
  },
  hoursTitle: {
    fontSize: 12,
    color: COLORS.DARK_BLUE,
    fontWeight: '600',
    marginBottom: 2,
  },
  hoursText: {
    fontSize: 12,
    color: COLORS.GRAY,
    lineHeight: 16,
  },
});

export default LocationSuggestionCard;