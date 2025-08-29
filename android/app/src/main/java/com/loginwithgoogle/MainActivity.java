package com.loginwithgoogle;

import com.facebook.react.ReactActivity;
import com.facebook.react.ReactActivityDelegate;
import com.facebook.react.defaults.DefaultNewArchitectureEntryPoint;
import com.facebook.react.defaults.DefaultReactActivityDelegate;
import android.os.Bundle; 
import org.devio.rn.splashscreen.SplashScreen;
import android.content.Intent;

public class MainActivity extends ReactActivity {

  /**
   * Returns the name of the main component registered from JavaScript. This is used to schedule
   * rendering of the component.
   */

  protected void onCreate(Bundle savedInstance) {
    // Not passing savedInstance to parent.
    // This is causing a lot of crashes on devices with low memory
    // There is no data to save / load anyways so does not matter
    System.out.println("Passing null for OnCreate");
    super.onCreate(null);
  }
  @Override
  protected String getMainComponentName() {
    return "loginWithGoogle";
  }

  @Override
  public void onActivityResult(int requestCode, int resultCode, Intent data) {
      // Check if the data or its extras are null
      if (data == null || data.getExtras() == null) {
          // Handle the null case appropriately
          return;
      }

      // If data is valid, pass it to the React Native modules
      super.onActivityResult(requestCode, resultCode, data);
  }


  /**
   * Returns the instance of the {@link ReactActivityDelegate}. Here we use a util class {@link
   * DefaultReactActivityDelegate} which allows you to easily enable Fabric and Concurrent React
   * (aka React 18) with two boolean flags.
   */
  @Override
  protected ReactActivityDelegate createReactActivityDelegate() {
    return new DefaultReactActivityDelegate(
        this,
        getMainComponentName(),
        // If you opted-in for the New Architecture, we enable the Fabric Renderer.
        DefaultNewArchitectureEntryPoint.getFabricEnabled(), // fabricEnabled
        // If you opted-in for the New Architecture, we enable Concurrent React (i.e. React 18).
        DefaultNewArchitectureEntryPoint.getConcurrentReactEnabled() // concurrentRootEnabled
        );
  }
}
