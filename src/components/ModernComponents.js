import React from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  TouchableOpacity, 
  TextInput,
  Image,
  ScrollView,
  Dimensions,
  Animated,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { BlurView } from 'expo-blur';
import { Ionicons } from '@expo/vector-icons';
import { DESIGN_SYSTEM, GRADIENTS, COMPONENT_STYLES } from '../constants/designSystem';

const { width: SCREEN_WIDTH } = Dimensions.get('window');

// Modern Card Component with gradient border
export const ModernCard = ({ children, variant = 'default', gradient = false, style, ...props }) => {
  if (gradient) {
    return (
      <LinearGradient
        colors={GRADIENTS.subtle}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={[styles.gradientCard, style]}
        {...props}
      >
        <View style={styles.gradientCardInner}>
          {children}
        </View>
      </LinearGradient>
    );
  }

  return (
    <View style={[styles.modernCard, COMPONENT_STYLES.card[variant], style]} {...props}>
      {children}
    </View>
  );
};

// Glassmorphism Card Component
export const GlassCard = ({ children, intensity = 80, style, ...props }) => {
  return (
    <View style={[styles.glassContainer, style]} {...props}>
      <BlurView intensity={intensity} style={styles.glassBlur}>
        <View style={styles.glassContent}>
          {children}
        </View>
      </BlurView>
    </View>
  );
};

// Modern Button with multiple variants
export const ModernButton = ({ 
  title, 
  onPress, 
  variant = 'primary', 
  icon, 
  loading = false,
  disabled = false,
  size = 'medium',
  style,
  ...props 
}) => {
  const buttonStyles = [
    styles.modernButton,
    styles[`button${variant.charAt(0).toUpperCase() + variant.slice(1)}`],
    styles[`button${size.charAt(0).toUpperCase() + size.slice(1)}`],
    disabled && styles.buttonDisabled,
    style,
  ];

  const textStyles = [
    styles.buttonText,
    styles[`buttonText${variant.charAt(0).toUpperCase() + variant.slice(1)}`],
    styles[`buttonText${size.charAt(0).toUpperCase() + size.slice(1)}`],
  ];

  return (
    <TouchableOpacity 
      style={buttonStyles} 
      onPress={onPress}
      disabled={disabled || loading}
      activeOpacity={0.7}
      {...props}
    >
      {icon && !loading && (
        <Ionicons 
          name={icon} 
          size={size === 'small' ? 16 : size === 'large' ? 24 : 20} 
          color={variant === 'primary' ? '#FFFFFF' : DESIGN_SYSTEM.colors.primary[500]}
          style={styles.buttonIcon}
        />
      )}
      {loading ? (
        <ActivityIndicator color={variant === 'primary' ? '#FFFFFF' : DESIGN_SYSTEM.colors.primary[500]} />
      ) : (
        <Text style={textStyles}>{title}</Text>
      )}
    </TouchableOpacity>
  );
};

// Floating Action Button
export const FAB = ({ icon, onPress, style, ...props }) => {
  const scaleAnim = React.useRef(new Animated.Value(1)).current;

  const handlePressIn = () => {
    Animated.spring(scaleAnim, {
      toValue: 0.9,
      useNativeDriver: true,
    }).start();
  };

  const handlePressOut = () => {
    Animated.spring(scaleAnim, {
      toValue: 1,
      friction: 3,
      tension: 40,
      useNativeDriver: true,
    }).start();
  };

  return (
    <Animated.View style={[styles.fabContainer, { transform: [{ scale: scaleAnim }] }, style]}>
      <TouchableOpacity
        style={styles.fab}
        onPress={onPress}
        onPressIn={handlePressIn}
        onPressOut={handlePressOut}
        activeOpacity={0.8}
        {...props}
      >
        <LinearGradient
          colors={GRADIENTS.primary}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
          style={styles.fabGradient}
        >
          <Ionicons name={icon} size={24} color="#FFFFFF" />
        </LinearGradient>
      </TouchableOpacity>
    </Animated.View>
  );
};

// Modern Input Field
export const ModernInput = ({ 
  placeholder, 
  value, 
  onChangeText, 
  icon, 
  secureTextEntry,
  style,
  ...props 
}) => {
  const [isFocused, setIsFocused] = React.useState(false);

  return (
    <View style={[styles.inputContainer, isFocused && styles.inputContainerFocused, style]}>
      {icon && (
        <Ionicons 
          name={icon} 
          size={20} 
          color={isFocused ? DESIGN_SYSTEM.colors.primary[500] : DESIGN_SYSTEM.colors.text.tertiary}
          style={styles.inputIcon}
        />
      )}
      <TextInput
        style={styles.modernInput}
        placeholder={placeholder}
        placeholderTextColor={DESIGN_SYSTEM.colors.text.tertiary}
        value={value}
        onChangeText={onChangeText}
        onFocus={() => setIsFocused(true)}
        onBlur={() => setIsFocused(false)}
        secureTextEntry={secureTextEntry}
        {...props}
      />
    </View>
  );
};

// Chip Component
export const Chip = ({ label, selected = false, onPress, style }) => {
  return (
    <TouchableOpacity 
      style={[styles.chip, selected && styles.chipSelected, style]}
      onPress={onPress}
      activeOpacity={0.7}
    >
      <Text style={[styles.chipText, selected && styles.chipTextSelected]}>{label}</Text>
    </TouchableOpacity>
  );
};

// Section Header
export const SectionHeader = ({ title, subtitle, action, onActionPress }) => {
  return (
    <View style={styles.sectionHeader}>
      <View style={styles.sectionHeaderText}>
        <Text style={styles.sectionTitle}>{title}</Text>
        {subtitle && <Text style={styles.sectionSubtitle}>{subtitle}</Text>}
      </View>
      {action && (
        <TouchableOpacity onPress={onActionPress}>
          <Text style={styles.sectionAction}>{action}</Text>
        </TouchableOpacity>
      )}
    </View>
  );
};

// Progress Bar
export const ProgressBar = ({ progress = 0, height = 8, color = DESIGN_SYSTEM.colors.primary[500] }) => {
  const widthAnim = React.useRef(new Animated.Value(0)).current;

  React.useEffect(() => {
    Animated.timing(widthAnim, {
      toValue: progress,
      duration: 500,
      useNativeDriver: false,
    }).start();
  }, [progress]);

  return (
    <View style={[styles.progressBarContainer, { height }]}>
      <Animated.View 
        style={[
          styles.progressBarFill, 
          { 
            backgroundColor: color,
            width: widthAnim.interpolate({
              inputRange: [0, 1],
              outputRange: ['0%', '100%'],
            }),
          }
        ]} 
      />
    </View>
  );
};

// Avatar Component
export const Avatar = ({ source, size = 'medium', style }) => {
  const sizeMap = {
    small: 32,
    medium: 48,
    large: 64,
    xlarge: 96,
  };

  const avatarSize = sizeMap[size] || size;

  return (
    <View style={[styles.avatarContainer, { width: avatarSize, height: avatarSize }, style]}>
      {source ? (
        <Image source={source} style={styles.avatarImage} />
      ) : (
        <View style={styles.avatarPlaceholder}>
          <Ionicons name="person" size={avatarSize * 0.5} color={DESIGN_SYSTEM.colors.text.tertiary} />
        </View>
      )}
    </View>
  );
};

// Tab Component
export const Tab = ({ tabs, activeTab, onTabPress }) => {
  return (
    <View style={styles.tabContainer}>
      {tabs.map((tab, index) => (
        <TouchableOpacity
          key={index}
          style={[styles.tab, activeTab === index && styles.tabActive]}
          onPress={() => onTabPress(index)}
          activeOpacity={0.7}
        >
          <Text style={[styles.tabText, activeTab === index && styles.tabTextActive]}>
            {tab}
          </Text>
          {activeTab === index && <View style={styles.tabIndicator} />}
        </TouchableOpacity>
      ))}
    </View>
  );
};

const styles = StyleSheet.create({
  // Modern Card Styles
  modernCard: {
    backgroundColor: DESIGN_SYSTEM.colors.surface.card,
    borderRadius: DESIGN_SYSTEM.borderRadius.xl,
    padding: DESIGN_SYSTEM.spacing[6],
  },
  gradientCard: {
    borderRadius: DESIGN_SYSTEM.borderRadius.xl,
    padding: 1,
  },
  gradientCardInner: {
    backgroundColor: DESIGN_SYSTEM.colors.surface.card,
    borderRadius: DESIGN_SYSTEM.borderRadius.xl - 1,
    padding: DESIGN_SYSTEM.spacing[6],
  },
  
  // Glass Card Styles
  glassContainer: {
    borderRadius: DESIGN_SYSTEM.borderRadius.xl,
    overflow: 'hidden',
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
  },
  glassBlur: {
    flex: 1,
  },
  glassContent: {
    padding: DESIGN_SYSTEM.spacing[6],
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
  },
  
  // Button Styles
  modernButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: DESIGN_SYSTEM.borderRadius.full,
    paddingVertical: DESIGN_SYSTEM.spacing[4],
    paddingHorizontal: DESIGN_SYSTEM.spacing[8],
  },
  buttonPrimary: {
    backgroundColor: DESIGN_SYSTEM.colors.primary[500],
    ...DESIGN_SYSTEM.shadows.md,
  },
  buttonSecondary: {
    backgroundColor: DESIGN_SYSTEM.colors.background.tertiary,
    borderWidth: 1,
    borderColor: DESIGN_SYSTEM.colors.surface.divider,
  },
  buttonGhost: {
    backgroundColor: 'transparent',
  },
  buttonSmall: {
    paddingVertical: DESIGN_SYSTEM.spacing[2],
    paddingHorizontal: DESIGN_SYSTEM.spacing[4],
  },
  buttonLarge: {
    paddingVertical: DESIGN_SYSTEM.spacing[5],
    paddingHorizontal: DESIGN_SYSTEM.spacing[10],
  },
  buttonDisabled: {
    opacity: 0.5,
  },
  buttonIcon: {
    marginRight: DESIGN_SYSTEM.spacing[2],
  },
  buttonText: {
    fontSize: DESIGN_SYSTEM.typography.fontSize.base,
    fontWeight: DESIGN_SYSTEM.typography.fontWeight.semiBold,
  },
  buttonTextPrimary: {
    color: DESIGN_SYSTEM.colors.text.inverse,
  },
  buttonTextSecondary: {
    color: DESIGN_SYSTEM.colors.text.primary,
  },
  buttonTextGhost: {
    color: DESIGN_SYSTEM.colors.primary[500],
  },
  buttonTextSmall: {
    fontSize: DESIGN_SYSTEM.typography.fontSize.sm,
  },
  buttonTextLarge: {
    fontSize: DESIGN_SYSTEM.typography.fontSize.md,
  },
  
  // FAB Styles
  fabContainer: {
    position: 'absolute',
    bottom: DESIGN_SYSTEM.spacing[6],
    right: DESIGN_SYSTEM.spacing[6],
  },
  fab: {
    width: 56,
    height: 56,
    borderRadius: DESIGN_SYSTEM.borderRadius.full,
    ...DESIGN_SYSTEM.shadows.xl,
  },
  fabGradient: {
    width: '100%',
    height: '100%',
    borderRadius: DESIGN_SYSTEM.borderRadius.full,
    alignItems: 'center',
    justifyContent: 'center',
  },
  
  // Input Styles
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: DESIGN_SYSTEM.colors.background.tertiary,
    borderRadius: DESIGN_SYSTEM.borderRadius.lg,
    paddingHorizontal: DESIGN_SYSTEM.spacing[5],
    borderWidth: 1,
    borderColor: 'transparent',
  },
  inputContainerFocused: {
    borderColor: DESIGN_SYSTEM.colors.primary[300],
    backgroundColor: DESIGN_SYSTEM.colors.background.primary,
    ...DESIGN_SYSTEM.shadows.sm,
  },
  inputIcon: {
    marginRight: DESIGN_SYSTEM.spacing[3],
  },
  modernInput: {
    flex: 1,
    paddingVertical: DESIGN_SYSTEM.spacing[4],
    fontSize: DESIGN_SYSTEM.typography.fontSize.base,
    color: DESIGN_SYSTEM.colors.text.primary,
  },
  
  // Chip Styles
  chip: {
    paddingVertical: DESIGN_SYSTEM.spacing[2],
    paddingHorizontal: DESIGN_SYSTEM.spacing[4],
    borderRadius: DESIGN_SYSTEM.borderRadius.full,
    backgroundColor: DESIGN_SYSTEM.colors.background.tertiary,
    marginRight: DESIGN_SYSTEM.spacing[2],
  },
  chipSelected: {
    backgroundColor: DESIGN_SYSTEM.colors.primary[100],
  },
  chipText: {
    fontSize: DESIGN_SYSTEM.typography.fontSize.sm,
    color: DESIGN_SYSTEM.colors.text.secondary,
    fontWeight: DESIGN_SYSTEM.typography.fontWeight.medium,
  },
  chipTextSelected: {
    color: DESIGN_SYSTEM.colors.primary[700],
  },
  
  // Section Header Styles
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: DESIGN_SYSTEM.spacing[4],
  },
  sectionHeaderText: {
    flex: 1,
  },
  sectionTitle: {
    fontSize: DESIGN_SYSTEM.typography.fontSize.lg,
    fontWeight: DESIGN_SYSTEM.typography.fontWeight.semiBold,
    color: DESIGN_SYSTEM.colors.text.primary,
  },
  sectionSubtitle: {
    fontSize: DESIGN_SYSTEM.typography.fontSize.sm,
    color: DESIGN_SYSTEM.colors.text.secondary,
    marginTop: DESIGN_SYSTEM.spacing[1],
  },
  sectionAction: {
    fontSize: DESIGN_SYSTEM.typography.fontSize.sm,
    color: DESIGN_SYSTEM.colors.primary[500],
    fontWeight: DESIGN_SYSTEM.typography.fontWeight.medium,
  },
  
  // Progress Bar Styles
  progressBarContainer: {
    backgroundColor: DESIGN_SYSTEM.colors.background.tertiary,
    borderRadius: DESIGN_SYSTEM.borderRadius.full,
    overflow: 'hidden',
  },
  progressBarFill: {
    height: '100%',
    borderRadius: DESIGN_SYSTEM.borderRadius.full,
  },
  
  // Avatar Styles
  avatarContainer: {
    borderRadius: DESIGN_SYSTEM.borderRadius.full,
    overflow: 'hidden',
    backgroundColor: DESIGN_SYSTEM.colors.background.tertiary,
  },
  avatarImage: {
    width: '100%',
    height: '100%',
    resizeMode: 'cover',
  },
  avatarPlaceholder: {
    width: '100%',
    height: '100%',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: DESIGN_SYSTEM.colors.background.tertiary,
  },
  
  // Tab Styles
  tabContainer: {
    flexDirection: 'row',
    backgroundColor: DESIGN_SYSTEM.colors.background.tertiary,
    borderRadius: DESIGN_SYSTEM.borderRadius.lg,
    padding: DESIGN_SYSTEM.spacing[1],
  },
  tab: {
    flex: 1,
    paddingVertical: DESIGN_SYSTEM.spacing[3],
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: DESIGN_SYSTEM.borderRadius.md,
    position: 'relative',
  },
  tabActive: {
    backgroundColor: DESIGN_SYSTEM.colors.background.primary,
    ...DESIGN_SYSTEM.shadows.sm,
  },
  tabText: {
    fontSize: DESIGN_SYSTEM.typography.fontSize.sm,
    fontWeight: DESIGN_SYSTEM.typography.fontWeight.medium,
    color: DESIGN_SYSTEM.colors.text.secondary,
  },
  tabTextActive: {
    color: DESIGN_SYSTEM.colors.primary[500],
    fontWeight: DESIGN_SYSTEM.typography.fontWeight.semiBold,
  },
  tabIndicator: {
    position: 'absolute',
    bottom: DESIGN_SYSTEM.spacing[1],
    width: 20,
    height: 3,
    backgroundColor: DESIGN_SYSTEM.colors.primary[500],
    borderRadius: DESIGN_SYSTEM.borderRadius.full,
  },
});

export default {
  ModernCard,
  GlassCard,
  ModernButton,
  FAB,
  ModernInput,
  Chip,
  SectionHeader,
  ProgressBar,
  Avatar,
  Tab,
};