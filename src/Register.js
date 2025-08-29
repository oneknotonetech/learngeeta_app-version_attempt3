import { View, Text, TouchableOpacity, Image, ActivityIndicator, Dimensions, BackHandler, Alert } from 'react-native'
import React, { useEffect, useRef, useState } from 'react'
import WebView from 'react-native-webview';
import { decryptArray, encryptArray, getParameterValueFromURL } from './helper/helper_register';
const { height, width } = Dimensions.get('window');
import AsyncStorage from '@react-native-async-storage/async-storage';

export default function Register({ navigation }) {

  const [loading, setLoading] = useState(false);
  const [canGoBack, setCanGoBack] = useState(false);
  const refWeb = useRef();

  useEffect(() => {
    navigation.addListener('beforeRemove', (e) => {
      getUserLoggedIn();
    });
  }, []);

  const saveLoggedInUser = async (value) => {
    try {
      await AsyncStorage.setItem("loggedInUser", JSON.stringify(value));
    } catch (error) {
      console.log(error.message);
    }

  }
  const getUserLoggedIn = async () => {
    try {
      const value = await AsyncStorage.getItem("loggedInUser");
      const get = JSON.parse(value);
      if (get.isLogin === true) {
        navigation.replace("Home", { data: get.user })
      } else {
        // navigation.replace("Login")
        return;
      }
    } catch (error) {
      // navigation.replace("Login");
      // console.log(error.message);
      return null;
    }
  }

  const loginDirect = (state) => {
    setCanGoBack(state.canGoBack);
    if (state.url.startsWith('https://app.learngeeta.com/application/index.php?page=home&sa=')) {
      setLoading(true);
      try {
        const urlData = getParameterValueFromURL(state.url, "sa");
        let obj = decryptArray(urlData);
        obj.whatsapp_grp_link = ""
        let newData = encryptArray(obj);

        saveLoggedInUser(
          {
            user: { ...obj, url: `https://app.learngeeta.com/application/index.php?page=home&sa=${newData}` },
            isLogin: true
          }
        )
        setLoading(false);
      } catch (err) {
        console.log("🚀 ~ file: Register.js:52 ~ loginDirect ~ err:", err)
        setLoading(false);
      }
    }
  }
  return (
    <View style={{ flex: 1 }}>
      <WebView
        source={{ uri: 'https://online.learngeeta.com/participant/reg_participant.php' }}
        // source={{ uri: 'http://online.learngeeta.com/participant/participant_test.php' }}
        ref={refWeb}
        style={{ flex: 1 }}
        allowsBackForwardNavigationGestures
        onNavigationStateChange={loginDirect}
        onLoadStart={(event) => { setLoading(true) }}
        onLoadEnd={(event) => { setLoading(false) }}
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
  )
}
