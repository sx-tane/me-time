# Service Architecture Documentation

This document provides comprehensive documentation for all services, APIs, and core functionality in the Me Time app.

## Overview

Me Time is built with a service-oriented architecture that separates concerns into specialized modules. Each service handles a specific aspect of the app's functionality while maintaining clean interfaces and graceful degradation.

## Core Services

### 1. AI Task Service (`aiTaskService.js`)

**Purpose**: Generates personalized mindful activities using OpenAI GPT-4o-mini with intelligent fallbacks.

#### Key Features
- **Context-Aware Generation**: Adapts to time of day, mood, weather, and season
- **14 Activity Categories**: Comprehensive range from mindful to creative activities
- **Smart Caching**: 1-minute session cache with variety enforcement
- **Rate Limiting**: 60 requests per minute protection
- **Cost Optimization**: Uses GPT-4o-mini (~$0.15 per 1,000 suggestions)
- **Graceful Fallbacks**: Local curated tasks when API unavailable

#### Main APIs

```javascript
// Generate personalized zen task
const task = await aiTaskService.generateZenTask({
  keywords: ['peaceful', 'coffee'],
  location: { latitude: 37.7749, longitude: -122.4194 },
  timeOfDay: 'morning',        // morning, afternoon, evening, any
  mood: 'peaceful',            // peaceful, energizing, contemplative
  activityLevel: 'gentle',     // gentle, moderate, active
  weather: 'sunny',            // sunny, rainy, cloudy, null
  season: 'spring',            // spring, summer, fall, winter, null
  energyLevel: 'medium'        // low, medium, high, null
});

// Generate location-specific tasks
const tasks = await aiTaskService.generateTasksForLocation(
  place,              // Place object with name, type, etc.
  ['mindful', 'zen'], // Keywords
  3                   // Number of tasks to generate
);

// Generate daily task collection
const dailyTasks = await aiTaskService.generateDailyZenTasks({
  preferredCategories: ['mindful', 'creative'],
  timePreference: 'morning',
  locationEnabled: true
});

// Get fallback task when AI unavailable
const fallbackTask = await aiTaskService.getFallbackTask({
  category: 'mindful',
  timeOfDay: 'morning'
});

// Scenario-based generation
const scenarioTask = await aiTaskService.generateScenarioBasedTask(
  'work_break',    // Scenario type
  { duration: 10 } // Options
);
```

#### Activity Categories

| Category | Description | Example Tasks |
|----------|-------------|---------------|
| `mindful` | Present-moment awareness | Mindful breathing, meditation |
| `sensory` | Engaging the senses | Sound meditation, texture exploration |
| `movement` | Gentle physical activity | Walking meditation, stretching |
| `reflection` | Contemplative activities | Journaling, life reflection |
| `discovery` | Exploring new things | Local history, architecture |
| `rest` | Restorative activities | Gentle napping, relaxation |
| `creative` | Artistic expression | Drawing, poetry, music |
| `nature` | Connecting with outdoors | Garden visits, sky watching |
| `social` | Gentle human connection | Coffee with friend, conversation |
| `connection` | Building relationships | Community involvement, kindness |
| `learning` | Gentle education | Reading, skill exploration |
| `play` | Lighthearted activities | Games, playful exploration |
| `service` | Helping others | Volunteering, acts of kindness |
| `gratitude` | Appreciation practices | Gratitude meditation, thankfulness |

#### Supported Scenarios

- `work_break`: Short office/work environment breaks
- `commute`: Activities for travel time
- `waiting`: Things to do while waiting
- `home_evening`: Peaceful home activities
- `social_gathering`: Group-friendly activities
- `outdoor_space`: Activities for outdoor environments
- `indoor_cozy`: Intimate indoor activities
- `morning_start`: Beginning-of-day practices
- `stress_relief`: Calming stress-reduction activities

### 2. Places Service (`placesService.js`)

**Purpose**: Discovers nearby interesting places using Google Places API with intelligent caching and fallbacks.

#### Key Features
- **Hybrid API Support**: Google Places API v1 with Google Maps API fallback
- **Smart Caching**: 24-hour TTL with data compression
- **Demo Mode**: Sample data for web/testing environments
- **Rate Limiting**: 100 requests per minute protection
- **Place Type Mapping**: Comprehensive mapping between app and API types
- **Cost Monitoring**: Built-in usage tracking

#### Main APIs

```javascript
// Get nearby places with comprehensive filtering
const places = await placesService.getNearbyInterestingPlaces({
  latitude: 37.7749,
  longitude: -122.4194,
  radius: 5000,                    // Search radius in meters
  types: ['cafe', 'park', 'museum'], // Place types to search for
  maxResults: 10,                  // Maximum results to return
  bypassCache: false               // Force fresh API call
});

// Get single random interesting place
const randomPlace = await placesService.getRandomInterestingPlace({
  latitude: 37.7749,
  longitude: -122.4194
});

// Cache management
await placesService.clearCache();
const cached = await placesService.getCachedResult(cacheKey);
await placesService.setCachedResult(cacheKey, data, ttl);
```

#### Place Data Structure

```javascript
{
  id: "ChIJrTLr-GyuEmsRBfy61i59si0",
  name: "Central Park",
  address: "New York, NY, USA",
  location: {
    latitude: 40.7829,
    longitude: -73.9654
  },
  rating: 4.9,
  userRatingCount: 12847,
  types: ["park", "tourist_attraction"],
  photos: [
    {
      name: "places/photo123",
      widthPx: 1024,
      heightPx: 768
    }
  ],
  phone: "+1 212-310-6600",
  website: "https://www.centralparknyc.org",
  openingHours: [
    "Monday: 6:00 AM – 1:00 AM",
    "Tuesday: 6:00 AM – 1:00 AM"
  ],
  priceLevel: "FREE"
}
```

#### Supported Place Types

```javascript
// Core peaceful places
const peacefulPlaces = [
  'park', 'garden', 'spa', 'library', 'museum', 'cafe',
  'art_gallery', 'botanical_garden', 'church', 'temple'
];

// Activity-specific places  
const activityPlaces = [
  'fitness_center', 'sports_complex', 'trail',      // Movement
  'tourist_attraction', 'shopping_mall',            // Discovery
  'restaurant', 'bakery', 'flower_shop',           // Sensory
  'book_store', 'craft_store', 'studio',           // Creative
  'community_center', 'school', 'university'       // Learning/Social
];
```

### 3. Location Service (`locationService.js`)

**Purpose**: Manages device location with intelligent caching and permission handling.

#### Key Features
- **Smart Caching**: 5-minute location cache, 24-hour fallback cache
- **Permission Management**: Graceful permission request handling
- **Distance Calculations**: Haversine formula for accurate distances
- **Background Updates**: Optional location tracking with configurable intervals
- **Privacy Focused**: No location data storage or transmission

#### Main APIs

```javascript
// Get current location with caching
const location = await locationService.getCurrentLocation(useCache = true);

// Permission management
const hasPermission = await locationService.requestPermissions();
const isAvailable = await locationService.isLocationAvailable();

// Distance calculations
const distance = locationService.calculateDistance(
  lat1, lon1,  // First point
  lat2, lon2   // Second point
); // Returns distance in meters

// Background location updates (optional)
locationService.startLocationUpdates(
  (location) => console.log('New location:', location),
  300000 // Update interval in milliseconds (5 minutes)
);
locationService.stopLocationUpdates();

// Cache management
await locationService.cacheLocation(location);
const cached = await locationService.getCachedLocation();
await locationService.clearLocationCache();
```

#### Location Data Structure

```javascript
{
  latitude: 37.7749,
  longitude: -122.4194,
  accuracy: 65,           // Accuracy in meters
  altitude: 10.5,         // Altitude in meters
  altitudeAccuracy: 5,    // Altitude accuracy in meters
  heading: 90,            // Compass heading (0-360 degrees)
  speed: 2.5,             // Speed in m/s
  timestamp: 1640995200000 // Unix timestamp
}
```

### 4. Suggestion Service (`suggestionService.js`)

**Purpose**: Orchestrates AI task generation with location enrichment and intelligent caching.

#### Key Features
- **Daily Suggestions**: One suggestion per day with smart caching
- **Location Enrichment**: Matches tasks to relevant nearby places using priority scoring
- **Task-Location Matching**: 14 categories mapped to relevant place types
- **Smart Variety**: Ensures different suggestions and locations on skip
- **Cache Management**: Bypasses cache for fresh content when needed

#### Main APIs

```javascript
// Get today's cached suggestion
const todaysSuggestion = await suggestionService.getTodaysSuggestion();

// Generate fresh AI suggestion
const aiSuggestion = await suggestionService.getNewAISuggestion();

// Get different suggestion (ensures variety)
const newSuggestion = await suggestionService.getNewSuggestion(currentSuggestion);

// Enrich suggestion with location data
const enrichedSuggestion = await suggestionService.enrichSuggestionWithLocation(suggestion);

// Location-based discovery
const locationSuggestions = await suggestionService.getSuggestionsByLocation({
  latitude: 37.7749,
  longitude: -122.4194,
  radius: 1000,
  categories: ['mindful', 'creative']
});

// Find peaceful spots nearby
const peacefulSpots = await suggestionService.getPeacefulSpotsNearby({
  latitude: 37.7749,
  longitude: -122.4194,
  maxResults: 5
});

// AI-enhanced location discovery
const aiSpots = await suggestionService.getAIEnhancedPeacefulSpots(
  ['meditation', 'quiet'],  // Keywords
  { radius: 2000 }          // Options
);
```

#### Task-Location Matching System

The service uses a sophisticated scoring system to match tasks with relevant locations:

```javascript
// Priority-based place type mapping
const categoryToPlaceTypes = {
  'mindful': {
    primary: ['spa', 'garden', 'library'],      // 40 points
    secondary: ['park', 'museum', 'cafe'],      // 25 points  
    fallback: ['church', 'art_gallery']         // 15 points
  },
  'creative': {
    primary: ['art_gallery', 'studio', 'craft_store'],
    secondary: ['museum', 'library', 'cafe'],
    fallback: ['park', 'community_center']
  }
  // ... other categories
};

// Scoring algorithm components
const getLocationScore = (place, taskCategory, recentLocations) => {
  const taskRelevance = getTaskRelevanceScore(place, taskCategory);    // 40%
  const qualityScore = getQualityScore(place.rating);                // 30%
  const noveltyScore = getNoveltyScore(place, recentLocations);       // 20%
  const interestScore = getInterestScore(place.types);               // 10%
  
  return taskRelevance + qualityScore + noveltyScore + interestScore;
};
```

### 5. Notification Service (`notificationService.js`)

**Purpose**: Provides gentle daily reminders without pressure or anxiety.

#### Key Features
- **Three Daily Notifications**: Morning (9am), afternoon (3pm), evening (8pm)
- **Gentle Messaging**: Soft, encouraging reminder text
- **Customizable Times**: User can adjust notification schedule
- **Permission Handling**: Graceful permission request flow
- **No Sound**: Visual-only notifications for peaceful experience

#### Main APIs

```javascript
// Schedule all daily notifications
await notificationService.scheduleAllNotifications();

// Individual notification scheduling  
const notificationId = await notificationService.scheduleNotification(
  'morning',           // timeOfDay: morning, afternoon, evening
  { hour: 9, minute: 0 } // time object
);

// Enable/disable notifications
const success = await notificationService.enableNotifications();  // Returns boolean
await notificationService.disableNotifications();

// Time management
const times = await notificationService.getNotificationTimes();
await notificationService.setNotificationTimes({
  morning: { hour: 8, minute: 30 },
  afternoon: { hour: 14, minute: 0 },
  evening: { hour: 19, minute: 30 }
});

// Status checking
const scheduled = await notificationService.getScheduledNotifications();
```

#### Gentle Message Examples

```javascript
const GENTLE_MESSAGES = {
  morning: [
    "Time to breathe. No rush.",
    "A gentle morning pause awaits you.",
    "Your peaceful moment is here.",
    "Take it slow today. You deserve rest."
  ],
  afternoon: [
    "Midday reset. Just breathe.",
    "A quiet moment in your busy day.",
    "Time to slow down and notice.",
    "Your afternoon pause is ready."
  ],
  evening: [
    "Evening calm. Let the day go.",
    "Time to unwind. No pressure.",
    "Your gentle evening break.",
    "Rest is productive too."
  ]
};
```

### 6. API Monitoring Service (`apiMonitoringService.js`)

**Purpose**: Tracks API usage and costs for budget management and optimization.

#### Key Features
- **Cost Tracking**: Real-time cost calculation for OpenAI and Google APIs
- **Usage Statistics**: Session, daily, and weekly usage tracking
- **Budget Alerts**: Warnings at 80% of daily budget
- **Savings Calculation**: Cache hit savings tracking
- **Performance Metrics**: API response times and success rates

#### Main APIs

```javascript
// Track API usage
await apiMonitoringService.trackOpenAIUsage(1500, 'gpt-4o-mini'); // tokens, model
await apiMonitoringService.trackPlacesUsage(false); // cached = false

// Get usage statistics  
const sessionStats = await apiMonitoringService.getSessionStats();
const dailyStats = await apiMonitoringService.getDailyStats('2024-01-15');
const weeklyStats = await apiMonitoringService.getWeeklyStats();

// Budget management
const budgetAlert = await apiMonitoringService.checkBudgetAlert(1.0); // $1 daily budget

// Performance tracking
await apiMonitoringService.trackAPIResponse('openai', 1200, true); // service, ms, success
```

#### Cost Structure

```javascript
const API_COSTS = {
  openai: {
    'gpt-4o-mini': {
      input: 0.00015 / 1000,   // $0.15 per 1M input tokens
      output: 0.0006 / 1000    // $0.60 per 1M output tokens
    }
  },
  places: {
    nearby_search: 0.017,      // $17 per 1K requests
    place_details: 0.017,      // $17 per 1K requests
    photos: 0.007              // $7 per 1K requests
  }
};
```

### 7. Supporting Services

#### Location History Service (`locationHistoryService.js`)

**Purpose**: Tracks recently shown locations to ensure variety and prevent repetition.

```javascript
// Track suggested location
await locationHistoryService.addLocation(place);

// Check if location was recently shown
const isRecent = await locationHistoryService.isLocationRecent(place);

// Get recent locations for filtering
const recentLocations = await locationHistoryService.getRecentLocations();

// Clear history (for testing or fresh start)
await locationHistoryService.clearHistory();
```

#### Mindful Timing Service (`mindfulTiming.js`)

**Purpose**: Provides context-aware delays and timing for peaceful user experience.

```javascript
// Get breathing-rhythm delay
const delay = mindfulTiming.getBreathingDelay();

// Context-aware timing
const loadingDelay = mindfulTiming.getContextualDelay('loading');
const transitionDelay = mindfulTiming.getContextualDelay('transition');

// Staggered animation timing
const staggerTiming = mindfulTiming.getStaggeredTiming(itemCount);
```

#### API Rate Limiter (`apiRateLimiter.js`)

**Purpose**: Prevents API rate limit violations with automatic backoff.

```javascript
// Check if request is allowed
const canProceed = await apiRateLimiter.canMakeRequest('openai');

// Track request
await apiRateLimiter.trackRequest('openai');

// Get rate limit status
const status = await apiRateLimiter.getRateLimitStatus('openai');
```

## Data Flow Architecture

### Daily Suggestion Flow

```
1. App Launch
   ↓
2. Check Daily Cache (AsyncStorage)
   ↓
3. Cache Hit → Display Cached Suggestion
   Cache Miss → Generate New Suggestion
   ↓
4. AI Task Generation (aiTaskService)
   ↓
5. Location Enrichment (suggestionService)
   ↓
6. Place Discovery (placesService)
   ↓
7. Priority Scoring & Selection
   ↓
8. Cache Result & Display
```

### Skip/Refresh Flow

```
1. User Skips
   ↓
2. Clear AI Cache (force new task)
   ↓
3. Clear Location Cache (force new places)
   ↓
4. Generate Different Task Category
   ↓
5. Fresh Location Discovery
   ↓
6. Ensure Variety (different from previous)
   ↓
7. Cache & Display New Suggestion
```

## Configuration & Environment

### Environment Variables

```bash
# OpenAI Configuration
EXPO_PUBLIC_OPENAI_API_KEY=your_openai_key_here
EXPO_PUBLIC_OPENAI_MODEL=gpt-4o-mini

# Google APIs
EXPO_PUBLIC_GOOGLE_PLACES_API_KEY=your_places_key_here
EXPO_PUBLIC_GOOGLE_MAPS_API_KEY=your_maps_key_here
```

### Service Configuration

```javascript
// environment.js configuration
const CONFIG = {
  // AI Service
  OPENAI_MODEL: 'gpt-4o-mini',
  AI_CACHE_TTL_MINUTES: 1,
  AI_RATE_LIMIT_PER_MINUTE: 60,
  
  // Places Service
  PLACES_CACHE_TTL_HOURS: 24,
  PLACES_RATE_LIMIT_PER_MINUTE: 100,
  DEFAULT_SEARCH_RADIUS: 3000,
  MAX_SEARCH_RESULTS: 20,
  
  // Location Service
  LOCATION_CACHE_TTL_MINUTES: 5,
  LOCATION_FALLBACK_CACHE_HOURS: 24,
  
  // General
  ENABLE_DEBUG_LOGS: __DEV__,
  MAX_PHOTOS_PER_PLACE: 3
};
```

## Error Handling & Fallbacks

### Service Degradation Strategy

1. **OpenAI API Failure** → Local curated tasks
2. **Google Places API Failure** → Google Maps API
3. **All Location APIs Fail** → Demo data (web) or task-only (mobile)
4. **Network Issues** → Cached data when available
5. **Permission Denied** → Continue without location features

### Error Recovery Patterns

```javascript
// Example error handling in suggestion service
try {
  const aiTask = await aiTaskService.generateZenTask(options);
  return await enrichSuggestionWithLocation(aiTask);
} catch (aiError) {
  console.warn('AI task generation failed:', aiError);
  try {
    const fallbackTask = await aiTaskService.getFallbackTask(options);
    return await enrichSuggestionWithLocation(fallbackTask);
  } catch (fallbackError) {
    console.error('All task generation failed:', fallbackError);
    return getDefaultMindfulTask();
  }
}
```

## Performance Optimization

### Caching Strategy

- **AI Tasks**: 1-minute session cache with variety bypass
- **Location Data**: 24-hour persistent cache with compression
- **GPS Coordinates**: 5-minute cache with 24-hour fallback
- **Place Photos**: Aggressive caching with size limits

### API Cost Optimization

- **Request Deduplication**: Prevents concurrent identical requests
- **Intelligent Caching**: Reduces API calls by 80-90%
- **Fallback Hierarchy**: Uses cheaper alternatives when possible
- **Token Optimization**: Minimizes OpenAI token usage

### Memory Management

- **Cleanup Routines**: Automatic cache cleanup on app background
- **Size Limits**: Maximum cache sizes to prevent memory issues
- **Compression**: GZIP compression for large cached objects

## Development & Testing

### Debug Tools

```javascript
// Service status debugging
import { debugAPIStatus } from '../services/suggestionService';
const status = await debugAPIStatus();

// Location variety analysis (dev mode only)
import LocationVarietyDebug from '../components/LocationVarietyDebug';

// API monitoring dashboard
const stats = await apiMonitoringService.getSessionStats();
console.log('API Usage:', stats);
```

### Testing Utilities

```javascript
// Mock services for testing
const mockLocationService = {
  getCurrentLocation: () => Promise.resolve(mockLocation),
  isLocationAvailable: () => Promise.resolve(true)
};

// Cache clearing for testing
await Promise.all([
  aiTaskService.clearCache(),
  placesService.clearCache(),
  locationService.clearLocationCache()
]);
```

## Security & Privacy

### Data Handling

- **Local Storage Only**: No user data transmitted to external servers
- **Anonymous API Calls**: No personal information in API requests
- **Permission Respect**: Graceful handling of denied permissions
- **No Tracking**: No analytics or user behavior tracking

### API Key Security

- **Environment Variables**: Keys stored in `.env` file
- **Client-Side Keys**: Uses public API patterns where required
- **Key Rotation**: Support for key updates without app changes

---

This comprehensive service documentation provides developers with everything needed to understand, modify, and extend the Me Time app's service architecture while maintaining its core philosophy of gentle, mindful user experiences.