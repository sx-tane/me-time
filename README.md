# Me Time

> A gentle app about doing less, not more.

## 🌱 Philosophy

Me Time isn't another productivity app competing for your attention. It's an invitation to slow down, breathe, and reconnect with the present moment. No streaks, no achievements, no guilt - just gentle suggestions to help you find peace in your day.

## ✨ Features

- **Gentle Onboarding**: A welcoming introduction to the app's philosophy
- **Daily Suggestions**: Mindful activities tailored to help you slow down
- **Peaceful Discovery**: Find quiet spots near you for reflection
- **No Pressure**: Skip suggestions, miss days - it's all okay
- **Clean Design**: Calming colors and smooth animations
- **Offline First**: Works without internet connection

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
   ```

3. **Start the development server**
   ```bash
   npx expo start
   ```

4. **Run on your device**
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

### First Time
1. Open the app and go through the gentle onboarding
2. Read about the app's philosophy of doing less
3. Complete the welcome flow at your own pace

### Daily Use
1. Open the app when you feel like it (no pressure!)
2. Read today's gentle suggestion
3. Follow it if it resonates, skip if it doesn't
4. Explore peaceful spots nearby if you want
5. Adjust settings as needed

### Example Suggestions
- "Find a bench you've never sat on"
- "Watch clouds for as long as feels right"
- "Notice five sounds around you"
- "Do absolutely nothing for a moment"

## 🗂️ Project Structure

```
me-time/
├── src/
│   ├── components/          # Reusable UI components
│   │   ├── GentleButton.js
│   │   ├── SuggestionCard.js
│   │   └── PlaceCard.js
│   ├── screens/             # App screens
│   │   ├── WelcomeScreen.js
│   │   ├── HomeScreen.js
│   │   ├── DiscoverScreen.js
│   │   └── SettingsScreen.js
│   ├── services/            # Business logic
│   │   └── suggestionService.js
│   ├── constants/           # App constants
│   │   ├── colors.js
│   │   ├── suggestions.js
│   │   └── storage.js
│   └── utils/               # Helper functions
├── assets/                  # Images, fonts, etc.
├── App.js                   # Main app component
├── app.json                 # Expo configuration
└── package.json            # Dependencies
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
- **Navigation**: React Navigation v6
- **Storage**: AsyncStorage
- **Icons**: Expo Vector Icons (Ionicons)
- **Permissions**: Expo Location & Notifications
- **Animations**: React Native Animated API

## 📦 Dependencies

### Core
- `expo` - Development platform
- `react-native` - Mobile framework
- `react` - UI library

### Navigation
- `@react-navigation/native`
- `@react-navigation/stack`
- `react-native-screens`
- `react-native-safe-area-context`

### Storage & Utilities
- `@react-native-async-storage/async-storage`
- `expo-location`
- `expo-notifications`
- `expo-font`
- `expo-constants`

## 🔧 Configuration

### App Settings
The app stores user preferences locally:
- Onboarding completion status
- Daily suggestion history
- Notification preferences
- Last suggestion date

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

### Phase 2 (Future)
- [ ] Real location-based suggestions
- [ ] Weather-aware activities
- [ ] More suggestion categories
- [ ] Simple journaling
- [ ] Breathing exercises

### Phase 3 (Maybe)
- [ ] Share peaceful moments
- [ ] Gentle community features
- [ ] Widget for home screen
- [ ] Apple Watch companion

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

**Build fails**
```bash
# Check Expo compatibility
npx expo doctor
```

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