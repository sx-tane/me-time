import { Platform } from 'react-native';
import { AnimationConfig } from '../types';

export const isWeb: boolean = Platform.OS === 'web';
export const isNative: boolean = Platform.OS !== 'web';

interface AnimationConfigInput extends Partial<AnimationConfig> {
  useNativeDriver?: boolean;
}

export const getAnimationConfig = (config: AnimationConfigInput): any => {
  return {
    ...config,
    useNativeDriver: isNative && config.useNativeDriver !== false
  };
};

interface ShadowStylesInput {
  shadowColor?: string;
  shadowOffset?: { width: number; height: number };
  shadowOpacity?: number;
  shadowRadius?: number;
  elevation?: number;
}

interface WebShadowStyle {
  boxShadow: string;
}

interface NativeShadowStyle {
  shadowColor: string;
  shadowOffset: { width: number; height: number };
  shadowOpacity: number;
  shadowRadius: number;
  elevation: number;
}

export const getShadowStyles = ({ 
  shadowColor = '#000', 
  shadowOffset = { width: 0, height: 2 }, 
  shadowOpacity = 0.1, 
  shadowRadius = 4, 
  elevation = 2 
}: ShadowStylesInput = {}): WebShadowStyle | NativeShadowStyle => {
  if (isWeb) {
    const { width, height } = shadowOffset;
    let rgbColor = '0,0,0';
    
    if (shadowColor && shadowColor.startsWith('#')) {
      const hex = shadowColor.replace('#', '');
      if (hex.length === 3) {
        rgbColor = hex.split('').map(c => parseInt(c + c, 16)).join(',');
      } else if (hex.length === 6) {
        rgbColor = (hex.match(/.{2}/g) || []).map(x => parseInt(x, 16)).join(',');
      }
    }
    
    return {
      boxShadow: `${width}px ${height}px ${shadowRadius}px rgba(${rgbColor}, ${shadowOpacity})`,
    };
  }
  
  return {
    shadowColor,
    shadowOffset,
    shadowOpacity,
    shadowRadius,
    elevation,
  };
};