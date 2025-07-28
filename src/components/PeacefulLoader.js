import React, { useEffect, useRef } from 'react';
import { View, Text, StyleSheet, Animated } from 'react-native';
import { MindfulAnimations, MINDFUL_TIMINGS } from '../utils/mindfulAnimations';
import { COLORS, ROUNDED_DESIGN } from '../constants/colors';

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
              { backgroundColor: COLORS.accent }
            ]} />
            <Animated.View style={[
              styles.floatingDot,
              { transform: [{ translateY: animValue2 }] },
              { backgroundColor: COLORS.primary, marginHorizontal: ROUNDED_DESIGN.spacing.comfortable }
            ]} />
            <Animated.View style={[
              styles.floatingDot,
              { transform: [{ translateY: animValue3 }] },
              { backgroundColor: COLORS.accent }
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
    padding: ROUNDED_DESIGN.spacing.expansive,
  },
  loaderContainer: {
    marginBottom: ROUNDED_DESIGN.spacing.spacious,
    alignItems: 'center',
    justifyContent: 'center',
  },
  breathingCircle: {
    width: 64,
    height: 64,
    borderRadius: ROUNDED_DESIGN.radius.full,
    backgroundColor: COLORS.buttonBg,
    alignItems: 'center',
    justifyContent: 'center',
  },
  innerCircle: {
    width: 32,
    height: 32,
    borderRadius: ROUNDED_DESIGN.radius.full,
    backgroundColor: COLORS.accent + '40',
  },
  floatingContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  floatingDot: {
    width: 12,
    height: 12,
    borderRadius: ROUNDED_DESIGN.radius.full,
  },
  pulseCircle: {
    width: 56,
    height: 56,
    borderRadius: ROUNDED_DESIGN.radius.full,
    backgroundColor: COLORS.buttonBg,
    alignItems: 'center',
    justifyContent: 'center',
  },
  pulseInner: {
    width: 24,
    height: 24,
    borderRadius: ROUNDED_DESIGN.radius.full,
    backgroundColor: COLORS.accent,
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
    borderRadius: ROUNDED_DESIGN.radius.full,
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  rippleRing2: {
    width: 60,
    height: 60,
    borderRadius: ROUNDED_DESIGN.radius.full,
    borderColor: COLORS.divider,
  },
  rippleRing3: {
    width: 80,
    height: 80,
    borderRadius: ROUNDED_DESIGN.radius.full,
    borderColor: COLORS.divider,
  },
  message: {
    fontSize: ROUNDED_DESIGN.typography.body,
    color: COLORS.lightText,
    textAlign: 'center',
    fontWeight: '300',
    lineHeight: 24,
  },
  dotsContainer: {
    marginTop: ROUNDED_DESIGN.spacing.comfortable,
  },
  dots: {
    fontSize: ROUNDED_DESIGN.typography.medium,
    color: COLORS.mutedText,
    letterSpacing: 4,
  },
});

export default PeacefulLoader;