package com.loginwithgoogle;

import android.content.BroadcastReceiver;
import android.content.Intent;
import android.content.IntentFilter;
import android.os.Build;
import org.jetbrains.annotations.Nullable;
import android.content.Context;

import android.app.Application;
import com.facebook.react.PackageList;
import com.facebook.react.ReactApplication;
import com.facebook.react.ReactNativeHost;
import com.facebook.react.ReactPackage;
import com.facebook.react.defaults.DefaultNewArchitectureEntryPoint;
import com.facebook.react.defaults.DefaultReactNativeHost;
import com.facebook.react.soloader.OpenSourceMergedSoMapping;
import com.facebook.soloader.SoLoader;
import java.io.IOException;
import java.util.List;
import com.dieam.reactnativepushnotification.ReactNativePushNotificationPackage;

public class MainApplication extends Application implements ReactApplication {

  private final ReactNativeHost mReactNativeHost =
      new DefaultReactNativeHost(this) {
        @Override
        public boolean getUseDeveloperSupport() {
          return BuildConfig.DEBUG;
        }

        @Override
        protected List<ReactPackage> getPackages() {
          @SuppressWarnings("UnnecessaryLocalVariable")
          List<ReactPackage> packages = new PackageList(this).getPackages();
          // Packages that cannot be autolinked yet can be added manually here, for example:
          // packages.add(new MyReactNativePackage());
          return packages;
        }

        @Override
        protected String getJSMainModuleName() {
          return "index";
        }

        @Override
        protected boolean isNewArchEnabled() {
          return BuildConfig.IS_NEW_ARCHITECTURE_ENABLED;
        }

        @Override
        protected Boolean isHermesEnabled() {
          return BuildConfig.IS_HERMES_ENABLED;
        }
      };

  @Override
  public ReactNativeHost getReactNativeHost() {
    return mReactNativeHost;
  }

  @Override
  public void onCreate() {
    super.onCreate();
    // See https://reactnative.dev/blog/2024/10/23/release-0.76-new-architecture#breaking-changes-1
    try {
        SoLoader.init(this, OpenSourceMergedSoMapping.INSTANCE);
    } catch (IOException e) {
        throw new RuntimeException(e);
    }
    if (BuildConfig.IS_NEW_ARCHITECTURE_ENABLED) {
      // If you opted-in for the New Architecture, we load the native entry point for this app.
      DefaultNewArchitectureEntryPoint.load();
    }
    // ReactNativeFlipper.initializeFlipper(this, getReactNativeHost().getReactInstanceManager());
  }

  // From: https://medium.com/@md.Azeem/reac-native-android-app-crash-after-upgrade-targetsdkversion-34-e521f0dd0e19
  @Override
  public Intent registerReceiver(@Nullable BroadcastReceiver receiver, IntentFilter filter) {
      if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.TIRAMISU) {
          return super.registerReceiver(receiver, filter, Context.RECEIVER_EXPORTED);
      } else {
          return super.registerReceiver(receiver, filter);
      }
  }
}
