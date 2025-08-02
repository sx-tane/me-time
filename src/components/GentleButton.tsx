import React, { useRef, useEffect, useState } from 'react';
import { TouchableOpacity, Text, Animated, StyleSheet, View } from 'react-native';
import { JAPANESE_WELLNESS_DESIGN, JAPANESE_COMPONENTS } from '../constants/japaneseWellnessDesign';
import { MindfulAnimations, JapaneseWellnessAnimations, MINDFUL_EASINGS } from '../utils/mindfulAnimations';
import { ViewStyle, TextStyle } from '../types';
import Svg, { Path, Circle } from 'react-native-svg';

interface GentleButtonProps {
  title: string;
  onPress: () => void;
  style?: ViewStyle;
  variant?: 'primary' | 'secondary' | 'ghost' | 'organic' | 'zen';
  shape?: 'default' | 'stone' | 'leaf' | 'flowing';
  withRipple?: boolean;
  meditation?: boolean;
  disabled?: boolean;
  children?: React.ReactNode;
}

export const GentleButton: React.FC<GentleButtonProps> = ({ 
  title, 
  onPress, 
  style, 
  variant = 'primary',
  shape = 'default',
  withRipple = false,
  meditation = false,
  disabled = false,
  children
}) => {
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const scaleAnim = useRef(new Animated.Value(1)).current;
  const rippleAnim = useRef(new Animated.Value(0)).current;
  const meditationAnim = useRef(new Animated.Value(1)).current;
  const [isPressed, setIsPressed] = useState(false);

  // Initial fade-in animation with Ma (間) timing
  useEffect(() => {
    JapaneseWellnessAnimations.createMaReveal(fadeAnim, {
      duration: 800,
      easing: MINDFUL_EASINGS.meditation
    }).start();
  }, []);

  // Continuous meditation breathing animation
  useEffect(() => {
    if (meditation && !disabled) {
      const breathingAnimation = JapaneseWellnessAnimations.createWafuBreathing(meditationAnim, {
        technique: 'zen',
        inhaleScale: 1.02,
        exhaleScale: 0.99
      });
      breathingAnimation.start();
      
      return () => breathingAnimation.stop();
    }
  }, [meditation, disabled]);

  const handlePressIn = () => {
    if (disabled) return;
    
    setIsPressed(true);
    
    // Gentle press animation with stone-like settling
    Animated.timing(scaleAnim, {
      toValue: 0.97,
      duration: 150,
      easing: MINDFUL_EASINGS.stone,
      useNativeDriver: true,
    }).start();
    
    // Ripple effect for tactile feedback
    if (withRipple) {
      rippleAnim.setValue(0);
      Animated.timing(rippleAnim, {
        toValue: 1,
        duration: 600,
        easing: MINDFUL_EASINGS.water,
        useNativeDriver: true,
      }).start();
    }
  };

  const handlePressOut = () => {
    if (disabled) return;
    
    setIsPressed(false);
    
    // Natural spring back with bamboo flexibility
    Animated.timing(scaleAnim, {
      toValue: 1,
      duration: 200,
      easing: MINDFUL_EASINGS.bamboo,
      useNativeDriver: true,
    }).start();
  };

  const getShapeStyle = () => {
    const baseRadius = JAPANESE_WELLNESS_DESIGN.borderRadius;
    
    switch (shape) {
      case 'stone':
        return {
          borderTopLeftRadius: baseRadius.organicShapes.stone.topLeft,
          borderTopRightRadius: baseRadius.organicShapes.stone.topRight,
          borderBottomLeftRadius: baseRadius.organicShapes.stone.bottomLeft,
          borderBottomRightRadius: baseRadius.organicShapes.stone.bottomRight,
        };
      case 'leaf':
        return {
          borderTopLeftRadius: baseRadius.organicShapes.leaf.topLeft,
          borderTopRightRadius: baseRadius.organicShapes.leaf.topRight,
          borderBottomLeftRadius: baseRadius.organicShapes.leaf.bottomLeft,
          borderBottomRightRadius: baseRadius.organicShapes.leaf.bottomRight,
        };
      case 'flowing':
        return {
          borderTopLeftRadius: baseRadius.organicShapes.flowing.topLeft,
          borderTopRightRadius: baseRadius.organicShapes.flowing.topRight,
          borderBottomLeftRadius: baseRadius.organicShapes.flowing.bottomLeft,
          borderBottomRightRadius: baseRadius.organicShapes.flowing.bottomRight,
        };
      default:
        return {
          borderRadius: baseRadius.full,
        };
    }
  };

  return (
    <Animated.View 
      style={[
        { opacity: fadeAnim },
        meditation && { transform: [{ scale: meditationAnim }] }
      ]}
    >
      <TouchableOpacity
        style={[
          styles.button,
          styles[`${variant}Button`],
          getShapeStyle(),
          disabled && styles.disabledButton,
          style
        ]}
        onPress={disabled ? undefined : onPress}
        onPressIn={handlePressIn}
        onPressOut={handlePressOut}
        activeOpacity={1}
        disabled={disabled}
      >
        <Animated.View 
          style={[
            styles.buttonContent,
            { transform: [{ scale: scaleAnim }] }
          ]}
        >
          {/* Ripple effect overlay */}
          {withRipple && (
            <Animated.View 
              style={[
                styles.rippleOverlay,
                {
                  opacity: rippleAnim.interpolate({
                    inputRange: [0, 0.5, 1],
                    outputRange: [0, 0.3, 0]
                  }),
                  transform: [{
                    scale: rippleAnim.interpolate({
                      inputRange: [0, 1],
                      outputRange: [0.3, 2]
                    })
                  }]
                }
              ]}
            />
          )}
          
          {/* Zen circle accent for meditation variant */}
          {meditation && variant === 'zen' && (
            <View style={styles.zenAccent}>
              <Svg width={16} height={16} viewBox="0 0 100 100">
                <Path
                  d="M 50,10 A 40,40 0 1,1 30,85"
                  stroke={JAPANESE_WELLNESS_DESIGN.colors.primary[400]}
                  strokeWidth="3"
                  fill="none"
                  opacity={0.6}
                />
              </Svg>
            </View>
          )}
          
          {children ? children : (
            <Text style={[
              styles.buttonText,
              styles[`${variant}ButtonText`],
              disabled && styles.disabledButtonText
            ]}>
              {title}
            </Text>
          )}
        </Animated.View>
      </TouchableOpacity>
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  button: {
    alignItems: 'center',
    justifyContent: 'center',
    minHeight: 48,
    paddingVertical: JAPANESE_WELLNESS_DESIGN.spacing.ma.pause,
    paddingHorizontal: JAPANESE_WELLNESS_DESIGN.spacing.ma.contemplation,
    overflow: 'hidden',
    position: 'relative',
  },
  
  buttonContent: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  
  // Primary button - Main CTA with warm earth tones
  primaryButton: {
    backgroundColor: JAPANESE_WELLNESS_DESIGN.colors.primary[600],
    ...JAPANESE_WELLNESS_DESIGN.shadows.sm,
  },
  
  // Secondary button - Subtle with natural border
  secondaryButton: {
    backgroundColor: 'transparent',
    borderWidth: 1.5,
    borderColor: JAPANESE_WELLNESS_DESIGN.colors.primary[300],
  },
  
  // Ghost button - Minimal, text-only
  ghostButton: {
    backgroundColor: 'transparent',
    paddingVertical: JAPANESE_WELLNESS_DESIGN.spacing.ma.breath,
    paddingHorizontal: JAPANESE_WELLNESS_DESIGN.spacing.ma.pause,
  },
  
  // Organic button - Natural, earth-inspired
  organicButton: {
    backgroundColor: JAPANESE_WELLNESS_DESIGN.colors.accent.shizen,
    ...JAPANESE_WELLNESS_DESIGN.shadows.md,
  },
  
  // Zen button - Minimalist meditation style
  zenButton: {
    backgroundColor: JAPANESE_WELLNESS_DESIGN.colors.background.meditation,
    borderWidth: 1,
    borderColor: JAPANESE_WELLNESS_DESIGN.colors.primary[200],
    ...JAPANESE_WELLNESS_DESIGN.shadows.xs,
  },
  
  // Disabled state
  disabledButton: {
    backgroundColor: JAPANESE_WELLNESS_DESIGN.colors.neutral[200],
    borderColor: JAPANESE_WELLNESS_DESIGN.colors.neutral[300],
  },
  
  // Text styles
  buttonText: {
    fontSize: JAPANESE_WELLNESS_DESIGN.typography.fontSize.base,
    fontWeight: JAPANESE_WELLNESS_DESIGN.typography.fontWeight.medium as any,
    letterSpacing: JAPANESE_WELLNESS_DESIGN.typography.letterSpacing.wide,
    textAlign: 'center',
  },
  
  primaryButtonText: {
    color: JAPANESE_WELLNESS_DESIGN.colors.text.inverse,
  },
  
  secondaryButtonText: {
    color: JAPANESE_WELLNESS_DESIGN.colors.primary[600],
  },
  
  ghostButtonText: {
    color: JAPANESE_WELLNESS_DESIGN.colors.text.secondary,
  },
  
  organicButtonText: {
    color: JAPANESE_WELLNESS_DESIGN.colors.text.primary,
  },
  
  zenButtonText: {
    color: JAPANESE_WELLNESS_DESIGN.colors.primary[700],
    fontWeight: JAPANESE_WELLNESS_DESIGN.typography.fontWeight.light as any,
  },
  
  disabledButtonText: {
    color: JAPANESE_WELLNESS_DESIGN.colors.text.muted,
  },
  
  // Ripple effect overlay
  rippleOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: JAPANESE_WELLNESS_DESIGN.colors.primary[500],
    borderRadius: 50,
  },
  
  // Zen circle accent
  zenAccent: {
    position: 'absolute',
    left: JAPANESE_WELLNESS_DESIGN.spacing.ma.breath,
    top: '50%',
    transform: [{ translateY: -8 }],
  },
});