import React, { useRef, useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, Animated, Dimensions } from 'react-native';
import { JAPANESE_WELLNESS_DESIGN, JAPANESE_GRADIENTS, CULTURAL_PATTERNS } from '../constants/japaneseWellnessDesign';
import { JapaneseWellnessAnimations, MindfulAnimations, MINDFUL_TIMINGS } from '../utils/mindfulAnimations';
import { GentleButton } from './GentleButton';
import Svg, { Path, Circle, G, Defs, LinearGradient, Stop } from 'react-native-svg';

const { width } = Dimensions.get('window');

// Japanese Wellness Card Component
interface WellnessCardProps {
  title: string;
  subtitle?: string;
  children?: React.ReactNode;
  variant?: 'default' | 'elevated' | 'organic' | 'meditation';
  pattern?: 'seigaiha' | 'asanoha' | 'none';
}

const WellnessCard: React.FC<WellnessCardProps> = ({
  title,
  subtitle,
  children,
  variant = 'default',
  pattern = 'none'
}) => {
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const slideAnim = useRef(new Animated.Value(30)).current;

  useEffect(() => {
    // Ma-inspired staggered reveal
    const revealAnimation = Animated.parallel([
      JapaneseWellnessAnimations.createMaReveal(fadeAnim, {
        duration: MINDFUL_TIMINGS.gentle.slow
      }),
      MindfulAnimations.createGentleSlideIn(slideAnim, {
        duration: MINDFUL_TIMINGS.gentle.slow,
        fromValue: 30,
        toValue: 0
      })
    ]);

    revealAnimation.start();
  }, []);

  const getCardStyle = () => {
    const baseStyle = {
      backgroundColor: JAPANESE_WELLNESS_DESIGN.colors.surface.card,
      padding: JAPANESE_WELLNESS_DESIGN.spacing.ma.contemplation,
      ...JAPANESE_WELLNESS_DESIGN.shadows.sm,
    };

    switch (variant) {
      case 'elevated':
        return {
          ...baseStyle,
          backgroundColor: JAPANESE_WELLNESS_DESIGN.colors.surface.elevated,
          padding: JAPANESE_WELLNESS_DESIGN.spacing.ma.ceremony,
          ...JAPANESE_WELLNESS_DESIGN.shadows.md,
          borderRadius: JAPANESE_WELLNESS_DESIGN.borderRadius.xl,
        };
      case 'organic':
        return {
          ...baseStyle,
          borderTopLeftRadius: 16,
          borderTopRightRadius: 20,
          borderBottomLeftRadius: 18,
          borderBottomRightRadius: 14,
        };
      case 'meditation':
        return {
          ...baseStyle,
          backgroundColor: JAPANESE_WELLNESS_DESIGN.colors.background.meditation,
          borderWidth: 1,
          borderColor: JAPANESE_WELLNESS_DESIGN.colors.primary[200],
          borderRadius: JAPANESE_WELLNESS_DESIGN.borderRadius.lg,
          padding: JAPANESE_WELLNESS_DESIGN.spacing.ma.sanctuary,
        };
      default:
        return {
          ...baseStyle,
          borderRadius: JAPANESE_WELLNESS_DESIGN.borderRadius.lg,
        };
    }
  };

  return (
    <Animated.View
      style={[
        getCardStyle(),
        {
          opacity: fadeAnim,
          transform: [{ translateY: slideAnim }],
        },
      ]}
    >
      {/* Pattern overlay */}
      {pattern !== 'none' && (
        <View style={styles.patternOverlay}>
          <Svg width="100%" height="100%" style={StyleSheet.absoluteFill}>
            {pattern === 'seigaiha' && (
              <Path
                d="M0,40 Q20,20 40,40 Q60,20 80,40 Q100,20 120,40"
                stroke={JAPANESE_WELLNESS_DESIGN.colors.primary[200]}
                strokeWidth="1"
                fill="none"
                opacity={0.1}
              />
            )}
          </Svg>
        </View>
      )}

      <Text style={styles.cardTitle}>{title}</Text>
      {subtitle && <Text style={styles.cardSubtitle}>{subtitle}</Text>}
      
      {children && (
        <View style={styles.cardContent}>
          {children}
        </View>
      )}
    </Animated.View>
  );
};

// Zen Circle Component (Ensō)
interface ZenCircleProps {
  size?: number;
  strokeWidth?: number;
  complete?: boolean;
  animated?: boolean;
}

const ZenCircle: React.FC<ZenCircleProps> = ({
  size = 60,
  strokeWidth = 2,
  complete = false,
  animated = true
}) => {
  const drawAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    if (animated) {
      // Slow, meditative drawing animation
      Animated.timing(drawAnim, {
        toValue: 1,
        duration: MINDFUL_TIMINGS.nature.mist,
        useNativeDriver: false,
      }).start();
    }
  }, [animated]);

  const radius = (size - strokeWidth) / 2;
  const circumference = 2 * Math.PI * radius;

  return (
    <View style={[styles.zenCircle, { width: size, height: size }]}>
      <Svg width={size} height={size}>
        <Circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          stroke={JAPANESE_WELLNESS_DESIGN.colors.primary[400]}
          strokeWidth={strokeWidth}
          fill="none"
          strokeDasharray={complete ? undefined : `${circumference * 0.85} ${circumference * 0.15}`}
          strokeDashoffset={animated ? drawAnim.interpolate({
            inputRange: [0, 1],
            outputRange: [circumference, 0]
          }) as any : 0}
          strokeLinecap="round"
        />
      </Svg>
    </View>
  );
};

// Traditional Japanese Divider
interface WellnessDividerProps {
  pattern?: 'line' | 'waves' | 'dots';
  spacing?: 'tight' | 'normal' | 'loose';
}

const WellnessDivider: React.FC<WellnessDividerProps> = ({
  pattern = 'line',
  spacing = 'normal'
}) => {
  const spacingValue = {
    tight: JAPANESE_WELLNESS_DESIGN.spacing.ma.pause,
    normal: JAPANESE_WELLNESS_DESIGN.spacing.ma.contemplation,
    loose: JAPANESE_WELLNESS_DESIGN.spacing.ma.ceremony,
  }[spacing];

  return (
    <View style={[styles.divider, { marginVertical: spacingValue }]}>
      <Svg width="100%" height="2" viewBox="0 0 200 2">
        {pattern === 'line' && (
          <Path
            d="M0,1 L200,1"
            stroke={JAPANESE_WELLNESS_DESIGN.colors.surface.divider}
            strokeWidth="1"
          />
        )}
        {pattern === 'waves' && (
          <Path
            d="M0,1 Q25,0 50,1 Q75,2 100,1 Q125,0 150,1 Q175,2 200,1"
            stroke={JAPANESE_WELLNESS_DESIGN.colors.surface.divider}
            strokeWidth="1"
            fill="none"
          />
        )}
        {pattern === 'dots' && (
          <G>
            {[0, 40, 80, 120, 160].map((x, index) => (
              <Circle
                key={index}
                cx={x + 20}
                cy="1"
                r="0.5"
                fill={JAPANESE_WELLNESS_DESIGN.colors.surface.divider}
              />
            ))}
          </G>
        )}
      </Svg>
    </View>
  );
};

// Floating Action Button with organic shape
interface WellnessFABProps {
  onPress: () => void;
  icon?: React.ReactNode;
  variant?: 'primary' | 'secondary';
  shape?: 'circular' | 'organic';
}

const WellnessFAB: React.FC<WellnessFABProps> = ({
  onPress,
  icon,
  variant = 'primary',
  shape = 'organic'
}) => {
  const floatAnim = useRef(new Animated.Value(0)).current;
  const scaleAnim = useRef(new Animated.Value(1)).current;

  useEffect(() => {
    // Gentle floating animation
    const floatingAnimation = MindfulAnimations.createFloatingAnimation(floatAnim, {
      amplitude: 3,
      type: 'mist'
    });
    floatingAnimation.start();

    return () => floatingAnimation.stop();
  }, []);

  const handlePress = () => {
    // Brief compression feedback
    Animated.sequence([
      Animated.timing(scaleAnim, {
        toValue: 0.95,
        duration: 100,
        useNativeDriver: true,
      }),
      Animated.timing(scaleAnim, {
        toValue: 1,
        duration: 150,
        useNativeDriver: true,
      })
    ]).start();

    onPress();
  };

  const getShapeStyle = () => {
    if (shape === 'organic') {
      return {
        borderTopLeftRadius: 24,
        borderTopRightRadius: 28,
        borderBottomLeftRadius: 26,
        borderBottomRightRadius: 22,
      };
    }
    return { borderRadius: 28 };
  };

  return (
    <Animated.View
      style={[
        styles.fab,
        variant === 'secondary' && styles.secondaryFab,
        getShapeStyle(),
        {
          transform: [
            { translateY: floatAnim },
            { scale: scaleAnim }
          ]
        }
      ]}
    >
      <GentleButton
        title=""
        onPress={handlePress}
        variant={variant}
        shape="flowing"
        withRipple={true}
        style={[styles.fabButton, getShapeStyle()]}
        children={icon || <ZenCircle size={24} strokeWidth={1.5} complete={false} animated={false} />}
      />
    </Animated.View>
  );
};

// Demo component showcasing all wellness components
const JapaneseWellnessShowcase: React.FC = () => {
  return (
    <ScrollView style={styles.showcase} contentContainerStyle={styles.showcaseContent}>
      <WellnessCard
        title="瞑想 - Meditation"
        subtitle="Find your inner peace"
        variant="meditation"
        pattern="seigaiha"
      >
        <Text style={styles.showcaseText}>
          Experience tranquility through mindful breathing and gentle animations
        </Text>
        
        <View style={styles.buttonRow}>
          <GentleButton
            title="Begin"
            onPress={() => {}}
            variant="zen"
            shape="stone"
            meditation={true}
          />
          <GentleButton
            title="Guide"
            onPress={() => {}}
            variant="ghost"
            shape="flowing"
          />
        </View>
      </WellnessCard>

      <WellnessDivider pattern="waves" spacing="normal" />

      <WellnessCard
        title="自然 - Nature"
        subtitle="Connect with organic forms"
        variant="organic"
      >
        <View style={styles.zenRow}>
          <ZenCircle size={40} complete={false} />
          <ZenCircle size={40} complete={true} />
          <ZenCircle size={40} complete={false} strokeWidth={3} />
        </View>
        
        <GentleButton
          title="Explore Shapes"
          onPress={() => {}}
          variant="organic"
          shape="leaf"
          withRipple={true}
        />
      </WellnessCard>

      <WellnessDivider pattern="dots" spacing="loose" />

      <WellnessCard
        title="調和 - Harmony"
        subtitle="Balanced interactions"
        variant="elevated"
      >
        <Text style={styles.showcaseText}>
          Every interaction follows natural rhythms and breathing patterns
        </Text>
        
        <View style={styles.buttonGrid}>
          <GentleButton title="Primary" onPress={() => {}} variant="primary" shape="default" />
          <GentleButton title="Secondary" onPress={() => {}} variant="secondary" shape="stone" />
          <GentleButton title="Ghost" onPress={() => {}} variant="ghost" shape="flowing" />
          <GentleButton title="Organic" onPress={() => {}} variant="organic" shape="leaf" />
        </View>
      </WellnessCard>

      <View style={styles.fabContainer}>
        <WellnessFAB
          onPress={() => {}}
          variant="primary"
          shape="organic"
        />
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  // Card styles
  patternOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    opacity: 0.05,
  },
  
  cardTitle: {
    fontSize: JAPANESE_WELLNESS_DESIGN.typography.fontSize.lg,
    fontWeight: JAPANESE_WELLNESS_DESIGN.typography.fontWeight.semibold as any,
    color: JAPANESE_WELLNESS_DESIGN.colors.text.primary,
    marginBottom: JAPANESE_WELLNESS_DESIGN.spacing.ma.breath,
    letterSpacing: JAPANESE_WELLNESS_DESIGN.typography.letterSpacing.wide,
  },
  
  cardSubtitle: {
    fontSize: JAPANESE_WELLNESS_DESIGN.typography.fontSize.sm,
    color: JAPANESE_WELLNESS_DESIGN.colors.text.secondary,
    marginBottom: JAPANESE_WELLNESS_DESIGN.spacing.ma.pause,
    lineHeight: JAPANESE_WELLNESS_DESIGN.typography.lineHeight.relaxed,
  },
  
  cardContent: {
    marginTop: JAPANESE_WELLNESS_DESIGN.spacing.ma.contemplation,
  },
  
  // Zen circle styles
  zenCircle: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  
  // Divider styles
  divider: {
    width: '100%',
    alignItems: 'center',
  },
  
  // FAB styles
  fab: {
    width: 56,
    height: 56,
    position: 'absolute',
    bottom: JAPANESE_WELLNESS_DESIGN.spacing.ma.ceremony,
    right: JAPANESE_WELLNESS_DESIGN.spacing.ma.ceremony,
    backgroundColor: JAPANESE_WELLNESS_DESIGN.colors.primary[600],
    ...JAPANESE_WELLNESS_DESIGN.shadows.lg,
  },
  
  secondaryFab: {
    backgroundColor: JAPANESE_WELLNESS_DESIGN.colors.surface.elevated,
    borderWidth: 1,
    borderColor: JAPANESE_WELLNESS_DESIGN.colors.primary[300],
  },
  
  fabButton: {
    width: '100%',
    height: '100%',
    minHeight: 56,
    margin: 0,
    padding: 0,
  },
  
  // Showcase styles
  showcase: {
    flex: 1,
    backgroundColor: JAPANESE_WELLNESS_DESIGN.colors.background.primary,
  },
  
  showcaseContent: {
    padding: JAPANESE_WELLNESS_DESIGN.spacing.ma.contemplation,
    paddingBottom: 100, // Space for FAB
  },
  
  showcaseText: {
    fontSize: JAPANESE_WELLNESS_DESIGN.typography.fontSize.base,
    color: JAPANESE_WELLNESS_DESIGN.colors.text.secondary,
    lineHeight: JAPANESE_WELLNESS_DESIGN.typography.lineHeight.relaxed,
    marginBottom: JAPANESE_WELLNESS_DESIGN.spacing.ma.pause,
  },
  
  buttonRow: {
    flexDirection: 'row',
    gap: JAPANESE_WELLNESS_DESIGN.spacing.ma.pause,
    marginTop: JAPANESE_WELLNESS_DESIGN.spacing.ma.contemplation,
  },
  
  buttonGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: JAPANESE_WELLNESS_DESIGN.spacing.ma.pause,
    marginTop: JAPANESE_WELLNESS_DESIGN.spacing.ma.contemplation,
  },
  
  zenRow: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
    marginVertical: JAPANESE_WELLNESS_DESIGN.spacing.ma.contemplation,
  },
  
  fabContainer: {
    height: 80, // Spacer for FAB
  },
});

export { WellnessCard, ZenCircle, WellnessDivider, WellnessFAB, JapaneseWellnessShowcase };