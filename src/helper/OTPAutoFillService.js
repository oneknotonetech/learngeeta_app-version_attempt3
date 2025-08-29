import { Platform, NativeModules, NativeEventEmitter, Clipboard } from 'react-native';
import { PermissionsAndroid } from 'react-native';
import messaging from '@react-native-firebase/messaging';

class OTPAutoFillService {
    constructor() {
        this.isListening = false;
        this.otpCallback = null;
        this.smsListener = null;
        this.clipboardListener = null;
        this.lastClipboardContent = '';
        this.otpPatterns = [
            /(\b\d{4,6}\b)/, // 4-6 digit numbers
            /OTP[:\s]*(\d{4,6})/i, // OTP: 123456
            /verification[:\s]*(\d{4,6})/i, // verification: 123456
            /code[:\s]*(\d{4,6})/i, // code: 123456
            /password[:\s]*(\d{4,6})/i, // password: 123456
            /(\d{4,6})/ // Any 4-6 digit number
        ];
    }

    /**
     * Request necessary permissions for OTP auto-fill
     */
    async requestPermissions() {
        if (Platform.OS === 'android') {
            try {
                // Request SMS permission
                const smsGranted = await PermissionsAndroid.request(
                    PermissionsAndroid.PERMISSIONS.READ_SMS,
                    {
                        title: 'SMS Permission',
                        message: 'This app needs access to SMS to auto-fill OTP',
                        buttonNeutral: 'Ask Me Later',
                        buttonNegative: 'Cancel',
                        buttonPositive: 'OK',
                    }
                );

                // Request notification permission
                const notificationGranted = await PermissionsAndroid.request(
                    PermissionsAndroid.PERMISSIONS.POST_NOTIFICATIONS,
                    {
                        title: 'Notification Permission',
                        message: 'This app needs notification permission to receive OTP',
                        buttonNeutral: 'Ask Me Later',
                        buttonNegative: 'Cancel',
                        buttonPositive: 'OK',
                    }
                );

                return smsGranted === PermissionsAndroid.RESULTS.GRANTED && 
                       notificationGranted === PermissionsAndroid.RESULTS.GRANTED;
            } catch (err) {
                console.warn('Permission request error:', err);
                return false;
            }
        }
        return true; // iOS doesn't need explicit permission for SMS auto-fill
    }

    /**
     * Start listening for OTP messages
     * @param {Function} callback - Callback function to receive OTP
     */
    async startListening(callback) {
        if (this.isListening) {
            return false;
        }

        this.otpCallback = callback;

        if (Platform.OS === 'android') {
            return await this.startAndroidOTPListener();
        } else if (Platform.OS === 'ios') {
            // iOS handles SMS auto-fill natively
            this.isListening = true;
            return true;
        }
        return false;
    }

    /**
     * Stop listening for OTP messages
     */
    stopListening() {
        if (Platform.OS === 'android') {
            if (this.smsListener) {
                this.smsListener.remove();
                this.smsListener = null;
            }
            if (this.clipboardListener) {
                clearInterval(this.clipboardListener);
                this.clipboardListener = null;
            }
        }
        this.isListening = false;
        this.otpCallback = null;
    }

    /**
     * Start Android OTP listener using multiple methods
     */
    async startAndroidOTPListener() {
        try {
            // Method 1: Firebase Messaging for push notifications
            await this.setupFirebaseMessaging();
            
            // Method 2: Clipboard monitoring for copied OTPs
            this.setupClipboardMonitoring();
            
            // Method 3: SMS content provider (if available)
            await this.setupSMSContentProvider();
            
            this.isListening = true;
            return true;
        } catch (error) {
            console.error('Error starting Android OTP listener:', error);
            return false;
        }
    }

    /**
     * Setup Firebase Messaging for OTP notifications
     */
    async setupFirebaseMessaging() {
        try {
            const authStatus = await messaging().requestPermission();
            const enabled = authStatus === messaging.AuthorizationStatus.AUTHORIZED || 
                          authStatus === messaging.AuthorizationStatus.PROVISIONAL;

            if (!enabled) {
                console.log('Notification permission not granted');
                return;
            }

            // Listen for incoming messages
            this.smsListener = messaging().onMessage(async (remoteMessage) => {
                console.log('Received message:', remoteMessage);
                
                // Check if message contains OTP
                let otp = null;
                
                // Check data payload
                if (remoteMessage.data && remoteMessage.data.otp) {
                    otp = remoteMessage.data.otp;
                }
                
                // Check notification body for OTP
                if (!otp && remoteMessage.notification && remoteMessage.notification.body) {
                    otp = this.extractOTPFromText(remoteMessage.notification.body);
                }
                
                // Check notification title for OTP
                if (!otp && remoteMessage.notification && remoteMessage.notification.title) {
                    otp = this.extractOTPFromText(remoteMessage.notification.title);
                }

                if (otp && this.otpCallback) {
                    console.log('OTP detected via Firebase:', otp);
                    this.otpCallback(otp);
                }
            });

            // Listen for background messages
            messaging().setBackgroundMessageHandler(async (remoteMessage) => {
                console.log('Background message received:', remoteMessage);
                
                let otp = null;
                if (remoteMessage.data && remoteMessage.data.otp) {
                    otp = remoteMessage.data.otp;
                } else if (remoteMessage.notification && remoteMessage.notification.body) {
                    otp = this.extractOTPFromText(remoteMessage.notification.body);
                }

                if (otp && this.otpCallback) {
                    console.log('Background OTP detected:', otp);
                    this.otpCallback(otp);
                }
            });

        } catch (error) {
            console.error('Firebase messaging setup error:', error);
        }
    }

    /**
     * Setup clipboard monitoring for copied OTPs
     */
    setupClipboardMonitoring() {
        // Check clipboard every 2 seconds for OTP
        this.clipboardListener = setInterval(async () => {
            try {
                const clipboardContent = await Clipboard.getString();
                
                // Only process if clipboard content changed and contains potential OTP
                if (clipboardContent !== this.lastClipboardContent && 
                    clipboardContent && 
                    clipboardContent.length <= 20) {
                    
                    const otp = this.extractOTPFromText(clipboardContent);
                    if (otp && this.otpCallback) {
                        console.log('OTP detected via clipboard:', otp);
                        this.otpCallback(otp);
                        // Clear clipboard after detecting OTP
                        await Clipboard.setString('');
                    }
                    
                    this.lastClipboardContent = clipboardContent;
                }
            } catch (error) {
                console.error('Clipboard monitoring error:', error);
            }
        }, 2000);
    }

    /**
     * Setup SMS content provider (Android 10+)
     */
    async setupSMSContentProvider() {
        // This is a placeholder for SMS content provider implementation
        // Would require additional native module setup
        console.log('SMS content provider setup (placeholder)');
    }

    /**
     * Extract OTP from text using regex patterns
     * @param {string} text - The text content to search
     * @returns {string|null} - Extracted OTP or null if not found
     */
    extractOTPFromText(text) {
        if (!text || typeof text !== 'string') return null;

        // Clean the text
        const cleanText = text.trim();
        
        // Try exact 6-digit match first (most common)
        const exactMatch = cleanText.match(/^(\d{6})$/);
        if (exactMatch) {
            return exactMatch[1];
        }

        // Try 4-6 digit patterns
        for (const pattern of this.otpPatterns) {
            const match = cleanText.match(pattern);
            if (match && match[1]) {
                const otp = match[1];
                // Validate OTP length
                if (otp.length >= 4 && otp.length <= 6) {
                    return otp;
                }
            }
        }

        // Try to find any sequence of 4-6 digits
        const digitMatch = cleanText.match(/(\d{4,6})/);
        if (digitMatch && digitMatch[1]) {
            const otp = digitMatch[1];
            // Additional validation: check if it's not part of a longer number
            const before = cleanText[digitMatch.index - 1];
            const after = cleanText[digitMatch.index + otp.length];
            
            // If surrounded by non-digits, it's likely an OTP
            if ((!before || !/\d/.test(before)) && (!after || !/\d/.test(after))) {
                return otp;
            }
        }

        return null;
    }

    /**
     * Manually trigger OTP detection from text
     * @param {string} text - Text to search for OTP
     * @returns {string|null} - Extracted OTP or null
     */
    detectOTP(text) {
        return this.extractOTPFromText(text);
    }

    /**
     * Check if auto-fill is supported on current platform
     */
    isSupported() {
        return Platform.OS === 'ios' || Platform.OS === 'android';
    }

    /**
     * Get platform-specific auto-fill instructions
     */
    getInstructions() {
        if (Platform.OS === 'ios') {
            return 'Tap the OTP input field to see "Paste from Messages" option';
        } else if (Platform.OS === 'android') {
            return 'OTP will be auto-filled when received via SMS or copied to clipboard';
        }
        return 'Auto-fill not supported on this platform';
    }

    /**
     * Get current auto-fill status
     */
    getStatus() {
        return {
            isListening: this.isListening,
            isSupported: this.isSupported(),
            platform: Platform.OS
        };
    }
}

export default new OTPAutoFillService();
