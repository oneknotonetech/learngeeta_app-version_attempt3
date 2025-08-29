import AsyncStorage from '@react-native-async-storage/async-storage';
import React, { useEffect, useState } from 'react'
import { Text, View, Image, StyleSheet, TextInput, Dimensions, TouchableOpacity, ActivityIndicator, Alert, alert, SafeAreaView,Appearance, KeyboardAvoidingView } from 'react-native'
// const windowWidth = Dimensions.get('window').width;
// const windowHeight = Dimensions.get('window').height;

export default function OtpScr({ route, navigation }) {

    const [loadingButton, setLoadingButton] = useState(false);
    const [otpInput, setOtpInput] = useState('');
    const [userData, setUserData] = useState('');
    var OTP_1 = route && route.params && route.params.data && route.params.data.otp;

    const saveLoggedInUser = async (value) => {
        try {
            await AsyncStorage.setItem("loggedInUser", JSON.stringify(value));
        } catch (error) {
            console.log(error.message);
        }

    }
    const onSubmit = () => {
        if (otpInput.length != 6) {
            Alert.alert('Learn Geeta', 'Please enter a valid OTP')
        } else {
            setLoadingButton(true)
            if (otpInput == route.params.data.otp) {
                saveLoggedInUser({ user: route.params.data, isLogin: true })
                navigation.replace("Home", { data: route.params.data })
                setLoadingButton(false)
            } else {
                Alert.alert("Learn Geeta", "Invalid OTP");
                setLoadingButton(false)
            }
        }
    }
    return (
        <SafeAreaView style={{ flex: 1, backgroundColor:'whitesmoke' }}>
            <KeyboardAvoidingView>
                <View style={{ alignItems: 'center', backgroundColor: 'white', }}>
                    <View style={{ height: 70, width: 200, marginTop: 70 }}>
                        <Image source={require('./assets/geetapariwar-logo.png')} style={{ height: "100%", width: "100%" }} />
                    </View>
                    
                    <View style={{ marginTop: 70, width: "100%", textAlign: 'center', justifyContent: 'center', alignItems: 'center' }}>
                        <Text style={{ fontSize: 14, textAlign: 'center', color: 'black' }}>Please enter OTP sent on your mobile or email</Text>
                    </View>
                    <TextInput
                        maxLength={6}
                        keyboardType='numeric'
                        onChangeText={(txt) => { setOtpInput(txt) }}
                        style={styles.inputs}
                    />



                    {
                        loadingButton ?
                            <TouchableOpacity style={{ marginTop: 20, height: 45, width: "90%", fontSize: 16, padding: 0, backgroundColor: "#ad0d00", marginBottom: 25, borderRadius: 5, justifyContent: 'center', alignItems: 'center' }}>
                                <ActivityIndicator color={"white"} size={22} />
                            </TouchableOpacity>
                            :
                            <TouchableOpacity onPress={onSubmit} style={{ marginTop: 20, height: 45, width: "80%", fontSize: 16, padding: 0, backgroundColor: "#ad0d00", marginBottom: 25, borderRadius: 5, justifyContent: 'center', alignItems: 'center' }}>
                                <Text style={{ color: "white", fontSize: 16 }}>Submit</Text>
                            </TouchableOpacity>
                    }
                </View>
            </KeyboardAvoidingView>
          
        </SafeAreaView>
    )
}


const { height, width } = Dimensions.get('window');
console.log(width)
const styles = StyleSheet.create({
    inputs: { marginTop: 30, textAlign: 'center', letterSpacing: 10, fontSize: 20, margin: 10, height: 45, width: "80%", borderWidth: .5, padding: 0, borderColor: "gray", color:'black'},
})