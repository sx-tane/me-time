import React, { useState, useEffect } from 'react';
import { View, Text, StatusBar, StyleSheet } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import AsyncStorage from '@react-native-async-storage/async-storage';

import { WelcomeScreen } from './src/screens/WelcomeScreen';
import { HomeScreen } from './src/screens/HomeScreen';
import { DiscoverScreen } from './src/screens/DiscoverScreen';
import { SettingsScreen } from './src/screens/SettingsScreen';
import { STORAGE_KEYS } from './src/constants/storage';
import colors from './src/constants/colors';

const Stack = createStackNavigator();

const MainStack = () => (
  <Stack.Navigator
    screenOptions={{
      headerStyle: {
        backgroundColor: colors.background,
        elevation: 0,
        shadowOpacity: 0,
        borderBottomWidth: 0,
      },
      headerTintColor: colors.text,
      headerTitleStyle: {
        fontWeight: '600',
      },
    }}
  >
    <Stack.Screen 
      name="Home" 
      component={HomeScreen}
      options={{ headerShown: false }}
    />
    <Stack.Screen 
      name="Discover" 
      component={DiscoverScreen}
      options={{ 
        title: '',
        headerBackTitle: 'Back'
      }}
    />
    <Stack.Screen 
      name="Settings" 
      component={SettingsScreen}
      options={{ 
        title: '',
        headerBackTitle: 'Back'
      }}
    />
  </Stack.Navigator>
);

export default function App() {
  const [isLoading, setIsLoading] = useState(true);
  const [showOnboarding, setShowOnboarding] = useState(false);

  useEffect(() => {
    checkOnboarding();
  }, []);

  const checkOnboarding = async () => {
    try {
      const completed = await AsyncStorage.getItem(STORAGE_KEYS.ONBOARDING_COMPLETE);
      setShowOnboarding(completed !== 'true');
    } catch (error) {
      setShowOnboarding(true);
    } finally {
      setIsLoading(false);
    }
  };

  if (isLoading) {
    return (
      <View style={styles.loadingContainer}>
        <Text style={styles.loadingText}>Taking a breath...</Text>
      </View>
    );
  }

  return (
    <NavigationContainer>
      <StatusBar barStyle="dark-content" backgroundColor={colors.background} />
      <Stack.Navigator screenOptions={{ headerShown: false }}>
        {showOnboarding ? (
          <Stack.Screen name="Welcome" component={WelcomeScreen} />
        ) : null}
        <Stack.Screen name="Main" component={MainStack} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}

const styles = StyleSheet.create({
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: colors.background,
  },
  loadingText: {
    fontSize: 18,
    color: colors.lightText,
  },
});