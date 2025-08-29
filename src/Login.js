import { View, Text, TextInput, PermissionsAndroid, TouchableOpacity, StyleSheet, Image, Alert, ActivityIndicator, SafeAreaView, Appearance, Platform, ScrollView, KeyboardAvoidingView, Dimensions } from 'react-native'
import React, { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { bindActionCreators } from 'redux'
import * as userActions from '../redux-state/action-creators/index';
// 
// import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios'
import TimeZone from 'react-native-timezone'
import messaging from '@react-native-firebase/messaging';
import DeviceInfo from 'react-native-device-info';
import { PermissionManager } from './helper/helper_register';
import LinearGradient from 'react-native-linear-gradient';
import * as Animatable from 'react-native-animatable';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import Ionicons from 'react-native-vector-icons/Ionicons';

const { width, height } = Dimensions.get('window');

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
  const [focusedInput, setFocusedInput] = useState(null);

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
    <LinearGradient
      colors={['#FF7D29', '#FFBF78', '#FFEEA9', '#FEFFD2']}
      style={styles.container}
    >

       
       <Animatable.View 
         animation={{
           from: { translateY: 0, opacity: 0.2 },
           to: { translateY: 8, opacity: 0.3 }
         }}
         duration={5000} 
         iterationCount="infinite" 
         direction="alternate"
         easing="ease-in-out"
         style={styles.floatingElement2}
       >
         <MaterialIcons name="star" size={16} color="#FF7D29" />
       </Animatable.View>

      <SafeAreaView style={styles.safeArea}>
        <ScrollView 
          contentContainerStyle={styles.scrollContainer}
          showsVerticalScrollIndicator={false}
        >
          {/* Logo Section with Sanskrit-inspired styling */}
          <Animatable.View 
            animation="fadeInDown" 
            duration={1200}
            style={styles.logoSection}
          >
            <Text style={styles.sanskritTitle}>॥ श्री राधे कृष्ण ॥</Text>
            
            <View style={styles.logoWrapper}>
              <Image 
                source={require('./assets/geetapariwar-logo.png')} 
                style={styles.logo} 
              />
            </View>
            

          </Animatable.View>

          {/* Form Section */}
          <Animatable.View 
            animation="fadeInUp" 
            duration={1200}
            delay={300}
            style={styles.formSection}
          >
            <View style={styles.formCard}>
              {isIndia ? (
                <>
                  <Text style={styles.formTitle}>मोबाइल नंबर दर्ज करें</Text>
                  <Text style={styles.formSubtitle}>Enter your mobile number</Text>
                  
                  <View style={[
                    styles.inputWrapper,
                    focusedInput === 'phone' && styles.inputWrapperFocused
                  ]}>
                    <LinearGradient
                      colors={focusedInput === 'phone' ? ['#FFF8DC', '#FFFAF0'] : ['#FFFFFF', '#F8F8FF']}
                      style={styles.inputGradient}
                    >
                      <Ionicons 
                        name="call-outline" 
                        size={18} 
                        color={focusedInput === 'phone' ? '#FF7D29' : '#FFBF78'} 
                        style={styles.inputIcon}
                      />
                      <TextInput
                        placeholderTextColor="#9E9E9E"
                        value={phoneNo}
                        maxLength={10}
                        keyboardType='numeric'
                        placeholder='Mobile number'
                        onChangeText={(txt) => { setPhoneNo(txt) }}
                        onFocus={() => setFocusedInput('phone')}
                        onBlur={() => setFocusedInput(null)}
                        style={styles.textInput}
                      />
                    </LinearGradient>
                  </View>
                  
                  <Text style={styles.helpText}>
                    कृपया कंट्री कोड के बिना 10 अंकों का व्हाट्सएप नंबर दर्ज करें
                  </Text>
                </>
              ) : (
                <>
                  <Text style={styles.formTitle}>ईमेल दर्ज करें</Text>
                  <Text style={styles.formSubtitle}>Enter your email address</Text>
                  
                  <View style={[
                    styles.inputWrapper,
                    focusedInput === 'email' && styles.inputWrapperFocused
                  ]}>
                    <LinearGradient
                      colors={focusedInput === 'email' ? ['#FFF8DC', '#FFFAF0'] : ['#FFFFFF', '#F8F8FF']}
                      style={styles.inputGradient}
                    >
                      <Ionicons 
                        name="mail-outline" 
                        size={18} 
                        color={focusedInput === 'email' ? '#FF7D29' : '#FFBF78'} 
                        style={styles.inputIcon}
                      />
                      <TextInput
                        placeholderTextColor="#9E9E9E"
                        keyboardType='email-address'
                        placeholder='Email address'
                        onChangeText={(txt) => { setEmail(txt) }}
                        onFocus={() => setFocusedInput('email')}
                        onBlur={() => setFocusedInput(null)}
                        style={styles.textInput}
                      />
                    </LinearGradient>
                  </View>
                </>
              )}

              {/* Login Button */}
              <Animatable.View 
                animation={{
                  from: { scale: 1, opacity: 0.9 },
                  to: { scale: 1.01, opacity: 1 }
                }}
                duration={2000} 
                iterationCount="infinite"
                direction="alternate"
                easing="ease-in-out"
              >
                <TouchableOpacity 
                  onPress={callLoginApi} 
                  style={styles.loginButton}
                  activeOpacity={0.8}
                >
                  <View style={styles.buttonInner}>
                    {loadingButton ? (
                      <ActivityIndicator color="#4A90E2" size="small" />
                    ) : (
                      <>
                        <View style={styles.buttonTextContainer}>
                          <Text style={styles.buttonText}>प्रवेश करें</Text>
                          <Text style={styles.buttonTextSeparator}>|</Text>
                          <Text style={styles.buttonTextEnglish}>Login</Text>
                        </View>
                      </>
                    )}
                  </View>
                </TouchableOpacity>
              </Animatable.View>

              {/* Registration Button */}
              <TouchableOpacity 
                onPress={() => { navigation.navigate('Register') }} 
                style={styles.secondaryButton}
                activeOpacity={0.8}
              >
                <View style={styles.secondaryButtonInner}>
                  <View style={styles.secondaryButtonTextContainer}>
                    <Text style={styles.secondaryButtonText}>पंजीकरण</Text>
                    <Text style={styles.secondaryTextSeparator}>|</Text>
                    <Text style={styles.secondaryButtonTextEnglish}>Registration</Text>
                  </View>
                </View>
              </TouchableOpacity>
            </View>
          </Animatable.View>
        </ScrollView>
      </SafeAreaView>
    </LinearGradient>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  safeArea: {
    flex: 1,
  },
  scrollContainer: {
    flexGrow: 1,
    paddingHorizontal: 24,
    justifyContent: 'center',
    minHeight: height,
  },

     
   floatingElement2: {
     position: 'absolute',
     top: height * 0.7,
     left: width * 0.08,
     zIndex: 1,
   },
  logoSection: {
    alignItems: 'center',
    marginBottom: 40,
  },
  sanskritTitle: {
    fontSize: 22,
    fontWeight: '600',
    color: '#FF7D29',
    marginBottom: 20,
    textShadowColor: 'rgba(255, 255, 255, 0.9)',
    textShadowOffset: { width: 1, height: 1 },
    textShadowRadius: 2,
    fontFamily: Platform.OS === 'ios' ? 'Devanagari MT' : 'serif',
  },
  logoWrapper: {
    backgroundColor: '#FFFFFF',
    borderRadius: 20,
    padding: 16,
    shadowColor: '#FF7D29',
    shadowOffset: {
      width: 0,
      height: 8,
    },
    shadowOpacity: 0.2,
    shadowRadius: 12,
    elevation: 8,
    borderWidth: 2,
    borderColor: 'rgba(255, 125, 41, 0.5)',
  },
  logo: {
    height: 80,
    width: 200,
    resizeMode: 'contain',
  },

  formSection: {
    alignItems: 'center',
  },
  formCard: {
    width: '100%',
    backgroundColor: 'rgba(255, 255, 255, 0.98)',
    borderRadius: 24,
    padding: 32,
    shadowColor: '#FF7D29',
    shadowOffset: {
      width: 0,
      height: 12,
    },
    shadowOpacity: 0.25,
    shadowRadius: 16,
    elevation: 10,
    borderWidth: 2,
    borderColor: 'rgba(255, 125, 41, 0.4)',
  },
  formTitle: {
    fontSize: 20,
    fontWeight: '600',
    color: '#FF7D29',
    textAlign: 'center',
    marginBottom: 4,
    fontFamily: Platform.OS === 'ios' ? 'Devanagari MT' : 'serif',
  },
  formSubtitle: {
    fontSize: 16,
    color: '#666666',
    textAlign: 'center',
    marginBottom: 32,
    fontWeight: '400',
  },
  inputWrapper: {
    marginBottom: 24,
    borderRadius: 16,
    shadowColor: '#FFBF78',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.15,
    shadowRadius: 4,
    elevation: 3,
  },
  inputWrapperFocused: {
    shadowColor: '#FF7D29',
    shadowOpacity: 0.4,
    shadowRadius: 8,
    elevation: 6,
    transform: [{ scale: 1.02 }],
  },
  inputGradient: {
    flexDirection: 'row',
    alignItems: 'center',
    borderRadius: 16,
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderWidth: 1,
    borderColor: 'rgba(255, 191, 120, 0.3)',
  },
  inputIcon: {
    marginRight: 12,
  },
  textInput: {
    flex: 1,
    fontSize: 16,
    color: '#333333',
    fontWeight: '500',
  },
  helpText: {
    fontSize: 13,
    color: '#666666',
    textAlign: 'center',
    lineHeight: 18,
    marginBottom: 32,
    fontStyle: 'italic',
  },
  loginButton: {
    marginBottom: 20,
    borderRadius: 12,
    backgroundColor: 'rgba(255, 255, 255, 0.98)',
    borderWidth: 2,
    borderColor: '#FF7D29',
    shadowColor: '#FF7D29',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 8,
    elevation: 4,
    overflow: 'hidden',
  },
  buttonInner: {
    paddingVertical: 18,
    paddingHorizontal: 24,
    alignItems: 'center',
    position: 'relative',
    minHeight: 56,
  },
  buttonTextContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  buttonText: {
    color: '#FF7D29',
    fontSize: 18,
    fontWeight: '600',
    fontFamily: Platform.OS === 'ios' ? 'Devanagari MT' : 'serif',
  },
  buttonTextSeparator: {
    color: '#FF7D29',
    fontSize: 16,
    fontWeight: '400',
    marginHorizontal: 8,
    opacity: 0.7,
  },
  buttonTextEnglish: {
    color: '#666666',
    fontSize: 16,
    fontWeight: '500',
  },
  secondaryButton: {
    borderRadius: 12,
    backgroundColor: 'rgba(255, 255, 255, 0.98)',
    borderWidth: 2,
    borderColor: '#FF7D29',
    shadowColor: '#FF7D29',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 8,
    elevation: 4,
    overflow: 'hidden',
  },
  secondaryButtonInner: {
    paddingVertical: 18,
    paddingHorizontal: 20,
    alignItems: 'center',
    minHeight: 56,
  },
  secondaryButtonTextContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  secondaryButtonText: {
    color: '#FF7D29',
    fontSize: 16,
    fontWeight: '500',
    fontFamily: Platform.OS === 'ios' ? 'Devanagari MT' : 'serif',
  },
  secondaryTextSeparator: {
    color: '#FF7D29',
    fontSize: 14,
    fontWeight: '400',
    marginHorizontal: 6,
    opacity: 0.7,
  },
  secondaryButtonTextEnglish: {
    color: '#888888',
    fontSize: 14,
    fontWeight: '400',
  },
})