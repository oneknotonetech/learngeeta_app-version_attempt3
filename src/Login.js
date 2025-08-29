import { View, Text, TextInput, PermissionsAndroid, TouchableOpacity, StyleSheet, Image, Alert, ActivityIndicator, SafeAreaView, Appearance, Platform, ScrollView, KeyboardAvoidingView, TouchableWithoutFeedback, Keyboard } from 'react-native'
import React, { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { bindActionCreators } from 'redux'
import * as userActions from '../redux-state/action-creators/index';
import AsyncStorage from '@react-native-async-storage/async-storage';
import axios, { Axios } from 'axios'
import TimeZone from 'react-native-timezone'
import messaging from '@react-native-firebase/messaging';
import DeviceInfo from 'react-native-device-info';
import { PermissionManager } from './helper/helper_register';

export default function Login({ navigation }) {
  // navigation.navigate('Home')
  const [phoneNo, setPhoneNo] = useState("")
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [refreshing, setRefreshing] = useState(false);
  const dispatch = useDispatch();
  const { setLoginData } = bindActionCreators(userActions, dispatch);
  const [loadingButton, setLoadingButton] = useState(false)
  const [isIndia, setIsIndia] = useState(false);
  const [deviceToken, setDeviceToken] = useState('');
  const [deviceName, setDeviceName] = useState('');
  const [os, setOs] = useState('');
  const [device_os, setDevice_os] = useState('');
  const [appVersion, setAppVersion] = useState('')
  useEffect(() => {
    const initializeApp = async () => {
      try {
        await getFcmToken();
        getDeviceInfo();
        const zone = await TimeZone.getTimeZone();
        console.log(zone);
        if (zone == "Asia/Kolkata" || zone == "Asia/Calcutta") {
          setIsIndia(true);
        } else {
          setIsIndia(false);
        }
      } catch (er) {
        console.log(er);
      }
    };

    initializeApp();
  }, [])

  const getFcmToken = async () => {
    try {
      // Use centralized permission manager
      const permissionStatus = await PermissionManager.requestNotificationPermissions();
      console.log('Permission status:', permissionStatus);
      
      const fcmToken = await messaging().getToken();
      console.log("🚀 ~ file: Login.js:30 ~ getFcmToken ~ fcmToken:", fcmToken)
      if (fcmToken) {
        setDeviceToken(fcmToken);
      } else {
        console.log('Failed', 'No token received');
      }
    } catch (error) {
      console.error('Error getting FCM token:', error);
    }
  }
  function getDeviceInfo() {

    let pp = DeviceInfo.getModel();
    console.log("🚀 ~ file: Login.js:38 ~ getFcmToken ~ pp:", pp)
    if (pp) {
      setDeviceName(pp);
    } else {
      console.log('Failed', 'No deveice name received');
    }

    let os = Platform.OS;
    console.log("🚀 ~ file: Login.js:46 ~ getFcmToken ~ os:", os)
    if (os) {
      setOs(os);
    } else {
      console.log('Failed', 'No deveice os received');
    }

    let tt = DeviceInfo.getSystemVersion();
    console.log("🚀 ~ file: Login.js:54 ~ getFcmToken ~ tt:", tt)
    if (tt) {
      setDevice_os(tt);
    } else {
      console.log('failed to get version');
    }


    let version = DeviceInfo.getVersion();
    console.log("🚀 ~ file: Login.js:63 ~ getFcmToken ~ version:", version)
    if (version) {
      setAppVersion(version);
    } else {
      console.log('failed to get version');
    }


  };
  const callLoginApi = async () => {
    let isValid = false;
    const Formdata = new FormData();
    Formdata.append('device_token', deviceToken)
    Formdata.append('app_version', appVersion)
    Formdata.append('device_name', deviceName)
    Formdata.append('device_os', os)
    Formdata.append('os_type', device_os)




    if (isIndia) {
      if (phoneNo.length !== 10) {
        Alert.alert('Learn Geeta', 'Please enter a valid number');
        isValid = false;
        return;
      } else {
        Formdata.append('api_name', 'login');
        Formdata.append('mobile', phoneNo);
        Formdata.append('isd_code', '91');
        isValid = true;
      }
    } else {
      var mailformat = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;
      if (!email.match(mailformat)) {
        Alert.alert('Learn Geeta', 'Please enter a valid Email address');
        isValid = false;
        return;
      } else {
        Formdata.append('api_name', 'login');
        Formdata.append('email', email);
        // Formdata.append('isd_code', '91');
        isValid = true;
      }
    }

    if (isValid) {
      setLoadingButton(true)
      await axios.post('https://app.learngeeta.com/application/api.php', Formdata, { headers: { 'Content-Type': 'multipart/form-data' } })
        .then(async (res) => {
          if (res.data.response_code == "400") {
            Alert.alert('Learn Geeta', res.data.response_message);
            setLoadingButton(false)
          } else {
            navigation.navigate("OTP", { data: res.data.response_data });
            setLoadingButton(false)
          }
        }).catch((err) => {
          console.log("error=", err)
        })
    }
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
  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: (deviceTheme == 'dark') ? 'gray' : 'whitesmoke' }}>
      <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
        <KeyboardAvoidingView 
          style={{ flex: 1 }}
          behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
          keyboardVerticalOffset={Platform.OS === 'ios' ? 0 : 20}
        >
          <ScrollView 
            contentContainerStyle={{ flexGrow: 1, backgroundColor:'white' }}
            keyboardShouldPersistTaps="handled"
            showsVerticalScrollIndicator={false}
          >
            <View style={{ alignItems: 'center', paddingVertical: 10, minHeight: '100%' }}>
              <View style={{ height: 70, width: 200, marginTop: 50 }}>
                <Image source={require('./assets/geetapariwar-logo.png')} style={{ height: "100%", width: "100%" }} />
              </View>
              <View style={{ alignItems: 'center', marginTop: 30, width:"100%", flex: 1, justifyContent: 'center' }}>
                {isIndia ?
                  <>
                    <View style={{ width: '90%', marginVertical: 10 }}>
                      <Text style={{ color: 'black' }} >Enter your mobile number</Text>
                    </View>
                    <TextInput
                      placeholderTextColor="#000"
                      value={phoneNo}
                      maxLength={10}
                      keyboardType='numeric'
                      placeholder='Mobile number'
                      onChangeText={(txt) => { setPhoneNo(txt) }}
                      style={styles.inputs}
                      returnKeyType="done"
                      blurOnSubmit={true}
                    />
                    <Text style={styles.inputTip}>
                      Please enter your 10 digit registered WhatsApp number without country code.
                    </Text>
                    <Text style={[styles.inputTip, { marginBottom: 35, }]}>
                      कृपया अपना 10 अंकों का पंजीकृत व्हाट्सएप नंबर कंट्री कोड के बिना लिखें।
                    </Text>
                  </>

                  :
                  <>
                    <View style={{ width: '90%', marginVertical: 10 }}>
                      <Text style={{ color: 'black' }} >Enter your email address </Text>
                    </View>
                    <TextInput
                      placeholderTextColor="#000"
                      keyboardType='email-address'
                      placeholder='Email address'
                      onChangeText={(txt) => { setEmail(txt) }}
                      style={styles.inputs}
                      returnKeyType="done"
                      blurOnSubmit={true}
                      autoCapitalize="none"
                      autoCorrect={false}
                    />
                  </>
                }
                {
                  loadingButton ?
                    <TouchableOpacity onPress={callLoginApi} style={{ height: 45, width: "90%", fontSize: 16, padding: 0, backgroundColor: "#ad0d00", marginBottom: 25, borderRadius: 5, justifyContent: 'center', alignItems: 'center' }}>
                      <ActivityIndicator color={"white"} size={22} />
                    </TouchableOpacity>
                    :
                    <TouchableOpacity onPress={callLoginApi} style={{ height: 45, width: "90%", fontSize: 16, padding: 0, backgroundColor: "#ad0d00", marginBottom: 25, borderRadius: 5, justifyContent: 'center', alignItems: 'center' }}>
                      <Text style={{ color: "white", fontSize: 16 }}>Login</Text>
                    </TouchableOpacity>
                }
                <TouchableOpacity onPress={() => { navigation.navigate('Register') }} style={{ height: 45, width: "90%", fontSize: 16, padding: 0, backgroundColor: "#ad0d00", marginBottom: 25, borderRadius: 5, justifyContent: 'center', alignItems: 'center' }}>
                  <Text style={{ color: "white", fontSize: 16 }}>Registration</Text>
                </TouchableOpacity>
              </View>
            </View>
          </ScrollView>
        </KeyboardAvoidingView>
      </TouchableWithoutFeedback>
    </SafeAreaView>
  )
}
const styles = StyleSheet.create({
  inputs: { paddingLeft: 20, height: 45, width: "90%", borderWidth: 1, borderRadius: 5, fontSize: 16, padding: 0, borderColor: "gray", marginBottom: 5, color: 'black' },
  inputTip: {
    color: 'gray',
    fontSize: 14,
    fontWeight: '500',
    paddingHorizontal: 20,
    lineHeight: 20,
  }
})