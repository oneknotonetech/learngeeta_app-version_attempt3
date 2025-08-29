import { decode, encode } from 'base-64';
import { unserialize,serialize} from 'serialize-php';
import { Platform, PermissionsAndroid } from 'react-native';
import messaging from '@react-native-firebase/messaging';
// Register base64 globally
if (!global.btoa) {
    global.btoa = encode;
}

if (!global.atob) {
    global.atob = decode;
}

/**
 * Centralized permission management utility
 * Prevents null parameter issues and provides consistent permission handling
 */

export const PermissionManager = {
  /**
   * Request notification permissions safely
   * @returns {Promise<string>} Permission status
   */
  async requestNotificationPermissions() {
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
        console.log('iOS notification permission status:', authStatus);
        return authStatus;
      } else {
        // For Android 13+ (API 33+), request POST_NOTIFICATIONS permission
        if (Platform.Version >= 33) {
          try {
            const granted = await PermissionsAndroid.request(
              PermissionsAndroid.PERMISSIONS.POST_NOTIFICATIONS
            );
            console.log('Android notification permission:', granted);
            return granted === PermissionsAndroid.RESULTS.GRANTED ? 'granted' : 'denied';
          } catch (error) {
            console.warn('Android notification permission request failed:', error);
            return 'denied';
          }
        } else {
          // For older Android versions, Firebase handles permissions
          console.log('Android: Firebase handles permissions automatically');
          return 'granted';
        }
      }
    } catch (error) {
      console.error('Notification permission request error:', error);
      return 'denied';
    }
  },

  /**
   * Request storage and camera permissions safely
   * @returns {Promise<Object>} Permission results
   */
  async requestStorageAndCameraPermissions() {
    try {
      if (Platform.OS === 'android') {
        const permissions = [
          PermissionsAndroid.PERMISSIONS.READ_EXTERNAL_STORAGE,
          PermissionsAndroid.PERMISSIONS.WRITE_EXTERNAL_STORAGE,
          PermissionsAndroid.PERMISSIONS.CAMERA,
        ];

        // Filter out permissions that might not exist on newer Android versions
        const validPermissions = permissions.filter(permission => {
          try {
            return PermissionsAndroid.PERMISSIONS[permission.split('.').pop()];
          } catch {
            return false;
          }
        });

        if (validPermissions.length === 0) {
          console.log('No valid permissions to request');
          return { granted: true, permissions: {} };
        }

        const granted = await PermissionsAndroid.requestMultiple(validPermissions);
        console.log('Storage and camera permissions:', granted);
        return { granted, permissions: granted };
      } else {
        console.log('iOS: Permissions handled by system');
        return { granted: true, permissions: {} };
      }
    } catch (error) {
      console.error('Storage and camera permission request error:', error);
      return { granted: false, permissions: {}, error };
    }
  },

  /**
   * Check if all required permissions are granted
   * @param {Object} permissionResults - Results from permission requests
   * @returns {boolean} True if all permissions are granted
   */
  areAllPermissionsGranted(permissionResults) {
    if (!permissionResults || !permissionResults.permissions) {
      return false;
    }

    return Object.values(permissionResults.permissions).every(
      result => result === PermissionsAndroid.RESULTS.GRANTED
    );
  }
};

export function getParameterValueFromURL(url, parameterName) {
    var queryString = url.split('?')[1];
    var parameters = queryString.split('&');
    for (var i = 0; i < parameters.length; i++) {
        var parameter = parameters[i].split('=');
        if (parameter[0] === parameterName) {
            return decodeURIComponent(parameter[1]);
        }
    }
    return null; // Parameter not found
}


export function decryptArray(encryptedData) {
    var decodedData = atob(encryptedData);
    var searchString = btoa('mylogin');
    var decryptedData = decodedData.replace(searchString, '');
    var serializedData = atob(decryptedData);
    //   var dataArray = JSON.parse(serializedData);
    return unserialize(serializedData);
}

export function encryptArray(data) {
    var serializedData = serialize(data);
    var base64EncodedData = btoa(btoa(serializedData) + btoa('mylogin'));
    return base64EncodedData;
}