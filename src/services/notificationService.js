import * as Notifications from 'expo-notifications';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { STORAGE_KEYS } from '../constants/storage';

// Configure notification behavior
Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowAlert: true,
    shouldPlaySound: false,  // Keep it gentle
    shouldSetBadge: false,
  }),
});

const NOTIFICATION_IDS = {
  MORNING: 'daily-morning-relax',
  AFTERNOON: 'daily-afternoon-relax', 
  EVENING: 'daily-evening-relax',
};

const GENTLE_MESSAGES = {
  morning: [
    "Time to breathe. No rush.",
    "A gentle morning pause awaits you.",
    "Your peaceful moment is here.",
    "Take it slow today. You deserve rest.",
  ],
  afternoon: [
    "Midday reset. Just breathe.",
    "A quiet moment in your busy day.",
    "Time to slow down and notice.",
    "Your afternoon pause is ready.",
  ],
  evening: [
    "Evening calm. Let the day go.",
    "Time to unwind. No pressure.",
    "Your gentle evening break.",
    "Rest is productive too.",
  ]
};

const DEFAULT_TIMES = {
  morning: { hour: 9, minute: 0 },
  afternoon: { hour: 15, minute: 0 },
  evening: { hour: 20, minute: 0 }
};

class NotificationService {
  async scheduleAllNotifications() {
    try {
      const notificationsEnabled = await AsyncStorage.getItem(STORAGE_KEYS.NOTIFICATIONS_ENABLED);
      if (notificationsEnabled !== 'true') return;

      // Cancel existing notifications first
      await this.cancelAllNotifications();

      // Get user's preferred times or use defaults
      const times = await this.getNotificationTimes();

      // Schedule each notification
      await this.scheduleNotification('morning', times.morning);
      await this.scheduleNotification('afternoon', times.afternoon);
      await this.scheduleNotification('evening', times.evening);

      console.log('Daily relaxation notifications scheduled');
    } catch (error) {
      console.error('Error scheduling notifications:', error);
    }
  }

  async scheduleNotification(timeOfDay, time) {
    const messages = GENTLE_MESSAGES[timeOfDay];
    const message = messages[Math.floor(Math.random() * messages.length)];

    const notificationId = await Notifications.scheduleNotificationAsync({
      identifier: NOTIFICATION_IDS[timeOfDay.toUpperCase()],
      content: {
        title: "Gentle reminder",
        body: message,
        data: { timeOfDay },
      },
      trigger: {
        type: Notifications.SchedulableTriggerInputTypes.DAILY,
        hour: time.hour,
        minute: time.minute,
      },
    });

    return notificationId;
  }

  async cancelAllNotifications() {
    try {
      await Notifications.cancelScheduledNotificationAsync(NOTIFICATION_IDS.MORNING);
      await Notifications.cancelScheduledNotificationAsync(NOTIFICATION_IDS.AFTERNOON);
      await Notifications.cancelScheduledNotificationAsync(NOTIFICATION_IDS.EVENING);
    } catch (error) {
      console.error('Error canceling notifications:', error);
    }
  }

  async getNotificationTimes() {
    try {
      const storedTimes = await AsyncStorage.getItem(STORAGE_KEYS.NOTIFICATION_TIMES);
      return storedTimes ? JSON.parse(storedTimes) : DEFAULT_TIMES;
    } catch (error) {
      console.error('Error getting notification times:', error);
      return DEFAULT_TIMES;
    }
  }

  async setNotificationTimes(times) {
    try {
      await AsyncStorage.setItem(STORAGE_KEYS.NOTIFICATION_TIMES, JSON.stringify(times));
      // Reschedule with new times
      await this.scheduleAllNotifications();
    } catch (error) {
      console.error('Error setting notification times:', error);
    }
  }

  async enableNotifications() {
    const { status } = await Notifications.requestPermissionsAsync();
    if (status === 'granted') {
      await AsyncStorage.setItem(STORAGE_KEYS.NOTIFICATIONS_ENABLED, 'true');
      await this.scheduleAllNotifications();
      return true;
    }
    return false;
  }

  async disableNotifications() {
    await AsyncStorage.setItem(STORAGE_KEYS.NOTIFICATIONS_ENABLED, 'false');
    await this.cancelAllNotifications();
  }

  // Get a preview of when notifications will fire
  async getScheduledNotifications() {
    try {
      const scheduled = await Notifications.getAllScheduledNotificationsAsync();
      return scheduled.filter(notif => 
        Object.values(NOTIFICATION_IDS).includes(notif.identifier)
      );
    } catch (error) {
      console.error('Error getting scheduled notifications:', error);
      return [];
    }
  }
}

export const notificationService = new NotificationService();