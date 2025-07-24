# Me Time

> A gentle app about doing less, not more.

## 🌱 Philosophy

Me Time isn't another productivity app competing for your attention. It's an invitation to slow down, breathe, and reconnect with the present moment. No streaks, no achievements, no guilt - just gentle suggestions to help you find peace in your day.

## ✨ Features

- **AI-Powered Suggestions**: OpenAI GPT-4o-mini generates personalized mindful activities
- **Location-Based Discovery**: Find multiple peaceful spots nearby using Google Places API
- **Gentle Notifications**: Optional daily reminders at customizable times (9am, 3pm, 8pm)
- **Smart Caching**: 24hr intelligent caching for faster performance and reduced API costs
- **Time-Aware Activities**: 14 activity categories adapt to time of day and context
- **Location Variety System**: Advanced scoring prevents repetitive location suggestions
- **Visual Place Cards**: Rich photos, ratings, hours, and contact details
- **No Pressure**: Skip suggestions, miss days - it's all okay
- **Clean Design**: Calming colors, mindful animations, breathing-rhythm timing
- **Hybrid Mode**: Works with or without API keys, graceful fallbacks to curated content
- **Privacy Focused**: Local storage only, no tracking or user data collection
- **Cost Optimized**: Built-in API monitoring and budget management

## 🎯 Core Values

- **Liberation over productivity**: Do less, not more
- **Presence over achievement**: Be here now
- **Compassion over judgment**: It's okay to not be okay
- **Simplicity over complexity**: Just breathe

## 🚀 Getting Started

### Prerequisites

- Node.js (v16 or higher)
- npm or yarn
- Expo CLI
- Expo Go app on your mobile device

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/yourusername/me-time.git
   cd me-time
   ```

2. **Install dependencies**
   ```bash
   npm install
   # or
   yarn install
   ```

3. **Configure API Keys**
   
   Copy the example environment file:
   ```bash
   cp .env.example .env
   ```
   
   Then edit `.env` and add your API keys:
   
   - **Google Places API Key** (Required for location features):
     - Get it from [Google Cloud Console](https://console.cloud.google.com/apis/)
     - Enable "Places API (New)" for best results
     - Add to `.env`: `EXPO_PUBLIC_GOOGLE_PLACES_API_KEY=your_key_here`
   
   - **Google Maps API Key** (Legacy fallback support):
     - Same console as above, enable "Maps JavaScript API"
     - Add to `.env`: `EXPO_PUBLIC_GOOGLE_MAPS_API_KEY=your_key_here`
     - App automatically falls back to this if New Places API fails
   
   - **OpenAI API Key** (Highly recommended for personalized experience):
     - Get it from [OpenAI Platform](https://platform.openai.com/api-keys)
     - Add to `.env`: `EXPO_PUBLIC_OPENAI_API_KEY=your_key_here`
     - Model: `EXPO_PUBLIC_OPENAI_MODEL=gpt-4o-mini` (cost-optimized)
     - Enables AI-generated, time-aware, personalized activities across 14 categories
     - Without this key, app uses smart fallback tasks with local generation
     - Estimated cost: ~$0.15 per 1,000 suggestions (very affordable)

4. **Start the development server**
   ```bash
   npx expo start
   ```

5. **Run on your device**
   - Download the Expo Go app on your phone
   - Scan the QR code displayed in your terminal
   - The app will load on your device

### Alternative Running Methods

```bash
# Run on iOS Simulator (macOS only)
npx expo start --ios

# Run on Android Emulator
npx expo start --android

# Run in web browser
npx expo start --web

# Clear cache and restart
npx expo start --clear
```

## 📱 How to Use

### First Launch
1. Open the app - no onboarding, just gentle introduction
2. Grant location permission (optional) for nearby place suggestions
3. Enable notifications (optional) for gentle daily reminders
4. Start with your first AI-generated mindful suggestion

### Daily Use
1. **Open anytime** (no pressure, no streaks!)
2. **Read today's suggestion** - AI-generated and tailored to time of day
3. **Explore nearby spots** - 3-5 relevant locations with photos and details
4. **Follow or skip** - it's all okay, your choice entirely
5. **Skip for variety** - get a different task category and fresh locations
6. **Adjust settings** - notification times, cache clearing

### Notification Experience
- **Gentle reminders**: "Time to breathe. No rush."
- **Customizable times**: Default 9am, 3pm, 8pm (fully adjustable)
- **No sound**: Peaceful visual-only notifications
- **Easy disable**: Turn off anytime in settings

### Example AI-Generated Suggestions

**Morning (9am)**:
- "Visit a nearby café and practice mindful observation of morning routines" (3-5 café options)
- "Find a quiet park spot for 5 minutes of gratitude reflection" (nearby parks with photos)

**Afternoon (3pm)**:
- "Take a gentle walk through a local museum, focusing on one exhibit" (museum locations)
- "Practice mindful breathing in a library's peaceful corner" (library options with hours)

**Evening (8pm)**:
- "Find a cozy bookstore and read poetry for 10 minutes" (bookstore suggestions)
- "Sit by a window in a quiet café and watch the world slow down" (evening-friendly venues)

**14 Activity Categories**: mindful, sensory, movement, reflection, discovery, rest, creative, nature, social, connection, learning, play, service, gratitude

## 🗂️ Project Structure

```
me-time/
├── src/
│   ├── components/          # Reusable UI components
│   │   ├── GentleButton.js         # Mindful button interactions
│   │   ├── ChillButton.js          # Alternative button style
│   │   ├── SuggestionCard.js       # Daily suggestion display
│   │   ├── LocationSuggestionCard.js # Location-enriched suggestions
│   │   ├── GentleTimePicker.js     # Notification time picker
│   │   ├── SettingsScreen.js       # App configuration
│   │   ├── MindfulContainer.js     # Animated content wrapper
│   │   ├── PeacefulLoader.js       # Calming loading animations
│   │   ├── StepByStepLoader.js     # Progressive loading states
│   │   └── LocationVarietyDebug.js # Development variety analysis
│   ├── services/            # Core business logic
│   │   ├── aiTaskService.js           # OpenAI GPT-4o-mini integration
│   │   ├── suggestionService.js       # AI + location orchestration
│   │   ├── placesService.js           # Google Places API v1 + fallbacks
│   │   ├── locationService.js         # GPS, permissions, caching
│   │   ├── notificationService.js     # Gentle daily reminders
│   │   ├── locationHistoryService.js  # Prevent repetitive suggestions
│   │   ├── apiMonitoringService.js    # Cost tracking and budgets
│   │   └── mindfulTiming.js           # Breathing-rhythm animations
│   ├── config/              # Environment configuration
│   │   └── environment.js
│   ├── constants/           # App constants
│   │   ├── colors.js               # Calming color palette
│   │   ├── suggestions.js          # Fallback mindful tasks
│   │   └── storage.js              # AsyncStorage keys
│   └── utils/               # Helper functions
│       ├── aiResponseParser.js     # Robust AI response parsing
│       ├── apiRateLimiter.js       # API rate limiting protection
│       ├── clearAllCache.js        # Cache management utilities
│       ├── locationVariety.js      # Location diversity algorithms
│       ├── logger.js               # Mindful logging system
│       ├── mindfulAnimations.js    # Gentle animation helpers
│       └── platformDetection.js    # Web/mobile platform detection
├── docs/                    # Documentation
│   ├── API.md                      # API configuration guide
│   └── LOCATION_FEATURES.md        # Location services documentation
├── assets/                  # Images, fonts, etc.
├── App.js                   # Main app orchestrator
├── app.json                 # Expo configuration
└── package.json            # Dependencies and scripts
```

## 🎨 Design System

### Colors
- **Background**: `#FAF9F6` - Warm off-white
- **Primary**: `#8B7355` - Earthy brown
- **Secondary**: `#556B2F` - Sage green
- **Text**: `#3C3C3C` - Soft black
- **Light Text**: `#7C7C7C` - Gentle gray
- **Card**: `#FFFFFF` - Pure white
- **Accent**: `#D4A574` - Warm beige

### Typography
- **Headings**: Bold, clear, calming
- **Body**: Easy to read, comfortable spacing
- **Labels**: Gentle, non-demanding

## 🛠️ Technology Stack

- **Framework**: React Native with Expo
- **AI Integration**: OpenAI API for personalized suggestions
- **Location Services**: Google Places API (New) with legacy fallback
- **Navigation**: React Navigation v6
- **Storage**: AsyncStorage with intelligent caching
- **Icons**: Expo Vector Icons (Ionicons)
- **Permissions**: Expo Location & Notifications
- **Animations**: React Native Animated API with mindful timing

## 📦 Dependencies

### Core
- `expo` - Development platform
- `react-native` - Mobile framework
- `react` - UI library

### UI & Experience
- `react-native-safe-area-context` - Safe area handling
- Custom gentle animations and mindful timing
- Breathing-rhythm loading states
- Calming color palette and typography

### Core Services
- `@react-native-async-storage/async-storage` - Local storage with 24hr caching
- `expo-location` - Location permissions and GPS with smart caching
- `expo-notifications` - Gentle daily reminders system
- `openai` - GPT-4o-mini integration for task generation

### External APIs
- **Google Places API (New v1)** - Primary location data source
- **Google Maps API** - Legacy fallback for places
- **OpenAI API** - AI-generated personalized suggestions with cost optimization

### Additional Features
- `expo-font` - Typography system
- `expo-constants` - Environment configuration
- Built-in API monitoring and budget management
- Advanced location variety algorithms
- Intelligent caching with compression

## 🔧 Configuration

### App Settings & Storage
The app stores user preferences and data locally with privacy focus:
- **Daily Suggestions**: Cached with 24hr TTL, cleared on skip for variety
- **Notification Preferences**: Custom times (default: 9am, 3pm, 8pm)
- **Location Data**: 24hr cached with compression, 5min GPS cache
- **AI Task Cache**: 1-minute session cache with variety enforcement
- **API Cost Tracking**: Session and daily usage monitoring
- **Location History**: Recent suggestions tracked to prevent repetition
- **User Privacy**: No personal data collection, all storage local-only

### Permissions
- **Location** (optional): To find peaceful spots nearby
- **Notifications** (optional): For gentle daily reminders

## 🚀 Building for Production

### Development Build
```bash
eas build --platform all --profile development
```

### Preview Build
```bash
eas build --platform all --profile preview
```

### Production Build
```bash
eas build --platform all --profile production
```

### App Store Submission
```bash
eas submit --platform ios
eas submit --platform android
```

## 🤝 Contributing

This app is about simplicity and peace. If you'd like to contribute:

1. Fork the repository
2. Create a gentle feature branch
3. Make thoughtful changes
4. Test thoroughly
5. Submit a compassionate pull request

### Contribution Guidelines
- Keep the philosophy of "doing less"
- Maintain the calming design
- Ensure accessibility
- Write clear, simple code
- Test on real devices

## 📝 Roadmap

### Phase 1 (Current)
- [x] Basic app structure
- [x] Daily suggestions
- [x] Onboarding flow
- [x] Settings screen
- [x] Local storage

### Phase 2 (Current Implementation)
- [x] Real location-based suggestions with Google Places API v1
- [x] AI-powered personalized activities (GPT-4o-mini)
- [x] Time-aware suggestions across 14 activity categories
- [x] Multiple location suggestions with advanced variety algorithms
- [x] Smart caching (24hr) and offline support
- [x] Rich visual place cards with photos, ratings, hours
- [x] Gentle notification system with customizable times
- [x] API cost monitoring and budget management
- [x] Location variety system preventing repetitive suggestions
- [x] Enhanced task-location matching with priority scoring
- [ ] Weather-aware activities integration
- [ ] Simple mood journaling
- [ ] Guided breathing exercises

### Phase 3 (Future)
- [ ] Enhanced AI with conversation memory
- [ ] Weather-integrated suggestions
- [ ] Share peaceful moments
- [ ] Gentle community features
- [ ] Widget for home screen
- [ ] Apple Watch companion
- [ ] Voice-guided activities

## 🐛 Troubleshooting

### Common Issues

**Metro bundler not starting**
```bash
npx expo start --clear
```

**Dependencies out of sync**
```bash
npx expo install --fix
```

**Cache issues**
```bash
npx expo start --clear
rm -rf node_modules
npm install
```

**API Issues**
```bash
# Built-in API debugging and monitoring
# Check console for detailed API status logs
# Location not working: Check location permissions and API keys
# AI suggestions not generating: Verify OpenAI API key and credits
# Places not loading: Check Google Places API key, quotas, and billing
# Cost monitoring: Check API usage in app logs
# Rate limiting: Built-in protection, check console for limits
```

**Location Services Not Working**
- Ensure location permissions are granted
- Check that Google Places API key is valid
- Verify Places API is enabled in Google Cloud Console
- The app will show demo data on web if APIs aren't configured

**AI Suggestions Not Generating**
- Verify OpenAI API key is valid and has credits
- Check console logs for AI service errors
- App will gracefully fall back to curated suggestions

**Build fails**
```bash
# Check Expo compatibility
npx expo doctor
```

## 📚 Additional Documentation

- **[API Configuration Guide](docs/API.md)** - Detailed setup for OpenAI GPT-4o-mini and Google Places APIs with cost optimization
- **[Location Features Documentation](docs/LOCATION_FEATURES.md)** - Complete guide to location-based suggestions, variety algorithms, and privacy
- **[Service Architecture Documentation](docs/SERVICES.md)** - Comprehensive guide to all app services and APIs

## 📄 License

This project is open source and available under the [MIT License](LICENSE).

## 💫 Philosophy in Code

This app embodies its philosophy in every line of code:
- Simple, clean architecture
- Gentle error handling
- Respectful of user's time and attention
- No tracking or analytics
- Offline-first approach
- Accessible design

## 🙏 Acknowledgments

Inspired by the slow living movement, mindfulness practices, and the belief that technology should serve humanity's need for peace, not productivity.

---

*Remember: It's okay to skip using this app. It's okay to uninstall it. It's okay to not be okay. You're doing enough.*