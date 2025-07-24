import React, { useRef, useEffect, useState } from 'react';
import { View, Text, Animated, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import MindfulContainer from './MindfulContainer';
import ChillButton from './ChillButton';
import { MindfulAnimations, MINDFUL_TIMINGS } from '../utils/mindfulAnimations';
import { contemplate, MINDFUL_DELAYS } from '../services/mindfulTiming';
import { getAnimationConfig, getShadowStyles } from '../utils/platformDetection';
import colors, { ROUNDED_DESIGN } from '../constants/colors';

export const SuggestionCard = ({ suggestion, onSkip, skipLoading = false, loadingStage = null }) => {
  const scaleAnim = useRef(new Animated.Value(0.9)).current;
  const iconBreathAnim = useRef(new Animated.Value(1)).current;
  const [isContemplating, setIsContemplating] = useState(false);

  // Debug log for loading states
  console.log('🎯 SuggestionCard render - skipLoading:', skipLoading, 'loadingStage:', loadingStage);

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
    if (isContemplating || skipLoading) {
      console.log('🚫 Skip blocked - isContemplating:', isContemplating, 'skipLoading:', skipLoading);
      return;
    }
    
    console.log('✅ Starting contemplative skip');
    setIsContemplating(true);
    
    // Give user a moment to contemplate the decision
    await contemplate(MINDFUL_DELAYS.thoughtfulAction, 'considering_skip');
    
    if (onSkip) {
      console.log('🔄 Calling onSkip function');
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
            {suggestion?.text || suggestion?.title || ''}
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
            title={
              skipLoading 
                ? (loadingStage === 'generating' 
                    ? "🤖 AI is creating your new moment..." 
                    : loadingStage === 'locations' 
                      ? "🗺️ Finding peaceful nearby spots..." 
                      : loadingStage === 'finalizing'
                        ? "✨ Preparing everything for you..."
                        : "🔄 Finding a fresh moment for you...")
                : isContemplating 
                  ? "Contemplating..." 
                  : "Perhaps another time"
            }
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
    marginVertical: ROUNDED_DESIGN.spacing.gentle,
    marginHorizontal: ROUNDED_DESIGN.spacing.minimal,
  },
  suggestionCard: {
    backgroundColor: colors.card,
    borderRadius: ROUNDED_DESIGN.radius.flowing,
    padding: ROUNDED_DESIGN.spacing.generous,
    paddingVertical: ROUNDED_DESIGN.spacing.expansive,
    alignItems: 'center',
    ...ROUNDED_DESIGN.shadows.soft,
    minHeight: 320,
    justifyContent: 'space-between',
    borderWidth: 1,
    borderColor: colors.border,
  },
  iconContainer: {
    marginBottom: ROUNDED_DESIGN.spacing.spacious,
    padding: ROUNDED_DESIGN.spacing.comfortable,
    backgroundColor: colors.accent + '20',
    borderRadius: ROUNDED_DESIGN.radius.organic,
    alignItems: 'center',
    justifyContent: 'center',
    ...ROUNDED_DESIGN.shadows.gentle,
  },
  textContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: ROUNDED_DESIGN.spacing.comfortable,
    marginVertical: ROUNDED_DESIGN.spacing.comfortable,
  },
  suggestionText: {
    fontSize: 26,
    fontWeight: '500',
    color: colors.text,
    textAlign: 'center',
    lineHeight: 38,
    letterSpacing: -0.2,
    marginBottom: ROUNDED_DESIGN.spacing.comfortable,
    fontFamily: 'System',
  },
  suggestionDescription: {
    fontSize: 17,
    color: colors.lightText,
    textAlign: 'center',
    lineHeight: 26,
    marginBottom: ROUNDED_DESIGN.spacing.comfortable,
    paddingHorizontal: ROUNDED_DESIGN.spacing.gentle,
    fontWeight: '300',
  },
  suggestionType: {
    fontSize: 16,
    color: colors.lightText,
    marginBottom: 6,
    fontWeight: '400',
  },
  timeEstimate: {
    fontSize: 14,
    color: colors.accent,
    fontWeight: '500',
    backgroundColor: colors.accent + '20',
    paddingHorizontal: ROUNDED_DESIGN.spacing.comfortable,
    paddingVertical: ROUNDED_DESIGN.spacing.gentle,
    borderRadius: ROUNDED_DESIGN.radius.organic,
    overflow: 'hidden',
  },
  actionContainer: {
    marginTop: ROUNDED_DESIGN.spacing.comfortable,
    width: '100%',
    alignItems: 'center',
  },
  skipButton: {
    minWidth: 200,
  },
});