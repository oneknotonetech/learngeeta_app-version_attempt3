import { View, Text, StatusBar, Appearance, Alert, Platform } from 'react-native'
import React, { useEffect } from 'react'
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import Login from './src/Login';
import Home from './src/Home';
import { Provider } from 'react-redux';
import { store } from './redux-state/store';
import Splash_Screen from './src/Splash_Screen';
import OtpScr from './src/OtpScr';
import Register from './src/Register';
import messaging, { firebase } from '@react-native-firebase/messaging';
import PushNotification, { Importance } from 'react-native-push-notification';
import PushNotificationIOS from "@react-native-community/push-notification-ios";

const Stack = createNativeStackNavigator();

export default function App() {
  useEffect(() => {
    initializeNotifications();
  }, []);

  const initializeNotifications = async () => {
    try {
      // First request Firebase messaging permission
      await requestUserPermission();
      
      // Then configure push notifications with platform-specific settings
      configurePushNotifications();
      
      // Finally setup message handlers
      setupMessageHandlers();
    } catch (error) {
      console.error('Notification initialization failed:', error);
    }
  };

  const requestUserPermission = async () => {
    try {
      if (Platform.OS === 'ios') {
        const authStatus = await messaging().requestPermission({
          alert: true,
          announcement: false,
          badge: true,
          carPlay: false,
          criticalAlert: false,
          provisional: false,
          sound: true,
        });
        const enabled = authStatus === messaging.AuthorizationStatus.AUTHORIZED || 
                       authStatus === messaging.AuthorizationStatus.PROVISIONAL;
        console.log('iOS notification permission enabled:', enabled);
      } else {
        // For Android, just get the token (permissions are handled by Firebase)
        const token = await messaging().getToken();
        console.log('FCM Token:', token);
      }
    } catch (error) {
      console.error('Permission request error:', error);
    }
  };

  const configurePushNotifications = () => {
    try {
      // Configure with platform-specific options
      const config = {
        onRegister: function (token) {
          console.log('Push notification token:', token);
        },

        onNotification: function (notification) {
          console.log('Notification received:', notification);
          
          // Handle notification tap
          if (notification && notification.userInteraction) {
            console.log('User tapped notification');
            // Handle navigation or other actions
          }

          // Required for iOS
          if (Platform.OS === 'ios' && notification) {
            try {
              notification.finish(PushNotificationIOS.FetchResult.NoData);
            } catch (error) {
              console.error('Error finishing iOS notification:', error);
            }
          }
        },

        onAction: function (notification) {
          if (notification) {
            console.log('Notification action:', notification.action);
          }
        },

        onRegistrationError: function (err) {
          console.error('Push notification registration error:', err);
        },

        // Platform-specific permissions
        permissions: {
          alert: true,
          badge: true,
          sound: true,
        },
        
        popInitialNotification: true,
        
        // CRITICAL FIX: Only request permissions on iOS and ensure proper parameter handling
        requestPermissions: Platform.OS === 'ios' ? {
          alert: true,
          badge: true,
          sound: true,
        } : false,
      };

      // Safely configure PushNotification
      if (PushNotification && typeof PushNotification.configure === 'function') {
        PushNotification.configure(config);
        console.log('PushNotification configured successfully');
      } else {
        console.warn('PushNotification not available or configure method missing');
      }

      // Create default notification channel for Android
      if (Platform.OS === 'android' && PushNotification && typeof PushNotification.createChannel === 'function') {
        PushNotification.createChannel(
          {
            channelId: "default_channel",
            channelName: "Default Channel",
            channelDescription: "Default notification channel",
            playSound: true,
            soundName: "default",
            importance: Importance.HIGH,
            vibrate: true,
          },
          (created) => console.log(`Default channel created: ${created}`)
        );
      }
    } catch (error) {
      console.error('Error configuring push notifications:', error);
    }
  };

  const setupMessageHandlers = () => {
    // Handle foreground messages
    const unsubscribe = messaging().onMessage(async (remoteMessage) => {
      const { notification } = remoteMessage;
      console.log('Foreground notification:', notification);
      
      if (!notification) return;

      const channelId = remoteMessage.messageId || 'default_channel';

      if (Platform.OS === 'ios') {
        // iOS local notification
        PushNotificationIOS.addNotificationRequest({
          id: remoteMessage.messageId,
          body: notification.body,
          title: notification.title,
          sound: 'default'
        });
      } else {
        // Android local notification
        PushNotification.localNotification({
          channelId: 'default_channel',
          id: channelId,
          body: notification.body,
          title: notification.title,
          soundName: 'default',
          vibrate: true,
          playSound: true
        });
      }
    });

    // Handle notification tap when app is in background
    messaging().onNotificationOpenedApp(remoteMessage => {
      console.log('Notification opened app from background:', remoteMessage);
      // Handle navigation
    });

    // Handle notification when app is closed
    messaging()
      .getInitialNotification()
      .then(remoteMessage => {
        if (remoteMessage) {
          console.log('Notification opened app from quit state:', remoteMessage);
          // Handle navigation
        }
      });

    // Cleanup function
    return unsubscribe;
  };

  return (
    <Provider store={store}>
      <NavigationContainer>
        <Stack.Navigator initialRouteName={"Splash"}>
          <Stack.Screen name="Splash" component={Splash_Screen} options={{ headerShown: false }} />
          <Stack.Screen name="Login" component={Login} options={{ headerShown: false }} />
          <Stack.Screen name="Home" component={Home} options={{ headerShown: false }} />
          <Stack.Screen name="OTP" component={OtpScr} options={{ headerShown: false }} />
          <Stack.Screen name="Register" component={Register} options={{ title: 'Registration' }} />
        </Stack.Navigator>
      </NavigationContainer>
    </Provider>
  );
}