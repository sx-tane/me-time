// Modern Wellness App Design System
// Unified Dribbble-inspired design system for consistent UI

export const DESIGN_SYSTEM = {
  // Color Palette - Modern wellness aesthetic with mint green accents
  colors: {
    // Brand colors - Mint green primary, black interactive
    primary: '#74C69D',           // Main mint green accent
    primaryLight: '#A8E6CF',      // Light mint for backgrounds
    primaryDark: '#52A672',       // Dark mint for emphasis
    
    // Interactive colors - Black for buttons and actions
    interactive: '#000000',       // Pure black for buttons
    interactiveHover: '#1A1A1A',  // Slightly lighter for hover
    interactiveActive: '#333333', // Active state
    interactiveText: '#FFFFFF',   // White text on black
    
    // Background colors - Warm, clean palette
    background: {
      primary: '#F8F5F1',        // Soft warm beige
      secondary: '#FFFFFF',       // Pure white
      tertiary: '#FAFAFA',        // Very light gray
      elevated: '#FFFFFF',        // White for cards
    },
    
    // Text colors - High contrast hierarchy
    text: {
      primary: '#000000',         // Pure black for headings
      secondary: '#4A4A4A',       // Dark gray for body
      tertiary: '#878787',        // Medium gray for captions
      light: '#B0B0B0',          // Light gray for subtle text
      inverse: '#FFFFFF',         // White text
    },
    
    // Surface colors - Clean and modern
    surface: {
      card: '#FFFFFF',            // Pure white cards
      overlay: 'rgba(0, 0, 0, 0.1)',
      border: '#E8E8E8',          // Light borders
      divider: '#F0F0F0',         // Very subtle dividers
    },
    
    // Accent colors - Complementary wellness palette
    accent: {
      peach: '#FFB5A7',           // Soft coral
      blue: '#A8DADC',            // Light blue
      yellow: '#F7DC6F',          // Soft yellow
      purple: '#C7A8DC',          // Light purple
      beige: '#F5E6D3',           // Light beige
    },
    
    // Semantic colors
    semantic: {
      success: '#74C69D',         // Use mint for success
      warning: '#F7DC6F',         // Soft yellow
      error: '#FF6B6B',           // Soft red
      info: '#A8DADC',            // Light blue
    },
  },
  
  // Typography - Bold, modern hierarchy
  typography: {
    // Font families - System fonts for performance
    fontFamily: {
      primary: '-apple-system, BlinkMacSystemFont, "Inter", "Segoe UI", Roboto, sans-serif',
      display: '"SF Pro Display", -apple-system, BlinkMacSystemFont, sans-serif',
      mono: '"SF Mono", "Monaco", "Inconsolata", monospace',
    },
    
    // Font sizes - Clear hierarchy
    fontSize: {
      caption: 12,              // Small captions
      small: 14,                // Small text
      body: 16,                 // Body text
      subtitle: 18,             // Subtitles
      title: 22,                // Section titles
      heading: 28,              // Main headings
      large: 32,                // Large headings
      xlarge: 36,               // Extra large
      display: 42,              // Display text
      hero: 48,                 // Hero text
    },
    
    // Font weights - Bold, confident
    fontWeight: {
      light: '300',
      regular: '400',
      medium: '500',
      semibold: '600',
      bold: '700',
      heavy: '800',
      black: '900',
    },
    
    // Line heights - Generous spacing
    lineHeight: {
      tight: 1.1,
      snug: 1.3,
      normal: 1.5,
      relaxed: 1.7,
      loose: 2.0,
    },
    
    // Letter spacing - Clean and readable
    letterSpacing: {
      tight: -0.8,
      normal: 0,
      wide: 0.3,
      wider: 0.8,
    },
  },
  
  // Spacing system - Generous, clean spacing
  spacing: {
    xs: 4,                      // Minimal spacing
    sm: 8,                      // Small spacing
    md: 16,                     // Medium spacing
    lg: 24,                     // Large spacing
    xl: 32,                     // Extra large
    xxl: 48,                    // Very large
    xxxl: 64,                   // Maximum spacing
    hero: 80,                   // Hero sections
  },
  
  // Border radius - Modern, rounded corners
  borderRadius: {
    none: 0,
    sm: 8,                      // Small elements
    md: 16,                     // Medium elements
    lg: 24,                     // Cards and large elements
    xl: 32,                     // Very rounded
    full: 9999,                 // Circles and pills
  },
  
  // Shadows - Modern depth and elevation
  shadows: {
    none: 'none',
    subtle: {
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.08,
      shadowRadius: 4,
      elevation: 1,
    },
    card: {
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 4 },
      shadowOpacity: 0.12,
      shadowRadius: 16,
      elevation: 4,
    },
    elevated: {
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 8 },
      shadowOpacity: 0.16,
      shadowRadius: 24,
      elevation: 8,
    },
    hero: {
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 12 },
      shadowOpacity: 0.2,
      shadowRadius: 32,
      elevation: 12,
    },
  },
  
  // Transitions
  transitions: {
    duration: {
      fast: 150,
      base: 200,
      slow: 300,
      slower: 400,
    },
    easing: {
      easeIn: 'cubic-bezier(0.4, 0, 1, 1)',
      easeOut: 'cubic-bezier(0, 0, 0.2, 1)',
      easeInOut: 'cubic-bezier(0.4, 0, 0.2, 1)',
      spring: 'cubic-bezier(0.175, 0.885, 0.32, 1.275)',
    },
  },
  
  // Z-index layers
  zIndex: {
    negative: -1,
    base: 0,
    elevated: 1,
    dropdown: 10,
    sticky: 20,
    overlay: 30,
    modal: 40,
    popover: 50,
    tooltip: 60,
    notification: 70,
  },
  
  // Breakpoints (for responsive design)
  breakpoints: {
    xs: 320,
    sm: 375,
    md: 414,
    lg: 768,
    xl: 1024,
  },
};

// Component styles - Unified, modern components
export const COMPONENT_STYLES = {
  // Card styles - Clean, elevated surfaces
  card: {
    default: {
      backgroundColor: DESIGN_SYSTEM.colors.surface.card,
      borderRadius: DESIGN_SYSTEM.borderRadius.lg,
      padding: DESIGN_SYSTEM.spacing.lg,
      ...DESIGN_SYSTEM.shadows.card,
    },
    elevated: {
      backgroundColor: DESIGN_SYSTEM.colors.surface.card,
      borderRadius: DESIGN_SYSTEM.borderRadius.lg,
      padding: DESIGN_SYSTEM.spacing.xl,
      ...DESIGN_SYSTEM.shadows.elevated,
    },
    hero: {
      backgroundColor: DESIGN_SYSTEM.colors.surface.card,
      borderRadius: DESIGN_SYSTEM.borderRadius.lg,
      padding: DESIGN_SYSTEM.spacing.hero,
      ...DESIGN_SYSTEM.shadows.hero,
    },
  },
  
  // Button styles - Black interactive elements
  button: {
    primary: {
      backgroundColor: DESIGN_SYSTEM.colors.interactive,
      color: DESIGN_SYSTEM.colors.interactiveText,
      borderRadius: DESIGN_SYSTEM.borderRadius.lg,
      paddingVertical: 18,
      paddingHorizontal: 32,
      minHeight: 56,
      fontWeight: DESIGN_SYSTEM.typography.fontWeight.semibold,
      ...DESIGN_SYSTEM.shadows.card,
    },
    secondary: {
      backgroundColor: DESIGN_SYSTEM.colors.background.secondary,
      color: DESIGN_SYSTEM.colors.text.primary,
      borderRadius: DESIGN_SYSTEM.borderRadius.lg,
      paddingVertical: 18,
      paddingHorizontal: 32,
      minHeight: 56,
      borderWidth: 2,
      borderColor: DESIGN_SYSTEM.colors.surface.border,
      fontWeight: DESIGN_SYSTEM.typography.fontWeight.medium,
      ...DESIGN_SYSTEM.shadows.subtle,
    },
    accent: {
      backgroundColor: DESIGN_SYSTEM.colors.primary,
      color: DESIGN_SYSTEM.colors.text.inverse,
      borderRadius: DESIGN_SYSTEM.borderRadius.lg,
      paddingVertical: 18,
      paddingHorizontal: 32,
      minHeight: 56,
      fontWeight: DESIGN_SYSTEM.typography.fontWeight.semibold,
      ...DESIGN_SYSTEM.shadows.card,
    },
    ghost: {
      backgroundColor: 'transparent',
      color: DESIGN_SYSTEM.colors.text.secondary,
      borderRadius: DESIGN_SYSTEM.borderRadius.lg,
      paddingVertical: 14,
      paddingHorizontal: 24,
      borderWidth: 1,
      borderColor: DESIGN_SYSTEM.colors.surface.border,
      fontWeight: DESIGN_SYSTEM.typography.fontWeight.medium,
    },
  },
};

// Gradient definitions - Subtle, wellness-focused
export const GRADIENTS = {
  primary: [DESIGN_SYSTEM.colors.primary, DESIGN_SYSTEM.colors.primaryLight],
  background: [DESIGN_SYSTEM.colors.background.primary, DESIGN_SYSTEM.colors.background.tertiary],
  wellness: ['#E0F5F1', '#D4E5D3'],
  sunset: ['#FFE5D9', '#FFB5A7'],
  sky: ['#E3F2FD', '#A8DADC'],
};

// Animation presets
export const ANIMATIONS = {
  fadeIn: {
    from: { opacity: 0 },
    to: { opacity: 1 },
    duration: DESIGN_SYSTEM.transitions.duration.base,
  },
  slideUp: {
    from: { 
      opacity: 0,
      transform: [{ translateY: 20 }],
    },
    to: { 
      opacity: 1,
      transform: [{ translateY: 0 }],
    },
    duration: DESIGN_SYSTEM.transitions.duration.slow,
  },
  scale: {
    from: { 
      opacity: 0,
      transform: [{ scale: 0.9 }],
    },
    to: { 
      opacity: 1,
      transform: [{ scale: 1 }],
    },
    duration: DESIGN_SYSTEM.transitions.duration.base,
  },
  spring: {
    from: { 
      opacity: 0,
      transform: [{ scale: 0.3 }],
    },
    to: { 
      opacity: 1,
      transform: [{ scale: 1 }],
    },
    duration: DESIGN_SYSTEM.transitions.duration.slower,
    easing: DESIGN_SYSTEM.transitions.easing.spring,
  },
};

// Legacy color exports for backwards compatibility
export const COLORS = {
  // Main colors
  background: DESIGN_SYSTEM.colors.background.primary,
  surface: DESIGN_SYSTEM.colors.surface.card,
  primary: DESIGN_SYSTEM.colors.primary,
  accent: DESIGN_SYSTEM.colors.accent.peach,
  
  // Text colors
  text: DESIGN_SYSTEM.colors.text.primary,
  lightText: DESIGN_SYSTEM.colors.text.secondary,
  mutedText: DESIGN_SYSTEM.colors.text.tertiary,
  
  // Interactive
  buttonBg: DESIGN_SYSTEM.colors.interactive,
  buttonText: DESIGN_SYSTEM.colors.interactiveText,
  
  // Surface colors
  card: DESIGN_SYSTEM.colors.surface.card,
  border: DESIGN_SYSTEM.colors.surface.border,
  divider: DESIGN_SYSTEM.colors.surface.divider,
  
  // Utility
  WHITE: '#FFFFFF',
  BLACK: '#000000',
  TRANSPARENT: 'transparent',
};

// Rounded design system for backwards compatibility
export const ROUNDED_DESIGN = {
  radius: {
    small: DESIGN_SYSTEM.borderRadius.sm,
    medium: DESIGN_SYSTEM.borderRadius.md,
    large: DESIGN_SYSTEM.borderRadius.lg,
    pill: DESIGN_SYSTEM.borderRadius.full,
  },
  shadows: DESIGN_SYSTEM.shadows,
  spacing: DESIGN_SYSTEM.spacing,
  typography: {
    ...DESIGN_SYSTEM.typography.fontSize,
    weights: DESIGN_SYSTEM.typography.fontWeight,
    letterSpacing: DESIGN_SYSTEM.typography.letterSpacing,
    lineHeight: DESIGN_SYSTEM.typography.lineHeight,
  },
};

// Button styles for backwards compatibility
export const BUTTON_STYLES = COMPONENT_STYLES.button;

export default DESIGN_SYSTEM;