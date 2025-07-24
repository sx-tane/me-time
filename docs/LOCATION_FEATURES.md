# Location-Based Features Documentation

This document details how the Me Time app uses location services to provide personalized, nearby suggestions for mindful activities.

## Overview

Me Time integrates location services to enrich mindful suggestions with nearby places where users can practice their activities. The app finds peaceful spots, interesting locations, and contextually relevant places within walking distance.

## Core Features

### 1. Location-Enriched Suggestions
Every mindful activity is enhanced with nearby places where it can be practiced:

```javascript
// Example: "Practice mindful breathing" becomes:
{
  text: "Practice mindful breathing",
  locationSuggestions: [
    { place: "Serenity Park", distance: "0.3km away" },
    { place: "Quiet Library Corner", distance: "0.5km away" },
    { place: "Peaceful Café", distance: "0.7km away" }
  ]
}
```

### 2. Multiple Location Options
Each suggestion shows 3-5 nearby options, giving users choice and flexibility:

- **Primary suggestion**: Best match for the activity
- **Alternative locations**: Different types of venues for variety
- **Distance-sorted**: Closest options appear first
- **Contextually relevant**: Places match the activity type

### 3. Rich Place Information
Each location includes comprehensive details:

```javascript
{
  name: "Central Peace Library",
  address: "789 Quiet Avenue",
  rating: 4.9,
  distance: "0.5km away",
  photos: [/* photo URLs */],
  phone: "+1 234-567-8902",
  website: "https://library.example.com",
  openingHours: ["Monday: 9:00 AM – 9:00 PM", ...],
  types: ["library", "quiet_space"]
}
```

## Location Services Architecture

### Service Layer

#### `locationService.js`
- Manages location permissions
- Gets current GPS coordinates
- Calculates distances between points
- Handles location availability detection

#### `placesService.js`
- Integrates with Google Places API
- Searches for nearby interesting places
- Formats and caches place data
- Handles API fallbacks and errors

#### `suggestionService.js`
- Enriches AI suggestions with location data
- Maps activity types to relevant place categories
- Manages the suggestion generation workflow

### Location Permission Flow

```javascript
// 1. Check if location is available
const isAvailable = await locationService.isLocationAvailable();

// 2. Request permissions if needed
const { status } = await Location.requestForegroundPermissionsAsync();

// 3. Get current location
const location = await locationService.getCurrentLocation();

// 4. Search for nearby places
const places = await placesService.getNearbyInterestingPlaces({
  latitude: location.latitude,
  longitude: location.longitude,
  radius: 800,  // 800 meters for walking distance
  types: ['park', 'cafe', 'library'],
  maxResults: 5
});
```

## Place Type Mapping

### Activity-Specific Place Types

Different mindful activities are matched with appropriate venue types:

```javascript
const categoryToPlaceTypes = {
  'mindful': ['park', 'garden', 'spa', 'library', 'museum', 'cafe'],
  'sensory': ['park', 'botanical_garden', 'flower_shop', 'bakery', 'art_gallery'],
  'movement': ['park', 'trail', 'fitness_center', 'sports_complex'],
  'reflection': ['library', 'museum', 'art_gallery', 'book_store', 'cafe'],
  'discovery': ['tourist_attraction', 'museum', 'shopping_mall'],
  'rest': ['park', 'cafe', 'library', 'spa', 'garden'],
  'creative': ['art_gallery', 'museum', 'craft_store', 'studio'],
  'nature': ['park', 'botanical_garden', 'garden'],
  'social': ['cafe', 'restaurant', 'community_center', 'park']
};
```

### Place Prioritization

The app intelligently prioritizes places based on:

1. **Relevance**: How well the venue matches the activity
2. **Interest Level**: Tourist attractions and unique spots get priority
3. **Rating**: Higher-rated places appear first
4. **Distance**: Closer locations are preferred
5. **Data Quality**: Places with photos and rich information rank higher

## Search Strategy

### Multi-Layered Search

1. **Primary Search**: Activity-specific place types within 800m
2. **Expanded Search**: General interesting places within 800m
3. **Broad Fallback**: Any establishment within 2km if needed
4. **Demo Mode**: Sample places for web/testing environments

### Distance Optimization

```javascript
const searchRadii = {
  close: 800,    // Walking distance (5-10 minutes)
  nearby: 2000,  // Short bike ride or drive
  extended: 5000 // For areas with fewer venues
};
```

### Smart Filtering

- **Type matching**: Venues that fit the activity context
- **Quality filtering**: Minimum rating thresholds when available
- **Accessibility**: Preference for publicly accessible locations
- **Hours consideration**: Places likely to be open

## User Interface Integration

### Location Cards

Each location is displayed in a detailed card showing:

```javascript
<LocationSuggestionCard>
  - Place name and category
  - Distance from user
  - Rating and review count
  - Photo (when available)
  - Address and contact info
  - Quick actions (directions, call, website)
  - Opening hours
</LocationSuggestionCard>
```

### Interactive Elements

- **Directions**: Opens default maps app with navigation
- **Phone**: Initiates phone call if number available
- **Website**: Opens place's website in browser
- **Photos**: Shows high-quality images from Google Places

### Progressive Enhancement

1. **Basic Suggestion**: Shows without location if GPS unavailable
2. **Location Loading**: Displays "Finding nearby spots..." while loading
3. **Location Enriched**: Shows full location cards when data loaded
4. **Error Graceful**: Falls back to suggestion-only if location fails

## Caching and Performance

### Intelligent Caching

```javascript
const cacheStrategy = {
  duration: 24 * 60 * 60 * 1000, // 24 hours
  compression: true,              // Reduce storage size
  keyStrategy: 'location_radius_types', // Cache by search parameters
  deduplication: true            // Avoid duplicate concurrent requests
};
```

### Cache Optimization

- **Data Compression**: Stores only essential fields for caching
- **TTL Management**: Automatic cache expiration and cleanup
- **Memory Efficiency**: Limits photo count and data size
- **Background Refresh**: Updates cache during idle time

### Performance Benefits

- **Faster Loading**: Cached results appear instantly
- **Reduced API Calls**: Saves on API quotas and costs
- **Offline Support**: Works with cached data when network unavailable
- **Battery Optimization**: Reduces GPS and network usage

## Privacy and Permissions

### Permission Handling

```javascript
// Graceful permission requests
const requestLocationPermission = async () => {
  // Check current status
  const { status: existingStatus } = await Location.getForegroundPermissionsAsync();
  
  if (existingStatus !== 'granted') {
    // Request with user-friendly prompt
    const { status } = await Location.requestForegroundPermissionsAsync();
    return status === 'granted';
  }
  
  return true;
};
```

### Privacy Features

- **Optional Location**: App works fully without location access
- **No Tracking**: Location data never stored or transmitted
- **User Control**: Easy to disable location features in settings
- **Transparent**: Clear indication when location is being used

### Data Handling

- **Local Only**: GPS coordinates never leave the device
- **Anonymous Queries**: API calls don't include user identification
- **Temporary Storage**: Location data cleared after session
- **No History**: Past locations aren't stored or remembered

## Error Handling and Fallbacks

### Location Service Failures

```javascript
const handleLocationError = async (error) => {
  switch (error.code) {
    case 'PERMISSION_DENIED':
      return showLocationDisabledMessage();
    case 'POSITION_UNAVAILABLE':
      return useLastKnownLocation();
    case 'TIMEOUT':
      return retryWithLongerTimeout();
    default:
      return showGenericLocationError();
  }
};
```

### API Fallback Chain

1. **Google Places API (New)**: Primary rich data source
2. **Google Maps API**: Legacy fallback with basic data
3. **Demo Data**: Sample locations for web/testing
4. **No Location**: Suggestion continues without places

### User Experience

- **Progressive Enhancement**: Features degrade gracefully
- **Clear Messaging**: Users understand what's happening
- **Alternative Options**: Always provide non-location alternatives
- **Retry Mechanisms**: Allow users to retry failed operations

## Development and Testing

### Testing Location Features

```javascript
// Mock location for testing
const mockLocation = {
  latitude: 37.7749,
  longitude: -122.4194
};

// Test different scenarios
await testLocationPermissions();
await testPlaceSearch(mockLocation);
await testCachePerformance();
await testOfflineMode();
```

### Debug Tools

```javascript
// Location debugging utilities
import { debugLocationServices } from '../utils/troubleshootAPIs';

const locationDebug = await debugLocationServices();
console.log('Location Status:', locationDebug);
```

### Common Test Cases

1. **Permission States**: Granted, denied, undetermined
2. **Network Conditions**: Online, offline, slow connection
3. **Location Accuracy**: GPS, network, passive location
4. **API Responses**: Success, failure, empty results
5. **Edge Cases**: No nearby places, API quota exceeded

## Configuration Options

### Environment Variables

```javascript
// Location service configuration
const locationConfig = {
  DEFAULT_SEARCH_RADIUS: 3000,     // Default search radius in meters
  MAX_SEARCH_RESULTS: 20,          // Maximum places to return
  CACHE_TTL_HOURS: 24,            // Cache duration
  MAX_PHOTOS_PER_PLACE: 3,        // Photo limit per location
  ENABLE_DEBUG_LOGS: true         // Debug logging
};
```

### Customizable Parameters

- **Search Radius**: Adjust based on urban vs rural environments
- **Place Types**: Modify based on regional preferences
- **Result Limits**: Balance between choice and performance
- **Cache Duration**: Based on how often places change
- **Photo Limits**: Balance visual appeal with data usage

## Future Enhancements

### Planned Features

1. **Weather Integration**: Factor weather into location suggestions
2. **Time-Aware Filtering**: Consider opening hours in search
3. **User Preferences**: Learn from user location choices
4. **Accessibility Info**: Include wheelchair access, noise levels
5. **Real-time Data**: Live occupancy, wait times

### Advanced Location Features

1. **Route Planning**: Multi-stop mindful journeys
2. **Seasonal Suggestions**: Places that change with seasons
3. **Community Data**: User-contributed peaceful spots
4. **AR Integration**: Augmented reality for place discovery
5. **Offline Maps**: Downloadable location data

## Best Practices

### For Developers

1. **Always Handle Failures**: Location can fail in many ways
2. **Respect Privacy**: Make location features clearly optional
3. **Test Edge Cases**: Rural areas, no network, permission denied
4. **Optimize Performance**: Cache aggressively, minimize API calls
5. **User Feedback**: Show loading states and error messages

### For Users

1. **Grant Location Permission**: For the best experience
2. **Try Different Areas**: Explore suggestions in various locations
3. **Use Offline**: Many features work without internet
4. **Provide Feedback**: Report places that don't match activities
5. **Respect Locations**: Be mindful when visiting suggested spots

## Troubleshooting

### Common Issues

**"No nearby places found":**
- User in rural area with few establishments
- API quota exceeded or keys invalid
- Network connectivity issues
- Try expanding search radius or using cached data

**"Location permission denied":**
- User declined location access
- App works without location, just without place suggestions
- Provide clear instructions for enabling location if desired

**"Places loading slowly":**
- Network connectivity issues
- API rate limiting
- Large search radius with many results
- Cache data for better performance

### Debug Steps

1. Check location permission status
2. Verify API keys are valid and have quota
3. Test network connectivity
4. Clear cache and retry
5. Check console logs for detailed errors