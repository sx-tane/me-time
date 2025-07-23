import React, { useState, useRef, useEffect } from 'react';
import { View, Text, SafeAreaView, Animated, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { GentleButton } from '../components/GentleButton';
import { STORAGE_KEYS } from '../constants/storage';
import { getAnimationConfig } from '../utils/platformDetection';
import colors from '../constants/colors';

const steps = [
  {
    title: "Welcome to me time",
    description: "This isn't another app competing for your attention.",
    icon: "leaf-outline"
  },
  {
    title: "No streaks. No guilt.",
    description: "Use it when you want. Skip it when you don't. We'll never judge.",
    icon: "heart-outline"
  },
  {
    title: "Your pace, always",
    description: "Gentle suggestions to slow down. Take them or leave them.",
    icon: "time-outline"
  }
];

export const WelcomeScreen = ({ navigation }) => {
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const [step, setStep] = useState(0);

  useEffect(() => {
    Animated.timing(fadeAnim, getAnimationConfig({
      toValue: 1,
      duration: 1000,
      useNativeDriver: true,
    })).start();
  }, [step]);

  const completeOnboarding = async () => {
    await AsyncStorage.setItem(STORAGE_KEYS.ONBOARDING_COMPLETE, 'true');
    navigation.replace('Main');
  };

  return (
    <SafeAreaView style={styles.container}>
      <Animated.View style={[styles.welcomeContent, { opacity: fadeAnim }]}>
        <Ionicons 
          name={steps[step].icon} 
          size={80} 
          color={colors.primary} 
          style={styles.welcomeIcon}
        />
        <Text style={styles.welcomeTitle}>{steps[step].title}</Text>
        <Text style={styles.welcomeDescription}>{steps[step].description}</Text>
        
        <View style={styles.welcomeButtons}>
          {step < steps.length - 1 ? (
            <GentleButton
              title="Continue"
              onPress={() => {
                fadeAnim.setValue(0);
                setStep(step + 1);
              }}
            />
          ) : (
            <GentleButton
              title="Begin"
              onPress={completeOnboarding}
            />
          )}
        </View>
        
        <View style={styles.dots}>
          {steps.map((_, index) => (
            <View
              key={index}
              style={[
                styles.dot,
                index === step && styles.activeDot
              ]}
            />
          ))}
        </View>
      </Animated.View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
    justifyContent: 'center',
    alignItems: 'center',
  },
  welcomeContent: {
    alignItems: 'center',
    paddingHorizontal: 40,
  },
  welcomeIcon: {
    marginBottom: 30,
  },
  welcomeTitle: {
    fontSize: 32,
    fontWeight: '700',
    color: colors.text,
    textAlign: 'center',
    marginBottom: 15,
  },
  welcomeDescription: {
    fontSize: 18,
    color: colors.lightText,
    textAlign: 'center',
    lineHeight: 26,
    marginBottom: 40,
  },
  welcomeButtons: {
    marginTop: 20,
  },
  dots: {
    flexDirection: 'row',
    marginTop: 40,
  },
  dot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: '#E0E0E0',
    marginHorizontal: 5,
  },
  activeDot: {
    backgroundColor: colors.primary,
  },
});