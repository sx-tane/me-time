// Import the unified design system
import DESIGN_SYSTEM, { COMPONENT_STYLES } from './designSystem';

// Main color palette - now sourced from unified design system
export const COLORS = {
  // Primary colors - mint green branding
  background: DESIGN_SYSTEM.colors.background.primary,
  surface: DESIGN_SYSTEM.colors.surface.card,
  primary: DESIGN_SYSTEM.colors.primary,
  primaryLight: DESIGN_SYSTEM.colors.primaryLight,
  primaryDark: DESIGN_SYSTEM.colors.primaryDark,
  
  // Accent colors - complementary wellness palette
  accent: DESIGN_SYSTEM.colors.accent.peach,
  accentBlue: DESIGN_SYSTEM.colors.accent.blue,
  accentYellow: DESIGN_SYSTEM.colors.accent.yellow,
  accentPurple: DESIGN_SYSTEM.colors.accent.purple,
  accentBeige: DESIGN_SYSTEM.colors.accent.beige,
  
  // Text colors - high contrast hierarchy
  text: DESIGN_SYSTEM.colors.text.primary,
  lightText: DESIGN_SYSTEM.colors.text.secondary,
  mutedText: DESIGN_SYSTEM.colors.text.tertiary,
  
  // Surface colors - clean and modern
  card: DESIGN_SYSTEM.colors.surface.card,
  border: DESIGN_SYSTEM.colors.surface.border,
  divider: DESIGN_SYSTEM.colors.surface.divider,
  
  // Interactive colors - black buttons for modern look
  buttonBg: DESIGN_SYSTEM.colors.interactive,
  buttonHover: DESIGN_SYSTEM.colors.interactiveHover,
  buttonActive: DESIGN_SYSTEM.colors.interactiveActive,
  buttonText: DESIGN_SYSTEM.colors.interactiveText,
  
  // Semantic colors
  success: DESIGN_SYSTEM.colors.semantic.success,
  warning: DESIGN_SYSTEM.colors.semantic.warning,
  error: DESIGN_SYSTEM.colors.semantic.error,
  info: DESIGN_SYSTEM.colors.semantic.info,
  
  // Utility colors
  WHITE: '#FFFFFF',
  BLACK: '#000000',
  TRANSPARENT: 'transparent',
  
  // Background variations
  tertiary: DESIGN_SYSTEM.colors.background.tertiary,
  elevated: DESIGN_SYSTEM.colors.background.elevated,
};

// Theme combinations - wellness-focused palettes
export const MODERN_THEMES = {
  default: {
    background: COLORS.background,
    text: COLORS.text,
    accent: COLORS.primary,
    card: COLORS.surface
  },
  mindful: {
    background: COLORS.background,
    text: COLORS.text,
    accent: COLORS.primary,
    card: COLORS.surface
  },
  calm: {
    background: COLORS.background,
    text: COLORS.text,
    accent: COLORS.accentBlue,
    card: COLORS.surface
  },
  warm: {
    background: COLORS.background,
    text: COLORS.text,
    accent: COLORS.accent,
    card: COLORS.surface
  }
};

// Design system - imported from unified design system
export const ROUNDED_DESIGN = {
  // Border radius values - from unified system
  radius: {
    small: DESIGN_SYSTEM.borderRadius.sm,
    medium: DESIGN_SYSTEM.borderRadius.md,
    large: DESIGN_SYSTEM.borderRadius.lg,
    pill: DESIGN_SYSTEM.borderRadius.full,
  },
  
  // Shadow values - from unified system
  shadows: DESIGN_SYSTEM.shadows,
  
  // Spacing - from unified system
  spacing: DESIGN_SYSTEM.spacing,
  
  // Typography - from unified system
  typography: {
    // Font sizes
    caption: DESIGN_SYSTEM.typography.fontSize.caption,
    small: DESIGN_SYSTEM.typography.fontSize.small,
    body: DESIGN_SYSTEM.typography.fontSize.body,
    subtitle: DESIGN_SYSTEM.typography.fontSize.subtitle,
    title: DESIGN_SYSTEM.typography.fontSize.title,
    heading: DESIGN_SYSTEM.typography.fontSize.heading,
    large: DESIGN_SYSTEM.typography.fontSize.large,
    xlarge: DESIGN_SYSTEM.typography.fontSize.xlarge,
    display: DESIGN_SYSTEM.typography.fontSize.display,
    hero: DESIGN_SYSTEM.typography.fontSize.hero,
    
    // Font weights
    weights: DESIGN_SYSTEM.typography.fontWeight,
    
    // Letter spacing
    letterSpacing: DESIGN_SYSTEM.typography.letterSpacing,
    
    // Line heights
    lineHeight: DESIGN_SYSTEM.typography.lineHeight,
  }
};

// Button styles - from unified design system
export const BUTTON_STYLES = COMPONENT_STYLES.button;

export default COLORS;