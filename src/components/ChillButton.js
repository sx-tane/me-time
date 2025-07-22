import React, { useRef, useState } from 'react';
import { TouchableOpacity, Text, StyleSheet, Animated } from 'react-native';
import { MindfulAnimations, MINDFUL_TIMINGS } from '../utils/mindfulAnimations';
import { COLORS } from '../constants/colors';

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
      Animated.timing(scaleAnim, {
        toValue: 0.98,
        duration: 150,
        useNativeDriver: true,
      }),
      Animated.timing(opacityAnim, {
        toValue: 0.8,
        duration: 150,
        useNativeDriver: true,
      }),
      // Ripple effect
      ripple && Animated.timing(rippleAnim, {
        toValue: 1,
        duration: 600,
        useNativeDriver: true,
      }),
    ]).start();
  };

  const handlePressOut = () => {
    if (disabled) return;
    
    setIsPressed(false);
    
    const releaseDelay = contemplativePress ? 400 : 0;
    
    setTimeout(() => {
      Animated.parallel([
        Animated.timing(scaleAnim, {
          toValue: 1,
          duration: contemplativePress ? 800 : 200,
          useNativeDriver: true,
        }),
        Animated.timing(opacityAnim, {
          toValue: 1,
          duration: contemplativePress ? 800 : 200,
          useNativeDriver: true,
        }),
        Animated.timing(rippleAnim, {
          toValue: 0,
          duration: 400,
          useNativeDriver: true,
        }),
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
      backgroundColor: disabled ? COLORS.GRAY + '30' : COLORS.WHITE,
      borderColor: disabled ? COLORS.GRAY + '30' : COLORS.ACCENT,
    };

    switch (variant) {
      case 'primary':
        return {
          ...baseStyle,
          backgroundColor: disabled ? COLORS.GRAY + '30' : COLORS.ACCENT,
          borderWidth: 0,
        };
      
      case 'secondary':
        return {
          ...baseStyle,
          backgroundColor: disabled ? COLORS.GRAY + '20' : COLORS.LIGHT_BLUE + '20',
          borderColor: disabled ? COLORS.GRAY + '30' : COLORS.LIGHT_BLUE,
          borderWidth: 1,
        };
      
      case 'ghost':
        return {
          backgroundColor: 'transparent',
          borderColor: disabled ? COLORS.GRAY + '30' : COLORS.ACCENT + '50',
          borderWidth: 1,
        };
      
      case 'zen':
        return {
          backgroundColor: disabled ? COLORS.GRAY + '20' : 'transparent',
          borderColor: 'transparent',
          borderWidth: 0,
        };
      
      default:
        return baseStyle;
    }
  };

  const getSizeStyle = () => {
    switch (size) {
      case 'small':
        return {
          paddingVertical: 8,
          paddingHorizontal: 16,
          borderRadius: 12,
        };
      
      case 'large':
        return {
          paddingVertical: 18,
          paddingHorizontal: 32,
          borderRadius: 20,
        };
      
      default: // medium
        return {
          paddingVertical: 14,
          paddingHorizontal: 24,
          borderRadius: 16,
        };
    }
  };

  const getTextStyle = () => {
    const baseTextStyle = {
      fontSize: size === 'small' ? 14 : size === 'large' ? 18 : 16,
      fontWeight: '600',
    };

    switch (variant) {
      case 'primary':
        return {
          ...baseTextStyle,
          color: disabled ? COLORS.GRAY : COLORS.WHITE,
        };
      
      case 'secondary':
        return {
          ...baseTextStyle,
          color: disabled ? COLORS.GRAY : COLORS.DARK_BLUE,
        };
      
      case 'ghost':
        return {
          ...baseTextStyle,
          color: disabled ? COLORS.GRAY : COLORS.ACCENT,
        };
      
      case 'zen':
        return {
          ...baseTextStyle,
          color: disabled ? COLORS.GRAY : COLORS.DARK_BLUE,
          fontWeight: '400',
        };
      
      default:
        return {
          ...baseTextStyle,
          color: disabled ? COLORS.GRAY : COLORS.DARK_BLUE,
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
    boxShadow: '0 2px 8px rgba(0, 0, 0, 0.1)',
    elevation: 3,
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