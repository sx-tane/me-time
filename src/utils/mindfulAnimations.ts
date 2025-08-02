import { Animated, Easing } from 'react-native';
import { isNative } from './platformDetection';

// Type definitions for animation options
interface BreathingOptions {
  inhaleScale?: number;
  exhaleScale?: number;
  technique?: '4-7-8' | 'box' | 'natural' | 'zen';
  loop?: boolean;
  inhaleTime?: number;
  holdTime?: number;
  exhaleTime?: number;
  pauseTime?: number;
}

interface FadeOptions {
  duration?: number;
  delay?: number;
  easing?: any;
  toValue?: number;
}

interface SlideOptions {
  duration?: number;
  delay?: number;
  easing?: any;
  fromValue?: number;
  toValue?: number;
}

interface StaggerOptions {
  staggerDelay?: number;
  duration?: number;
  easing?: any;
}

interface PulseOptions {
  minScale?: number;
  maxScale?: number;
  duration?: number;
  easing?: any;
}

interface FloatingOptions {
  amplitude?: number;
  type?: 'gentle' | 'water' | 'wind' | 'bamboo' | 'petals' | 'mist';
  easing?: any;
  duration?: number;
}

interface PressOptions {
  pressedScale?: number;
  duration?: number;
  easing?: any;
}

interface ContemplativeOptions {
  contemplationTime?: number;
  pauseBetween?: number;
  easing?: any;
  pattern?: 'sequential' | 'wave' | 'ripple' | 'meditation';
}

interface MaRevealOptions {
  delay?: number;
  duration?: number;
  easing?: any;
}

interface ZenGardenOptions {
  amplitude?: number;
  duration?: number;
}

type AnimationCallback = (result: { finished: boolean }) => void;

// Japanese wellness animation philosophy:
// - 自然 (Shizen): Natural, effortless movement
// - 間 (Ma): Purposeful pauses and negative space
// - 和 (Wa): Harmony between elements
// - 静寂 (Seijaku): Tranquil, meditative timing

export const MINDFUL_TIMINGS = {
  // Enhanced breathing patterns based on traditional practices
  breath: {
    // 4-7-8 breathing technique
    inhale: 4000,       // 4 seconds in
    hold: 7000,         // 7 seconds hold  
    exhale: 8000,       // 8 seconds out
    pause: 1000,        // 1 second pause
    // Box breathing (sama vritti)
    box: 4000,          // Equal 4-second intervals
    // Natural breathing observation
    natural: 3500,      // Average natural breath cycle
    // Deep contemplative breathing
    zen: 6000,          // Longer, meditative breathing
  },
  gentle: {
    instant: 150,       // Almost instant but smooth
    fast: 300,          // Quick but mindful
    medium: 600,        // Standard gentle timing
    slow: 1200,         // Very slow and peaceful
    contemplative: 2000, // For deep moments
    meditative: 3000,   // Extended meditative timing
  },
  reveal: {
    stagger: 150,       // Reduced stagger for smoother flow
    cascade: 100,       // Faster cascade for natural feel
    wave: 200,          // Wave-like reveal timing
    ripple: 80,         // Ripple effect timing
  },
  // Natural rhythms inspired by Japanese aesthetics
  nature: {
    water: 2400,        // Water flow rhythm
    wind: 1800,         // Gentle wind movement
    bamboo: 3200,       // Bamboo swaying
    petals: 4000,       // Falling cherry petals
    mist: 5000,         // Morning mist dissipation
  }
};

export const MINDFUL_EASINGS = {
  // Enhanced easing curves for Japanese wellness aesthetics
  gentle: Easing.bezier(0.25, 0.46, 0.45, 0.94),     // Gentle ease-out
  breath: Easing.bezier(0.37, 0, 0.63, 1),           // Breathing rhythm
  contemplative: Easing.bezier(0.16, 1, 0.3, 1),     // Very soft
  natural: Easing.bezier(0.23, 1, 0.32, 1),          // Natural movement
  peaceful: Easing.bezier(0.19, 1, 0.22, 1),         // Ultra peaceful
  
  // Japanese-inspired natural easing patterns
  water: Easing.bezier(0.4, 0, 0.2, 1),              // Water flow - 水の流れ
  wind: Easing.bezier(0.25, 0, 0.4, 1),              // Wind movement - 風の動き
  bamboo: Easing.bezier(0.68, -0.55, 0.265, 1.55),  // Bamboo flexibility - 竹のしなやかさ
  stone: Easing.bezier(0.55, 0, 0.1, 1),             // Stone settling - 石の落ち着き
  mist: Easing.bezier(0.1, 0, 0.1, 1),               // Mist dissipation - 霧の消散
  petals: Easing.bezier(0.68, 0, 0.32, 1),           // Falling petals - 花びらの落下
  
  // Zen-inspired contemplative curves
  meditation: Easing.bezier(0.08, 0, 0.08, 1),       // Deep meditation
  enlightenment: Easing.bezier(0, 0, 0, 1),          // Perfect linear - 悟り
  harmony: Easing.bezier(0.33, 0, 0.67, 1),          // Perfect balance - 調和
};

export class MindfulAnimations {
  static createBreathingAnimation(animatedValue: Animated.Value, options: BreathingOptions = {}): Animated.CompositeAnimation {
    const {
      inhaleScale = 1.05,
      exhaleScale = 1.0,
      technique = '4-7-8', // '4-7-8', 'box', 'natural', 'zen'
      loop = true
    } = options;

    const techniques = {
      '4-7-8': {
        inhaleTime: MINDFUL_TIMINGS.breath.inhale,
        holdTime: MINDFUL_TIMINGS.breath.hold,
        exhaleTime: MINDFUL_TIMINGS.breath.exhale,
        pauseTime: MINDFUL_TIMINGS.breath.pause,
      },
      'box': {
        inhaleTime: MINDFUL_TIMINGS.breath.box,
        holdTime: MINDFUL_TIMINGS.breath.box,
        exhaleTime: MINDFUL_TIMINGS.breath.box,
        pauseTime: MINDFUL_TIMINGS.breath.box,
      },
      'natural': {
        inhaleTime: MINDFUL_TIMINGS.breath.natural,
        holdTime: MINDFUL_TIMINGS.breath.natural * 0.3,
        exhaleTime: MINDFUL_TIMINGS.breath.natural * 1.2,
        pauseTime: MINDFUL_TIMINGS.breath.natural * 0.2,
      },
      'zen': {
        inhaleTime: MINDFUL_TIMINGS.breath.zen,
        holdTime: MINDFUL_TIMINGS.breath.zen * 0.5,
        exhaleTime: MINDFUL_TIMINGS.breath.zen * 1.5,
        pauseTime: MINDFUL_TIMINGS.breath.zen * 0.3,
      }
    };

    const timing = techniques[technique] || techniques['4-7-8'];

    const breathCycle = Animated.sequence([
      // Inhale - 吸気
      Animated.timing(animatedValue, {
        toValue: inhaleScale,
        duration: timing.inhaleTime,
        easing: MINDFUL_EASINGS.breath,
        useNativeDriver: isNative,
      }),
      // Hold - 息止め
      Animated.delay(timing.holdTime),
      // Exhale - 呼気
      Animated.timing(animatedValue, {
        toValue: exhaleScale,
        duration: timing.exhaleTime,
        easing: MINDFUL_EASINGS.peaceful,
        useNativeDriver: isNative,
      }),
      // Pause - 休息
      Animated.delay(timing.pauseTime),
    ]);

    if (loop) {
      return Animated.loop(breathCycle, { iterations: -1 });
    }
    
    return breathCycle;
  }

  static createGentleFadeIn(animatedValue: Animated.Value, options: FadeOptions = {}): Animated.CompositeAnimation {
    const {
      duration = MINDFUL_TIMINGS.gentle.medium,
      delay = 0,
      easing = MINDFUL_EASINGS.gentle,
      toValue = 1
    } = options;

    return Animated.timing(animatedValue, {
      toValue,
      duration,
      delay,
      easing,
      useNativeDriver: isNative,
    });
  }

  static createGentleSlideIn(animatedValue: Animated.Value, options: SlideOptions = {}): Animated.CompositeAnimation {
    const {
      duration = MINDFUL_TIMINGS.gentle.medium,
      delay = 0,
      easing = MINDFUL_EASINGS.gentle,
      fromValue = 50,
      toValue = 0
    } = options;

    animatedValue.setValue(fromValue);
    
    return Animated.timing(animatedValue, {
      toValue,
      duration,
      delay,
      easing,
      useNativeDriver: isNative,
    });
  }

  static createStaggeredReveal(animatedValues: Animated.Value[], options: StaggerOptions = {}): Animated.CompositeAnimation {
    const {
      staggerDelay = MINDFUL_TIMINGS.reveal.stagger,
      duration = MINDFUL_TIMINGS.gentle.medium,
      easing = MINDFUL_EASINGS.gentle
    } = options;

    const animations = animatedValues.map((value, index) => 
      Animated.timing(value, {
        toValue: 1,
        duration,
        delay: index * staggerDelay,
        easing,
        useNativeDriver: isNative,
      })
    );

    return Animated.stagger(staggerDelay, animations);
  }

  static createPulseAnimation(animatedValue: Animated.Value, options: PulseOptions = {}): Animated.CompositeAnimation {
    const {
      minScale = 0.95,
      maxScale = 1.05,
      duration = MINDFUL_TIMINGS.gentle.slow,
      easing = MINDFUL_EASINGS.peaceful
    } = options;

    return Animated.loop(
      Animated.sequence([
        Animated.timing(animatedValue, {
          toValue: maxScale,
          duration: duration / 2,
          easing,
          useNativeDriver: isNative,
        }),
        Animated.timing(animatedValue, {
          toValue: minScale,
          duration: duration / 2,
          easing,
          useNativeDriver: isNative,
        }),
      ]),
      { iterations: -1 }
    );
  }

  static createFloatingAnimation(animatedValue: Animated.Value, options: FloatingOptions = {}): Animated.CompositeAnimation {
    const {
      amplitude = 10,
      type = 'gentle', // 'gentle', 'water', 'wind', 'bamboo', 'petals', 'mist'
      easing = MINDFUL_EASINGS.natural
    } = options;

    const floatingTypes = {
      gentle: {
        duration: MINDFUL_TIMINGS.gentle.contemplative,
        easing: MINDFUL_EASINGS.gentle,
        amplitude: amplitude
      },
      water: {
        duration: MINDFUL_TIMINGS.nature.water,
        easing: MINDFUL_EASINGS.water,
        amplitude: amplitude * 0.7
      },
      wind: {
        duration: MINDFUL_TIMINGS.nature.wind,
        easing: MINDFUL_EASINGS.wind,
        amplitude: amplitude * 1.2
      },
      bamboo: {
        duration: MINDFUL_TIMINGS.nature.bamboo,
        easing: MINDFUL_EASINGS.bamboo,
        amplitude: amplitude * 1.5
      },
      petals: {
        duration: MINDFUL_TIMINGS.nature.petals,
        easing: MINDFUL_EASINGS.petals,
        amplitude: amplitude * 2
      },
      mist: {
        duration: MINDFUL_TIMINGS.nature.mist,
        easing: MINDFUL_EASINGS.mist,
        amplitude: amplitude * 0.3
      }
    };

    const config = floatingTypes[type] || floatingTypes.gentle;

    return Animated.loop(
      Animated.sequence([
        Animated.timing(animatedValue, {
          toValue: config.amplitude,
          duration: config.duration / 2,
          easing: config.easing,
          useNativeDriver: isNative,
        }),
        Animated.timing(animatedValue, {
          toValue: -config.amplitude,
          duration: config.duration / 2,
          easing: config.easing,
          useNativeDriver: isNative,
        }),
      ]),
      { iterations: -1 }
    );
  }

  static createGentlePress(animatedValue: Animated.Value, options: PressOptions = {}) {
    const {
      pressedScale = 0.98,
      duration = 100,
      easing = MINDFUL_EASINGS.gentle
    } = options;

    return {
      pressIn: () => {
        Animated.timing(animatedValue, {
          toValue: pressedScale,
          duration,
          easing,
          useNativeDriver: isNative,
        }).start();
      },
      pressOut: () => {
        Animated.timing(animatedValue, {
          toValue: 1,
          duration: duration * 1.5,
          easing,
          useNativeDriver: isNative,
        }).start();
      }
    };
  }

  static createContemplativeSequence(values: Animated.Value[], options: ContemplativeOptions = {}): Animated.CompositeAnimation {
    const {
      contemplationTime = MINDFUL_TIMINGS.gentle.contemplative,
      pauseBetween = 500,
      easing = MINDFUL_EASINGS.contemplative,
      pattern = 'sequential' // 'sequential', 'wave', 'ripple', 'meditation'
    } = options;

    const patterns = {
      sequential: () => {
        const sequence: any[] = [];
        values.forEach((value, index) => {
          if (index > 0) {
            sequence.push(Animated.delay(pauseBetween));
          }
          sequence.push(
            Animated.timing(value, {
              toValue: 1,
              duration: contemplationTime,
              easing,
              useNativeDriver: isNative,
            })
          );
        });
        return Animated.sequence(sequence);
      },
      
      wave: () => {
        return Animated.stagger(MINDFUL_TIMINGS.reveal.wave, 
          values.map(value => 
            Animated.timing(value, {
              toValue: 1,
              duration: contemplationTime,
              easing: MINDFUL_EASINGS.water,
              useNativeDriver: isNative,
            })
          )
        );
      },
      
      ripple: () => {
        return Animated.stagger(MINDFUL_TIMINGS.reveal.ripple,
          values.map(value => 
            Animated.timing(value, {
              toValue: 1,
              duration: contemplationTime * 0.8,
              easing: MINDFUL_EASINGS.natural,
              useNativeDriver: isNative,
            })
          )
        );
      },
      
      meditation: () => {
        return Animated.parallel(
          values.map((value, index) => 
            Animated.timing(value, {
              toValue: 1,
              duration: contemplationTime + (index * 200),
              delay: index * 1000,
              easing: MINDFUL_EASINGS.meditation,
              useNativeDriver: isNative,
            })
          )
        );
      }
    };

    return patterns[pattern] ? patterns[pattern]() : patterns.sequential();
  }
}

// Enhanced Japanese wellness animation patterns
export class JapaneseWellnessAnimations {
  // 和風呼吸法 - Japanese breathing animation with traditional techniques
  static createWafuBreathing(animatedValue: Animated.Value, options: BreathingOptions = {}): Animated.CompositeAnimation {
    return MindfulAnimations.createBreathingAnimation(animatedValue, {
      technique: 'zen',
      inhaleScale: 1.03,
      exhaleScale: 0.98,
      ...options
    });
  }

  // 桜散り - Cherry blossom falling animation
  static createSakuraFall(animatedValue: Animated.Value, options: FloatingOptions = {}): Animated.CompositeAnimation {
    return MindfulAnimations.createFloatingAnimation(animatedValue, {
      type: 'petals',
      amplitude: 15,
      ...options
    });
  }

  // 波紋 - Ripple effect animation
  static createHamon(values: Animated.Value[], options: ContemplativeOptions = {}): Animated.CompositeAnimation {
    return MindfulAnimations.createContemplativeSequence(values, {
      pattern: 'ripple',
      contemplationTime: MINDFUL_TIMINGS.gentle.medium,
      ...options
    });
  }

  // 間の美学 - Ma (negative space) reveal animation
  static createMaReveal(animatedValue: Animated.Value, options: MaRevealOptions = {}): Animated.CompositeAnimation {
    const {
      delay = 0,
      duration = MINDFUL_TIMINGS.gentle.slow,
      easing = MINDFUL_EASINGS.meditation
    } = options;

    return Animated.timing(animatedValue, {
      toValue: 1,
      duration,
      delay,
      easing,
      useNativeDriver: isNative,
    });
  }

  // 禅庭園 - Zen garden rake animation
  static createZenGarden(animatedValue: Animated.Value, options: ZenGardenOptions = {}): Animated.CompositeAnimation {
    const {
      amplitude = 5,
      duration = MINDFUL_TIMINGS.nature.mist
    } = options;

    return Animated.loop(
      Animated.sequence([
        Animated.timing(animatedValue, {
          toValue: amplitude,
          duration: duration / 3,
          easing: MINDFUL_EASINGS.meditation,
          useNativeDriver: isNative,
        }),
        Animated.delay(duration / 6),
        Animated.timing(animatedValue, {
          toValue: 0,
          duration: duration / 2,
          easing: MINDFUL_EASINGS.harmony,
          useNativeDriver: isNative,
        }),
      ]),
      { iterations: -1 }
    );
  }
}

export const useGentleAnimation = () => {
  const createAnimatedValue = (initialValue = 0) => new Animated.Value(initialValue);
  
  const runAnimation = (animation: Animated.CompositeAnimation, callback?: AnimationCallback) => {
    animation.start(callback);
  };

  return {
    createAnimatedValue,
    runAnimation,
    MindfulAnimations,
    JapaneseWellnessAnimations,
    MINDFUL_TIMINGS,
    MINDFUL_EASINGS
  };
};