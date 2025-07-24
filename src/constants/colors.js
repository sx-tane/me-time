export const COLORS = {
  // Japanese WA (和) Harmony 🌸 - Soft, rounded, natural aesthetic
  background: '#FDF7F0',        // Warm cream (washi paper)
  surface: '#FFFFFF',           // Pure white (snow on tatami)
  primary: '#4A5D4F',           // Forest green (pine needles)
  accent: '#E8B4A0',            // Soft coral (cherry blossom)
  secondary: '#C4A484',         // Warm taupe (bamboo)
  tertiary: '#F4F0E8',          // Whisper beige (morning mist)
  
  // Text colors inspired by traditional Japanese ink
  text: '#3C4142',              // Charcoal (sumi ink)
  lightText: '#8B8680',         // Soft gray (river stone)
  mutedText: '#A4A19C',         // Light ash (morning fog)
  
  // Surface colors (nature-inspired harmony)
  card: '#FFFFFF',              // Pure white (clean tatami)
  border: '#F0EAE2',            // Soft pearl (gentle boundaries)
  divider: '#F0EAE2',           // Gentle separation
  
  // Accent colors (natural harmony)
  accentSecondary: '#7A8A7D',   // Sage green accent
  accentSoft: '#F9F3EB',        // Soft cream tone
  highlight: '#D4B896',         // Golden honey (warm light)
  
  // Japanese-inspired nature colors
  deepForest: '#4A5D4F',        // Deep forest green
  cherryBloom: '#E8B4A0',       // Soft cherry blossom
  moonlight: '#FFFFFF',         // Pure moonlight
  earthen: '#C4A484',           // Natural earth
  sunrise: '#D4B896',           // Golden morning
  mist: '#F9F3EB',              // Gentle mist
  
  // Semantic colors (nature-themed)
  success: '#7A9B7E',           // Soft sage for positive actions
  warning: '#D4B896',           // Warm honey for caution
  error: '#B4847C',             // Muted rose for notices
  info: '#8B8680',              // Soft stone for information
  
  // Utility colors
  WHITE: '#FFFFFF',
  BLACK: '#000000',
  TRANSPARENT: 'transparent',
  
  // Legacy support (mapped to new WA palette)
  GRAY: '#8B8680',              // River stone gray
  LIGHT_BLUE: '#E8B4A0',        // Cherry blossom
  DARK_BLUE: '#4A5D4F',         // Forest green
  BLUE: '#E8B4A0'               // Cherry blossom
};

// Japanese WA (和) themed combinations for harmony
export const ZEN_THEMES = {
  peaceful: {
    background: COLORS.background,  // Warm cream
    text: COLORS.text,              // Charcoal ink
    accent: COLORS.accent,          // Cherry blossom
    card: COLORS.surface            // Pure white
  },
  contemplative: {
    background: COLORS.surface,     // Pure white
    text: COLORS.primary,           // Forest green
    accent: COLORS.highlight,       // Golden honey
    card: COLORS.background         // Warm cream
  },
  serene: {
    background: COLORS.background,  // Warm cream
    text: COLORS.text,              // Charcoal ink
    accent: COLORS.accent,          // Cherry blossom
    card: COLORS.surface            // Pure white
  },
  garden: {
    background: COLORS.primary,     // Forest depths
    text: COLORS.surface,           // Pure white
    accent: COLORS.accent,          // Cherry blossom
    card: COLORS.background         // Cream cards
  }
};

// Rounded design tokens for WA aesthetic
export const ROUNDED_DESIGN = {
  // Border radius values for organic, soft shapes
  radius: {
    minimal: 8,      // Subtle rounding
    gentle: 16,      // Standard buttons/cards
    soft: 24,        // Modal corners
    flowing: 32,     // Large components
    organic: 40,     // Pills and floating elements
  },
  
  // Shadow values for depth and softness
  shadows: {
    gentle: {
      shadowColor: COLORS.text,
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.06,
      shadowRadius: 8,
      elevation: 2,
    },
    soft: {
      shadowColor: COLORS.text,
      shadowOffset: { width: 0, height: 4 },
      shadowOpacity: 0.08,
      shadowRadius: 12,
      elevation: 4,
    },
    floating: {
      shadowColor: COLORS.text,
      shadowOffset: { width: 0, height: 8 },
      shadowOpacity: 0.12,
      shadowRadius: 20,
      elevation: 8,
    },
  },
  
  // Spacing for harmonious layout
  spacing: {
    minimal: 4,
    gentle: 8,
    comfortable: 16,
    spacious: 24,
    generous: 32,
    expansive: 48,
  }
};

export default COLORS;