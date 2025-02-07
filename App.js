import React, { useEffect, useState } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import StackNavigator from './src/navigation/StackNavigator';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Text, TextInput } from 'react-native';
import { useFonts, Inter_400Regular, Inter_600SemiBold } from '@expo-google-fonts/inter';
import * as SplashScreen from 'expo-splash-screen';
import * as Notifications from 'expo-notifications';
import CustomSplash from './src/components/CustomSplash';
import { navigationRef } from './src/navigation/navigationService';

import {
  registerForPushNotificationsAsync,
  configureNotificationHandler,
  addNotificationListeners,
} from './src/services/notificationService';

SplashScreen.preventAutoHideAsync().catch(() => {
  console.warn('Splash screen already hidden or unavailable');
});

export default function App() {
  const [initialRoute, setInitialRoute] = useState('Login');
  const [isReady, setIsReady] = useState(false);
  const [showSplash, setShowSplash] = useState(true);

  const [fontsLoaded] = useFonts({
    Inter_400Regular,
    Inter_600SemiBold,
  });

  useEffect(() => {
    configureNotificationHandler();

    registerForPushNotificationsAsync().then((token) => {
      if (token) console.log('Expo Push Token:', token);
    });

    const removeListeners = addNotificationListeners(
      (notification) => console.log('Notification received in foreground:', notification),
      (appointment) => {
        if (appointment) {
          navigationRef.navigate('AppointmentDetails', { appointment });
        }
      }
    );

    return () => removeListeners();
  }, []);

  useEffect(() => {
    const responseListener = Notifications.addNotificationResponseReceivedListener((response) => {
      console.log('Tapped notification response:', JSON.stringify(response, null, 2));
      try {
        if (response?.notification?.request?.content?.data) {
          const rawData = response.notification.request.content.data;
          const data = typeof rawData === 'string' ? JSON.parse(rawData) : rawData;

          if (data?.appointment) {
            navigationRef.navigate('AppointmentDetails', { appointment: data.appointment });
          } else {
            console.warn('No valid appointment data in the tapped notification.');
          }
        } else {
          console.warn('Tapped notification structure is invalid or missing properties.');
        }
      } catch (error) {
        console.error('Error processing notification response:', error);
      }
    });

    return () => responseListener.remove();
  }, []);

  useEffect(() => {
    if (fontsLoaded) {
      const defaultFontFamily = 'Inter_400Regular';
      const setDefaultFont = (component) => {
        const oldRender = component.render;
        component.render = function (...args) {
          const origin = oldRender.call(this, ...args);
          return React.cloneElement(origin, {
            style: [{ fontFamily: defaultFontFamily }, origin.props.style],
          });
        };
      };
      setDefaultFont(Text);
      setDefaultFont(TextInput);
    }
  }, [fontsLoaded]);

  useEffect(() => {
    (async () => {
      try {
        console.log('Initializing app...');
        const loggedIn = await AsyncStorage.getItem('userLoggedIn');
        setInitialRoute(loggedIn === 'true' ? 'Main' : 'Login');
        setIsReady(true);

        setTimeout(() => {
          console.log('Hiding splash screen...');
          setShowSplash(false);
          SplashScreen.hideAsync().catch(() => {
            console.warn('Splash screen already hidden or unavailable');
          });
        }, 5000);
      } catch (error) {
        console.error('Error during initialization:', error);
      }
    })();
  }, []);

  if (showSplash) {
    console.log('Displaying custom splash screen...');
    return <CustomSplash />;
  }

  if (!isReady || !fontsLoaded) {
    console.log('Waiting for app readiness or fonts to load...');
    return null;
  }

  return (
    <NavigationContainer ref={navigationRef}>
      <StackNavigator initialRoute={initialRoute} />
    </NavigationContainer>
  );
}
