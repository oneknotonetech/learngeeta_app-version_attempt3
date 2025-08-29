/**
 * @format
 */

import {AppRegistry, Alert} from 'react-native';
import App from './App';
import {name as appName} from './app.json';
import RNRestart from 'react-native-restart';

import { setJSExceptionHandler } from 'react-native-exception-handler';


// Set a global exception handler
setJSExceptionHandler((error, isFatal) => {
    // console.error('Global JS Error:', error, 'Fatal:', isFatal);
    if (isFatal) {
      // Optionally show an alert or log it remotely
      Alert.alert(
        'Unexpected error occurred',
        `
        Error: ${error.name} ${error.message}
        We have reported this to our team! Please restart the app.
        `,
        [
          {
            text: 'Restart',
            onPress: () => {
              RNRestart.Restart(); // You can use react-native-restart for restarting
            },
          },
        ]
      );
    } else {
      console.log(error); // Non-fatal error
    }
  }, true);

AppRegistry.registerComponent(appName, () => App);
