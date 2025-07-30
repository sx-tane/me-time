import React, { useRef, useEffect } from 'react';
import { TouchableOpacity, Text, Animated, StyleSheet } from 'react-native';
import DESIGN_SYSTEM, { BUTTON_STYLES } from '../constants/designSystem';
import { getAnimationConfig } from '../utils/platformDetection';

export const GentleButton = ({ title, onPress, style, variant = 'primary' }) => {
  const fadeAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.timing(fadeAnim, getAnimationConfig({
      toValue: 1,
      duration: 500,
      useNativeDriver: true,
    })).start();
  }, []);

  return (
    <Animated.View style={{ opacity: fadeAnim }}>
      <TouchableOpacity
        style={[
          styles.button,
          variant === 'secondary' && styles.secondaryButton,
          variant === 'ghost' && styles.ghostButton,
          style
        ]}
        onPress={onPress}
        activeOpacity={0.7}
      >
        <Text style={[
          styles.buttonText,
          variant === 'ghost' && styles.ghostButtonText
        ]}>
          {title}
        </Text>
      </TouchableOpacity>
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  button: {
    ...BUTTON_STYLES.primary,
    alignItems: 'center',
  },
  secondaryButton: {
    ...BUTTON_STYLES.secondary,
  },
  ghostButton: {
    ...BUTTON_STYLES.ghost,
  },
  buttonText: {
    color: DESIGN_SYSTEM.colors.interactiveText,
    fontSize: DESIGN_SYSTEM.typography.fontSize.body,
    fontWeight: DESIGN_SYSTEM.typography.fontWeight.semibold,
  },
  ghostButtonText: {
    color: DESIGN_SYSTEM.colors.text.secondary,
  },
});