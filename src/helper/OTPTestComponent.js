import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Alert } from 'react-native';
import OTPAutoFillService from './OTPAutoFillService';

/**
 * Test Component for OTP Auto-fill functionality
 * This component can be used during development to test OTP detection
 */
export default function OTPTestComponent() {
    const [testText, setTestText] = useState('');
    const [detectedOTP, setDetectedOTP] = useState('');
    const [serviceStatus, setServiceStatus] = useState({});

    const testOTPDetection = () => {
        if (!testText.trim()) {
            Alert.alert('Error', 'Please enter some text to test OTP detection');
            return;
        }

        const otp = OTPAutoFillService.detectOTP(testText);
        if (otp) {
            setDetectedOTP(otp);
            Alert.alert('OTP Detected!', `Found OTP: ${otp}`);
        } else {
            setDetectedOTP('');
            Alert.alert('No OTP Found', 'No valid OTP pattern detected in the text');
        }
    };

    const getServiceStatus = () => {
        const status = OTPAutoFillService.getStatus();
        setServiceStatus(status);
    };

    const testAutoFill = () => {
        // Simulate receiving an OTP
        const testOTP = '123456';
        Alert.alert('Test Auto-fill', `Simulating OTP: ${testOTP}\nCheck if auto-fill callback is triggered`);
        
        // This would normally be called by the service when OTP is detected
        if (OTPAutoFillService.otpCallback) {
            OTPAutoFillService.otpCallback(testOTP);
        }
    };

    return (
        <View style={styles.container}>
            <Text style={styles.title}>OTP Auto-fill Test Component</Text>
            
            <View style={styles.section}>
                <Text style={styles.sectionTitle}>Test OTP Detection</Text>
                <TextInput
                    style={styles.input}
                    placeholder="Enter text with OTP (e.g., 'Your OTP is 123456')"
                    value={testText}
                    onChangeText={setTestText}
                    multiline
                />
                <TouchableOpacity style={styles.button} onPress={testOTPDetection}>
                    <Text style={styles.buttonText}>Detect OTP</Text>
                </TouchableOpacity>
                
                {detectedOTP && (
                    <View style={styles.resultContainer}>
                        <Text style={styles.resultText}>Detected OTP: {detectedOTP}</Text>
                    </View>
                )}
            </View>

            <View style={styles.section}>
                <Text style={styles.sectionTitle}>Service Status</Text>
                <TouchableOpacity style={styles.button} onPress={getServiceStatus}>
                    <Text style={styles.buttonText}>Get Status</Text>
                </TouchableOpacity>
                
                {Object.keys(serviceStatus).length > 0 && (
                    <View style={styles.resultContainer}>
                        <Text style={styles.resultText}>Platform: {serviceStatus.platform}</Text>
                        <Text style={styles.resultText}>Supported: {serviceStatus.isSupported ? 'Yes' : 'No'}</Text>
                        <Text style={styles.resultText}>Listening: {serviceStatus.isListening ? 'Yes' : 'No'}</Text>
                    </View>
                )}
            </View>

            <View style={styles.section}>
                <Text style={styles.sectionTitle}>Test Auto-fill Callback</Text>
                <TouchableOpacity style={styles.button} onPress={testAutoFill}>
                    <Text style={styles.buttonText}>Test Auto-fill</Text>
                </TouchableOpacity>
                <Text style={styles.helpText}>
                    This simulates receiving an OTP and tests if the callback is working
                </Text>
            </View>

            <View style={styles.section}>
                <Text style={styles.sectionTitle}>Instructions</Text>
                <Text style={styles.helpText}>
                    • Enter text containing OTP patterns to test detection{'\n'}
                    • Use this component to verify OTP extraction logic{'\n'}
                    • Test auto-fill callback functionality{'\n'}
                    • Check service status and platform support
                </Text>
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 20,
        backgroundColor: '#f5f5f5',
    },
    title: {
        fontSize: 20,
        fontWeight: 'bold',
        textAlign: 'center',
        marginBottom: 20,
        color: '#333',
    },
    section: {
        backgroundColor: 'white',
        padding: 15,
        marginBottom: 15,
        borderRadius: 8,
        shadowColor: '#000',
        shadowOffset: {
            width: 0,
            height: 2,
        },
        shadowOpacity: 0.1,
        shadowRadius: 3.84,
        elevation: 5,
    },
    sectionTitle: {
        fontSize: 16,
        fontWeight: '600',
        marginBottom: 10,
        color: '#333',
    },
    input: {
        borderWidth: 1,
        borderColor: '#ddd',
        borderRadius: 8,
        padding: 12,
        marginBottom: 10,
        fontSize: 14,
        minHeight: 80,
        textAlignVertical: 'top',
    },
    button: {
        backgroundColor: '#ad0d00',
        padding: 12,
        borderRadius: 8,
        alignItems: 'center',
        marginBottom: 10,
    },
    buttonText: {
        color: 'white',
        fontSize: 14,
        fontWeight: '600',
    },
    resultContainer: {
        backgroundColor: '#e8f5e8',
        padding: 10,
        borderRadius: 6,
        borderLeftWidth: 4,
        borderLeftColor: '#4caf50',
    },
    resultText: {
        fontSize: 14,
        color: '#2e7d32',
        marginBottom: 2,
    },
    helpText: {
        fontSize: 12,
        color: '#666',
        lineHeight: 18,
        fontStyle: 'italic',
    },
});
