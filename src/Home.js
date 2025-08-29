import { View, Text, TouchableOpacity, Image, ActivityIndicator, Dimensions, BackHandler, Alert, StatusBar, Platform, SafeAreaView, PermissionsAndroid, Appearance } from 'react-native'
import React, { useEffect, useRef, useState } from 'react'
import { Linking } from 'react-native';
import { GoogleSignin, statusCodes } from '@react-native-google-signin/google-signin'
import { useSelector } from 'react-redux';
import { useDispatch } from 'react-redux'
import { bindActionCreators } from 'redux'
import * as userActions from '../redux-state/action-creators/index';
import AsyncStorage from '@react-native-async-storage/async-storage';
import WebView from 'react-native-webview';
import { PermissionManager } from './helper/helper_register';
const { height, width } = Dimensions.get('window');


export default function Home({ navigation, route }) {
  const [loading, setLoading] = useState(false);
  const [canGoBack, setCanGoBack] = useState(false);
  const refWeb = useRef();

  async function requestPermissions() {
    try {
      const permissionResults = await PermissionManager.requestStorageAndCameraPermissions();
      if (PermissionManager.areAllPermissionsGranted(permissionResults)) {
        console.log('All permissions granted');
      } else {
        console.log('Some permissions not granted');
      }
    } catch (err) {
      console.warn('Permission request error:', err);
    }
  }


  useEffect(() => {
    const initializePermissions = async () => {
      if (Platform.OS == 'android') { 
        try {
          await requestPermissions(); 
        } catch (error) {
          console.warn('Permission request error:', error);
        }
      }
    };
    
    initializePermissions();
    BackHandler.addEventListener('hardwareBackPress', () => {
      if (canGoBack) {
        refWeb.current.goBack();
        return true; // prevent default behavior (exit app)
      }
      Alert.alert(
        'Learn Geeta',
        'Do you want to exit?',
        [
          {
            text: 'Cancel',
            onPress: () => { console.log('Cancel Pressed') },
            style: 'cancel',
          },
          {
            text: 'OK',
            onPress: () => { BackHandler.exitApp() }
          },
        ],
        { cancelable: false },
      );
      return true;

    })


  }, [canGoBack])

  const removeLoggedInUser = async (value) => {
    try {
      await AsyncStorage.setItem("loggedInUser", JSON.stringify(value));
    } catch (error) {
      console.log(error.message);
    }
  }

  const handleExternalLink = (state) => {
    if (state.url === 'https://app.learngeeta.com/application/login.php') {
      // Special case for login URL
      removeLoggedInUser({ user: {}, isLogin: false });
      navigation.navigate('Login');
      return false;
    } else if (state.url.startsWith('http') && !state.url.includes('learngeeta.com')) {
      // for Non learngeeta.com urls, open externally. 
      try {
        Linking.openURL(state.url);
      } catch (exception) {
        console.error(exception);
      }
      return false;
    }
    // Continue with opening inside the app itself
    return true;
  }

  const navigationStateChange = (state) => {
    setCanGoBack(state.canGoBack);
  }

  const [deviceTheme, setDeviceTheme] = useState('');
  useEffect(() => {
    const colorScheme = Appearance.getColorScheme();
    if (colorScheme === 'dark') {
      setDeviceTheme('dark')
    } else {
      setDeviceTheme('light')
    }
  })
  // backgroundColor:(Platform.OS=='ios')?'#fed857':'transparent',backgroundColor:(Platform.OS=='ios')?20:0
  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: (deviceTheme == 'dark') ? 'gray' : 'whitesmoke' }}>
      <View style={{ flex: 1 }}>

        <WebView source={{ uri: route.params.data.url }}
          ref={refWeb}
          style={{ flex: 1 }}
          allowsBackForwardNavigationGestures
          onNavigationStateChange={navigationStateChange}
          onShouldStartLoadWithRequest={handleExternalLink}
          onLoadStart={() => setLoading(true)}
          onLoadEnd={() => setLoading(false)}
          javaScriptEnabled
          allowsInlineMediaPlayback
          allowFileAccess
          allowUniversalAccessFromFileURLs
          domStorageEnabled
          useWebKit
        />
        {
          loading &&
          <View style={{ width: width, height: height, position: 'absolute', backgroundColor: 'transparent', justifyContent: 'center', alignItems: 'center' }}>
            <ActivityIndicator
              size={50}
              color={"orange"}
            />
          </View>
        }
      </View>
    </SafeAreaView>


  )
}