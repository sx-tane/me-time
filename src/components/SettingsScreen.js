import React, { useState, useEffect } from 'react';
import { View, Text, SafeAreaView, ScrollView, Switch, Alert, StyleSheet, TouchableOpacity } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import * as Notifications from 'expo-notifications';
import { GentleButton } from './GentleButton';
import GentleTimePicker from './GentleTimePicker';

const formatTime = (hour, minute) => {
  const period = hour >= 12 ? 'PM' : 'AM';
  const displayHour = hour === 0 ? 12 : hour > 12 ? hour - 12 : hour;
  return `${displayHour}:${minute.toString().padStart(2, '0')} ${period}`;
};
import { STORAGE_KEYS } from '../constants/storage';
import colors, { ROUNDED_DESIGN } from '../constants/colors';
import { clearAllCache } from '../utils/clearAllCache';
import { notificationService } from '../services/notificationService';

export const SettingsScreen = ({ onBack }) => {
  const [notificationsEnabled, setNotificationsEnabled] = useState(false);
  const [showAdvancedTimes, setShowAdvancedTimes] = useState(false);
  const [notificationTimes, setNotificationTimes] = useState({
    morning: { hour: 9, minute: 0 },
    afternoon: { hour: 15, minute: 0 },
    evening: { hour: 20, minute: 0 }
  });

  useEffect(() => {
    loadSettings();
  }, []);

  const loadSettings = async () => {
    try {
      const enabled = await AsyncStorage.getItem(STORAGE_KEYS.NOTIFICATIONS_ENABLED);
      setNotificationsEnabled(enabled === 'true');
      
      const times = await notificationService.getNotificationTimes();
      setNotificationTimes(times);
    } catch (error) {
      console.error('Error loading settings:', error);
    }
  };

  const toggleNotifications = async (value) => {
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

  const handleTimeChange = async (timeOfDay, newTime) => {
    const updatedTimes = {
      ...notificationTimes,
      [timeOfDay]: newTime
    };
    setNotificationTimes(updatedTimes);
    await notificationService.setNotificationTimes(updatedTimes);
  };

  const clearAllData = () => {
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

  const clearCache = () => {
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
              trackColor={{ false: colors.border, true: colors.accent }}
              thumbColor={notificationsEnabled ? colors.primary : colors.surface}
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
    backgroundColor: colors.background,
  },
  scrollContent: {
    paddingHorizontal: ROUNDED_DESIGN.spacing.comfortable,
    paddingBottom: ROUNDED_DESIGN.spacing.expansive,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: ROUNDED_DESIGN.spacing.comfortable,
    marginBottom: ROUNDED_DESIGN.spacing.spacious,
    paddingVertical: ROUNDED_DESIGN.spacing.gentle,
  },
  backButton: {
    paddingVertical: ROUNDED_DESIGN.spacing.gentle,
    paddingHorizontal: ROUNDED_DESIGN.spacing.comfortable,
    backgroundColor: colors.tertiary,
    borderRadius: ROUNDED_DESIGN.radius.gentle,
    ...ROUNDED_DESIGN.shadows.gentle,
  },
  backButtonText: {
    fontSize: 16,
    color: colors.primary,
    fontWeight: '400',
  },
  screenTitle: {
    fontSize: 30,
    fontWeight: '500',
    color: colors.text,
    marginLeft: ROUNDED_DESIGN.spacing.comfortable,
    letterSpacing: -0.5,
  },
  settingSection: {
    marginTop: ROUNDED_DESIGN.spacing.generous,
    backgroundColor: colors.surface,
    borderRadius: ROUNDED_DESIGN.radius.soft,
    padding: ROUNDED_DESIGN.spacing.spacious,
    ...ROUNDED_DESIGN.shadows.gentle,
    borderWidth: 1,
    borderColor: colors.border,
  },
  sectionTitle: {
    fontSize: 22,
    fontWeight: '500',
    color: colors.text,
    marginBottom: ROUNDED_DESIGN.spacing.gentle,
    letterSpacing: -0.2,
  },
  sectionDescription: {
    fontSize: 15,
    color: colors.lightText,
    marginBottom: ROUNDED_DESIGN.spacing.comfortable,
    lineHeight: 22,
    fontWeight: '300',
  },
  settingRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: ROUNDED_DESIGN.spacing.comfortable,
    backgroundColor: colors.tertiary,
    borderRadius: ROUNDED_DESIGN.radius.gentle,
    paddingHorizontal: ROUNDED_DESIGN.spacing.comfortable,
    marginVertical: ROUNDED_DESIGN.spacing.gentle,
    ...ROUNDED_DESIGN.shadows.gentle,
  },
  settingLabel: {
    fontSize: 16,
    color: colors.text,
  },
  aboutText: {
    fontSize: 16,
    color: colors.text,
    lineHeight: 26,
    fontWeight: '300',
    letterSpacing: 0.2,
  },
  buttonsContainer: {
    marginTop: ROUNDED_DESIGN.spacing.generous,
    gap: ROUNDED_DESIGN.spacing.comfortable,
  },
  button: {
    marginVertical: 6,
  },
  timeSettingsContainer: {
    marginTop: ROUNDED_DESIGN.spacing.comfortable,
    padding: ROUNDED_DESIGN.spacing.comfortable,
    backgroundColor: colors.tertiary,
    borderRadius: ROUNDED_DESIGN.radius.gentle,
    ...ROUNDED_DESIGN.shadows.gentle,
  },
  timeSettingsTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: colors.text,
    marginBottom: 8,
  },
  defaultTimesSection: {
    marginBottom: 16,
  },
  defaultTimesDescription: {
    fontSize: 14,
    color: colors.lightText,
    lineHeight: 20,
    marginBottom: 16,
  },
  customizeButton: {
    paddingVertical: ROUNDED_DESIGN.spacing.comfortable,
    paddingHorizontal: ROUNDED_DESIGN.spacing.comfortable,
    backgroundColor: colors.surface,
    borderRadius: ROUNDED_DESIGN.radius.gentle,
    alignItems: 'center',
    borderWidth: 1.5,
    borderColor: colors.accent,
    ...ROUNDED_DESIGN.shadows.gentle,
  },
  customizeButtonText: {
    fontSize: 14,
    color: colors.primary,
    fontWeight: '500',
  },
  advancedTimeSettings: {
    marginTop: ROUNDED_DESIGN.spacing.comfortable,
    padding: ROUNDED_DESIGN.spacing.comfortable,
    backgroundColor: colors.surface,
    borderRadius: ROUNDED_DESIGN.radius.gentle,
    ...ROUNDED_DESIGN.shadows.gentle,
  },
  advancedTitle: {
    fontSize: 14,
    fontWeight: '500',
    color: colors.text,
    marginBottom: 16,
    textAlign: 'center',
  },
});