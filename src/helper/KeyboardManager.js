import { Keyboard, Platform, Dimensions } from 'react-native';

class KeyboardManager {
  static keyboardHeight = 0;
  static isKeyboardVisible = false;

  static init() {
    // Listen for keyboard show/hide events
    this.keyboardDidShowListener = Keyboard.addListener(
      Platform.OS === 'ios' ? 'keyboardWillShow' : 'keyboardDidShow',
      (e) => {
        this.keyboardHeight = e.endCoordinates.height;
        this.isKeyboardVisible = true;
      }
    );

    this.keyboardDidHideListener = Keyboard.addListener(
      Platform.OS === 'ios' ? 'keyboardWillHide' : 'keyboardDidHide',
      () => {
        this.keyboardHeight = 0;
        this.isKeyboardVisible = false;
      }
    );
  }

  static cleanup() {
    if (this.keyboardDidShowListener) {
      this.keyboardDidShowListener.remove();
    }
    if (this.keyboardDidHideListener) {
      this.keyboardDidHideListener.remove();
    }
  }

  static dismiss() {
    Keyboard.dismiss();
  }

  static getKeyboardHeight() {
    return this.keyboardHeight;
  }

  static isVisible() {
    return this.isKeyboardVisible;
  }

  // Get safe area for keyboard avoiding
  static getKeyboardAvoidingOffset() {
    return Platform.OS === 'ios' ? 0 : 20;
  }

  // Get behavior based on platform
  static getBehavior() {
    return Platform.OS === 'ios' ? 'padding' : 'height';
  }

  // Check if device has hardware keyboard
  static hasHardwareKeyboard() {
    return Platform.OS === 'android' && this.keyboardHeight === 0;
  }
}

export default KeyboardManager;
