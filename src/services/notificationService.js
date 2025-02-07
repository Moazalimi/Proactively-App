import * as Notifications from 'expo-notifications';
import { Platform } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';
import { getItem, setItem } from './storageService';

const TOKEN_STORAGE_KEY = 'expoPushToken';

// Store a token locally
async function storeToken(token) {
  try {
    if (token) {
      await AsyncStorage.setItem(TOKEN_STORAGE_KEY, token);
    } else {
      console.warn('Invalid token. Token not stored.');
    }
  } catch (error) {
    console.error('Error storing push token:', error);
  }
}

// Retrieve the stored token
export async function retrieveToken() {
  try {
    return await AsyncStorage.getItem(TOKEN_STORAGE_KEY);
  } catch (error) {
    console.error('Error retrieving push token:', error);
    return null;
  }
}

// Check for unseen notifications
export async function hasUnseenNotifications() {
  try {
    const notifications = (await getItem('notifications')) || [];
    return notifications.some((n) => !n.seen);
  } catch (error) {
    console.error('Error checking unseen notifications:', error);
    return false;
  }
}

// Register for push notifications and get an Expo Push Token
export async function registerForPushNotificationsAsync() {
  try {
    if (Platform.OS === 'android') {
      await Notifications.setNotificationChannelAsync('default', {
        name: 'default',
        importance: Notifications.AndroidImportance.MAX,
        vibrationPattern: [0, 250, 250, 250],
        lightColor: '#FF231F7C',
      });
    }

    const { status: existingStatus } = await Notifications.getPermissionsAsync();
    let finalStatus = existingStatus;

    if (finalStatus !== 'granted') {
      const { status } = await Notifications.requestPermissionsAsync();
      finalStatus = status;
    }

    if (finalStatus !== 'granted') {
      console.warn('Notification permissions not granted');
      return null;
    }

    const tokenResponse = await Notifications.getExpoPushTokenAsync();
    const expoPushToken = tokenResponse.data;

    if (!expoPushToken) {
      console.error('Invalid Expo Push Token:', expoPushToken);
      return null;
    }

    console.log('Expo Push Token:', expoPushToken);
    await storeToken(expoPushToken);

    return expoPushToken;
  } catch (error) {
    console.error('Error registering for push notifications:', error);
    return null;
  }
}

// Configure notification behavior
export function configureNotificationHandler() {
  Notifications.setNotificationHandler({
    handleNotification: async () => ({
      shouldShowAlert: true,
      shouldPlaySound: true,
      shouldSetBadge: true,
    }),
  });
}

// Send a push notification via Expo's Push API
export async function sendPushNotification(expoPushToken, title, body, data = {}) {
  try {
    if (!expoPushToken) {
      throw new Error('Expo Push Token is required to send notifications.');
    }

    const message = {
      to: expoPushToken,
      sound: 'default',
      title,
      body,
      data,
    };

    console.log('Sending notification with payload:', JSON.stringify(message, null, 2));

    const response = await axios.post('https://exp.host/--/api/v2/push/send', message, {
      headers: {
        'Content-Type': 'application/json',
      },
    });

    console.log('Notification sent successfully:', response.data);
  } catch (error) {
    console.error('Error sending push notification:', error.response?.data || error.message);
  }
}

// Add notification listeners for foreground and tap events
export function addNotificationListeners(onReceived, onResponse) {
  const receivedSubscription = Notifications.addNotificationReceivedListener((notification) => {
    console.log('Notification received (foreground):', notification);
    const date = notification.date || new Date().toISOString();
    addNotificationToList({
      id: notification.request.identifier,
      title: notification.request.content.title,
      message: notification.request.content.body,
      date,
    });
    if (onReceived) onReceived(notification);
  });

  const responseSubscription = Notifications.addNotificationResponseReceivedListener((response) => {
    console.log('Tapped notification response:', response);
    if (response?.notification?.request?.content?.data?.appointment) {
      onResponse(response.notification.request.content.data.appointment);
    }
  });

  return () => {
    receivedSubscription.remove();
    responseSubscription.remove();
  };
}


// Add a new notification to the local notification list
import { formatDateToIST, formatTimeToIST } from '../utils/formatDate';
export async function addNotificationToList(notification) {
  try {
    if (!notification || !notification.id || !notification.title || !notification.message) {
      throw new Error('Invalid notification structure.');
    }

    const notifications = (await getItem('notifications')) || [];
    
    // Check for duplicates by both ID and message content
    const isDuplicate = notifications.some(
      (n) => n.id === notification.id || n.message === notification.message
    );

    if (!isDuplicate) {
      const parsedDate = new Date(notification.date);

      const newNotification = {
        ...notification,
        formattedDate: !isNaN(parsedDate) ? formatDateToIST(parsedDate) : 'Unknown date',
        formattedTime: !isNaN(parsedDate) ? formatTimeToIST(parsedDate) : 'Unknown time',
      };

      notifications.push(newNotification);

      await setItem('notifications', notifications);
      console.log('Notification added to local list successfully:', newNotification);
    } else {
      console.log('Duplicate notification detected and skipped:', notification);
    }
  } catch (error) {
    console.error('Error adding notification to local list:', error);
  }
}


// Clear all notifications
export async function clearAllNotifications() {
  try {
    await AsyncStorage.removeItem('notifications');
    console.log('All notifications cleared.');
  } catch (error) {
    console.error('Error clearing notifications:', error);
  }
}

// Update badge count
export async function updateBadgeCount() {
  try {
    const notifications = (await getItem('notifications')) || [];
    const unseenCount = notifications.filter((n) => !n.seen).length;

    if (Platform.OS === 'ios') {
      await Notifications.setBadgeCountAsync(unseenCount);
    }

    console.log(`Badge count updated to: ${unseenCount}`);
  } catch (error) {
    console.error('Error updating badge count:', error);
  }
}
