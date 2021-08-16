import {Alert} from 'react-native';
import {analytics} from '../../Analytics';
import {auth, db, functions, firestore} from '../../Firebase/Firebase';
import {getUserInfoForUID, getUsers} from '../../Firebase/functions';

export const bubbleFuncs = {
  getInvitedUsers: async function (
    bubble,
    campusKey,
    updateInvitedUsers = () => {},
  ) {
    return db
      .collection('campuses')
      .doc(campusKey)
      .collection('invites')
      .where('obj_id', '==', bubble)
      .where('type', '==', 'bubble')
      .where('claimed', '==', false)
      .where('visible', '==', true)
      .get()
      .then(async (querySnapShot) => {
        const users = [];

        querySnapShot.forEach(async (doc, index) => {
          await getUserInfoForUID(doc.data().receiver)
            .then(async (user) => {
              if (index == querySnapShot.size - 1)
                updateInvitedUsers(users.concat([user]));
              else users.push(user);
            })
            .catch(console.warn);
        });
      })
      .catch((err) =>
        analytics.error(err, 'Campus/Funcs/bubble.js', 'getInvitedUsers()'),
      );
  },
  updateOnlineTimestamp: async function (
    conversationId,
    user,
    conversationType,
    campusKey,
  ) {
    const uid = (auth.currentUser || {}).uid;
    const {image, last_name, first_name, level, points, period_points} = user;

    // Change ref if it is a channel
    var ref = db.collection('bubbles').doc(conversationId);
    if (conversationType === 'channel')
      ref = db
        .collection('campuses')
        .doc(campusKey)
        .collection('channels')
        .doc(conversationId);

    ref
      .update({
        ['member_names.' + uid + '.online_timestamp_ms']: Date.now(),
        ['member_names.' + uid + '.first_name']: first_name,
        ['member_names.' + uid + '.last_name']: last_name,
        ['member_names.' + uid + '.image']: image,
        ['member_names.' + uid + '.level']: level,
        ['member_names.' + uid + '.points']: points,
        ['member_names.' + uid + '.period_points']: period_points,
      })
      .then((res) =>
        console.log('Updated online timestamp for bubble ' + conversationId),
      )
      .catch((err) =>
        analytics.error(err, 'bubbleFuncs', 'updateOnlineTimestamp'),
      );
  },
  updateOfflineTimestamp: async function (
    conversationId,
    conversationType,
    campusKey,
  ) {
    const uid = (auth.currentUser || {}).uid;

    // Change ref if it is a channel
    var ref = db.collection('bubbles').doc(conversationId);
    if (conversationType === 'channel')
      ref = db
        .collection('campuses')
        .doc(campusKey)
        .collection('channels')
        .doc(conversationId);

    ref
      .update({
        ['member_names.' + uid + '.offline_timestamp_ms']: Date.now(),
      })
      .then((res) =>
        console.log('Updated offline timestamp for bubble ' + conversationId),
      )
      .catch((err) =>
        analytics.error(err, 'bubbleFuncs', 'updateOfflineTimestamp'),
      );
  },
  sendMessage: async function (message) {
    /**
     * Function to send a message thrugh the firebase functions.
     * Pass an object of the message, some fields are required and will not send if
     * they are not met. These are visible in the if statement below
     */

    const {text, custom, image, creator, conversationId} = message;
    if ((text || custom || image) && creator && conversationId)
      return functions.httpsCallable('createMessage')(message);
    else throw new Error('Invalid message passed');
  },
  toggleMessageLike: async function ({
    conversationId,
    messageId,
    alreadyLiked,
    campusKey,
    type,
  }) {
    /**
     * Function to like a message
     * Pass the param 'alreadyLiked' to toggle the like
     */
    const uid = (auth.currentUser || {}).uid;
    const update = {
      likes: alreadyLiked
        ? firestore.FieldValue.arrayRemove(uid)
        : firestore.FieldValue.arrayUnion(uid),
    };

    var ref = db
      .collection('bubbles')
      .doc(conversationId)
      .collection('messages')
      .doc(messageId);

    if (campusKey && type === 'channel')
      ref = db
        .collection('campuses')
        .doc(campusKey)
        .collection('channels')
        .doc(conversationId)
        .collection('messages')
        .doc(messageId);
    return ref
      .update(update)
      .then((res) => {
        return {liked: !alreadyLiked};
      })
      .catch((err) => {
        analytics.error(err, 'CampusFuncs/bubble', 'toggleMessageLike');
        throw err;
      });
  },
  handleNavigationCreation: async function (campusKey, creation) {
    /**
     * This function handles whenever a user navigates to
     * a bubble and a new bubble is created
     */
    analytics.breadcrumb(
      'Creating new bubble through bubble focus',
      'CampusFuncs',
      'handleNavigationCreation',
    );
    analytics.breadcrumb(creation, 'CampusFuncs', 'handleNavigationCreation');
    console.log('Creating new bubble', creation);

    const {uids, bubbleParams} = creation;

    // Create default data
    const data = {
      __type: 'private_bubble',
      member_uids: uids,
      creator: auth.currentUser.uid,
      ...bubbleParams,
    };

    // Get the member names for the bubble
    const names = await getUsers(uids)
      .then((users) => {
        return users;
      })
      .catch((err) => {
        throw err;
      });
    data.member_names = names;

    return functions
      .httpsCallable('createBubble')(data)
      .then((res) => {
        return {id: res.data.id, data};
      })
      .catch((err) => {
        analytics.error(err, 'CampusFuncs', 'handleNavigationCreation');
        throw err;
      });
  },
  isUserMember: function (memberUids, goBack) {
    /** Function to check whether user is a member of the bubble
     * or not.
     *
     * If they are not then the function will retun an alert that navigates
     * the user back
     */
    const isMember = memberUids.includes(auth.currentUser.uid);
    if (isMember) return true;
    else {
      Alert.alert('Not a member', 'You are not a member of this bubble.', [
        {text: 'Go back', onPress: goBack},
      ]);
      return false;
    }
  },
};
