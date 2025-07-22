import { Animated, Easing } from 'react-native';

export const MINDFUL_TIMINGS = {
  breath: {
    inhale: 4000,    // 4 seconds in
    hold: 2000,      // 2 seconds hold  
    exhale: 6000,    // 6 seconds out
    pause: 1000      // 1 second pause
  },
  gentle: {
    fast: 800,       // Quick but still gentle
    medium: 1200,    // Standard gentle timing
    slow: 1800,      // Very slow and peaceful
    contemplative: 2500 // For deep moments
  },
  reveal: {
    stagger: 200,    // Delay between staggered animations
    cascade: 150,    // For cascading effects
  }
};

export const MINDFUL_EASINGS = {
  gentle: Easing.bezier(0.25, 0.46, 0.45, 0.94),     // Gentle ease-out
  breath: Easing.bezier(0.37, 0, 0.63, 1),           // Breathing rhythm
  contemplative: Easing.bezier(0.16, 1, 0.3, 1),     // Very soft
  natural: Easing.bezier(0.23, 1, 0.32, 1),          // Natural movement
  peaceful: Easing.bezier(0.19, 1, 0.22, 1),         // Ultra peaceful
};

export class MindfulAnimations {
  static createBreathingAnimation(animatedValue, options = {}) {
    const {
      inhaleScale = 1.05,
      exhaleScale = 1.0,
      inhaleTime = MINDFUL_TIMINGS.breath.inhale,
      holdTime = MINDFUL_TIMINGS.breath.hold,
      exhaleTime = MINDFUL_TIMINGS.breath.exhale,
      pauseTime = MINDFUL_TIMINGS.breath.pause,
      loop = true
    } = options;

    const breathCycle = Animated.sequence([
      // Inhale
      Animated.timing(animatedValue, {
        toValue: inhaleScale,
        duration: inhaleTime,
        easing: MINDFUL_EASINGS.breath,
        useNativeDriver: true,
      }),
      // Hold
      Animated.delay(holdTime),
      // Exhale
      Animated.timing(animatedValue, {
        toValue: exhaleScale,
        duration: exhaleTime,
        easing: MINDFUL_EASINGS.breath,
        useNativeDriver: true,
      }),
      // Pause
      Animated.delay(pauseTime),
    ]);

    if (loop) {
      return Animated.loop(breathCycle, { iterations: -1 });
    }
    
    return breathCycle;
  }

  static createGentleFadeIn(animatedValue, options = {}) {
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
      useNativeDriver: true,
    });
  }

  static createGentleSlideIn(animatedValue, options = {}) {
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
      useNativeDriver: true,
    });
  }

  static createStaggeredReveal(animatedValues, options = {}) {
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
        useNativeDriver: true,
      })
    );

    return Animated.stagger(staggerDelay, animations);
  }

  static createPulseAnimation(animatedValue, options = {}) {
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
          useNativeDriver: true,
        }),
        Animated.timing(animatedValue, {
          toValue: minScale,
          duration: duration / 2,
          easing,
          useNativeDriver: true,
        }),
      ]),
      { iterations: -1 }
    );
  }

  static createFloatingAnimation(animatedValue, options = {}) {
    const {
      amplitude = 10,
      duration = MINDFUL_TIMINGS.gentle.contemplative,
      easing = MINDFUL_EASINGS.natural
    } = options;

    return Animated.loop(
      Animated.sequence([
        Animated.timing(animatedValue, {
          toValue: amplitude,
          duration: duration / 2,
          easing,
          useNativeDriver: true,
        }),
        Animated.timing(animatedValue, {
          toValue: -amplitude,
          duration: duration / 2,
          easing,
          useNativeDriver: true,
        }),
      ]),
      { iterations: -1 }
    );
  }

  static createGentlePress(animatedValue, options = {}) {
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
          useNativeDriver: true,
        }).start();
      },
      pressOut: () => {
        Animated.timing(animatedValue, {
          toValue: 1,
          duration: duration * 1.5,
          easing,
          useNativeDriver: true,
        }).start();
      }
    };
  }

  static createContemplativeSequence(values, options = {}) {
    const {
      contemplationTime = MINDFUL_TIMINGS.gentle.contemplative,
      pauseBetween = 500,
      easing = MINDFUL_EASINGS.contemplative
    } = options;

    const sequence = [];
    
    values.forEach((value, index) => {
      if (index > 0) {
        sequence.push(Animated.delay(pauseBetween));
      }
      
      sequence.push(
        Animated.timing(value, {
          toValue: 1,
          duration: contemplationTime,
          easing,
          useNativeDriver: true,
        })
      );
    });

    return Animated.sequence(sequence);
  }
}

export const useGentleAnimation = () => {
  const createAnimatedValue = (initialValue = 0) => new Animated.Value(initialValue);
  
  const runAnimation = (animation, callback) => {
    animation.start(callback);
  };

  return {
    createAnimatedValue,
    runAnimation,
    MindfulAnimations,
    MINDFUL_TIMINGS,
    MINDFUL_EASINGS
  };
};