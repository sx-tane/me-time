import React, { useRef, useState } from 'react';
import { TouchableOpacity, Text, StyleSheet, Animated } from 'react-native';
import DESIGN_SYSTEM, { COLORS, ROUNDED_DESIGN, BUTTON_STYLES } from '../constants/designSystem';

const ChillButton = ({ 
  title,
  onPress,
  style,
  textStyle,
  variant = 'primary', // 'primary', 'secondary'
  size = 'medium', // 'small', 'medium', 'large'
  disabled = false,
  children,
  ...props 
}) => {
  const scaleAnim = useRef(new Animated.Value(1)).current;
  const [isPressed, setIsPressed] = useState(false);

  const handlePressIn = () => {
    if (disabled) return;
    setIsPressed(true);
    
    // Clean press animation
    Animated.timing(scaleAnim, {
      toValue: 0.96,
      duration: 100,
      useNativeDriver: true,
    }).start();
  };

  const handlePressOut = () => {
    if (disabled) return;
    setIsPressed(false);
    
    Animated.timing(scaleAnim, {
      toValue: 1,
      duration: 150,
      useNativeDriver: true,
    }).start();
  };

  const handlePress = () => {
    if (disabled) return;
    onPress && onPress();
  };

  const getButtonStyle = () => {
    const baseStyle = {
      ...BUTTON_STYLES[variant],
      borderRadius: DESIGN_SYSTEM.borderRadius.lg,
    };
    
    // Size adjustments - consistent with design system
    const sizeAdjustments = {
      small: {
        paddingVertical: 12,
        paddingHorizontal: 24,
        minHeight: 44,
        fontSize: DESIGN_SYSTEM.typography.fontSize.small,
      },
      medium: {
        paddingVertical: 18,
        paddingHorizontal: 32,
        minHeight: 56,
        fontSize: DESIGN_SYSTEM.typography.fontSize.body,
      },
      large: {
        paddingVertical: 22,
        paddingHorizontal: 40,
        minHeight: 64,
        fontSize: DESIGN_SYSTEM.typography.fontSize.title,
      },
    };
    
    return {
      ...baseStyle,
      ...sizeAdjustments[size],
      opacity: disabled ? 0.4 : 1,
    };
  };

  const getTextStyle = () => {
    const buttonStyle = getButtonStyle();
    const fontSize = {
      small: DESIGN_SYSTEM.typography.fontSize.small,
      medium: DESIGN_SYSTEM.typography.fontSize.body,
      large: DESIGN_SYSTEM.typography.fontSize.title,
    }[size];
    
    return {
      color: buttonStyle.color,
      fontWeight: buttonStyle.fontWeight || DESIGN_SYSTEM.typography.fontWeight.semibold,
      fontSize,
      letterSpacing: DESIGN_SYSTEM.typography.letterSpacing.normal,
      textAlign: 'center',
    };
  };

  const animatedStyle = {
    transform: [{ scale: scaleAnim }],
  };

  return (
    <TouchableOpacity
      onPressIn={handlePressIn}
      onPressOut={handlePressOut}
      onPress={handlePress}
      disabled={disabled}
      activeOpacity={1}
      style={[styles.container, style]}
      {...props}
    >
      <Animated.View style={[
        styles.button,
        getButtonStyle(),
        animatedStyle,
      ]}>
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
    // No additional styling needed
  },
  button: {
    alignItems: 'center',
    justifyContent: 'center',
    flexDirection: 'row',
  },
});

export default ChillButton;