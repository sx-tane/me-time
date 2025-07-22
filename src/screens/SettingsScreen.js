import React, { useState, useEffect } from 'react';
import { View, Text, SafeAreaView, ScrollView, Switch, Alert, StyleSheet } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import * as Notifications from 'expo-notifications';
import { GentleButton } from '../components/GentleButton';
import { STORAGE_KEYS } from '../constants/storage';
import colors from '../constants/colors';

export const SettingsScreen = () => {
  const [notificationsEnabled, setNotificationsEnabled] = useState(false);

  useEffect(() => {
    loadSettings();
  }, []);

  const loadSettings = async () => {
    try {
      const enabled = await AsyncStorage.getItem(STORAGE_KEYS.NOTIFICATIONS_ENABLED);
      setNotificationsEnabled(enabled === 'true');
    } catch (error) {
      console.error('Error loading settings:', error);
    }
  };

  const toggleNotifications = async (value) => {
    setNotificationsEnabled(value);
    await AsyncStorage.setItem(STORAGE_KEYS.NOTIFICATIONS_ENABLED, value.toString());
    
    if (value) {
      const { status } = await Notifications.requestPermissionsAsync();
      if (status !== 'granted') {
        Alert.alert(
          "Gentle reminder",
          "We'd love to send you daily suggestions, but you'll need to enable notifications in your phone settings.",
          [{ text: "Ok", style: "cancel" }]
        );
        setNotificationsEnabled(false);
        await AsyncStorage.setItem(STORAGE_KEYS.NOTIFICATIONS_ENABLED, 'false');
      }
    }
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

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollContent}>
        <Text style={styles.screenTitle}>Settings</Text>
        
        <View style={styles.settingSection}>
          <Text style={styles.sectionTitle}>Daily reminder</Text>
          <Text style={styles.sectionDescription}>
            A gentle nudge to slow down. Or not. Your choice.
          </Text>
          
          <View style={styles.settingRow}>
            <Text style={styles.settingLabel}>Enable daily reminder</Text>
            <Switch
              value={notificationsEnabled}
              onValueChange={toggleNotifications}
              trackColor={{ false: '#E0E0E0', true: colors.accent }}
              thumbColor={notificationsEnabled ? colors.primary : '#f4f3f4'}
            />
          </View>
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
        
        <GentleButton
          title="Clear all data"
          onPress={clearAllData}
          variant="ghost"
          style={{ marginTop: 20 }}
        />
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
    paddingHorizontal: 20,
    paddingBottom: 40,
  },
  screenTitle: {
    fontSize: 28,
    fontWeight: '700',
    color: colors.text,
    marginBottom: 30,
    marginTop: 20,
  },
  settingSection: {
    marginTop: 30,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: '600',
    color: colors.text,
    marginBottom: 5,
  },
  sectionDescription: {
    fontSize: 14,
    color: colors.lightText,
    marginBottom: 20,
  },
  settingRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 15,
    borderBottomWidth: 1,
    borderBottomColor: '#F0F0F0',
  },
  settingLabel: {
    fontSize: 16,
    color: colors.text,
  },
  aboutText: {
    fontSize: 16,
    color: colors.text,
    lineHeight: 24,
  },
});