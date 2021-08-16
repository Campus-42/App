import AsyncStorage from '@react-native-async-storage/async-storage';
import {Cache} from 'react-native-cache';
import {analytics} from '../Analytics';
import {auth} from '../Firebase/Firebase';

const userCache = new Cache({
  namespace: 'campus42_app',
  policy: {
    maxEntries: 50000,
  },
  backend: AsyncStorage,
});

const bubbleCache = new Cache({
  namespace: 'bubbles',
  policy: {
    maxEntries: 100,
  },
  backend: AsyncStorage,
});

const userId = (uid) => `user${uid}`;
const messageId = (msgId, convId, campusKey) =>
  `message.${msgId}.${convId}-${campusKey || ''}`;

export const CacheFuncs = {
  cacheUsers: async function (users = [], overwrite = false) {
    users.forEach(async (u) => {
      const uid = userId(u.uid);
      let exists = await userCache.peek(uid);

      if ((!exists || overwrite) && u.uid !== undefined)
        userCache
          .set(uid, u)
          .catch((error) => console.warn('Cache error:', error));
    });
  },
  getUsers: async function (uids = false, removeSignedInUser = false) {
    /**
     * Optional argument [users], will return specified uids or all if undefined
     */
    const signedInUid = removeSignedInUser
      ? '-empty' /** Set uid to a placeholder to allow signed in user if specified */
      : (auth.currentUser || {}).uid;

    return userCache
      .getAll()
      .then(async (res) => {
        res = Object.entries(res);
        res = res.filter(
          ([key, {value}]) =>
            (uids === false || (uids || []).includes(key)) &&
            typeof value == 'object' &&
            key !== signedInUid,
        );

        const users = {};
        const numUsers = res.length;

        await new Promise((resolve) =>
          res.forEach(([uid, info], index) => {
            users[uid] = info.value;
            if (index == numUsers - 1) resolve(users);
          }),
        );
        return {users};
      })
      .catch((err) => {
        return {error: err, users: {}};
      });
  },
  cachePendingConversationMessage: async function (
    message,
    conversation,
    campusKey,
  ) {
    /**
     * Cache the messages that are pending to send
     */
    const id = messageId(message.id, conversation.id, campusKey);
    const payload = JSON.stringify({message, conversation, campusKey});
    return bubbleCache.set(id, payload);
  },
  removeCachePendingConversationMessage: async function (
    message,
    conversation,
    campusKey,
  ) {
    /**
     * Query the cached messages and remove the matching message
     */
    const id = messageId(message.id, conversation.id, campusKey);
    const existingValue = await bubbleCache.peek(id);

    await bubbleCache.remove(id);

    return {existingValue};
  },
  getCachedPendingConversationMessages: async function (
    conversationId = false,
    conversationType = false,
    campusKey = false,
  ) {
    /**
     * Get the cached pending messages.
     *
     * If arguments are passed then it will
     * only return messages matching it.
     */

    const messages = [];
    var cachedMessages = (await bubbleCache.getAll()) || {};
    cachedMessages = Object.entries(cachedMessages);

    return new Promise((resolve) => {
      cachedMessages.forEach(async ([id, {value}], index) => {
        try {
          const object = JSON.parse(value || {});

          /** Check if the id is following format, if not delete */
          if (id.split('.')[0] !== 'message') await bubbleCache.remove(id);

          /** If no argument is passed, append all messages to array */
          if (!conversationId && !campusKey && !conversationId)
            messages.push(object);
          else {
            /** Else query accordingly */
            const {campusKey: msgCampusKey, message, conversation} = object;
            if (msgCampusKey == campusKey) messages.push(object);
            else if (
              conversation.id == conversationId &&
              conversation.__type == conversationType
            )
              messages.push(object);
          }
        } catch (err) {
          analytics.error(
            err,
            'CacheFuncs',
            'getCachedPendingConversationMessages',
          );
        }
        if (index === cachedMessages.length - 1) resolve(messages);
      });
    });
  },
};
