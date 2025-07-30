import React, { useEffect, useRef } from 'react';
import { View, Animated, StyleSheet } from 'react-native';
import { MindfulAnimations, MINDFUL_TIMINGS } from '../utils/mindfulAnimations';
import DESIGN_SYSTEM from '../constants/designSystem';

const MindfulContainer = ({ 
  children, 
  style,
  breathe = false,
  fadeIn = true,
  slideIn = false,
  staggerChildren = false,
  contemplativeEntry = false,
  delay = 0,
  ...props 
}) => {
  const fadeAnim = useRef(new Animated.Value(fadeIn ? 0 : 1)).current;
  const slideAnim = useRef(new Animated.Value(slideIn ? 30 : 0)).current;
  const breatheAnim = useRef(new Animated.Value(1)).current;
  const containerRef = useRef(null);

  useEffect(() => {
    const animations = [];

    // Gentle fade in
    if (fadeIn) {
      animations.push(
        MindfulAnimations.createGentleFadeIn(fadeAnim, {
          delay: delay,
          duration: contemplativeEntry ? MINDFUL_TIMINGS.gentle.contemplative : MINDFUL_TIMINGS.gentle.medium
        })
      );
    }

    // Gentle slide in
    if (slideIn) {
      animations.push(
        MindfulAnimations.createGentleSlideIn(slideAnim, {
          delay: delay + 100,
          duration: contemplativeEntry ? MINDFUL_TIMINGS.gentle.contemplative : MINDFUL_TIMINGS.gentle.medium
        })
      );
    }

    // Start entrance animations
    if (animations.length > 0) {
      const entranceSequence = contemplativeEntry 
        ? Animated.sequence(animations)
        : Animated.parallel(animations);
      
      entranceSequence.start();
    }

    // Start breathing animation if requested
    if (breathe) {
      const breathingAnimation = MindfulAnimations.createBreathingAnimation(breatheAnim, {
        inhaleScale: 1.02,
        exhaleScale: 1.0,
        inhaleTime: 3000,
        holdTime: 1000,
        exhaleTime: 4000,
        pauseTime: 2000,
      });
      
      breathingAnimation.start();
    }
  }, [fadeIn, slideIn, breathe, contemplativeEntry, delay]);

  const animatedStyles = {
    opacity: fadeAnim,
    transform: [
      { 
        translateY: slideIn ? slideAnim : 0 
      },
      { 
        scale: breathe ? breatheAnim : 1 
      }
    ]
  };

  return (
    <Animated.View 
      ref={containerRef}
      style={[styles.container, animatedStyles, style]} 
      {...props}
    >
      {children}
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  container: {
    // Breathing room built in - use consistent spacing
    paddingVertical: DESIGN_SYSTEM.spacing.sm,
  }
});

export default MindfulContainer;