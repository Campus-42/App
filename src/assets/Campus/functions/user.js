import {Alert} from 'react-native';
import deviceInfoModule from 'react-native-device-info';
import {createIconSetFromFontello} from 'react-native-vector-icons';
import {analytics} from '../../Analytics';
import {AsyncStorage} from '../../AsyncStorage/functions';
import {CacheFuncs} from '../../Cache';
import {parseFirebaseError} from '../../Firebase/errorHandling';
import {db, auth, functions} from '../../Firebase/Firebase';
import {
  getSignedInUserInfo,
  getUserInfoForUID,
  parseUserData,
} from '../../Firebase/functions';
import {Store} from '../../redux/store';
import {pointFuncs} from './points';

export const userFuncs = {
  bookmark: async function (currentBookmarks, id, type) {
    /**
     * Bookmark an event or a society so that a user will be able to find these later in their profile page
     */
    const uid = auth.currentUser ? auth.currentUser.uid : '-';
    const illDefined =
      currentBookmarks === undefined || currentBookmarks === false;
    const bookmarks = illDefined ? {event: [], society: []} : currentBookmarks;

    // Add the type to corresponding bookmark child
    // Bookmarks look like this {events: [...ids], societies: [...ids], ...}
    const isBookmarked = (bookmarks[type] || []).includes(id);
    if (!isBookmarked) bookmarks[type] = [...(bookmarks[type] || []), id];
    else bookmarks[type] = bookmarks[type].filter((e) => e !== id);

    return db
      .collection('users')
      .doc(uid)
      .update({
        bookmarks: bookmarks,
      })
      .then(async (res) => {
        console.log('Successfully updated bookmarks');
        Store.dispatch({type: 'UPDATE_BOOKMARKS', payload: bookmarks});
        return {newStatus: !isBookmarked};
      })
      .catch((err) => {
        throw err;
      });
  },
  checkIfWelcomePopupShouldShow: async function (
    user,
    screen,
    showPopup,
    navigate,
    question = false,
  ) {
    const visitedScreens = Array.isArray(user.welcome_screens_visited)
      ? user.welcome_screens_visited
      : [];
    const alreadyVisited = visitedScreens.includes(screen);

    console.log('Should show popup user', user.welcome_screens_visited);

    // BETA: Remove beta tester condition when text has been implemented
    if (!alreadyVisited && question) {
      analytics.breadcrumb(
        `Showing welcome popup for screen: ${screen}`,
        'Campus/Funcs/user.js',
        'userFuncs.checkIfWelcomePopupShouldShow()',
      );

      const show = () =>
        showPopup({
          active: true,
          level: 'welcome',
          learnmore: {
            screen: 'FAQ',
            params: {question: question},
          },
          type: 'popup',
          screen,
          navigate,
        });

      setTimeout(show, 750);

      // Update the user doc on firebase
      const uid = auth.currentUser !== null ? auth.currentUser.uid : '-';
      db.collection('users')
        .doc(uid)
        .update({
          welcome_screens_visited: [
            ...new Set(visitedScreens.concat([screen])),
          ],
        })
        .catch((err) => analytics.error(err));
    }
  },
  getMultipleUsers: async function (uids = [], shuffleUsers = false) {
    return new Promise(async (resolve) => {
      var users = (await CacheFuncs.getUsers().users) || {};

      uids
        .filter((e) => users[e] == undefined)
        .forEach(async (uid, index) => {
          await getUserInfoForUID(uid)
            .then((usr) => (users[uid] = usr))
            .catch(console.warn);
          if (index == uids.length - 1) {
            resolve(users);
            CacheFuncs.cacheUsers(Object.values(users));
          }
        });
    });
  },
  createAccount: async function (userInfo, campusKey, verificationMethod) {
    const accountCreation = await auth
      .createUserWithEmailAndPassword(userInfo.email, userInfo.password1)
      .then((res) => {
        return {sucess: true, res};
      })
      .catch((err) => {
        return {error: err};
      });

    if (accountCreation.error) throw parseFirebaseError(accountCreation.error);
    else {
      await auth.currentUser.reload();
      userInfo.uid = auth.currentUser.uid;
      return functions
        .httpsCallable('createAccountDocument')({
          userInfo,
          campusKey,
          verificationMethod,
        })
        .then(({data}) => {
          if (!data.success) throw new Error('Unable to create account');
          else if (data.error) throw data.error;
          return {...data, uid: auth.currentUser.uid};
        })
        .then(async (data) => {
          Store.dispatch({type: 'UPDATE_USER_INFO', payload: data.user});

          try {
            await AsyncStorage.setSignIn(userInfo.email, userInfo.password1);
            await AsyncStorage.setFullName(
              userInfo.first_name,
              userInfo.last_name,
            );
          } catch (error) {
            console.warn('00239:', error);
          }
          return data;
        })
        .catch((err) => {
          console.warn(err);
          analytics.error(
            parseFirebaseError(err),
            'CampusFuncs',
            'createAccount',
          );
          throw parseFirebaseError(err);
        });
    }
  },
  searchUsers: async function (searchTerm, campus) {
    /**
     * Search for a user by converting the search term
     * into an array with only aplhanumeric characters
     *
     * @returns Array
     */
    const search = searchTerm
      .toLowerCase()
      .replace(/[^0-9a-z]/gi, '')
      .split(' ');

    return db
      .collection('users')
      .where('campus', '==', campus)
      .where('search_index', 'array-contains-any', search)
      .get()
      .then((querySnapShot) => {
        const users = [];
        return new Promise((resolve) => {
          querySnapShot.forEach((user, index) => {
            users.push(parseUserData(user.data(), user.id));
            if (index === querySnapShot.size - 1) resolve(users);
          });
        });
      })
      .catch((err) => {
        analytics.error(err, 'CampusFuncs/user', 'searchUsers');
        throw err;
      });
  },
  toggleBookmark: async function (objId, bookmarkType, shouldBookmark = false) {
    /**
     * Toggle whether an obj is bookmarked by the user
     *
     * The function will call a firebase function that
     * will add or remove the obj id to an object of
     * arrays in the user document
     */
    return functions
      .httpsCallable('toggleBookmark')({
        objId,
        bookmarkType,
        shouldBookmark,
        userId: (auth.currentUser || {}).uid,
      })
      .then((res) => {
        // getSignedInUserInfo(); // Get the user data and update user redux state
        return res;
      })
      .catch((err) => {
        Alert.alert(
          'Pin Error',
          'We could not bookmark it right now, please try again later',
        );
        console.warn('Could not bookmark', err);
        analytics.error(err, 'CampusFuncs/user', 'toggleBookmark');
        throw err;
      });
  },
  claimReferral: async function (showPopup) {
    /**
     * This function will claim the referral
     * for both the sender and the user.
     *
     * It will get the user doc individually,
     * this is just to make sure that we get
     * the most up to date user doc.
     *
     * Then it will trigger the point event
     * for the sender followed by the user.
     */

    analytics.breadcrumb('Claiming referral if existing');
    const user = await getSignedInUserInfo();

    console.log('User', user);

    const {claimed, sender} = user.referral || {}; // get the referral details from the user

    if (claimed) return;
    if (!sender) return;

    await db
      .collection('users')
      .doc((auth.currentUser || {}).uid)
      .update({'referral.claimed': true});
    console.log('Updated user info for referral');

    // Trigger user points
    const userPoints = await pointFuncs
      .triggerPointEvent('confirmedReferralInvite', user.campus, showPopup)
      .catch(console.warn);

    console.log('User referral', userPoints);

    // Trigger sender points
    const senderPoints = await pointFuncs
      .triggerPointEvent('confirmedReferralInvite', user.campus, false, {
        uid: sender,
      })
      .catch(console.warn);

    console.log('Sender referral', senderPoints);
  },
};
