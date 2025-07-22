import React, { useEffect, useRef } from 'react';
import { View, Text, StyleSheet, Animated } from 'react-native';
import { MindfulAnimations, MINDFUL_TIMINGS } from '../utils/mindfulAnimations';
import { COLORS } from '../constants/colors';

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
              { backgroundColor: COLORS.ACCENT }
            ]} />
            <Animated.View style={[
              styles.floatingDot,
              { transform: [{ translateY: animValue2 }] },
              { backgroundColor: COLORS.LIGHT_BLUE, marginHorizontal: 12 }
            ]} />
            <Animated.View style={[
              styles.floatingDot,
              { transform: [{ translateY: animValue3 }] },
              { backgroundColor: COLORS.ACCENT }
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
    padding: 40,
  },
  loaderContainer: {
    marginBottom: 24,
    alignItems: 'center',
    justifyContent: 'center',
  },
  breathingCircle: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: COLORS.ACCENT + '20',
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 2,
    borderColor: COLORS.ACCENT + '40',
  },
  innerCircle: {
    width: 30,
    height: 30,
    borderRadius: 15,
    backgroundColor: COLORS.ACCENT + '60',
  },
  floatingContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  floatingDot: {
    width: 12,
    height: 12,
    borderRadius: 6,
  },
  pulseCircle: {
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: COLORS.LIGHT_BLUE + '30',
    alignItems: 'center',
    justifyContent: 'center',
  },
  pulseInner: {
    width: 20,
    height: 20,
    borderRadius: 10,
    backgroundColor: COLORS.LIGHT_BLUE,
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
    borderRadius: 20,
    borderWidth: 2,
    borderColor: COLORS.ACCENT + '60',
  },
  rippleRing2: {
    width: 60,
    height: 60,
    borderRadius: 30,
    borderColor: COLORS.ACCENT + '40',
  },
  rippleRing3: {
    width: 80,
    height: 80,
    borderRadius: 40,
    borderColor: COLORS.ACCENT + '20',
  },
  message: {
    fontSize: 16,
    color: COLORS.GRAY,
    textAlign: 'center',
    fontWeight: '400',
    lineHeight: 24,
  },
  dotsContainer: {
    marginTop: 12,
  },
  dots: {
    fontSize: 20,
    color: COLORS.ACCENT + '60',
    letterSpacing: 4,
  },
});

export default PeacefulLoader;