import React, { useState, useRef } from 'react';
import { View, ScrollView, Dimensions, StyleSheet, Text } from 'react-native';
import LocationSuggestionCard from './LocationSuggestionCard';
import { colors } from '../constants/colors';

const { width: screenWidth } = Dimensions.get('window');
const CARD_MARGIN = 24;
const CARDS_PER_PAGE = 5;

const LocationCarousel = ({ locationSuggestions, suggestion, style }) => {
  const [currentPage, setCurrentPage] = useState(0);
  const scrollViewRef = useRef(null);

  if (!locationSuggestions || locationSuggestions.length === 0) {
    return null;
  }

  // Split locations into pages of 5
  const pages = [];
  for (let i = 0; i < locationSuggestions.length; i += CARDS_PER_PAGE) {
    pages.push(locationSuggestions.slice(i, i + CARDS_PER_PAGE));
  }

  const handleScroll = (event) => {
    const scrollX = event.nativeEvent.contentOffset.x;
    const pageIndex = Math.round(scrollX / screenWidth);
    setCurrentPage(pageIndex);
  };

  const renderPage = (pageLocations, pageIndex) => (
    <View key={pageIndex} style={styles.page}>
      {pageLocations.map((locationSug, index) => (
        <LocationSuggestionCard 
          key={`location-${pageIndex}-${index}`}
          suggestion={{
            ...suggestion,
            locationSuggestion: locationSug
          }}
          style={styles.locationCard}
        />
      ))}
    </View>
  );

  return (
    <View style={[styles.container, style]}>
      <View style={styles.header}>
        <Text style={styles.title}>
          🌍 Nearby Peaceful Spots ({locationSuggestions.length})
        </Text>
        <Text style={styles.subtitle}>
          Perfect places within walking distance for your activity
        </Text>
        {pages.length > 1 && (
          <Text style={styles.pageIndicator}>
            Page {currentPage + 1} of {pages.length} • Swipe to explore more →
          </Text>
        )}
      </View>

      {pages.length === 1 ? (
        // Single page - no need for scroll
        <View style={styles.singlePageContainer}>
          {pages[0].map((locationSug, index) => (
            <LocationSuggestionCard 
              key={`location-single-${index}`}
              suggestion={{
                ...suggestion,
                locationSuggestion: locationSug
              }}
              style={styles.locationCard}
            />
          ))}
        </View>
      ) : (
        // Multiple pages - swipeable
        <ScrollView
          ref={scrollViewRef}
          horizontal
          pagingEnabled
          showsHorizontalScrollIndicator={false}
          onScroll={handleScroll}
          scrollEventThrottle={16}
          contentContainerStyle={styles.scrollContent}
        >
          {pages.map((pageLocations, pageIndex) => renderPage(pageLocations, pageIndex))}
        </ScrollView>
      )}

      {pages.length > 1 && (
        <View style={styles.pagination}>
          {pages.map((_, index) => (
            <View
              key={index}
              style={[
                styles.paginationDot,
                index === currentPage && styles.paginationDotActive
              ]}
            />
          ))}
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginBottom: 32,
  },
  header: {
    paddingHorizontal: CARD_MARGIN,
    marginBottom: 20,
  },
  title: {
    fontSize: 22,
    fontWeight: '600',
    color: colors.text,
    marginBottom: 8,
    letterSpacing: -0.3,
  },
  subtitle: {
    fontSize: 14,
    color: colors.lightText,
    marginBottom: 12,
    fontStyle: 'italic',
  },
  pageIndicator: {
    fontSize: 12,
    color: colors.accent,
    fontWeight: '500',
    textAlign: 'center',
    paddingVertical: 8,
    paddingHorizontal: 16,
    backgroundColor: colors.accent + '15',
    borderRadius: 16,
    alignSelf: 'center',
  },
  singlePageContainer: {
    paddingHorizontal: CARD_MARGIN,
  },
  scrollContent: {
    paddingLeft: CARD_MARGIN,
  },
  page: {
    width: screenWidth - (CARD_MARGIN * 2),
    paddingRight: CARD_MARGIN,
  },
  locationCard: {
    marginBottom: 16,
  },
  pagination: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 16,
    paddingHorizontal: CARD_MARGIN,
  },
  paginationDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: colors.lightText + '40',
    marginHorizontal: 4,
  },
  paginationDotActive: {
    backgroundColor: colors.accent,
    width: 12,
    height: 8,
    borderRadius: 4,
  },
});

export default LocationCarousel;