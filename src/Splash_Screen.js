import { View, Text, Image, Animated } from 'react-native'
import React, { useEffect, useRef } from 'react'
import Login from './Login';
import SpringAnimation from './SpringAnimation';
import AsyncStorage from '@react-native-async-storage/async-storage';

export default function Splash_Screen({ navigation }) {
    const fadeAnim = useRef(new Animated.Value(0)).current;
    useEffect(() => {
        setTimeout(() => {
            // navigation.replace("Login")
            getUserLoggedIn();
        }, 3000)
    }, []);
    const getUserLoggedIn = async () => {
        try {
          const value = await AsyncStorage.getItem("loggedInUser");
          const get = JSON.parse(value);
          if (get.isLogin === true) {
            navigation.replace("Home",{data:get.user})
          } else {
            navigation.replace("Login")
          }
        } catch (error) {
          navigation.replace("Login");
          console.log(error.message);
          return null;
        }
      }
    return (
        
        <SpringAnimation/>

    )
}