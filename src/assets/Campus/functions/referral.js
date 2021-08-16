import {Platform} from 'react-native';
import {Alert} from 'react-native';
import {Share} from 'react-native';
import {analytics} from '../../Analytics';
import {auth, dynamicLinks} from '../../Firebase/Firebase';
import {GlobalStyle} from '../../GlobalStyle';

export const referralFuncs = {
  openShareView: async function (url) {
    /**
     * Open the native ui for sharing a code.
     * The invite will be linked to the uid
     */

    analytics.breadcrumb('Opened shareview for referral');
    // Get the uid and if we can't then show the user an alert
    const uid = (auth.currentUser || {}).uid;
    if (!uid) {
      analytics.error(
        new Error('Could not get the uid', 'CampusFuncs/Referral', uid),
      );
      Alert.alert(
        'Share error',
        'Something went wrong inviting your friends, please try again later',
      );
      return {error: true};
    }

    try {
      const result = await Share.share(
        {
          message: `Join Campus42 and connect with your campus and friends.\n\nClick and get extra points${
            Platform.OS === 'android' ? ` ${url}` : ''
          }`,
          title: 'Join Campus42',
          url: url,
        },
        {
          tintColor: GlobalStyle.ColorStyle.referralColour,
          dialogTitle: 'Invite friends to the app',
        },
      );

      /** Handle the result */
      if (result.action === Share.sharedAction) {
        const inviteType = result.activityType || false;
        return {inviteType, successful: true};
      } else if (result.action === Share.dismissedAction) {
        return {dismissed: true};
      }
    } catch (err) {
      analytics.error(err, 'CampusFuncs/Referral', 'openShareView');
      Alert.alert(
        'Share error',
        'Something went wrong inviting your friends, please try again later',
      );
      return {error: true};
    }
  },
  getReferralLink: async function () {
    /**
     * Construct the dynamic link for the referral links.
     * If it already exists, then just return link.
     */

    const uid = (auth.currentUser || {}).uid;

    if (!uid) throw new Error('Could not find user identifier');

    try {
      /** Create the urls we need */
      const link = `https://campus42.page.link/referral/${uid}`;
      const domainUriPrefix = 'https://campus42.page.link';

      /** Construct the link */
      const result = await dynamicLinks.buildShortLink({
        link,
        domainUriPrefix,
        analytics: {
          campaign: 'in-app',
        },
        ios: {
          bundleId: 'com.campus42.app',
          appStoreId: '1527412565',
        },
      });
      console.log('Created referral link:', result);
      return `${result}?efr=1`;
    } catch (err) {
      analytics.error(err, 'CampusFuncs/Referral', 'getReferralLink');
      throw err;
    }
  },
};
