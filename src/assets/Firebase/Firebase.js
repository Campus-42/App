import _auth from "@react-native-firebase/auth";
import _storage from "@react-native-firebase/storage";
import _messaging from "@react-native-firebase/messaging";
import _firestore from "@react-native-firebase/firestore";
import _functions from "@react-native-firebase/functions";
import _analytics from "@react-native-firebase/analytics";
import _crashlytics from "@react-native-firebase/crashlytics";
import _dynLinks from "@react-native-firebase/dynamic-links";

const USE_EMULATOR = false;
if (USE_EMULATOR && __DEV__) {
  console.info(
    "\n\n>>>>>>>REMEMBER TO OPEN CLOUD FUNCTIONS EMULATOR<<<<<<\nfirebase emulators:start --only functions\n\n\n"
  );
  _functions().useFunctionsEmulator("http://localhost:5001");
}

_analytics().setAnalyticsCollectionEnabled(!__DEV__);
_crashlytics().setCrashlyticsCollectionEnabled(!__DEV__);

export const db = _firestore();
export const auth = _auth();
export const storage = _storage();
export const messaging = _messaging();
export const functions = _functions();
export const crashlytics = _crashlytics();
export const firebaseAnalytics = _analytics();
export const dynamicLinks = _dynLinks();

/////// IF WE NEED ADMIN FIELDS
export const firestore = _firestore;
