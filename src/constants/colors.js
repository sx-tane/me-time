export const COLORS = {
  // Minimalist 3-color Japanese Zen palette
  background: '#F7F5F3',        // Primary: Warm off-white (washi paper)
  primary: '#3C3C3C',           // Secondary: Deep charcoal (sumi ink)
  secondary: '#8A8A8A',         // Tertiary: Soft gray (stone)
  tertiary: '#F7F5F3',          // Background repeated for consistency
  
  // Text colors (using the 3-color palette)
  text: '#3C3C3C',              // Deep charcoal for main text
  lightText: '#8A8A8A',         // Soft gray for secondary text
  mutedText: '#8A8A8A',         // Consistent gray
  
  // Surface colors (monotone variations)
  card: '#FEFEFE',              // Pure white cards for contrast
  surface: '#F7F5F3',           // Same as background
  divider: '#E8E8E8',           // Very subtle divider
  
  // Accent colors (minimal, using existing palette)
  accent: '#8A8A8A',            // Soft gray accent
  accentSecondary: '#3C3C3C',   // Charcoal accent
  accentSoft: '#F7F5F3',        // Background tone
  
  // Japanese-inspired colors (minimal, zen approach)
  matcha: '#8A8A8A',            // Matcha represented in gray scale
  sakura: '#F7F5F3',            // Sakura as background tone
  bamboo: '#8A8A8A',            // Bamboo as soft gray
  stone: '#8A8A8A',             // Stone gray (main tertiary)
  mist: '#F7F5F3',              // Morning mist as background
  cedar: '#3C3C3C',             // Cedar as deep charcoal
  
  // Semantic colors (minimalist zen approach)
  success: '#8A8A8A',           // Success in soft gray
  warning: '#3C3C3C',           // Warning in dark charcoal for visibility
  error: '#3C3C3C',             // Error in dark charcoal
  info: '#8A8A8A',              // Info in soft gray
  
  // Utility colors
  WHITE: '#FFFFFF',
  BLACK: '#000000',
  TRANSPARENT: 'transparent',
  
  // Legacy support (gradually transition away from these)
  GRAY: '#8A8A8A',
  LIGHT_BLUE: '#F7F5F3',
  DARK_BLUE: '#3C3C3C',
  BLUE: '#8A8A8A'
};

// Color combinations for different UI states (3-color zen approach)
export const ZEN_THEMES = {
  peaceful: {
    background: COLORS.background,  // Warm off-white
    text: COLORS.text,              // Deep charcoal
    accent: COLORS.secondary,       // Soft gray
    card: COLORS.card               // Pure white
  },
  contemplative: {
    background: COLORS.background,  // Warm off-white
    text: COLORS.text,              // Deep charcoal
    accent: COLORS.secondary,       // Soft gray
    card: COLORS.card               // Pure white
  },
  serene: {
    background: COLORS.background,  // Warm off-white
    text: COLORS.text,              // Deep charcoal
    accent: COLORS.secondary,       // Soft gray
    card: COLORS.card               // Pure white
  }
};

export default COLORS;