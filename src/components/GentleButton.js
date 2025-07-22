import React, { useRef, useEffect } from 'react';
import { TouchableOpacity, Text, Animated, StyleSheet } from 'react-native';
import colors from '../constants/colors';

export const GentleButton = ({ title, onPress, style, variant = 'primary' }) => {
  const fadeAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.timing(fadeAnim, {
      toValue: 1,
      duration: 500,
      useNativeDriver: true,
    }).start();
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
    backgroundColor: colors.primary,
    paddingHorizontal: 30,
    paddingVertical: 15,
    borderRadius: 25,
    alignItems: 'center',
  },
  secondaryButton: {
    backgroundColor: colors.secondary,
  },
  ghostButton: {
    backgroundColor: 'transparent',
    borderWidth: 1,
    borderColor: colors.lightText,
  },
  buttonText: {
    color: '#FFF',
    fontSize: 16,
    fontWeight: '600',
  },
  ghostButtonText: {
    color: colors.lightText,
  },
});