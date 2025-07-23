import React, { useRef, useEffect, useState } from 'react';
import { View, Text, Animated, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import MindfulContainer from './MindfulContainer';
import ChillButton from './ChillButton';
import { MindfulAnimations, MINDFUL_TIMINGS } from '../utils/mindfulAnimations';
import { contemplate, MINDFUL_DELAYS } from '../services/mindfulTiming';
import { getAnimationConfig, getShadowStyles } from '../utils/platformDetection';
import colors from '../constants/colors';

export const SuggestionCard = ({ suggestion, onSkip, skipLoading = false }) => {
  const scaleAnim = useRef(new Animated.Value(0.9)).current;
  const iconBreathAnim = useRef(new Animated.Value(1)).current;
  const [isContemplating, setIsContemplating] = useState(false);

  useEffect(() => {
    // Reset scale for entrance animation
    scaleAnim.setValue(0.9);
    
    // Gentle entrance animation
    const scaleAnimation = Animated.timing(scaleAnim, getAnimationConfig({
      toValue: 1,
      duration: MINDFUL_TIMINGS.gentle.slow,
      easing: require('react-native').Easing.bezier(0.25, 0.46, 0.45, 0.94),
      useNativeDriver: true,
    }));
    
    scaleAnimation.start();

    // Start gentle breathing animation for the icon
    const breathingAnimation = MindfulAnimations.createBreathingAnimation(iconBreathAnim, {
      inhaleScale: 1.08,
      exhaleScale: 1.0,
      inhaleTime: 3500,
      holdTime: 800,
      exhaleTime: 4500,
      pauseTime: 1500,
    });
    
    breathingAnimation.start();

    return () => {
      // Proper cleanup for both animations
      scaleAnimation.stop && scaleAnimation.stop();
      breathingAnimation.stop && breathingAnimation.stop();
      iconBreathAnim.stopAnimation && iconBreathAnim.stopAnimation();
    };
  }, [suggestion]);

  const handleContemplativeSkip = async () => {
    if (isContemplating) return;
    
    setIsContemplating(true);
    
    // Give user a moment to contemplate the decision
    await contemplate(MINDFUL_DELAYS.thoughtfulAction, 'considering_skip');
    
    if (onSkip) {
      onSkip();
    }
    
    // Brief pause before allowing next interaction
    setTimeout(() => {
      setIsContemplating(false);
    }, MINDFUL_DELAYS.acknowledgment);
  };

  return (
    <MindfulContainer fadeIn slideIn delay={0} style={styles.cardContainer}>
      <Animated.View style={[
        styles.suggestionCard,
        { transform: [{ scale: scaleAnim }] }
      ]}>
        {/* Breathing icon */}
        <Animated.View style={[
          styles.iconContainer,
          { transform: [{ scale: iconBreathAnim }] }
        ]}>
          <Ionicons 
            name={suggestion.icon || 'heart-outline'} 
            size={48} 
            color={colors.primary} 
          />
        </Animated.View>

        {/* Spacious text layout */}
        <View style={styles.textContainer}>
          <Text style={styles.suggestionText}>
            {suggestion.text || suggestion.title}
          </Text>
          
          {suggestion.description && (
            <Text style={styles.suggestionDescription}>
              {suggestion.description}
            </Text>
          )}
          
          {suggestion.type && (
            <Text style={styles.suggestionType}>
              A {suggestion.type} moment
            </Text>
          )}
          
          {suggestion.timeEstimate && (
            <Text style={styles.timeEstimate}>
              {suggestion.timeEstimate}
            </Text>
          )}
        </View>

        {/* Contemplative skip button */}
        <View style={styles.actionContainer}>
          <ChillButton
            title={skipLoading ? "Finding a new moment..." : isContemplating ? "Contemplating..." : "Perhaps another time"}
            onPress={handleContemplativeSkip}
            variant="zen"
            size="medium"
            disabled={isContemplating || skipLoading}
            contemplativePress={true}
            style={styles.skipButton}
          />
        </View>
      </Animated.View>
    </MindfulContainer>
  );
};

const styles = StyleSheet.create({
  cardContainer: {
    marginVertical: 8,
  },
  suggestionCard: {
    backgroundColor: colors.card,
    borderRadius: 24,
    padding: 36,
    alignItems: 'center',
    ...getShadowStyles({
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 4 },
      shadowOpacity: 0.08,
      shadowRadius: 16,
      elevation: 6,
    }),
    minHeight: 280,
    justifyContent: 'space-between',
  },
  iconContainer: {
    marginBottom: 24,
    padding: 16,
    backgroundColor: colors.primary + '10',
    borderRadius: 50,
    alignItems: 'center',
    justifyContent: 'center',
  },
  textContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 12,
    marginVertical: 16,
  },
  suggestionText: {
    fontSize: 24,
    fontWeight: '600',
    color: colors.text,
    textAlign: 'center',
    lineHeight: 36,
    letterSpacing: -0.3,
    marginBottom: 12,
  },
  suggestionDescription: {
    fontSize: 16,
    color: colors.lightText,
    textAlign: 'center',
    lineHeight: 24,
    marginBottom: 16,
    paddingHorizontal: 8,
    fontWeight: '400',
  },
  suggestionType: {
    fontSize: 16,
    color: colors.lightText,
    marginBottom: 6,
    fontWeight: '400',
  },
  timeEstimate: {
    fontSize: 14,
    color: colors.primary,
    fontWeight: '500',
    backgroundColor: colors.primary + '15',
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: 12,
    overflow: 'hidden',
  },
  actionContainer: {
    marginTop: 20,
    width: '100%',
    alignItems: 'center',
  },
  skipButton: {
    minWidth: 200,
  },
});