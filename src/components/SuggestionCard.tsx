import React, { useRef, useEffect, useState } from 'react';
import { View, Text, Animated, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import MindfulContainer from './MindfulContainer';
import ChillButton from './ChillButton';
import { MindfulAnimations, MINDFUL_TIMINGS } from '../utils/mindfulAnimations';
import { contemplate, MINDFUL_DELAYS } from '../services/mindfulTiming';
import { getAnimationConfig, getShadowStyles } from '../utils/platformDetection';
import DESIGN_SYSTEM, { COLORS, ROUNDED_DESIGN, BUTTON_STYLES } from '../constants/designSystem';
import { EnhancedSuggestion, LoadingStage, ViewStyle } from '../types';

interface SuggestionCardProps {
  suggestion: EnhancedSuggestion | null;
  onSkip: () => void;
  skipLoading?: boolean;
  loadingStage?: LoadingStage;
}

export const SuggestionCard: React.FC<SuggestionCardProps> = ({ 
  suggestion, 
  onSkip, 
  skipLoading = false, 
  loadingStage = null 
}) => {
  const scaleAnim = useRef(new Animated.Value(0.9)).current;
  const iconBreathAnim = useRef(new Animated.Value(1)).current;
  const [isContemplating, setIsContemplating] = useState<boolean>(false);

  // Clean render - removed debug logs

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

  const handleContemplativeSkip = async (): Promise<void> => {
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
        {/* Clean icon presentation */}
        <Animated.View style={[
          styles.iconContainer,
          { transform: [{ scale: iconBreathAnim }] }
        ]}>
          <Ionicons 
            name={(suggestion?.icon || 'sparkles') as any} 
            size={48} 
            color={DESIGN_SYSTEM.colors.text.inverse} 
          />
        </Animated.View>

        {/* Focused text layout */}
        <View style={styles.textContainer}>
          <Text style={styles.suggestionText}>
            {suggestion?.text || suggestion?.title || ''}
          </Text>
          
          {suggestion?.description && (
            <Text style={styles.suggestionDescription}>
              {suggestion.description}
            </Text>
          )}
        </View>

        {/* Clean action button */}
        <View style={styles.actionContainer}>
          <ChillButton
            title={
              skipLoading 
                ? (loadingStage === 'generating' 
                    ? "Generating..." 
                    : loadingStage === 'locations' 
                      ? "Finding spots..." 
                      : loadingStage === 'finalizing'
                        ? "Almost ready..."
                        : "Creating...")
                : isContemplating 
                  ? "Thinking..." 
                  : "Skip"
            }
            onPress={handleContemplativeSkip}
            variant="primary"
            size="medium"
            disabled={isContemplating || skipLoading}
            style={styles.skipButton}
          />
        </View>
      </Animated.View>
    </MindfulContainer>
  );
};

const styles = StyleSheet.create({
  cardContainer: {
    marginVertical: DESIGN_SYSTEM.spacing.md,
    marginHorizontal: 0,
  },
  suggestionCard: {
    backgroundColor: DESIGN_SYSTEM.colors.surface.card,
    borderRadius: DESIGN_SYSTEM.borderRadius.lg,
    padding: DESIGN_SYSTEM.spacing.xl,
    paddingVertical: DESIGN_SYSTEM.spacing.xl,
    alignItems: 'center',
    ...DESIGN_SYSTEM.shadows.hero,
    minHeight: 400,
    justifyContent: 'space-between',
  },
  iconContainer: {
    marginBottom: DESIGN_SYSTEM.spacing.lg,
    width: 80,
    height: 80,
    backgroundColor: DESIGN_SYSTEM.colors.primary,
    borderRadius: DESIGN_SYSTEM.borderRadius.full,
    alignItems: 'center',
    justifyContent: 'center',
    ...DESIGN_SYSTEM.shadows.elevated,
  },
  textContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: DESIGN_SYSTEM.spacing.lg,
    marginVertical: DESIGN_SYSTEM.spacing.md,
    maxWidth: '100%',
  },
  suggestionText: {
    fontSize: DESIGN_SYSTEM.typography.fontSize.large,
    fontWeight: DESIGN_SYSTEM.typography.fontWeight.heavy,
    color: DESIGN_SYSTEM.colors.text.primary,
    textAlign: 'center',
    lineHeight: DESIGN_SYSTEM.typography.fontSize.large * DESIGN_SYSTEM.typography.lineHeight.relaxed,
    letterSpacing: DESIGN_SYSTEM.typography.letterSpacing.tight,
    marginBottom: DESIGN_SYSTEM.spacing.md,
  },
  suggestionDescription: {
    fontSize: DESIGN_SYSTEM.typography.fontSize.body,
    color: DESIGN_SYSTEM.colors.text.secondary,
    textAlign: 'center',
    lineHeight: DESIGN_SYSTEM.typography.fontSize.body * DESIGN_SYSTEM.typography.lineHeight.relaxed,
    marginBottom: DESIGN_SYSTEM.spacing.sm,
    fontWeight: DESIGN_SYSTEM.typography.fontWeight.regular,
    opacity: 0.8,
  },
  actionContainer: {
    marginTop: DESIGN_SYSTEM.spacing.md,
    width: '100%',
    alignItems: 'center',
  },
  skipButton: {
    minWidth: 200,
    alignSelf: 'center',
  },
});