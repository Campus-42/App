import {Alert} from 'react-native';
import {analytics} from '../../../assets/Analytics';
import {Campus} from '../../../assets/Campus';
import {auth, db, functions} from '../../../assets/Firebase/Firebase';
import {
  getUsers,
  parseMessage,
  parseMessageThread,
} from '../../../assets/Firebase/functions';

export const MessageFuncs = {
  createThread: async function (
    members,
    user,
    type = 'private_bubble',
    admins = [],
  ) {
    const uids = [], // reformat object to array with only ids, and one with names
      names = {};
    Object.values(members).forEach((e) => {
      names[e.uid] = getUserInfoForBubbleInfo(e);
      uids.push(e.uid);
    });

    return functions
      .httpsCallable('createBubble')({
        member_uids: uids,
        member_names: names,
        admins: admins,
        created: new Date(),
        creator: user.uid,
        __type: type,
      })
      .then((res) => {
        return res.data;
      })
      .catch((err) => {
        throw err;
      });
  },
  getBubbles: async function (latest = new Date().getTime()) {
    return db
      .collection('bubbles')
      .where(
        'member_uids',
        'array-contains',
        auth.currentUser !== null ? auth.currentUser.uid : '-',
      )
      .orderBy('latest_timestamp_ms', 'desc')
      .endBefore(latest)
      .get()
      .then((querySnapShot) => {
        const bubbles = [];
        querySnapShot.forEach(async (doc) =>
          bubbles.push(await parseMessageThread(doc.data(), doc.id)),
        );
        return bubbles;
      })
      .catch((err) => {
        console.warn('Get bubbles error', err);
        throw err;
      });
  },
  sortBubbles: function (a, b) {
    if (a.latest_timestamp_ms < b.latest_timestamp_ms) {
      return 1;
    }
    if (a.latest_timestamp_ms > b.latest_timestamp_ms) {
      return -1;
    }
    return 0;
  },
  filterAwayUser: function (messages) {
    const uid = auth.currentUser != null ? auth.currentUser.uid : '-';
    return messages.filter((e) => e.creator !== uid || e.system);
  },
  getMessages: async function (
    thread,
    latest_timestamp = Date.now() + 1000,
    limit = 15,
  ) {
    return db
      .collection('bubbles')
      .doc(thread)
      .collection('messages')
      .orderBy('timestamp_ms', 'desc')
      .startAfter(latest_timestamp)
      .limit(limit)
      .get()
      .then((docSnapShot) => {
        const messages = [];
        docSnapShot.forEach(async (doc) =>
          messages.push(await parseMessage(doc.data(), doc.id)),
        );
        return messages;
      })
      .catch((err) => {
        console.warn('Alpha 023', err);
        throw err;
      });
  },
  getBubble: async function (bubble) {
    return db
      .collection('bubbles')
      .doc(bubble)
      .get()
      .then((doc) => {
        return parseMessageThread(doc.data(), doc.id);
      })
      .then(async (bubbleInfo) => {
        // Get the users firebase doc
        const fetchedUsers = await Campus.Funcs.user.getMultipleUsers(
          bubbleInfo.member_uids,
        );
        bubbleInfo.member_names = fetchedUsers;
        console.log('Members', bubbleInfo.member_names);
        return bubbleInfo;
      })
      .catch((err) => {
        analytics.error(err, 'MessageFuncs', 'getBubble');
        throw err;
      });
  },
  toggleSignedInUserIsAMember: async function (
    bubble,
    user,
    type = false,
    conversationType,
    campusKey,
  ) {
    const uid = auth.currentUser !== null ? auth.currentUser.uid : '-';
    const isMember = bubble.member_uids.includes(uid);

    var memberNames = bubble.member_names;
    var memberUids = bubble.member_uids;

    if (isMember && type == 'leave') {
      // delete memberNames[uid]; // don't since then we can't see who wrote messages
      memberUids = memberUids.filter((e) => e !== uid);
    } else if (type == 'join' && !isMember) {
      memberNames[uid] = getUserInfoForBubbleInfo(user);
      memberUids = memberUids.concat([uid]);
    }

    const creatorName = `${user.first_name} ${user.last_name}`;
    const action = type == 'leave' ? 'left' : 'joined';

    return updateBubble(
      bubble.id,
      {
        member_uids: memberUids,
        member_names: memberNames,
      },
      conversationType,
      campusKey,
    ).then(() =>
      sendBubbleSystemMessage(
        bubble.id,
        `${creatorName} ${action} the bubble`,
        bubble,
      ),
    );
  },
  getPreviewDate: function (date) {
    const msgDate = new Date(date);
    msgDate.setMinutes(msgDate.getMinutes());

    var dayStart = new Date();
    dayStart.setHours(0, 0, 0, 0);
    const yesterday = new Date();
    yesterday.setHours(0, 0, 0, 0);
    yesterday.setDate(yesterday.getDate() - 1);

    if (msgDate.getTime() >= dayStart.getTime())
      return msgDate.toString().substring(16, 21);
    else if (msgDate.getTime() >= yesterday.getTime())
      return `Yesterday ${msgDate.toString().substring(16, 21)}`;
    else
      return `${msgDate
        .toString()
        .substring(4, 10)} ${msgDate.toString().substring(16, 21)}`;
  },
  sendBubbleSystemMessage: sendBubbleSystemMessage,
  getChannels: async function (campusKey) {
    const uid = (auth.currentUser || {}).uid;
    return db
      .collection('campuses')
      .doc(campusKey)
      .collection('channels')
      .where('member_uids', 'array-contains', uid)
      .get()
      .then((querySnapShot) => {
        const channels = [];
        querySnapShot.forEach(async (doc) => {
          channels.push(await parseMessageThread(doc.data(), doc.id));
        });
        return channels;
      })
      .catch((err) => {
        console.warn('Get channels error', err);
        analytics.error(err, 'MessageFuncs', 'getChannels');
        throw err;
      });
  },
  getChannel: async function (channelId, campusKey) {
    return db
      .collection('campuses')
      .doc(campusKey)
      .collection('channels')
      .doc(channelId);
  },
  getBubbleFocusConversation: async function (id, type, campusKey) {
    /**
     * This function combines all types of
     * bubbles by conditionally getting the
     * conversation
     */
    var ref = db.collection('bubbles').doc(id);
    if (type == 'channel') {
      ref = db
        .collection('campuses')
        .doc(campusKey)
        .collection('channels')
        .doc(id);
    }

    return ref
      .get()
      .then(async (doc) => {
        return await parseMessageThread(doc.data(), doc.id);
      })
      .then(async (conversation) => {
        const validChannelUids = []; // If channel, only allow messages from admins or from user
        const admins = conversation.admins || [];
        var users = conversation.member_names; // original user infos
        const userInfos = await getUsers(conversation.member_uids); // updated information

        // Go through the user infos and append the missing
        // info to the existing user data
        Object.entries(userInfos).forEach(([id, usr]) => {
          users[id] = {...users[id], ...usr};
        });

        // If it is a channel only pass messages from admins or users
        if (conversation.__type == 'channel') {
          Object.entries(userInfos).forEach(([id, user]) => {
            const isAdmin = admins.includes(id);
            const isUser = auth.currentUser.uid === id;
            if (isAdmin || isUser) validChannelUids.push(id);
          });
        }

        conversation.member_names = users; // Update bubble with users

        return {conversation, validChannelUids};
      })
      .catch((err) => {
        analytics.error(err, 'MessageFuncs', 'getBubbleFocusConversation');
        throw err;
      });
  },
  getBubbleFocusConversationMessages: async function (
    id,
    type,
    campusKey,
    latestTimestamp,
    limit = 10,
  ) {
    /**
     * Get the messages depending on type of bubble
     * and its database location
     */

    var ref = db.collection('bubbles').doc(id).collection('messages');

    if (type == 'channel') {
      ref = db
        .collection('campuses')
        .doc(campusKey)
        .collection('channels')
        .doc(id)
        .collection('messages');
    }

    return ref
      .orderBy('timestamp_ms', 'desc')
      .startAfter(latestTimestamp)
      .limit(limit)
      .get()
      .then((docsSnapShot) => {
        const messages = [];
        docsSnapShot.forEach(async (doc) =>
          messages.push(await parseMessage(doc.data(), doc.id)),
        );
        return messages;
      })
      .catch((err) => {
        console.warn('Error getting conversation messages', err);
        analytics.error(
          err,
          'MessageFuncs',
          'getBubbleFocusConversationMessages',
        );
        throw err;
      });
  },
  isConversationUnread: function (info) {
    /**
     * Return a boolean whether this converastion is unread
     * or not by user.
     */

    const uid = (auth.currentUser || {}).uid;
    const lastOfflineTimestamp =
      (info.member_names[uid] || {}).offline_timestamp_ms || 0;

    if (lastOfflineTimestamp == 0) return false; // Prevent bugs

    const latestMessage = info.latest_timestamp_ms;

    return (
      lastOfflineTimestamp - latestMessage < 0 &&
      info.latest_author_uid !== (auth.currentUser || {}).uid
    );
  },
};
const getUserInfoForBubbleInfo = (user) => {
  return {
    first_name: user.first_name,
    last_name: user.last_name,
    id: user.uid,
    _id: user.uid,
    email: user.email,
    image: user.image,
  };
};

async function updateBubble(conversationId, update, type, campusKey) {
  var ref = db.collection('bubbles').doc(conversationId);
  // If it is a channel, redirect reference
  if (type === 'channel' && campusKey)
    ref = db
      .collection('campuses')
      .doc(campusKey)
      .collection('channels')
      .doc(conversationId);

  if (update)
    return ref
      .update(update)
      .then((res) => {
        analytics.breadcrumb(
          `Updated the bubble (${conversationId}) for the keys ${Object.keys(
            update || {},
          )}`,
          'Bubbles/functions.js',
          'updateBubble()',
        );
      })
      .catch((err) =>
        analytics.error(err, 'Bubbles/functions.js', 'updateBubble()'),
      );
  else return false;
}

async function sendBubbleSystemMessage(bubbleID, text, bubble) {
  const uid = auth.currentUser !== null ? auth.currentUser.uid : '-';
  const user = bubble.member_names[uid];
  const creatorName = `${user.first_name} ${user.last_name}`;

  functions
    .httpsCallable('createMessage')({
      __type: 'bubble_info',
      timestamp: new Date(),
      timestamp_ms: new Date().getTime(),
      createdAt: new Date(),
      creator: uid,
      creator_name: creatorName,
      user: user,
      bubble: bubbleID,
      text: text,
      __data: null,
      custom: false,
    })
    .then((res) => {
      console.log('Successfully sent system message');
      return res;
    })
    .catch((err) =>
      analytics.error(err, 'Bubbles/functions.js', 'updateBubble()'),
    );
}
