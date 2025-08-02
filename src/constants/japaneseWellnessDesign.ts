// Japanese Wellness Design System - 和の美学
// Inspired by Japanese aesthetics: Wabi-sabi, Ma (negative space), and Zen minimalism

import { ViewStyle } from 'react-native';

interface Philosophy {
  wabisabi: string;
  ma: string;
  kanso: string;
  shizen: string;
  yugen: string;
  shibui: string;
  seijaku: string;
}

interface PrimaryColorScale {
  50: string;
  100: string;
  200: string;
  300: string;
  400: string;
  500: string;
  600: string;
  700: string;
  800: string;
  900: string;
  // Extended colors for compatibility
  sage?: string;
  bamboo?: string;
}

interface AccentColors {
  sakura: string;
  matcha: string;
  kurenai: string;
  asagi: string;
  yamabuki: string;
  fuji: string;
  momiji: string;
  ai: string;
  // Additional wellness-focused colors
  hinoki: string;     // Japanese cypress - warm wood
  take: string;       // Bamboo green - growth
  tsuchi: string;     // Rich earth - grounding
  umi: string;        // Deep ocean - depth
  yuki: string;       // Snow white - purity
  kiri: string;       // Paulownia purple - nobility
  kumo: string;       // Cloud gray - serenity
  shizen: string;     // Natural beige - harmony
}

interface JapaneseColors {
  primary: PrimaryColorScale;
  accent: AccentColors;
  neutral: PrimaryColorScale;
  background: {
    primary: string;
    secondary: string;
    tertiary: string;
    paper: string;
    mist: string;
    meditation: string;
    ritual: string;
    sanctuary: string;
  };
  text: {
    primary: string;
    secondary: string;
    tertiary: string;
    muted: string;
    inverse: string;
  };
  semantic: {
    success: string;
    warning: string;
    error: string;
    info: string;
  };
  surface: {
    card: string;
    elevated: string;
    overlay: string;
    border: string;
    divider: string;
  };
  // Legacy color mappings for compatibility
  waveBlue: string;
  sunrise: string;
  deepWater: string;
  // Earth color palette
  earth: {
    mist: string;
    charcoal: string;
  };
}

interface JapaneseTypography {
  fontFamily: {
    primary: string;
    japanese: string;
    english: string;
  };
  fontSize: {
    xs: number;
    sm: number;
    base: number;
    md: number;
    lg: number;
    xl: number;
    '2xl': number;
    '3xl': number;
  };
  fontWeight: {
    light: string;
    regular: string;
    medium: string;
    semibold: string;
  };
  lineHeight: {
    tight: number;
    normal: number;
    relaxed: number;
    loose: number;
  };
  letterSpacing: {
    tighter: number;
    tight: number;
    normal: number;
    wide: number;
    wider: number;
    widest: number;
    zen: number;
  };
  // Sizes for extended typography
  sizes: {
    xs: number;
    sm: number;
    md: number;
    lg: number;
    xl: number;
    title: number;
  };
}

interface JapaneseSpacing {
  0: number;
  1: number;
  2: number;
  3: number;
  4: number;
  5: number;
  6: number;
  8: number;
  10: number;
  12: number;
  16: number;
  20: number;
  24: number;
  32: number;
  // Ma (間) - Traditional Japanese spatial harmonies
  ma: {
    breath: number;      // 息 - Breathing space
    pause: number;       // 間 - Thoughtful pause
    contemplation: number; // 瞑想 - Deep contemplation
    ceremony: number;    // 儀式 - Ceremonial spacing
    sanctuary: number;   // 聖域 - Sacred space
    horizon: number;     // 地平線 - Expansive space
  };
  // Golden ratio based spacing for natural harmony
  golden: {
    xs: number;
    sm: number;
    md: number;
    lg: number;
    xl: number;
    xxl: number;
  };
}

interface OrganicBorderRadius {
  topLeft: number;
  topRight: number;
  bottomLeft: number;
  bottomRight: number;
}

interface OrganicShapes {
  subtle: OrganicBorderRadius;
  natural: OrganicBorderRadius;
  flowing: OrganicBorderRadius;
  stone: OrganicBorderRadius;
  leaf: OrganicBorderRadius;
  pebble: OrganicBorderRadius;
}

interface JapaneseBorderRadius {
  none: number;
  sm: number;
  md: number;
  lg: number;
  xl: number;
  '2xl': number;
  full: number;
  organic: OrganicBorderRadius;
  organicShapes: OrganicShapes;
}

interface ShadowStyle {
  shadowColor: string;
  shadowOffset: { width: number; height: number };
  shadowOpacity: number;
  shadowRadius: number;
  elevation: number;
}

interface JapaneseShadows {
  none: string;
  xs: ShadowStyle;
  sm: ShadowStyle;
  md: ShadowStyle;
  lg: ShadowStyle;
  xl: ShadowStyle;
  // Extended shadow styles
  zen: ShadowStyle;
  meditation: ShadowStyle;
}

interface JapaneseWellnessDesign {
  philosophy: Philosophy;
  colors: JapaneseColors;
  typography: JapaneseTypography;
  spacing: JapaneseSpacing;
  borderRadius: JapaneseBorderRadius;
  shadows: JapaneseShadows;
  animation: {
    duration: {
      instant: number;
      fast: number;
      normal: number;
      slow: number;
      slower: number;
      slowest: number;
    };
    easing: {
      natural: string;
      smooth: string;
      snappy: string;
      gentle: string;
    };
  };
  layout: {
    goldenRatio: number;
    tatami: { width: number; height: number };
    container: {
      sm: number;
      md: number;
      lg: number;
      xl: number;
    };
    grid: {
      columns: number;
      gutter: number;
      contentRatio: number;
      breathingRoom: number;
    };
    proportions: {
      shakkanhō: number;
      kiwari: number;
      modulor: number;
      tatami: number;
    };
    zen: {
      asymmetry: number;
      simplicity: number;
      naturalness: number;
      subtlety: number;
    };
  };
  elements: {
    patterns: {
      seigaiha: string;
      asanoha: string;
      shippo: string;
      sakura: string;
      kumiko: string;
      yabane: string;
      uroko: string;
      igeta: string;
    };
    shapes: {
      circle: string;
      organic: string;
      flowing: string;
      stone: string;
      leaf: string;
      water: string;
    };
    textures: {
      washi: string;
      sumi: string;
      bamboo: string;
      wood: string;
      stone: string;
      water: string;
    };
    symbols: {
      enso: string;
      torii: string;
      mon: string;
      kanji: string;
    };
  };
}

export const JAPANESE_WELLNESS_DESIGN: JapaneseWellnessDesign = {
  // Core Design Philosophy
  philosophy: {
    wabisabi: 'Finding beauty in imperfection and simplicity',
    ma: 'The purposeful use of empty space',
    kanso: 'Simplicity and elimination of clutter',
    shizen: 'Natural, effortless appearance',
    yugen: 'Subtle grace and hidden beauty',
    shibui: 'Understated elegance',
    seijaku: 'Tranquility and calm',
  },

  // Color Palette - 和の色 (Japanese Colors)
  colors: {
    // Primary - Enhanced wellness earth tones with deeper grounding
    primary: {
      50: '#FAF9F7',   // 生成り色 (Kinari-iro) - Warmer natural
      100: '#F3EFE6',  // 鳥の子色 (Torinoko-iro) - Warmer eggshell
      200: '#E5DBC8',  // 香色 (Kou-iro) - Deeper incense
      300: '#D0BFA8',  // 砂色 (Suna-iro) - Richer sand
      400: '#B59B7F',  // 胡桃色 (Kurumi-iro) - Deeper walnut
      500: '#967A5A',  // 柴色 (Shiba-iro) - Richer brushwood (Main)
      600: '#755E44',  // 煤竹色 (Susutake-iro) - Deeper weathered bamboo
      700: '#574433',  // 焦茶 (Koge-cha) - Warmer dark brown
      800: '#3B2F26',  // 黒茶 (Kuro-cha) - Richer black tea
      900: '#261F18',  // 墨色 (Sumi-iro) - Deeper ink
      // Extended colors for compatibility
      sage: '#7BA05B',   // Sage green
      bamboo: '#A8C68F', // Bamboo green
    },

    // Accent Colors - Enhanced natural Japanese wellness palette
    accent: {
      sakura: '#F7E7E7',      // 桜色 - Soft cherry blossom (more muted)
      matcha: '#A8C68F',      // 抹茶色 - Deeper matcha green
      kurenai: '#C7919A',     // 紅色 - Muted crimson pink
      asagi: '#7FB8D3',       // 浅葱色 - Calmer light blue
      yamabuki: '#E6A500',    // 山吹色 - Warmer golden yellow
      fuji: '#A08BB5',        // 藤色 - Deeper wisteria purple
      momiji: '#B63A3C',      // 紅葉色 - Richer autumn red
      ai: '#3D5F8F',          // 藍色 - Deeper indigo blue
      // Enhanced wellness-focused colors
      hinoki: '#D4B896',      // 檜色 - Japanese cypress wood
      take: '#7BA05B',        // 竹色 - Bamboo green for growth
      tsuchi: '#8B6914',      // 土色 - Rich earth brown
      umi: '#2F5F8F',         // 海色 - Deep ocean blue
      yuki: '#FEFFFE',        // 雪色 - Pure snow white
      kiri: '#9A7AA0',        // 桐色 - Paulownia purple
      kumo: '#A8A8A8',        // 雲色 - Cloud gray
      shizen: '#E6DDD4',      // 自然色 - Natural harmony beige
    },

    // Neutral Grays - 鼠色系 (Nezumi-iro)
    neutral: {
      50: '#FAFAFA',   // 白鼠 (Shiro-nezu) - White mouse
      100: '#F5F5F5',  // 銀鼠 (Gin-nezu) - Silver mouse
      200: '#E5E5E5',  // 灰白色 (Kaihaku-shoku) - Ash white
      300: '#D4D4D4',  // 素鼠 (Su-nezu) - Plain mouse
      400: '#A3A3A3',  // 利休鼠 (Rikyu-nezu) - Rikyu gray
      500: '#737373',  // 鼠色 (Nezumi-iro) - Mouse gray
      600: '#525252',  // 墨染 (Sumizome) - Ink dyed
      700: '#404040',  // 消炭色 (Keshizumi-iro) - Charcoal
      800: '#262626',  // 呂色 (Ro-iro) - Lacquer black
      900: '#171717',  // 漆黒 (Shikkoku) - Jet black
    },

    // Background Colors - Enhanced for deeper wellness atmosphere
    background: {
      primary: '#FAF9F7',     // Main background - Warmer natural paper
      secondary: '#FEFFFE',    // Snow white - 雪色
      tertiary: '#F3EFE6',    // Warmer light - Enhanced eggshell
      paper: '#FBF9F6',       // Paper texture
      mist: 'rgba(250, 249, 247, 0.88)', // Slightly more opaque overlay
      meditation: '#F8F6F3',  // 瞑想 - Meditation background
      ritual: '#F6F3F0',      // 儀式 - Ritual/ceremony background
      sanctuary: '#F4F1ED',   // 聖域 - Sacred space background
    },

    // Text Colors
    text: {
      primary: '#2A211B',     // Sumi ink - High contrast
      secondary: '#5C4937',   // Dark brown - Medium contrast
      tertiary: '#7A6249',    // Weathered bamboo - Low contrast
      muted: '#9B7E5F',       // Brushwood - Very low contrast
      inverse: '#FAF8F5',     // Light text on dark
    },

    // Semantic Colors
    semantic: {
      success: '#7CB342',     // 若草色 (Wakakusa) - Young grass
      warning: '#F8B500',     // 山吹色 (Yamabuki) - Golden
      error: '#CB4042',       // 紅葉色 (Momiji) - Autumn red
      info: '#4A6FA5',        // 藍色 (Ai) - Indigo
    },

    // Surface Colors
    surface: {
      card: '#FFFFFF',
      elevated: '#FBFBFB',
      overlay: 'rgba(26, 21, 19, 0.08)',
      border: 'rgba(155, 126, 95, 0.15)',
      divider: 'rgba(155, 126, 95, 0.08)',
    },

    // Legacy color mappings for compatibility
    waveBlue: '#7FB8D3',    // Maps to asagi
    sunrise: '#E6A500',     // Maps to yamabuki  
    deepWater: '#2F5F8F',   // Maps to umi
    
    // Earth color palette
    earth: {
      mist: '#F3EFE6',      // Light earth mist
      charcoal: '#3B2F26',  // Dark earth charcoal
    }
  },

  // Typography - Clean, minimal hierarchy
  typography: {
    // Font families
    fontFamily: {
      // iOS: SF Pro for Latin, Hiragino for Japanese
      // Android: Roboto for Latin, Noto Sans JP for Japanese
      primary: 'System',
      japanese: 'Hiragino Sans, Noto Sans JP, Yu Gothic, sans-serif',
      english: '-apple-system, BlinkMacSystemFont, "SF Pro Text", Roboto, sans-serif',
    },

    // Font sizes - Golden ratio based
    fontSize: {
      xs: 11,      // 極小
      sm: 13,      // 小
      base: 16,    // 基本
      md: 20,      // 中
      lg: 25,      // 大
      xl: 31,      // 特大
      '2xl': 39,   // 超特大
      '3xl': 48,   // 巨大
    },

    // Font weights - Limited for simplicity
    fontWeight: {
      light: '300',
      regular: '400',
      medium: '500',
      semibold: '600',
    },

    // Line heights - Generous spacing
    lineHeight: {
      tight: 1.25,
      normal: 1.5,
      relaxed: 1.75,
      loose: 2,
    },

    // Letter spacing
    letterSpacing: {
      tighter: -0.5,
      tight: -0.25,
      normal: 0,
      wide: 0.25,
      wider: 0.5,
      widest: 1,
      zen: 0.75,      // Zen spacing for meditation
    },
    
    // Sizes for extended typography
    sizes: {
      xs: 11,
      sm: 13,
      md: 20,
      lg: 25,
      xl: 31,
      title: 28,
    },
  },

  // Spacing - Enhanced with Ma (間) - Japanese spatial philosophy
  spacing: {
    0: 0,
    1: 4,    // 一分 (1 bu)
    2: 8,    // 二分 (2 bu)
    3: 12,   // 三分 (3 bu)
    4: 16,   // 四分 (4 bu)
    5: 20,   // 五分 (5 bu)
    6: 24,   // 六分 (6 bu)
    8: 32,   // 八分 (8 bu)
    10: 40,  // 一寸 (1 sun)
    12: 48,  
    16: 64,  
    20: 80,  
    24: 96,  
    32: 128,
    
    // Ma (間) - The purposeful use of empty space for mindfulness
    ma: {
      breath: 8,         // 息 - Natural breathing rhythm spacing
      pause: 16,         // 間 - Thoughtful pause between elements
      contemplation: 32, // 瞑想 - Space for deep reflection
      ceremony: 48,      // 儀式 - Ceremonial, respectful spacing
      sanctuary: 64,     // 聖域 - Sacred, expansive space
      horizon: 96,       // 地平線 - Horizon-like vastness
    },
    
    // Golden ratio spacing for natural visual harmony
    golden: {
      xs: 6,    // φ * 4
      sm: 10,   // φ * 6
      md: 16,   // φ * 10
      lg: 26,   // φ * 16
      xl: 42,   // φ * 26
      xxl: 68,  // φ * 42
    },
  },

  // Border Radius - Soft, organic curves inspired by nature
  borderRadius: {
    none: 0,
    sm: 4,      // Subtle rounding
    md: 8,      // Default rounding
    lg: 12,     // Card rounding
    xl: 16,     // Large elements
    '2xl': 24,  // Extra large
    full: 9999, // Perfect circles
    organic: {  // Asymmetric, natural curves
      topLeft: 20,
      topRight: 16,
      bottomLeft: 18,
      bottomRight: 22,
    },
    // Enhanced organic shapes inspired by Japanese nature
    organicShapes: {
      subtle: {   // 微妙 (Bimyō) - Barely noticeable asymmetry
        topLeft: 8,
        topRight: 10,
        bottomLeft: 9,
        bottomRight: 7,
      },
      natural: {  // 自然 (Shizen) - Natural variation
        topLeft: 16,
        topRight: 20,
        bottomLeft: 18,
        bottomRight: 14,
      },
      flowing: {  // 流れ (Nagare) - Water-like flow
        topLeft: 24,
        topRight: 8,
        bottomLeft: 12,
        bottomRight: 28,
      },
      stone: {    // 石 (Ishi) - River stone smoothness
        topLeft: 32,
        topRight: 28,
        bottomLeft: 30,
        bottomRight: 26,
      },
      leaf: {     // 葉 (Ha) - Organic leaf shape
        topLeft: 4,
        topRight: 32,
        bottomLeft: 24,
        bottomRight: 8,
      },
      pebble: {   // 小石 (Koishi) - Small pebble
        topLeft: 40,
        topRight: 36,
        bottomLeft: 38,
        bottomRight: 42,
      },
    },
  },

  // Shadows - Soft, diffused 影 (kage)
  shadows: {
    none: 'none',
    xs: {
      shadowColor: '#2A211B',
      shadowOffset: { width: 0, height: 1 },
      shadowOpacity: 0.05,
      shadowRadius: 2,
      elevation: 1,
    },
    sm: {
      shadowColor: '#2A211B',
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.08,
      shadowRadius: 8,
      elevation: 2,
    },
    md: {
      shadowColor: '#2A211B',
      shadowOffset: { width: 0, height: 4 },
      shadowOpacity: 0.10,
      shadowRadius: 16,
      elevation: 4,
    },
    lg: {
      shadowColor: '#2A211B',
      shadowOffset: { width: 0, height: 8 },
      shadowOpacity: 0.12,
      shadowRadius: 24,
      elevation: 8,
    },
    xl: {
      shadowColor: '#2A211B',
      shadowOffset: { width: 0, height: 16 },
      shadowOpacity: 0.14,
      shadowRadius: 32,
      elevation: 16,
    },
    // Extended shadow styles
    zen: {
      shadowColor: '#2A211B',
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.06,
      shadowRadius: 12,
      elevation: 3,
    },
    meditation: {
      shadowColor: '#2A211B',
      shadowOffset: { width: 0, height: 4 },
      shadowOpacity: 0.08,
      shadowRadius: 16,
      elevation: 4,
    },
  },

  // Animations - Natural, organic timing
  animation: {
    duration: {
      instant: 50,
      fast: 200,
      normal: 350,
      slow: 500,
      slower: 750,
      slowest: 1000,
    },
    easing: {
      // Natural easing curves
      natural: 'cubic-bezier(0.4, 0.0, 0.2, 1)',
      smooth: 'cubic-bezier(0.45, 0, 0.55, 1)',
      snappy: 'cubic-bezier(0.68, -0.55, 0.265, 1.55)',
      gentle: 'cubic-bezier(0.25, 0.46, 0.45, 0.94)',
    },
  },

  // Layout patterns - Enhanced with Japanese proportional philosophy
  layout: {
    // Golden ratio and traditional proportions
    goldenRatio: 1.618,
    tatami: { width: 2, height: 1 }, // Traditional tatami proportions
    
    // Container widths with Ma-inspired spacing
    container: {
      sm: 640,
      md: 768,
      lg: 1024,
      xl: 1280,
    },
    
    // Grid system with Japanese spatial harmony
    grid: {
      columns: 12,
      gutter: 16,
      // Ma-based content ratios
      contentRatio: 0.618,     // Golden ratio for content vs space
      breathingRoom: 0.382,    // Complementary space ratio
    },
    
    // Traditional Japanese proportional relationships
    proportions: {
      shakkanhō: 1.818,       // 尺貫法 - Traditional measurement system
      kiwari: 2.0,            // 木割 - Wood proportion system
      modulor: 1.618,         // Le Corbusier's golden section
      tatami: 2.0,            // Tatami mat proportion
    },
    
    // Zen garden spacing principles
    zen: {
      asymmetry: 0.618,       // 非対称 - Asymmetrical balance
      simplicity: 0.5,        // 簡素 - Extreme simplification
      naturalness: 0.786,     // 自然 - Natural proportions
      subtlety: 0.382,        // 微妙 - Subtle relationships
    },
  },

  // Visual elements - Enhanced Japanese cultural design vocabulary
  elements: {
    // Traditional decorative patterns - 和柄 (Wagara)
    patterns: {
      seigaiha: '青海波 - Wave pattern representing calm seas and good fortune',
      asanoha: '麻の葉 - Hemp leaf pattern for growth and protection',
      shippo: '七宝 - Seven treasures pattern for harmony and relationships',
      sakura: '桜 - Cherry blossom pattern for life and renewal',
      kumiko: '組子 - Geometric woodwork pattern for precision and craft',
      yabane: '矢羽 - Arrow feather pattern for protection and progress',
      uroko: '鱗 - Fish scale pattern for protection and flexibility',
      igeta: '井桁 - Well curb pattern for stability and community',
    },
    
    // Natural shapes inspired by Japanese aesthetics
    shapes: {
      circle: '円相 - Ensō circle of enlightenment and completeness',
      organic: '自然形 - Natural, imperfect curves embracing wabi-sabi',
      flowing: '流れ - Water-like, fluid forms representing life flow',
      stone: '石 - River stone smoothness representing endurance',
      leaf: '葉 - Organic leaf shapes representing growth and seasons',
      water: '水 - Water drop forms representing purity and life',
    },
    
    // Traditional textures - 質感 (Shitsukan)
    textures: {
      washi: '和紙 - Traditional paper texture for warmth and craft',
      sumi: '墨 - Ink brush texture for expression and depth',
      bamboo: '竹 - Bamboo grain for flexibility and growth',
      wood: '木 - Natural wood grain for grounding and stability',
      stone: '石 - Stone texture for permanence and strength',
      water: '水 - Water ripple texture for flow and tranquility',
    },
    
    // Cultural symbols - 文化シンボル (Bunka shinboru)
    symbols: {
      enso: '円相 - Zen circle representing enlightenment and the void',
      torii: '鳥居 - Shrine gate representing transition and sacred space',
      mon: '紋 - Family crest representing identity and heritage',
      kanji: '漢字 - Characters representing meaning and philosophy',
    },
  },
};

interface JapaneseCardStyles {
  default: ViewStyle;
  elevated: ViewStyle;
  organic: ViewStyle;
}

interface JapaneseButtonStyles {
  primary: ViewStyle;
  secondary: ViewStyle;
  ghost: ViewStyle;
}

interface JapaneseComponents {
  card: JapaneseCardStyles;
  button: JapaneseButtonStyles;
}

// Component-specific styles
export const JAPANESE_COMPONENTS: JapaneseComponents = {
  // Card variations - 和紙 (washi) inspired
  card: {
    default: {
      backgroundColor: JAPANESE_WELLNESS_DESIGN.colors.surface.card,
      borderRadius: JAPANESE_WELLNESS_DESIGN.borderRadius.lg,
      padding: JAPANESE_WELLNESS_DESIGN.spacing[6],
      borderWidth: 1,
      borderColor: JAPANESE_WELLNESS_DESIGN.colors.surface.border,
      ...JAPANESE_WELLNESS_DESIGN.shadows.sm,
    },
    elevated: {
      backgroundColor: JAPANESE_WELLNESS_DESIGN.colors.surface.elevated,
      borderRadius: JAPANESE_WELLNESS_DESIGN.borderRadius.xl,
      padding: JAPANESE_WELLNESS_DESIGN.spacing[8],
      ...JAPANESE_WELLNESS_DESIGN.shadows.md,
    },
    organic: {
      backgroundColor: JAPANESE_WELLNESS_DESIGN.colors.surface.card,
      borderTopLeftRadius: 16,
      borderTopRightRadius: 20,
      borderBottomLeftRadius: 18,
      borderBottomRightRadius: 14,
      padding: JAPANESE_WELLNESS_DESIGN.spacing[6],
      ...JAPANESE_WELLNESS_DESIGN.shadows.sm,
    },
  },

  // Button variations
  button: {
    primary: {
      backgroundColor: JAPANESE_WELLNESS_DESIGN.colors.primary[600],
      borderRadius: JAPANESE_WELLNESS_DESIGN.borderRadius.full,
      paddingVertical: JAPANESE_WELLNESS_DESIGN.spacing[4],
      paddingHorizontal: JAPANESE_WELLNESS_DESIGN.spacing[8],
      minHeight: 48,
      ...JAPANESE_WELLNESS_DESIGN.shadows.sm,
    },
    secondary: {
      backgroundColor: 'transparent',
      borderRadius: JAPANESE_WELLNESS_DESIGN.borderRadius.full,
      borderWidth: 1.5,
      borderColor: JAPANESE_WELLNESS_DESIGN.colors.primary[300],
      paddingVertical: JAPANESE_WELLNESS_DESIGN.spacing[4],
      paddingHorizontal: JAPANESE_WELLNESS_DESIGN.spacing[8],
      minHeight: 48,
    },
    ghost: {
      backgroundColor: 'transparent',
      paddingVertical: JAPANESE_WELLNESS_DESIGN.spacing[3],
      paddingHorizontal: JAPANESE_WELLNESS_DESIGN.spacing[6],
    },
  },
};


interface JapaneseGradients {
  dawn: string[];
  mist: string[];
  sunset: string[];
  forest: string[];
  ocean: string[];
  earth: string[];
  // Enhanced wellness gradients
  meditation: string[];
  bamboo: string[];
  stone: string[];
  tea: string[];
  incense: string[];
  moonlight: string[];
}

// Enhanced gradients - Subtle, nature-inspired wellness palettes
export const JAPANESE_GRADIENTS: JapaneseGradients = {
  // Dawn - 暁 (akatsuki) - New beginnings
  dawn: ['#FAF9F7', '#F7E7E7', '#F3EFE6'],
  
  // Mist - 霧 (kiri) - Gentle concealment
  mist: ['rgba(250, 249, 247, 0.0)', 'rgba(250, 249, 247, 0.7)', 'rgba(250, 249, 247, 0.95)'],
  
  // Sunset - 夕焼け (yūyake) - Peaceful endings
  sunset: ['#F7E7E7', '#C7919A', '#B63A3C'],
  
  // Forest - 森 (mori) - Growth and life
  forest: ['#A8C68F', '#7BA05B', '#5C813B'],
  
  // Ocean - 海 (umi) - Depth and vastness
  ocean: ['#7FB8D3', '#3D5F8F', '#2F5F8F'],
  
  // Earth - 土 (tsuchi) - Grounding and stability
  earth: ['#E6DDD4', '#D0BFA8', '#967A5A'],
  
  // Meditation - 瞑想 (meisou) - Inner peace
  meditation: ['#FAF9F7', '#F8F6F3', '#F6F3F0'],
  
  // Bamboo - 竹 (take) - Flexibility and growth
  bamboo: ['#A8C68F', '#7BA05B', '#D4B896'],
  
  // Stone - 石 (ishi) - Permanence and strength
  stone: ['#D0BFA8', '#B59B7F', '#967A5A'],
  
  // Tea - 茶 (cha) - Contemplation and ritual
  tea: ['#E6DDD4', '#D0BFA8', '#8B6914'],
  
  // Incense - 香 (kō) - Spiritual elevation
  incense: ['#F6F3F0', '#E5DBC8', '#A08BB5'],
  
  // Moonlight - 月光 (gekkō) - Gentle illumination
  moonlight: ['#FEFFFE', '#FAF9F7', '#A8A8A8'],
};

// Cultural pattern utilities for creating authentic Japanese design elements
export const CULTURAL_PATTERNS = {
  // SVG pattern definitions for backgrounds and decorations
  seigaiha: {
    // 青海波 - Wave pattern SVG path
    path: 'M0,40 Q20,20 40,40 Q60,20 80,40 Q100,20 120,40 M0,80 Q20,60 40,80 Q60,60 80,80 Q100,60 120,80',
    viewBox: '0 0 120 80',
    repeat: 'repeat',
    meaning: 'Calm seas, good fortune, tranquility'
  },
  
  asanoha: {
    // 麻の葉 - Hemp leaf hexagonal pattern
    path: 'M50,0 L75,25 L75,75 L50,100 L25,75 L25,25 Z M50,25 L62.5,37.5 M50,25 L37.5,37.5 M50,75 L62.5,62.5 M50,75 L37.5,62.5',
    viewBox: '0 0 100 100',
    repeat: 'repeat',
    meaning: 'Growth, protection, prosperity'
  },
  
  kumiko: {
    // 組子 - Geometric woodwork pattern
    path: 'M0,0 L40,0 L40,40 L0,40 Z M20,0 L20,40 M0,20 L40,20 M10,10 L30,10 L30,30 L10,30 Z',
    viewBox: '0 0 40 40',
    repeat: 'repeat',
    meaning: 'Precision, craftsmanship, order'
  }
};

// Texture overlays for creating paper, wood, and stone effects
export const TEXTURE_OVERLAYS = {
  washi: {
    // 和紙 - Traditional paper texture
    filter: 'blur(0.5px) contrast(1.1) brightness(0.98)',
    background: 'radial-gradient(circle at 30% 30%, rgba(255,255,255,0.8) 0%, rgba(240,238,235,0.9) 70%)',
    pattern: 'repeating-linear-gradient(45deg, rgba(0,0,0,0.01) 0px, rgba(0,0,0,0.01) 1px, transparent 1px, transparent 2px)',
  },
  
  sumi: {
    // 墨 - Ink brush texture
    filter: 'contrast(1.2) saturate(0.8)',
    background: 'radial-gradient(ellipse at center, rgba(42,33,27,0.05) 0%, rgba(42,33,27,0.15) 100%)',
    pattern: 'repeating-radial-gradient(circle at 40% 60%, rgba(0,0,0,0.02) 0%, rgba(0,0,0,0.02) 3px, transparent 3px, transparent 6px)',
  },
  
  bamboo: {
    // 竹 - Bamboo grain texture
    background: 'linear-gradient(90deg, rgba(212,180,150,0.1) 0%, rgba(184,160,136,0.1) 50%, rgba(212,180,150,0.1) 100%)',
    pattern: 'repeating-linear-gradient(90deg, rgba(0,0,0,0.01) 0px, rgba(0,0,0,0.01) 2px, transparent 2px, transparent 8px)',
  }
};

// Zen-inspired visual elements
export const ZEN_ELEMENTS = {
  enso: {
    // 円相 - Zen circle variations
    perfect: 'M 50,10 A 40,40 0 1,1 49.9,10 Z',
    broken: 'M 50,10 A 40,40 0 1,1 30,85',
    brushed: 'M 45,8 Q 50,5 55,8 A 40,40 0 1,1 25,88 Q 20,85 25,82',
    meaning: 'Circle of enlightenment, void, beginning'
  },
  
  stones: {
    // Meditation stones - various organic shapes
    small: 'M20,30 Q10,20 15,10 Q25,5 35,10 Q45,15 40,25 Q35,35 25,35 Q15,35 20,30 Z',
    medium: 'M30,50 Q15,35 20,20 Q35,10 55,15 Q70,25 65,40 Q60,55 45,60 Q25,60 30,50 Z',
    large: 'M40,70 Q20,50 25,30 Q45,15 70,20 Q90,35 85,55 Q80,75 60,80 Q35,80 40,70 Z'
  }
};

// Color harmony rules based on traditional Japanese aesthetics
export const COLOR_HARMONIES = {
  seasonal: {
    spring: {
      primary: '#F7E7E7',  // Sakura pink
      secondary: '#A8C68F', // Young green
      accent: '#FEFFFE',    // Pure white
      mood: 'renewal, hope, gentle awakening'
    },
    summer: {
      primary: '#A8C68F',  // Deep green
      secondary: '#7FB8D3', // Clear blue
      accent: '#E6A500',    // Bright yellow
      mood: 'vitality, growth, abundance'
    },
    autumn: {
      primary: '#C7919A',  // Muted red
      secondary: '#E6A500', // Golden yellow
      accent: '#8B6914',    // Rich brown
      mood: 'reflection, harvest, preparation'
    },
    winter: {
      primary: '#A8A8A8',  // Cloud gray
      secondary: '#FEFFFE', // Snow white
      accent: '#3D5F8F',    // Deep blue
      mood: 'contemplation, purity, stillness'
    }
  },
  
  emotional: {
    calm: ['#FAF9F7', '#F6F3F0', '#E6DDD4'],
    focus: ['#F8F6F3', '#D0BFA8', '#967A5A'],
    energy: ['#A8C68F', '#7BA05B', '#E6A500'],
    comfort: ['#E6DDD4', '#D4B896', '#B59B7F']
  }
};

export default JAPANESE_WELLNESS_DESIGN;