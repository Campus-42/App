package com.campus42;

import com.facebook.react.ReactActivity;
import com.facebook.react.ReactActivityDelegate;
import com.facebook.react.ReactRootView;
import com.swmansion.gesturehandler.react.RNGestureHandlerEnabledRootView;
import android.os.Build;
import android.app.Application;
import android.app.NotificationChannel;
import android.app.NotificationManager;
import android.app.Notification;
import android.media.AudioAttributes;
import android.content.ContentResolver;
import android.net.Uri;
import androidx.core.app.NotificationCompat;
import java.util.List;


public class MainActivity extends ReactActivity {

  /**
   * Returns the name of the main component registered from JavaScript. This is used to schedule
   * rendering of the component.
   */
  @Override
  protected String getMainComponentName() {
    return "Campus42";
  }

  @Override
  protected ReactActivityDelegate createReactActivityDelegate() {
    return new ReactActivityDelegate(this, getMainComponentName()) {
      @Override
      protected ReactRootView createRootView() {
        return new RNGestureHandlerEnabledRootView(MainActivity.this);
      }
    };
  }

  // @Override
  //  protected List<ReactPackage> getPackages() {
  //    return Arrays.<ReactPackage>asList(
  //      new AirPackage()
  //    );
  //  }

  // public void onCreate() {
  //   if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.O) {
  //     NotificationChannel notificationChannel = new NotificationChannel("general", "Campus42", NotificationManager.IMPORTANCE_HIGH);
  //     notificationChannel.setShowBadge(true);
  //     notificationChannel.setDescription("");
  //     AudioAttributes att = new AudioAttributes.Builder()
  //             .setUsage(AudioAttributes.USAGE_NOTIFICATION)
  //             .setContentType(AudioAttributes.CONTENT_TYPE_SPEECH)
  //             .build();
  //     notificationChannel.setSound(Uri.parse(ContentResolver.SCHEME_ANDROID_RESOURCE + "://" + getPackageName() + "/raw/bubble_pop"), att);
  //     notificationChannel.enableVibration(true);
  //     notificationChannel.setVibrationPattern(new long[]{400, 400});
  //     notificationChannel.setLockscreenVisibility(NotificationCompat.VISIBILITY_PUBLIC);
  //     NotificationManager manager = getSystemService(NotificationManager.class);
  //     manager.createNotificationChannel(notificationChannel);
  //   }
  // }
 
}
