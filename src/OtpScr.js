import AsyncStorage from '@react-native-async-storage/async-storage';
import React, { useEffect, useState } from 'react'
import { Text, View, Image, StyleSheet, TextInput, Dimensions, TouchableOpacity, ActivityIndicator, Alert, alert, SafeAreaView, Appearance, KeyboardAvoidingView, ScrollView, Platform } from 'react-native'
import LinearGradient from 'react-native-linear-gradient';
import * as Animatable from 'react-native-animatable';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import Ionicons from 'react-native-vector-icons/Ionicons';

const { width, height } = Dimensions.get('window');

export default function OtpScr({ route, navigation }) {

    const [loadingButton, setLoadingButton] = useState(false);
    const [otpInput, setOtpInput] = useState('');
    const [userData, setUserData] = useState('');
    const [focusedInput, setFocusedInput] = useState(false);
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
                style={styles.floatingElement}
            >
                <MaterialIcons name="star" size={16} color="#FF7D29" />
            </Animatable.View>
            
            {/* Fanned Peacock Feathers - Bottom Right */}
            <Animatable.View 
                animation={{
                    from: { translateY: 0, opacity: 0.4 },
                    to: { translateY: -2, opacity: 0.6 }
                }}
                duration={10000} 
                iterationCount="infinite" 
                direction="alternate"
                easing="ease-in-out"
                style={styles.fannedFeather}
            >
                <Image 
                    source={require('./assets/FannedFeather.png')} 
                    style={styles.fannedFeatherImage}
                    resizeMode="contain"
                />
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

                    {/* OTP Form Section */}
                    <Animatable.View 
                        animation="fadeInUp" 
                        duration={1200}
                        delay={300}
                        style={styles.formSection}
                    >
                        <View style={styles.formCard}>
                            <Text style={styles.formTitle}>OTP दर्ज करें</Text>
                            <Text style={styles.formSubtitle}>Enter the OTP sent to your mobile or email</Text>
                            
                            <View style={[
                                styles.inputWrapper,
                                focusedInput && styles.inputWrapperFocused
                            ]}>
                                <LinearGradient
                                    colors={focusedInput ? ['#FFF8DC', '#FFFAF0'] : ['#FFFFFF', '#F8F8FF']}
                                    style={styles.inputGradient}
                                >
                                    <Ionicons 
                                        name="key-outline" 
                                        size={18} 
                                        color={focusedInput ? '#FF7D29' : '#FFBF78'} 
                                        style={styles.inputIcon}
                                    />
                                    <TextInput
                                        maxLength={6}
                                        keyboardType='numeric'
                                        onChangeText={(txt) => { setOtpInput(txt) }}
                                        onFocus={() => setFocusedInput(true)}
                                        onBlur={() => setFocusedInput(false)}
                                        placeholder="Enter OTP"
                                        placeholderTextColor="#9E9E9E"
                                        style={styles.textInput}
                                    />
                                </LinearGradient>
                            </View>

                            {/* Submit Button */}
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
                                    onPress={onSubmit} 
                                    style={styles.submitButton}
                                    activeOpacity={0.8}
                                >
                                    <View style={styles.buttonInner}>
                                        {loadingButton ? (
                                            <ActivityIndicator color="#FF7D29" size="small" />
                                        ) : (
                                            <>
                                                <View style={styles.buttonTextContainer}>
                                                    <Text style={styles.buttonText}>सत्यापित करें</Text>
                                                    <Text style={styles.buttonTextSeparator}>|</Text>
                                                    <Text style={styles.buttonTextEnglish}>Verify</Text>
                                                </View>
                                            </>
                                        )}
                                    </View>
                                </TouchableOpacity>
                            </Animatable.View>
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

    floatingElement: {
        position: 'absolute',
        top: height * 0.7,
        left: width * 0.08,
        zIndex: 1,
    },
    fannedFeather: {
        position: 'absolute',
        bottom: -100,
        right: -100,
        zIndex: 1,
        width: 350,
        height: 350,
    },
    fannedFeatherImage: {
        width: '100%',
        height: '100%',
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
        paddingVertical: 8,
        borderWidth: 1,
        borderColor: 'rgba(255, 191, 120, 0.3)',
    },
    inputIcon: {
        marginRight: 12,
    },
    textInput: {
        flex: 1,
        fontSize: 18,
        color: '#333333',
        fontWeight: '500',
        textAlign: 'center',
        letterSpacing: 8,
    },
    submitButton: {
        marginBottom: 16,
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
})