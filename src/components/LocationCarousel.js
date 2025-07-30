import React, { useState, useRef } from 'react';
import { View, ScrollView, Dimensions, StyleSheet, Text } from 'react-native';
import LocationSuggestionCard from './LocationSuggestionCard';
import DESIGN_SYSTEM from '../constants/designSystem';

const { width: screenWidth } = Dimensions.get('window');
const CARD_MARGIN = DESIGN_SYSTEM.spacing.lg;
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
          Nearby Peaceful Spots • {locationSuggestions.length} locations
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
    marginBottom: DESIGN_SYSTEM.spacing.xxl,
  },
  header: {
    paddingHorizontal: CARD_MARGIN,
    marginBottom: DESIGN_SYSTEM.spacing.lg,
  },
  title: {
    fontSize: DESIGN_SYSTEM.typography.fontSize.heading,
    fontWeight: DESIGN_SYSTEM.typography.fontWeight.medium,
    color: DESIGN_SYSTEM.colors.text.primary,
    marginBottom: DESIGN_SYSTEM.spacing.sm,
    letterSpacing: DESIGN_SYSTEM.typography.letterSpacing.tight,
  },
  subtitle: {
    fontSize: DESIGN_SYSTEM.typography.fontSize.body,
    color: DESIGN_SYSTEM.colors.text.secondary,
    marginBottom: DESIGN_SYSTEM.spacing.lg,
    fontWeight: DESIGN_SYSTEM.typography.fontWeight.light,
    lineHeight: DESIGN_SYSTEM.typography.fontSize.body * DESIGN_SYSTEM.typography.lineHeight.relaxed,
  },
  pageIndicator: {
    fontSize: DESIGN_SYSTEM.typography.fontSize.small,
    color: DESIGN_SYSTEM.colors.interactiveText,
    fontWeight: DESIGN_SYSTEM.typography.fontWeight.medium,
    textAlign: 'center',
    paddingVertical: DESIGN_SYSTEM.spacing.sm,
    paddingHorizontal: DESIGN_SYSTEM.spacing.lg,
    backgroundColor: DESIGN_SYSTEM.colors.interactive,
    borderRadius: DESIGN_SYSTEM.borderRadius.full,
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
    marginBottom: DESIGN_SYSTEM.spacing.lg,
  },
  pagination: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: DESIGN_SYSTEM.spacing.lg,
    paddingHorizontal: CARD_MARGIN,
  },
  paginationDot: {
    width: 8,
    height: 8,
    borderRadius: DESIGN_SYSTEM.borderRadius.full,
    backgroundColor: DESIGN_SYSTEM.colors.surface.divider,
    marginHorizontal: DESIGN_SYSTEM.spacing.xs,
  },
  paginationDotActive: {
    backgroundColor: DESIGN_SYSTEM.colors.primary,
    width: 24,
    height: 8,
    borderRadius: DESIGN_SYSTEM.borderRadius.full,
  },
});

export default LocationCarousel;