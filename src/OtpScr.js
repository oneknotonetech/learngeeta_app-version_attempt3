import AsyncStorage from '@react-native-async-storage/async-storage';
import React, { useEffect, useState } from 'react'
import { Text, View, Image, StyleSheet, TextInput, Dimensions, TouchableOpacity, ActivityIndicator, Alert, SafeAreaView, KeyboardAvoidingView, Platform, Keyboard, TouchableWithoutFeedback } from 'react-native'

export default function OtpScr({ route, navigation }) {

    const [loadingButton, setLoadingButton] = useState(false);
    const [otpInput, setOtpInput] = useState('');
    var OTP_1 = route && route.params && route.params.data && route.params.data.otp;

    const saveLoggedInUser = async (value) => {
        try {
            await AsyncStorage.setItem("loggedInUser", JSON.stringify(value));
        } catch (error) {
            console.log(error.message);
        }
    }

    const onSubmit = () => {
        if (otpInput.length !== 6) {
            Alert.alert('Learn Geeta', 'Please enter a valid 6-digit OTP')
            return;
        }
        
        setLoadingButton(true);
        
        // Validate OTP
        if (otpInput === route.params.data.otp) {
            saveLoggedInUser({ user: route.params.data, isLogin: true });
            navigation.replace("Home", { data: route.params.data });
            setLoadingButton(false);
        } else {
            Alert.alert("Learn Geeta", "Invalid OTP. Please try again.");
            setLoadingButton(false);
            // Clear the input for retry
            setOtpInput('');
        }
    }

    return (
        <SafeAreaView style={{ flex: 1, backgroundColor:'whitesmoke' }}>
            <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
                <KeyboardAvoidingView 
                    style={{ flex: 1 }}
                    behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
                    keyboardVerticalOffset={Platform.OS === 'ios' ? 0 : 20}
                >
                    <View style={{ flex: 1, alignItems: 'center', backgroundColor: 'white', justifyContent: 'center' }}>
                        <View style={{ height: 70, width: 200, marginBottom: 50 }}>
                            <Image source={require('./assets/geetapariwar-logo.png')} style={{ height: "100%", width: "100%" }} />
                        </View>
                        
                        <View style={{ width: "100%", alignItems: 'center', marginBottom: 30 }}>
                            <Text style={{ fontSize: 14, textAlign: 'center', color: 'black', paddingHorizontal: 20 }}>Please enter OTP sent on your mobile or email</Text>
                        </View>
                        
                        <TextInput
                            maxLength={6}
                            keyboardType='numeric'
                            value={otpInput}
                            onChangeText={(txt) => { setOtpInput(txt) }}
                            style={styles.inputs}
                            returnKeyType="done"
                            blurOnSubmit={true}
                            autoFocus={false}
                            placeholder="Enter 6-digit OTP"
                            placeholderTextColor="#999"
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
            </TouchableWithoutFeedback>
        </SafeAreaView>
    )
}

const styles = StyleSheet.create({
    inputs: { 
        marginTop: 30, 
        textAlign: 'center', 
        letterSpacing: 5, 
        fontSize: 24, 
        margin: 10, 
        height: 55, 
        width: "80%", 
        borderWidth: 1, 
        padding: 0, 
        borderColor: "#ddd", 
        color: 'black',
        borderRadius: 8,
        backgroundColor: '#f9f9f9'
    }
})