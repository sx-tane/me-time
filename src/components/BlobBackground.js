import React from 'react';
import { View, StyleSheet, Dimensions } from 'react-native';
import Svg, { Path, Circle, Ellipse } from 'react-native-svg';
import DESIGN_SYSTEM from '../constants/designSystem';

const { width, height } = Dimensions.get('window');

const BlobBackground = () => {
  return (
    <View style={styles.container}>
      {/* Top left mint blob */}
      <View style={[styles.blob, styles.blobTopLeft]}>
        <Svg width={200} height={200} viewBox="0 0 200 200">
          <Path
            d="M150,50 Q180,80 180,120 Q180,160 150,180 Q120,200 80,190 Q40,180 20,150 Q0,120 10,80 Q20,40 60,20 Q100,0 130,20 Q160,40 150,50"
            fill={DESIGN_SYSTEM.colors.primary + '20'}
          />
        </Svg>
      </View>

      {/* Bottom right blue blob */}
      <View style={[styles.blob, styles.blobBottomRight]}>
        <Svg width={250} height={250} viewBox="0 0 250 250">
          <Path
            d="M200,60 Q240,100 240,150 Q240,200 200,230 Q160,260 110,250 Q60,240 30,200 Q0,160 20,110 Q40,60 90,30 Q140,0 180,30 Q220,60 200,60"
            fill={DESIGN_SYSTEM.colors.accent.blue + '30'}
          />
        </Svg>
      </View>

      {/* Center peach blob */}
      <View style={[styles.blob, styles.blobCenter]}>
        <Svg width={300} height={300} viewBox="0 0 300 300">
          <Path
            d="M250,75 Q300,125 290,190 Q280,255 215,280 Q150,305 85,280 Q20,255 10,190 Q0,125 50,75 Q100,25 165,35 Q230,45 250,75"
            fill={DESIGN_SYSTEM.colors.accent.peach + '25'}
          />
        </Svg>
      </View>

      {/* Small accent circles */}
      <View style={[styles.blob, styles.circleTopRight]}>
        <Svg width={80} height={80} viewBox="0 0 80 80">
          <Circle cx="40" cy="40" r="40" fill={DESIGN_SYSTEM.colors.accent.yellow + '20'} />
        </Svg>
      </View>

      <View style={[styles.blob, styles.circleBottomLeft]}>
        <Svg width={60} height={60} viewBox="0 0 60 60">
          <Circle cx="30" cy="30" r="30" fill={DESIGN_SYSTEM.colors.accent.purple + '25'} />
        </Svg>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    ...StyleSheet.absoluteFillObject,
    zIndex: -1,
  },
  blob: {
    position: 'absolute',
  },
  blobTopLeft: {
    top: -50,
    left: -50,
  },
  blobBottomRight: {
    bottom: -80,
    right: -60,
  },
  blobCenter: {
    top: height * 0.3,
    left: width * 0.5 - 150,
  },
  circleTopRight: {
    top: 100,
    right: 20,
  },
  circleBottomLeft: {
    bottom: 150,
    left: 30,
  },
});

export default BlobBackground;