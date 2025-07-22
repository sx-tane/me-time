import React, { useRef, useEffect } from 'react';
import { View, Text, Animated, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { GentleButton } from './GentleButton';
import colors from '../constants/colors';

export const SuggestionCard = ({ suggestion, onSkip }) => {
  const scaleAnim = useRef(new Animated.Value(0.9)).current;

  useEffect(() => {
    Animated.spring(scaleAnim, {
      toValue: 1,
      friction: 8,
      tension: 40,
      useNativeDriver: true,
    }).start();
  }, []);

  return (
    <Animated.View style={[
      styles.suggestionCard,
      { transform: [{ scale: scaleAnim }] }
    ]}>
      <Ionicons 
        name={suggestion.icon} 
        size={40} 
        color={colors.primary} 
        style={styles.suggestionIcon}
      />
      <Text style={styles.suggestionText}>{suggestion.text}</Text>
      <Text style={styles.suggestionType}>A {suggestion.type} moment</Text>
      <GentleButton
        title="Maybe another time"
        onPress={onSkip}
        variant="ghost"
        style={{ marginTop: 20 }}
      />
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  suggestionCard: {
    backgroundColor: colors.card,
    borderRadius: 20,
    padding: 30,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 10,
    elevation: 3,
  },
  suggestionIcon: {
    marginBottom: 20,
  },
  suggestionText: {
    fontSize: 22,
    fontWeight: '600',
    color: colors.text,
    textAlign: 'center',
    lineHeight: 32,
  },
  suggestionType: {
    fontSize: 14,
    color: colors.lightText,
    marginTop: 10,
  },
});