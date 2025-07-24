# API Documentation

This document outlines the external APIs used by the Me Time app and how to configure them.

## Overview

Me Time integrates with several external APIs to provide personalized, location-aware mindful activities:

- **OpenAI API**: Generates personalized mindful tasks based on time of day and user context
- **Google Places API (New)**: Primary source for nearby location data with rich details
- **Google Maps API**: Legacy fallback for location data when New Places API fails

## API Configuration

### Environment Variables

All API keys are configured through environment variables in your `.env` file:

```bash
# OpenAI API (Highly Recommended)
EXPO_PUBLIC_OPENAI_API_KEY=your_openai_api_key_here
EXPO_PUBLIC_OPENAI_MODEL=gpt-4o-mini

# Google Places API (Required for location features)
EXPO_PUBLIC_GOOGLE_PLACES_API_KEY=your_new_places_api_key_here

# Google Maps API (Legacy fallback)
EXPO_PUBLIC_GOOGLE_MAPS_API_KEY=your_maps_api_key_here
```

### Configuration Details

The app uses environment-specific configuration in `src/config/environment.js`:

```javascript
{
  OPENAI_MODEL: 'gpt-4o-mini',           // Cost-effective AI model
  CACHE_TTL_HOURS: 24,                   // Cache duration for places data
  MAX_PHOTOS_PER_PLACE: 3,               // Photo limit per location
  DEFAULT_SEARCH_RADIUS: 3000,           // 3km default search radius
  MAX_SEARCH_RESULTS: 20,                // Maximum places returned
  ENABLE_DEBUG_LOGS: true/false          // Debug logging (dev/prod)
}
```

## OpenAI API Integration

### Purpose
Generates personalized, time-aware mindful activities across 14 activity categories that adapt to morning, afternoon, or evening contexts.

### Setup
1. Get an API key from [OpenAI Platform](https://platform.openai.com/api-keys)
2. Add to `.env`: `EXPO_PUBLIC_OPENAI_API_KEY=your_key_here`
3. Add model: `EXPO_PUBLIC_OPENAI_MODEL=gpt-4o-mini`
4. Ensure you have available credits in your OpenAI account

### Usage
- **Service**: `src/services/aiTaskService.js`
- **Model**: gpt-4o-mini (cost-optimized)
- **Features**:
  - Time-aware task generation (morning/afternoon/evening)
  - 14 activity categories (mindful, sensory, movement, reflection, discovery, rest, creative, nature, social, connection, learning, play, service, gratitude)
  - Location-context integration with priority scoring
  - Scenario-based task generation (work_break, commute, waiting, etc.)
  - Smart caching (1-minute TTL) with variety enforcement
  - Fallback to curated tasks if API fails

### Example API Calls
```javascript
// Basic task generation
const aiSuggestion = await aiTaskService.generateZenTask({
  timeOfDay: 'morning',
  mood: 'peaceful',
  activityLevel: 'gentle',
  weather: 'sunny',
  season: 'spring'
});

// Location-specific tasks
const locationTasks = await aiTaskService.generateTasksForLocation(
  place,
  ['mindful', 'zen'],
  3
);

// Scenario-based tasks
const workBreakTask = await aiTaskService.generateScenarioBasedTask(
  'work_break',
  { duration: 10 }
);
```

### Cost Optimization
- Uses gpt-4o-mini (~$0.15 per 1,000 suggestions)
- Built-in API monitoring and budget tracking
- 1-minute intelligent caching reduces API calls by 80%
- Graceful fallbacks to reduce unnecessary requests
- Token optimization for minimal usage

## Google Places API (New)

### Purpose
Primary source for rich location data including photos, ratings, hours, and contact information.

### Setup
1. Go to [Google Cloud Console](https://console.cloud.google.com/apis/)
2. Enable "Places API (New)"
3. Create API key and add to `.env`: `EXPO_PUBLIC_GOOGLE_PLACES_API_KEY=your_key_here`

### Features
- **Rich Data**: Photos, ratings, hours, phone numbers, websites
- **Type Filtering**: Searches by place categories with priority scoring
- **Distance-based**: Progressive search (1km → 1.5km → 2.5km) until results found
- **Comprehensive**: Returns detailed place information with location variety algorithms
- **Smart Caching**: 24-hour TTL with compression
- **Demo Mode**: Works on web without API keys using sample data

### Supported Place Types
```javascript
const placeTypes = [
  'park', 'garden', 'spa', 'cafe', 'restaurant', 'museum', 
  'library', 'tourist_attraction', 'art_gallery', 'shopping_mall',
  'fitness_center', 'botanical_garden', 'book_store', 'church',
  'hospital', 'pharmacy', 'bank', 'school', 'university'
];
```

### Service Implementation
- **Service**: `src/services/placesService.js`
- **Caching**: 24-hour TTL with compression and smart cache keys
- **Error Handling**: Automatic fallback to Google Maps API
- **Rate Limiting**: 100 requests/minute with built-in request deduplication
- **Cost Tracking**: Built-in API usage monitoring (~$0.017 per request)

## Google Maps API (Legacy)

### Purpose
Fallback option when Google Places API (New) fails or returns insufficient data.

### Setup
1. Go to [Google Cloud Console](https://console.cloud.google.com/apis/)
2. Enable "Maps JavaScript API"
3. Add to `.env`: `EXPO_PUBLIC_GOOGLE_MAPS_API_KEY=your_key_here`

### Features
- **Backup Service**: Automatically used when New Places API fails
- **Basic Data**: Name, address, rating, basic location info
- **Wide Compatibility**: Works with older Google infrastructure

## Notification System Integration

### Purpose
Provides gentle daily reminders for mindful activities without pressure or anxiety.

### Setup
- Uses `expo-notifications ~0.31.4`
- No additional API keys required
- User permission requested gracefully

### Features
- **Three Daily Notifications**: Morning (9am), afternoon (3pm), evening (8pm)
- **Customizable Times**: User can adjust in settings
- **Gentle Messaging**: Soft, encouraging reminder text
- **No Sound**: Visual-only notifications for peaceful experience
- **Smart Scheduling**: Uses `Notifications.SchedulableTriggerInputTypes.DAILY`

### Implementation
```javascript
// Service: src/services/notificationService.js
await notificationService.scheduleAllNotifications();

// Custom times
await notificationService.setNotificationTimes({
  morning: { hour: 8, minute: 30 },
  afternoon: { hour: 14, minute: 0 },
  evening: { hour: 19, minute: 30 }
});
```

## API Error Handling

### Graceful Degradation
The app handles API failures gracefully:

1. **OpenAI Failure**: Falls back to curated mindful tasks from 14 categories
2. **Places API Failure**: Falls back to Google Maps API
3. **All Location APIs Fail**: Shows demo locations on web, basic functionality on mobile
4. **Network Issues**: Uses cached data when available (24hr places, 5min location)
5. **Notification Issues**: Continues without notifications, user can retry

### Debug Tools
Built-in debugging and monitoring utilities:

```javascript
import { debugAPIStatus } from '../services/suggestionService';
import { apiMonitoringService } from '../services/apiMonitoringService';

// Check all API statuses
const status = await debugAPIStatus();
console.log('API Status:', status);

// Check API usage and costs
const usage = await apiMonitoringService.getSessionStats();
console.log('API Usage:', usage);
```

### Error Messages
- Clear user feedback for missing API keys with setup instructions
- Comprehensive console logging for debugging
- Fallback content maintains full user experience
- Budget alerts at 80% of daily limits

## Caching Strategy

### Places Data Caching
- **Duration**: 24 hours TTL
- **Storage**: AsyncStorage with compression
- **Benefits**: Faster loading, reduced API costs, offline capability

### AI Task Caching
- **Session-based**: Caches during user session
- **Clearable**: Can be cleared for fresh suggestions
- **Smart**: Avoids duplicate task generation

### Cache Management
```javascript
import { clearAllCache } from '../utils/clearAllCache';

// Clear all cached data
await clearAllCache();
```

## Platform Considerations

### Web Platform
- Uses demo data if API keys are missing
- Detects web environment automatically
- Provides realistic sample locations for testing

### Mobile Platform
- Full API integration
- Location permissions required
- Real-time location-based suggestions

## Cost Management

### API Usage Optimization
1. **Intelligent Caching**: Reduces duplicate requests
2. **Request Deduplication**: Prevents concurrent identical requests
3. **Fallback Hierarchy**: Uses cheaper alternatives when possible
4. **Batch Processing**: Minimizes individual API calls

### Recommended Quotas & Costs
- **OpenAI**: $5-10/month for personal use (~3,000-6,000 suggestions)
- **Google Places**: 1000 requests/day (~$17/month) sufficient for most users
- **Google Maps**: Used only as fallback, minimal usage expected
- **Total estimated monthly cost**: $20-30 for active daily usage
- **Built-in monitoring**: Budget alerts and usage tracking included

## API Keys Security

### Best Practices
- Store keys in `.env` file (never commit to repository)
- Use `EXPO_PUBLIC_` prefix for client-side keys
- Different keys for development/production environments
- Regular key rotation for production apps

### Environment Setup
```bash
# Copy example file
cp .env.example .env

# Edit with your actual API keys
nano .env
```

## Troubleshooting

### Common Issues

**OpenAI API not working:**
- Check API key validity and credits
- Verify model availability (gpt-4o-mini)
- Check console for detailed error messages

**Location services not working:**
- Verify both Google API keys are set
- Check that required APIs are enabled in Google Cloud Console
- Ensure location permissions are granted on device
- Check API quotas and billing in Google Cloud Console

**Demo data showing instead of real places:**
- Usually indicates missing or invalid Google API keys
- Check console logs for specific error messages
- Verify API keys have proper permissions

### Debug Commands
```javascript
// Check API configuration
const config = await debugAPIStatus();

// Clear all caches
await clearAllCache();

// Test location services
const location = await locationService.getCurrentLocation();
```

## Development Tips

### Testing APIs
1. Start with OpenAI API for personalized suggestions
2. Add Google Places API for rich location data
3. Test fallback behavior by temporarily disabling APIs
4. Monitor console logs for API status and errors

### Local Development
- Use development configuration with debug logging enabled
- Test both with and without API keys to verify fallbacks
- Use cache clearing during development for fresh data

### Production Deployment
- Disable debug logging in production
- Implement proper error monitoring
- Set up API quota alerts in Google Cloud Console
- Monitor OpenAI usage and costs