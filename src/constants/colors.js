export const COLORS = {
  // Japanese Zen Wellness 🌸 - Ultra-soft, minimal aesthetic
  background: '#FAFAF8',        // Pure silk (refined cream)
  surface: '#FFFFFF',           // Pure white (fresh snow)
  primary: '#7B8B8E',           // Soft sage (morning mist)
  accent: '#E5C4B1',            // Muted peach (sakura petals)
  secondary: '#B5A19A',         // Warm gray (natural stone)
  tertiary: '#F5F2ED',          // Soft beige (rice paper)
  
  // Text colors - refined and gentle
  text: '#2D3436',              // Deep charcoal (refined ink)
  lightText: '#636E72',         // Soft gray (gentle stone)
  mutedText: '#B2BEC3',         // Light gray (morning fog)
  
  // Surface colors - minimal and clean
  card: '#FFFFFF',              // Pure white
  cardHover: '#FAFAF8',         // Subtle hover state
  border: '#EEE8E3',            // Ultra-soft border
  divider: '#F5F2ED',           // Barely visible divider
  
  // Accent colors - muted wellness palette
  accentSecondary: '#A8B5B9',   // Soft blue-gray
  accentSoft: '#FAF8F5',        // Whisper cream
  highlight: '#E5C4B1',         // Soft highlight
  
  // Japanese wellness colors
  sakura: '#F4E4DD',            // Ultra-soft pink
  matcha: '#D4DDD6',            // Muted green tea
  lavender: '#E4D9E8',          // Soft purple
  sky: '#E1E8ED',               // Light blue-gray
  sand: '#F0E6DB',              // Warm sand
  
  // Semantic colors - ultra muted
  success: '#C3D4C8',           // Very soft green
  warning: '#F0E6DB',           // Gentle warm
  error: '#E8D0D0',             // Soft rose
  info: '#D4DDD6',              // Muted info
  
  // Interactive states
  buttonBg: '#F5F2ED',          // Default button
  buttonHover: '#EEE8E3',       // Hover state
  buttonActive: '#E5DDD6',      // Active state
  
  // Utility colors
  WHITE: '#FFFFFF',
  BLACK: '#000000',
  TRANSPARENT: 'transparent',
  
  // Legacy support (mapped to new palette)
  GRAY: '#636E72',              
  LIGHT_BLUE: '#E5C4B1',        
  DARK_BLUE: '#7B8B8E',         
  BLUE: '#E5C4B1'               
};

// Japanese Zen wellness combinations
export const ZEN_THEMES = {
  peaceful: {
    background: COLORS.background,  // Pure silk
    text: COLORS.text,              // Deep charcoal
    accent: COLORS.sakura,          // Soft pink
    card: COLORS.surface            // Pure white
  },
  contemplative: {
    background: COLORS.surface,     // Pure white
    text: COLORS.text,              // Deep charcoal
    accent: COLORS.matcha,          // Soft green
    card: COLORS.tertiary           // Rice paper
  },
  serene: {
    background: COLORS.background,  // Pure silk
    text: COLORS.text,              // Deep charcoal
    accent: COLORS.lavender,        // Soft purple
    card: COLORS.surface            // Pure white
  },
  mindful: {
    background: COLORS.tertiary,    // Rice paper
    text: COLORS.text,              // Deep charcoal
    accent: COLORS.sky,             // Light blue
    card: COLORS.surface            // Pure white
  }
};

// Ultra-soft Japanese design tokens
export const ROUNDED_DESIGN = {
  // Border radius values for organic, soft shapes
  radius: {
    minimal: 12,     // Subtle rounding
    gentle: 20,      // Standard buttons/inputs
    soft: 28,        // Cards and containers
    flowing: 36,     // Large components
    organic: 48,     // Pills and floating elements
    full: 999,       // Perfect circles
  },
  
  // Shadow values - ultra subtle and soft
  shadows: {
    minimal: {
      shadowColor: COLORS.text,
      shadowOffset: { width: 0, height: 1 },
      shadowOpacity: 0.03,
      shadowRadius: 4,
      elevation: 1,
    },
    gentle: {
      shadowColor: COLORS.text,
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.04,
      shadowRadius: 10,
      elevation: 2,
    },
    soft: {
      shadowColor: COLORS.text,
      shadowOffset: { width: 0, height: 4 },
      shadowOpacity: 0.06,
      shadowRadius: 20,
      elevation: 3,
    },
    floating: {
      shadowColor: COLORS.text,
      shadowOffset: { width: 0, height: 8 },
      shadowOpacity: 0.08,
      shadowRadius: 30,
      elevation: 5,
    },
    hover: {
      shadowColor: COLORS.text,
      shadowOffset: { width: 0, height: 12 },
      shadowOpacity: 0.10,
      shadowRadius: 40,
      elevation: 8,
    },
  },
  
  // Spacing for zen-like layout
  spacing: {
    micro: 2,
    minimal: 4,
    gentle: 8,
    comfortable: 16,
    spacious: 24,
    generous: 32,
    expansive: 48,
    luxurious: 64,
  },
  
  // Typography scale
  typography: {
    tiny: 11,
    small: 13,
    body: 15,
    medium: 17,
    large: 21,
    xlarge: 28,
    xxlarge: 36,
  }
};

export default COLORS;