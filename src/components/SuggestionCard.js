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
            size={36} 
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
    marginVertical: ROUNDED_DESIGN.spacing.spacious,
    marginHorizontal: ROUNDED_DESIGN.spacing.comfortable,
  },
  suggestionCard: {
    backgroundColor: colors.card,
    borderRadius: ROUNDED_DESIGN.radius.soft,
    padding: ROUNDED_DESIGN.spacing.generous,
    paddingVertical: ROUNDED_DESIGN.spacing.luxurious,
    alignItems: 'center',
    ...ROUNDED_DESIGN.shadows.soft,
    minHeight: 380,
    justifyContent: 'space-between',
    overflow: 'hidden',
  },
  iconContainer: {
    marginBottom: ROUNDED_DESIGN.spacing.generous,
    width: 88,
    height: 88,
    backgroundColor: colors.tertiary,
    borderRadius: ROUNDED_DESIGN.radius.full,
    alignItems: 'center',
    justifyContent: 'center',
  },
  textContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: ROUNDED_DESIGN.spacing.spacious,
    marginVertical: ROUNDED_DESIGN.spacing.comfortable,
  },
  suggestionText: {
    fontSize: ROUNDED_DESIGN.typography.xlarge,
    fontWeight: '400',
    color: colors.text,
    textAlign: 'center',
    lineHeight: 40,
    letterSpacing: -0.5,
    marginBottom: ROUNDED_DESIGN.spacing.comfortable,
    fontFamily: 'System',
  },
  suggestionDescription: {
    fontSize: ROUNDED_DESIGN.typography.body,
    color: colors.lightText,
    textAlign: 'center',
    lineHeight: 24,
    marginBottom: ROUNDED_DESIGN.spacing.spacious,
    paddingHorizontal: ROUNDED_DESIGN.spacing.comfortable,
    fontWeight: '300',
    opacity: 0.9,
  },
  suggestionType: {
    fontSize: ROUNDED_DESIGN.typography.small,
    color: colors.mutedText,
    marginBottom: ROUNDED_DESIGN.spacing.gentle,
    fontWeight: '300',
    letterSpacing: 0.5,
    textTransform: 'uppercase',
  },
  timeEstimate: {
    fontSize: ROUNDED_DESIGN.typography.small,
    color: colors.text,
    fontWeight: '400',
    backgroundColor: colors.buttonBg,
    paddingHorizontal: ROUNDED_DESIGN.spacing.spacious,
    paddingVertical: ROUNDED_DESIGN.spacing.comfortable,
    borderRadius: ROUNDED_DESIGN.radius.full,
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