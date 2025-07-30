import React, { useEffect, useRef } from 'react';
import { View, Text, StyleSheet, Animated } from 'react-native';
import { MindfulAnimations, MINDFUL_TIMINGS } from '../utils/mindfulAnimations';
import DESIGN_SYSTEM from '../constants/designSystem';

const PeacefulLoader = ({ 
  message = "Taking a gentle moment...", 
  style,
  showDots = true,
  variant = 'breathing' // 'breathing', 'floating', 'pulse', 'ripple'
}) => {
  const animValue1 = useRef(new Animated.Value(1)).current;
  const animValue2 = useRef(new Animated.Value(1)).current;
  const animValue3 = useRef(new Animated.Value(1)).current;
  const fadeAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    // Gentle fade in
    MindfulAnimations.createGentleFadeIn(fadeAnim, {
      duration: MINDFUL_TIMINGS.gentle.slow
    }).start();

    let animation;

    switch (variant) {
      case 'breathing':
        animation = MindfulAnimations.createBreathingAnimation(animValue1, {
          inhaleScale: 1.1,
          exhaleScale: 1.0,
          inhaleTime: 2500,
          holdTime: 500,
          exhaleTime: 3500,
          pauseTime: 1000,
        });
        break;

      case 'floating':
        animation = Animated.parallel([
          MindfulAnimations.createFloatingAnimation(animValue1, {
            amplitude: 5,
            duration: 3000
          }),
          MindfulAnimations.createFloatingAnimation(animValue2, {
            amplitude: 3,
            duration: 4000
          }),
          MindfulAnimations.createFloatingAnimation(animValue3, {
            amplitude: 7,
            duration: 3500
          })
        ]);
        break;

      case 'pulse':
        animation = MindfulAnimations.createPulseAnimation(animValue1, {
          minScale: 0.95,
          maxScale: 1.05,
          duration: MINDFUL_TIMINGS.gentle.contemplative
        });
        break;

      case 'ripple':
        animation = MindfulAnimations.createStaggeredReveal([animValue1, animValue2, animValue3], {
          staggerDelay: 600,
          duration: MINDFUL_TIMINGS.gentle.slow
        });
        break;

      default:
        animation = MindfulAnimations.createBreathingAnimation(animValue1);
    }

    animation.start();

    return () => animation.stop && animation.stop();
  }, [variant]);

  const renderLoadingIndicator = () => {
    switch (variant) {
      case 'breathing':
        return (
          <Animated.View style={[
            styles.breathingCircle, 
            { transform: [{ scale: animValue1 }] }
          ]}>
            <View style={styles.innerCircle} />
          </Animated.View>
        );

      case 'floating':
        return (
          <View style={styles.floatingContainer}>
            <Animated.View style={[
              styles.floatingDot,
              { transform: [{ translateY: animValue1 }] },
              { backgroundColor: DESIGN_SYSTEM.colors.accent.peach }
            ]} />
            <Animated.View style={[
              styles.floatingDot,
              { transform: [{ translateY: animValue2 }] },
              { backgroundColor: DESIGN_SYSTEM.colors.primary, marginHorizontal: DESIGN_SYSTEM.spacing.lg }
            ]} />
            <Animated.View style={[
              styles.floatingDot,
              { transform: [{ translateY: animValue3 }] },
              { backgroundColor: DESIGN_SYSTEM.colors.accent.peach }
            ]} />
          </View>
        );

      case 'pulse':
        return (
          <Animated.View style={[
            styles.pulseCircle,
            { transform: [{ scale: animValue1 }] }
          ]}>
            <View style={styles.pulseInner} />
          </Animated.View>
        );

      case 'ripple':
        return (
          <View style={styles.rippleContainer}>
            <Animated.View style={[
              styles.rippleRing,
              { opacity: animValue1, transform: [{ scale: animValue1 }] }
            ]} />
            <Animated.View style={[
              styles.rippleRing,
              { opacity: animValue2, transform: [{ scale: animValue2 }] },
              styles.rippleRing2
            ]} />
            <Animated.View style={[
              styles.rippleRing,
              { opacity: animValue3, transform: [{ scale: animValue3 }] },
              styles.rippleRing3
            ]} />
          </View>
        );

      default:
        return null;
    }
  };

  return (
    <Animated.View style={[styles.container, { opacity: fadeAnim }, style]}>
      <View style={styles.loaderContainer}>
        {renderLoadingIndicator()}
      </View>
      
      <Text style={styles.message}>{message}</Text>
      
      {showDots && (
        <View style={styles.dotsContainer}>
          <Text style={styles.dots}>•••</Text>
        </View>
      )}
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    justifyContent: 'center',
    padding: DESIGN_SYSTEM.spacing.hero,
  },
  loaderContainer: {
    marginBottom: DESIGN_SYSTEM.spacing.xl,
    alignItems: 'center',
    justifyContent: 'center',
  },
  breathingCircle: {
    width: 64,
    height: 64,
    borderRadius: DESIGN_SYSTEM.borderRadius.full,
    backgroundColor: DESIGN_SYSTEM.colors.interactive,
    alignItems: 'center',
    justifyContent: 'center',
    ...DESIGN_SYSTEM.shadows.subtle,
  },
  innerCircle: {
    width: 32,
    height: 32,
    borderRadius: DESIGN_SYSTEM.borderRadius.full,
    backgroundColor: DESIGN_SYSTEM.colors.primary + '60',
  },
  floatingContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  floatingDot: {
    width: 12,
    height: 12,
    borderRadius: DESIGN_SYSTEM.borderRadius.full,
  },
  pulseCircle: {
    width: 56,
    height: 56,
    borderRadius: DESIGN_SYSTEM.borderRadius.full,
    backgroundColor: DESIGN_SYSTEM.colors.interactive,
    alignItems: 'center',
    justifyContent: 'center',
    ...DESIGN_SYSTEM.shadows.subtle,
  },
  pulseInner: {
    width: 24,
    height: 24,
    borderRadius: DESIGN_SYSTEM.borderRadius.full,
    backgroundColor: DESIGN_SYSTEM.colors.primary,
  },
  rippleContainer: {
    width: 80,
    height: 80,
    alignItems: 'center',
    justifyContent: 'center',
  },
  rippleRing: {
    position: 'absolute',
    width: 40,
    height: 40,
    borderRadius: DESIGN_SYSTEM.borderRadius.full,
    borderWidth: 1,
    borderColor: DESIGN_SYSTEM.colors.surface.border,
  },
  rippleRing2: {
    width: 60,
    height: 60,
    borderRadius: DESIGN_SYSTEM.borderRadius.full,
    borderColor: DESIGN_SYSTEM.colors.surface.divider,
  },
  rippleRing3: {
    width: 80,
    height: 80,
    borderRadius: DESIGN_SYSTEM.borderRadius.full,
    borderColor: DESIGN_SYSTEM.colors.surface.divider,
  },
  message: {
    fontSize: DESIGN_SYSTEM.typography.fontSize.body,
    color: DESIGN_SYSTEM.colors.text.secondary,
    textAlign: 'center',
    fontWeight: DESIGN_SYSTEM.typography.fontWeight.light,
    lineHeight: DESIGN_SYSTEM.typography.fontSize.body * DESIGN_SYSTEM.typography.lineHeight.relaxed,
  },
  dotsContainer: {
    marginTop: DESIGN_SYSTEM.spacing.lg,
  },
  dots: {
    fontSize: DESIGN_SYSTEM.typography.fontSize.subtitle,
    color: DESIGN_SYSTEM.colors.text.tertiary,
    letterSpacing: DESIGN_SYSTEM.typography.letterSpacing.wider,
  },
});

export default PeacefulLoader;