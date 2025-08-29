import messaging from '@react-native-firebase/messaging';
import { Platform } from 'react-native';
import { PermissionManager } from './helper_register';

  export async function requestPermission() {
    try {
      // Use centralized permission manager
      const permissionStatus = await PermissionManager.requestNotificationPermissions();
      console.log('FCM Service permission status:', permissionStatus);
      return permissionStatus;
    } catch (error) {
      console.error('FCM Service permission request error:', error);
      return 'denied';
    }
  }

  export async function getToken() {
    try {
      await requestPermission();
      let token = '';
      if (Platform.OS === 'ios') {
        token = await messaging().getAPNSToken();
      } else {
        token = await messaging().getToken();
      }
      console.log('FCM Token retrieved:', token ? 'success' : 'failed');
      return token;
    } catch (error) {
      console.error('Error getting FCM token:', error);
      return null;
    }
  }

  export function onMessage(callback) {
    return messaging().onMessage(callback);
  }

  export function onNotificationOpenedApp(callback) {
    return messaging().onNotificationOpenedApp(callback);
  }

  export function onTokenRefresh(callback) {
    return messaging().onTokenRefresh(callback);
  }



