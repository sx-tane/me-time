import React, { useRef, useState } from 'react';
import { TouchableOpacity, Text, StyleSheet, Animated } from 'react-native';
import { MindfulAnimations, MINDFUL_TIMINGS } from '../utils/mindfulAnimations';
import { COLORS, ROUNDED_DESIGN } from '../constants/colors';
import { getAnimationConfig } from '../utils/platformDetection';

const ChillButton = ({ 
  title,
  onPress,
  style,
  textStyle,
  variant = 'primary', // 'primary', 'secondary', 'ghost', 'zen'
  size = 'medium', // 'small', 'medium', 'large'
  disabled = false,
  breathe = false,
  ripple = true,
  contemplativePress = false,
  children,
  ...props 
}) => {
  const scaleAnim = useRef(new Animated.Value(1)).current;
  const opacityAnim = useRef(new Animated.Value(1)).current;
  const breatheAnim = useRef(new Animated.Value(1)).current;
  const rippleAnim = useRef(new Animated.Value(0)).current;
  const [isPressed, setIsPressed] = useState(false);

  React.useEffect(() => {
    if (breathe && !disabled) {
      const breathingAnimation = MindfulAnimations.createBreathingAnimation(breatheAnim, {
        inhaleScale: 1.02,
        exhaleScale: 1.0,
        inhaleTime: 4000,
        holdTime: 1000,
        exhaleTime: 5000,
        pauseTime: 2000,
      });
      
      breathingAnimation.start();
      
      return () => breathingAnimation.stop && breathingAnimation.stop();
    }
  }, [breathe, disabled]);

  const handlePressIn = () => {
    if (disabled) return;
    
    setIsPressed(true);
    
    // Gentle press animation
    Animated.parallel([
      Animated.timing(scaleAnim, getAnimationConfig({
        toValue: 0.98,
        duration: 150,
        useNativeDriver: true,
      })),
      Animated.timing(opacityAnim, getAnimationConfig({
        toValue: 0.8,
        duration: 150,
        useNativeDriver: true,
      })),
      // Ripple effect
      ripple && Animated.timing(rippleAnim, getAnimationConfig({
        toValue: 1,
        duration: 600,
        useNativeDriver: true,
      })),
    ]).start();
  };

  const handlePressOut = () => {
    if (disabled) return;
    
    setIsPressed(false);
    
    const releaseDelay = contemplativePress ? 400 : 0;
    
    setTimeout(() => {
      Animated.parallel([
        Animated.timing(scaleAnim, getAnimationConfig({
          toValue: 1,
          duration: contemplativePress ? 800 : 200,
          useNativeDriver: true,
        })),
        Animated.timing(opacityAnim, getAnimationConfig({
          toValue: 1,
          duration: contemplativePress ? 800 : 200,
          useNativeDriver: true,
        })),
        Animated.timing(rippleAnim, getAnimationConfig({
          toValue: 0,
          duration: 400,
          useNativeDriver: true,
        })),
      ]).start();
    }, releaseDelay);
  };

  const handlePress = () => {
    if (disabled) return;
    
    if (contemplativePress) {
      // Add a gentle delay for contemplative pressing
      setTimeout(() => {
        onPress && onPress();
      }, 100);
    } else {
      onPress && onPress();
    }
  };

  const getVariantStyle = () => {
    const baseStyle = {
      backgroundColor: disabled ? COLORS.buttonBg : COLORS.surface,
      borderColor: 'transparent',
      ...ROUNDED_DESIGN.shadows.minimal,
    };

    switch (variant) {
      case 'primary':
        return {
          ...baseStyle,
          backgroundColor: disabled ? COLORS.buttonBg : COLORS.primary,
          borderWidth: 0,
          ...ROUNDED_DESIGN.shadows.gentle,
        };
      
      case 'secondary':
        return {
          ...baseStyle,
          backgroundColor: disabled ? COLORS.buttonBg : COLORS.buttonBg,
          borderColor: 'transparent',
          borderWidth: 0,
        };
      
      case 'ghost':
        return {
          backgroundColor: 'transparent',
          borderColor: 'transparent',
          borderWidth: 0,
        };
      
      case 'zen':
        return {
          backgroundColor: disabled ? COLORS.buttonBg : COLORS.buttonBg,
          borderColor: 'transparent',
          borderWidth: 0,
          ...ROUNDED_DESIGN.shadows.minimal,
        };
      
      default:
        return baseStyle;
    }
  };

  const getSizeStyle = () => {
    switch (size) {
      case 'small':
        return {
          paddingVertical: ROUNDED_DESIGN.spacing.comfortable,
          paddingHorizontal: ROUNDED_DESIGN.spacing.spacious,
          borderRadius: ROUNDED_DESIGN.radius.full,
        };
      
      case 'large':
        return {
          paddingVertical: ROUNDED_DESIGN.spacing.spacious,
          paddingHorizontal: ROUNDED_DESIGN.spacing.generous,
          borderRadius: ROUNDED_DESIGN.radius.full,
        };
      
      default: // medium
        return {
          paddingVertical: ROUNDED_DESIGN.spacing.comfortable,
          paddingHorizontal: ROUNDED_DESIGN.spacing.generous,
          borderRadius: ROUNDED_DESIGN.radius.full,
        };
    }
  };

  const getTextStyle = () => {
    const baseTextStyle = {
      fontSize: size === 'small' ? ROUNDED_DESIGN.typography.small : size === 'large' ? ROUNDED_DESIGN.typography.medium : ROUNDED_DESIGN.typography.body,
      fontWeight: '400',
      letterSpacing: 0,
    };

    switch (variant) {
      case 'primary':
        return {
          ...baseTextStyle,
          color: disabled ? COLORS.mutedText : COLORS.WHITE,
          fontWeight: '400',
        };
      
      case 'secondary':
        return {
          ...baseTextStyle,
          color: disabled ? COLORS.mutedText : COLORS.text,
          fontWeight: '400',
        };
      
      case 'ghost':
        return {
          ...baseTextStyle,
          color: disabled ? COLORS.mutedText : COLORS.lightText,
          fontWeight: '300',
        };
      
      case 'zen':
        return {
          ...baseTextStyle,
          color: disabled ? COLORS.mutedText : COLORS.text,
          fontWeight: '300',
          letterSpacing: 0.2,
        };
      
      default:
        return {
          ...baseTextStyle,
          color: disabled ? COLORS.mutedText : COLORS.text,
        };
    }
  };

  const animatedStyle = {
    transform: [
      { scale: Animated.multiply(scaleAnim, breathe && !disabled ? breatheAnim : 1) }
    ],
    opacity: opacityAnim,
  };

  const rippleStyle = {
    opacity: rippleAnim,
    transform: [{
      scale: rippleAnim.interpolate({
        inputRange: [0, 1],
        outputRange: [0, 1.5]
      })
    }]
  };

  return (
    <TouchableOpacity
      onPressIn={handlePressIn}
      onPressOut={handlePressOut}
      onPress={handlePress}
      disabled={disabled}
      activeOpacity={1}
      style={[styles.container]}
      {...props}
    >
      <Animated.View style={[
        styles.button,
        getVariantStyle(),
        getSizeStyle(),
        animatedStyle,
        style
      ]}>
        {ripple && (
          <Animated.View style={[
            styles.ripple,
            getVariantStyle(),
            getSizeStyle(),
            rippleStyle
          ]} />
        )}
        
        {children || (
          <Text style={[
            getTextStyle(),
            textStyle
          ]}>
            {title}
          </Text>
        )}
      </Animated.View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  container: {
    position: 'relative',
  },
  button: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  ripple: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    opacity: 0.3,
  },
});

export default ChillButton;