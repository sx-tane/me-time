import React from 'react';
import { View, StyleSheet, Dimensions } from 'react-native';
import Svg, { Path, Circle, Defs, RadialGradient, Stop, Pattern, G } from 'react-native-svg';
import { JAPANESE_WELLNESS_DESIGN, JAPANESE_GRADIENTS, CULTURAL_PATTERNS } from '../constants/japaneseWellnessDesign';

const { width, height } = Dimensions.get('window');

const BlobBackground: React.FC = () => {
  return (
    <View style={styles.container}>
      {/* Main SVG with enhanced Japanese wellness organic shapes */}
      <Svg width={width} height={height} style={styles.svg}>
        <Defs>
          {/* Gradients inspired by Japanese natural elements */}
          <RadialGradient id="mistGradient" cx="0.3" cy="0.3" r="0.8">
            <Stop offset="0%" stopColor={JAPANESE_WELLNESS_DESIGN.colors.background.mist} stopOpacity="0.4" />
            <Stop offset="70%" stopColor={JAPANESE_WELLNESS_DESIGN.colors.accent.sakura} stopOpacity="0.2" />
            <Stop offset="100%" stopColor={JAPANESE_WELLNESS_DESIGN.colors.background.primary} stopOpacity="0.1" />
          </RadialGradient>
          
          <RadialGradient id="bambooGradient" cx="0.7" cy="0.7" r="0.6">
            <Stop offset="0%" stopColor={JAPANESE_WELLNESS_DESIGN.colors.accent.take} stopOpacity="0.3" />
            <Stop offset="100%" stopColor={JAPANESE_WELLNESS_DESIGN.colors.accent.matcha} stopOpacity="0.15" />
          </RadialGradient>
          
          <RadialGradient id="stoneGradient" cx="0.5" cy="0.5" r="0.7">
            <Stop offset="0%" stopColor={JAPANESE_WELLNESS_DESIGN.colors.accent.shizen} stopOpacity="0.25" />
            <Stop offset="100%" stopColor={JAPANESE_WELLNESS_DESIGN.colors.accent.tsuchi} stopOpacity="0.1" />
          </RadialGradient>
          
          {/* Seigaiha wave pattern */}
          <Pattern id="seigaihaPattern" x="0" y="0" width="120" height="80" patternUnits="userSpaceOnUse">
            <Path
              d="M0,40 Q20,20 40,40 Q60,20 80,40 Q100,20 120,40 M0,80 Q20,60 40,80 Q60,60 80,80 Q100,60 120,80"
              stroke={JAPANESE_WELLNESS_DESIGN.colors.primary[300]}
              strokeWidth="1"
              fill="none"
              opacity="0.1"
            />
          </Pattern>
        </Defs>
        
        {/* Organic stone shape - top left */}
        <G opacity="0.6">
          <Path
            d="M30,50 Q15,35 20,20 Q35,10 55,15 Q70,25 65,40 Q60,55 45,60 Q25,60 30,50 Z"
            fill="url(#mistGradient)"
            transform="translate(-20, -30) scale(2.5)"
          />
        </G>
        
        {/* Flowing water shape - bottom right */}
        <G opacity="0.5">
          <Path
            d="M40,70 Q20,50 25,30 Q45,15 70,20 Q90,35 85,55 Q80,75 60,80 Q35,80 40,70 Z"
            fill="url(#bambooGradient)"
            transform={`translate(${width - 200}, ${height - 180}) scale(1.8)`}
          />
        </G>
        
        {/* Central meditation stone */}
        <G opacity="0.4">
          <Path
            d="M50,80 Q25,60 30,35 Q50,20 80,25 Q105,40 100,65 Q95,90 70,95 Q40,95 50,80 Z"
            fill="url(#stoneGradient)"
            transform={`translate(${width * 0.4}, ${height * 0.4}) scale(2)`}
          />
        </G>
        
        {/* Zen circle (Ensō) - subtle background element */}
        <G opacity="0.15">
          <Path
            d="M 50,10 A 40,40 0 1,1 30,85"
            stroke={JAPANESE_WELLNESS_DESIGN.colors.primary[400]}
            strokeWidth="2"
            fill="none"
            transform={`translate(${width * 0.7}, ${height * 0.2}) scale(1.5)`}
          />
        </G>
        
        {/* Small organic accent shapes */}
        <G opacity="0.3">
          <Path
            d="M20,30 Q10,20 15,10 Q25,5 35,10 Q45,15 40,25 Q35,35 25,35 Q15,35 20,30 Z"
            fill={JAPANESE_WELLNESS_DESIGN.colors.accent.kumo + '40'}
            transform={`translate(${width * 0.1}, ${height * 0.7}) scale(1.2)`}
          />
        </G>
        
        <G opacity="0.25">
          <Path
            d="M25,35 Q15,25 18,15 Q28,8 38,12 Q48,18 45,28 Q42,38 32,40 Q20,40 25,35 Z"
            fill={JAPANESE_WELLNESS_DESIGN.colors.accent.yuki + '60'}
            transform={`translate(${width * 0.8}, ${height * 0.1}) scale(0.8)`}
          />
        </G>
        
        {/* Subtle wave pattern overlay */}
        <Path
          d={`M0,${height * 0.7} Q${width * 0.25},${height * 0.65} ${width * 0.5},${height * 0.7} Q${width * 0.75},${height * 0.75} ${width},${height * 0.7} L${width},${height} L0,${height} Z`}
          fill="url(#seigaihaPattern)"
          opacity="0.08"
        />
      </Svg>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    ...StyleSheet.absoluteFillObject,
    zIndex: -1,
    backgroundColor: JAPANESE_WELLNESS_DESIGN.colors.background.primary,
  },
  svg: {
    position: 'absolute',
    top: 0,
    left: 0,
  },
});

export default BlobBackground;