import React, { useState, useEffect } from 'react';
import { View, Text, SafeAreaView, ScrollView, Switch, Alert, StyleSheet, TouchableOpacity } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import * as Notifications from 'expo-notifications';
import { GentleButton } from './GentleButton';
import GentleTimePicker from './GentleTimePicker';
import { STORAGE_KEYS } from '../constants/storage';
import DESIGN_SYSTEM from '../constants/designSystem';
import { JAPANESE_WELLNESS_DESIGN } from '../constants/japaneseWellnessDesign';
import { clearAllCache } from '../utils/clearAllCache';
import { notificationService } from '../services/notificationService';

interface TimeValue {
  hour: number;
  minute: number;
}

interface NotificationTimes {
  morning: TimeValue;
  afternoon: TimeValue;
  evening: TimeValue;
}

interface SettingsScreenProps {
  onBack: () => void;
}

const formatTime = (hour: number, minute: number): string => {
  const period = hour >= 12 ? 'PM' : 'AM';
  const displayHour = hour === 0 ? 12 : hour > 12 ? hour - 12 : hour;
  return `${displayHour}:${minute.toString().padStart(2, '0')} ${period}`;
};

export const SettingsScreen: React.FC<SettingsScreenProps> = ({ onBack }) => {
  const [notificationsEnabled, setNotificationsEnabled] = useState<boolean>(false);
  const [showAdvancedTimes, setShowAdvancedTimes] = useState<boolean>(false);
  const [notificationTimes, setNotificationTimes] = useState<NotificationTimes>({
    morning: { hour: 9, minute: 0 },
    afternoon: { hour: 15, minute: 0 },
    evening: { hour: 20, minute: 0 }
  });

  useEffect(() => {
    loadSettings();
  }, []);

  const loadSettings = async (): Promise<void> => {
    try {
      const enabled = await AsyncStorage.getItem(STORAGE_KEYS.NOTIFICATIONS_ENABLED);
      setNotificationsEnabled(enabled === 'true');
      
      const times = await notificationService.getNotificationTimes();
      setNotificationTimes(times);
    } catch (error) {
      console.error('Error loading settings:', error);
    }
  };

  const toggleNotifications = async (value: boolean): Promise<void> => {
    try {
      if (value) {
        const success = await notificationService.enableNotifications();
        if (success) {
          setNotificationsEnabled(true);
          Alert.alert(
            "All set! 🌱",
            "You'll receive gentle reminders to take breaks throughout the day. No stress, just gentle nudges.",
            [{ text: "Perfect", style: "default" }]
          );
        } else {
          Alert.alert(
            "Gentle reminder",
            "We'd love to send you daily suggestions, but you'll need to enable notifications in your phone settings.",
            [{ text: "Ok", style: "cancel" }]
          );
          setNotificationsEnabled(false);
        }
      } else {
        await notificationService.disableNotifications();
        setNotificationsEnabled(false);
      }
    } catch (error) {
      console.error('Error toggling notifications:', error);
    }
  };

  const handleTimeChange = async (timeOfDay: keyof NotificationTimes, newTime: TimeValue): Promise<void> => {
    const updatedTimes = {
      ...notificationTimes,
      [timeOfDay]: newTime
    };
    setNotificationTimes(updatedTimes);
    await notificationService.setNotificationTimes(updatedTimes);
  };

  const clearAllData = (): void => {
    Alert.alert(
      "Fresh start?",
      "This will reset everything. Like it never happened.",
      [
        { text: "Cancel", style: "cancel" },
        { 
          text: "Clear", 
          onPress: async () => {
            await AsyncStorage.clear();
            Alert.alert("Done", "Everything's been cleared. Fresh start.");
          }
        }
      ]
    );
  };

  const clearCache = (): void => {
    Alert.alert(
      "Clear suggestions cache?",
      "This will refresh all suggestions and location data. Your settings will remain.",
      [
        { text: "Cancel", style: "cancel" },
        { 
          text: "Clear Cache", 
          onPress: async () => {
            try {
              await clearAllCache();
              Alert.alert("Success", "Cache cleared! You'll get fresh suggestions now.");
            } catch (error) {
              console.error('Error clearing cache:', error);
              Alert.alert("Error", "Failed to clear cache. Please try again.");
            }
          }
        }
      ]
    );
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollContent}>
        <View style={styles.header}>
          <TouchableOpacity style={styles.backButton} onPress={onBack}>
            <Text style={styles.backButtonText}>← Back</Text>
          </TouchableOpacity>
          <Text style={styles.screenTitle}>Settings</Text>
        </View>
        
        <View style={styles.settingSection}>
          <Text style={styles.sectionTitle}>Daily reminders</Text>
          <Text style={styles.sectionDescription}>
            Gentle nudges to pause and breathe. Three times a day, perfectly timed for you.
          </Text>
          
          <View style={styles.settingRow}>
            <Text style={styles.settingLabel}>Enable daily reminders</Text>
            <Switch
              value={notificationsEnabled}
              onValueChange={toggleNotifications}
              trackColor={{ 
                false: JAPANESE_WELLNESS_DESIGN.colors.neutral[200], 
                true: JAPANESE_WELLNESS_DESIGN.colors.primary[500] 
              }}
              thumbColor={JAPANESE_WELLNESS_DESIGN.colors.neutral[100]}
            />
          </View>

          {notificationsEnabled && (
            <View style={styles.timeSettingsContainer}>
              <View style={styles.defaultTimesSection}>
                <Text style={styles.timeSettingsTitle}>Reminder times</Text>
                <Text style={styles.defaultTimesDescription}>
                  We'll send gentle reminders at 9:00 AM, 3:00 PM, and 8:00 PM. Perfect for most people.
                </Text>
                
                <TouchableOpacity 
                  style={styles.customizeButton}
                  onPress={() => setShowAdvancedTimes(!showAdvancedTimes)}
                >
                  <Text style={styles.customizeButtonText}>
                    {showAdvancedTimes ? '← Use default times' : 'Customize times →'}
                  </Text>
                </TouchableOpacity>
              </View>
              
              {showAdvancedTimes && (
                <View style={styles.advancedTimeSettings}>
                  <Text style={styles.advancedTitle}>Custom reminder times</Text>
                  
                  <GentleTimePicker
                    title="Morning pause"
                    description="Start your day with intention"
                    value={notificationTimes.morning}
                    onTimeChange={(time) => handleTimeChange('morning', time)}
                  />
                  
                  <GentleTimePicker
                    title="Afternoon reset"
                    description="A midday moment to breathe"
                    value={notificationTimes.afternoon}
                    onTimeChange={(time) => handleTimeChange('afternoon', time)}
                  />
                  
                  <GentleTimePicker
                    title="Evening wind-down"
                    description="Let the day settle gently"
                    value={notificationTimes.evening}
                    onTimeChange={(time) => handleTimeChange('evening', time)}
                  />
                </View>
              )}
            </View>
          )}
        </View>
        
        <View style={styles.settingSection}>
          <Text style={styles.sectionTitle}>About Me Time</Text>
          <Text style={styles.aboutText}>
            An app about doing less, not more.{'\n\n'}
            No streaks. No achievements. No guilt.{'\n\n'}
            Just gentle invitations to slow down and notice the world around you.{'\n\n'}
            It's ok to skip days. It's ok to uninstall. It's ok to be not ok.
          </Text>
        </View>
        
        <View style={styles.buttonsContainer}>
          <GentleButton
            title="Clear cache"
            onPress={clearCache}
            variant="secondary"
            style={styles.button}
          />
          
          <GentleButton
            title="Clear all data"
            onPress={clearAllData}
            variant="ghost"
            style={styles.button}
          />
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: JAPANESE_WELLNESS_DESIGN.colors.background.meditation,
  },
  scrollContent: {
    paddingHorizontal: 16,
    paddingBottom: 32,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: DESIGN_SYSTEM.spacing.lg,
    marginBottom: DESIGN_SYSTEM.spacing.xxl,
    paddingVertical: DESIGN_SYSTEM.spacing.sm,
  },
  backButton: {
    paddingVertical: 8,
    paddingHorizontal: 16,
    backgroundColor: JAPANESE_WELLNESS_DESIGN.colors.background.ritual,
    borderRadius: 12,
    ...DESIGN_SYSTEM.shadows.subtle,
  },
  backButtonText: {
    fontSize: DESIGN_SYSTEM.typography.fontSize.body,
    color: DESIGN_SYSTEM.colors.primary,
    fontWeight: DESIGN_SYSTEM.typography.fontWeight.medium,
  },
  screenTitle: {
    fontSize: JAPANESE_WELLNESS_DESIGN.typography.sizes.title,
    fontWeight: '600',
    color: JAPANESE_WELLNESS_DESIGN.colors.text.primary,
    marginLeft: 16,
    letterSpacing: JAPANESE_WELLNESS_DESIGN.typography.letterSpacing.zen,
  },
  settingSection: {
    marginTop: 24,
    backgroundColor: JAPANESE_WELLNESS_DESIGN.colors.background.sanctuary,
    borderRadius: 16,
    padding: 20,
    ...DESIGN_SYSTEM.shadows.card,
    borderWidth: 1,
    borderColor: JAPANESE_WELLNESS_DESIGN.colors.neutral[200],
  },
  sectionTitle: {
    fontSize: DESIGN_SYSTEM.typography.fontSize.title,
    fontWeight: DESIGN_SYSTEM.typography.fontWeight.semibold,
    color: DESIGN_SYSTEM.colors.text.primary,
    marginBottom: DESIGN_SYSTEM.spacing.sm,
    letterSpacing: DESIGN_SYSTEM.typography.letterSpacing.tight,
  },
  sectionDescription: {
    fontSize: DESIGN_SYSTEM.typography.fontSize.body,
    color: DESIGN_SYSTEM.colors.text.secondary,
    marginBottom: DESIGN_SYSTEM.spacing.lg,
    lineHeight: DESIGN_SYSTEM.typography.fontSize.body * DESIGN_SYSTEM.typography.lineHeight.relaxed,
    fontWeight: DESIGN_SYSTEM.typography.fontWeight.light,
  },
  settingRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 16,
    backgroundColor: JAPANESE_WELLNESS_DESIGN.colors.background.ritual,
    borderRadius: 14,
    paddingHorizontal: 16,
    marginVertical: 8,
    ...DESIGN_SYSTEM.shadows.subtle,
  },
  settingLabel: {
    fontSize: DESIGN_SYSTEM.typography.fontSize.body,
    color: DESIGN_SYSTEM.colors.text.primary,
    fontWeight: DESIGN_SYSTEM.typography.fontWeight.medium,
  },
  aboutText: {
    fontSize: DESIGN_SYSTEM.typography.fontSize.body,
    color: DESIGN_SYSTEM.colors.text.primary,
    lineHeight: DESIGN_SYSTEM.typography.fontSize.body * DESIGN_SYSTEM.typography.lineHeight.loose,
    fontWeight: DESIGN_SYSTEM.typography.fontWeight.light,
    letterSpacing: DESIGN_SYSTEM.typography.letterSpacing.normal,
  },
  buttonsContainer: {
    marginTop: DESIGN_SYSTEM.spacing.xxl,
    gap: DESIGN_SYSTEM.spacing.lg,
  },
  button: {
    marginVertical: DESIGN_SYSTEM.spacing.sm,
  },
  timeSettingsContainer: {
    marginTop: 16,
    padding: 16,
    backgroundColor: JAPANESE_WELLNESS_DESIGN.colors.background.ritual,
    borderRadius: 18,
    ...DESIGN_SYSTEM.shadows.subtle,
  },
  timeSettingsTitle: {
    fontSize: DESIGN_SYSTEM.typography.fontSize.body,
    fontWeight: DESIGN_SYSTEM.typography.fontWeight.semibold,
    color: DESIGN_SYSTEM.colors.text.primary,
    marginBottom: DESIGN_SYSTEM.spacing.sm,
  },
  defaultTimesSection: {
    marginBottom: DESIGN_SYSTEM.spacing.lg,
  },
  defaultTimesDescription: {
    fontSize: DESIGN_SYSTEM.typography.fontSize.small,
    color: DESIGN_SYSTEM.colors.text.secondary,
    lineHeight: DESIGN_SYSTEM.typography.fontSize.small * DESIGN_SYSTEM.typography.lineHeight.relaxed,
    marginBottom: DESIGN_SYSTEM.spacing.lg,
  },
  customizeButton: {
    paddingVertical: DESIGN_SYSTEM.spacing.lg,
    paddingHorizontal: DESIGN_SYSTEM.spacing.lg,
    backgroundColor: DESIGN_SYSTEM.colors.surface.card,
    borderRadius: DESIGN_SYSTEM.borderRadius.lg,
    alignItems: 'center',
    borderWidth: 2,
    borderColor: DESIGN_SYSTEM.colors.primary,
    ...DESIGN_SYSTEM.shadows.subtle,
  },
  customizeButtonText: {
    fontSize: DESIGN_SYSTEM.typography.fontSize.small,
    color: DESIGN_SYSTEM.colors.primary,
    fontWeight: DESIGN_SYSTEM.typography.fontWeight.medium,
  },
  advancedTimeSettings: {
    marginTop: DESIGN_SYSTEM.spacing.lg,
    padding: DESIGN_SYSTEM.spacing.lg,
    backgroundColor: DESIGN_SYSTEM.colors.surface.card,
    borderRadius: DESIGN_SYSTEM.borderRadius.lg,
    ...DESIGN_SYSTEM.shadows.subtle,
  },
  advancedTitle: {
    fontSize: DESIGN_SYSTEM.typography.fontSize.small,
    fontWeight: DESIGN_SYSTEM.typography.fontWeight.medium,
    color: DESIGN_SYSTEM.colors.text.primary,
    marginBottom: DESIGN_SYSTEM.spacing.lg,
    textAlign: 'center',
  },
});