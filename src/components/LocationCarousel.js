import React, { useState, useRef } from 'react';
import { View, ScrollView, Dimensions, StyleSheet, Text } from 'react-native';
import LocationSuggestionCard from './LocationSuggestionCard';
import colors, { ROUNDED_DESIGN } from '../constants/colors';

const { width: screenWidth } = Dimensions.get('window');
const CARD_MARGIN = ROUNDED_DESIGN.spacing.spacious;
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
    marginBottom: ROUNDED_DESIGN.spacing.generous,
  },
  header: {
    paddingHorizontal: CARD_MARGIN,
    marginBottom: ROUNDED_DESIGN.spacing.spacious,
  },
  title: {
    fontSize: ROUNDED_DESIGN.typography.large,
    fontWeight: '400',
    color: colors.text,
    marginBottom: ROUNDED_DESIGN.spacing.gentle,
    letterSpacing: -0.3,
  },
  subtitle: {
    fontSize: ROUNDED_DESIGN.typography.body,
    color: colors.lightText,
    marginBottom: ROUNDED_DESIGN.spacing.comfortable,
    fontWeight: '300',
  },
  pageIndicator: {
    fontSize: ROUNDED_DESIGN.typography.small,
    color: colors.text,
    fontWeight: '400',
    textAlign: 'center',
    paddingVertical: ROUNDED_DESIGN.spacing.gentle,
    paddingHorizontal: ROUNDED_DESIGN.spacing.comfortable,
    backgroundColor: colors.buttonBg,
    borderRadius: ROUNDED_DESIGN.radius.full,
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
    marginBottom: ROUNDED_DESIGN.spacing.comfortable,
  },
  pagination: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: ROUNDED_DESIGN.spacing.comfortable,
    paddingHorizontal: CARD_MARGIN,
  },
  paginationDot: {
    width: 8,
    height: 8,
    borderRadius: ROUNDED_DESIGN.radius.full,
    backgroundColor: colors.divider,
    marginHorizontal: ROUNDED_DESIGN.spacing.minimal,
  },
  paginationDotActive: {
    backgroundColor: colors.primary,
    width: 24,
    height: 8,
    borderRadius: ROUNDED_DESIGN.radius.full,
  },
});

export default LocationCarousel;