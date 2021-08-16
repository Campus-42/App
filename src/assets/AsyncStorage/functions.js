import _AsyncStorage from '@react-native-async-storage/async-storage';
import {analytics} from '../Analytics';
import notifee from '@notifee/react-native';
import {inAppBadgeEmitter} from '../EventEmitter';

export const AsyncStorage = {
  async getSignIn() {
    let values = await _AsyncStorage.multiGet([
      '@user_email',
      '@user_password',
    ]);
    return values;
  },
  async setSignIn(email, password) {
    console.log('Setting sign in to', {email, password});
    const user_email = ['@user_email', email];
    const user_password = ['@user_password', password];
    try {
      await _AsyncStorage.multiSet([user_email, user_password]);
      console.log("Changed user's sign in credentials");
      return true;
    } catch (e) {
      //save error

      console.warn("Can't access stored sign in information", e);
      return false;
    }
  },
  async setFullName(first, last) {
    try {
      await _AsyncStorage.multiSet([
        ['@first_name', first],
        ['@last_name', last],
      ]);
      return true;
    } catch {
      return false;
    }
  },
  async getFullName() {
    let names = await _AsyncStorage.multiGet(['@first_name', '@last_name']);
    return {first: names[0][1], last: names[1][1]};
  },
  async clearSignIn() {
    let success = await _AsyncStorage.multiSet([
      ['@user_email', 'null'],
      ['@user_password', 'null'],
      ['@first_name', 'null'],
      ['@last_name', 'null'],
    ]);

    return success;
  },
  async addReadStatusBlog(id = String, removeReadStatus = false) {
    // Validate id
    var allReadBlogs = await getAllReadBlogs();
    if (!allReadBlogs.includes(id) && !removeReadStatus) allReadBlogs.push(id);
    // If id already exists leave it
    else if (allReadBlogs.includes(id) && removeReadStatus)
      allReadBlogs = allReadBlogs.fill((e) => e !== id);

    return _AsyncStorage
      .setItem('@read_blogs', JSON.stringify(allReadBlogs)) // We can't store array, so we stringify it
      .then(() => {
        return true;
      })
      .catch((err) => {
        throw err;
      });
  },
  async checkIfBlogsRead(blogs = Array) {
    const allReadBlogs = await getAllReadBlogs();

    const notReadBlogs = blogs.filter(
      (blog) => !allReadBlogs.includes(blog.id),
    );
    return notReadBlogs;
  },
  async checkIfBlogRead(blog = Object) {
    const allReadBlogs = await getAllReadBlogs();
    return allReadBlogs.some((elem) => elem == blog);
  },
  async setCampusKey(key) {
    try {
      _AsyncStorage
        .setItem('@campus_key', key)
        .catch((err) =>
          console.warn('Could not store campus key in async storage', err),
        );
    } catch (err) {
      console.warn('Could not set campus key im async storage');
    }
  },
  async getCampusKey() {
    return _AsyncStorage
      .getItem('@campus_key')
      .then((res) => {
        return res;
      })
      .catch((err) => {
        console.warn('Could not get campus key from async storage', err);
        throw err;
      });
  },
  async updateUnreadBubbles(bubble, read) {
    var unread = await getAllUnreadBubbles();

    if (unread.error) {
      // analytics.error(unread.error, 'AsyncStorage.js', 'updateUnreadBubbles'());
      // TODO: Add error analytics
    } else {
      const unreads = Object.keys(unread.bubbles);
      if (read) unread.bubbles = unread.bubbles.filter((b) => b !== bubble);
      else if (!unread.bubbles.includes(bubble))
        unread.bubbles = unread.bubbles.concat([bubble]);
      setUnreadBubbles(unread.bubbles);
    }
  },
  async getAllUnreadBubbles() {
    return getAllUnreadBubbles();
  },

  async onNotification(msg) {
    /**
     * Handle the notification and set the appropriate badge count
     *
     * Follows the same format as the in app badge in headers. It
     * will create an object sorted by the type provided in the notifications
     */

    var type = msg.data.type;
    const id = msg.messageId;
    const objId = msg.data.obj_id || msg.data.bubble; // This is to future proof, the only used field in the future will be obj_id
    const allowedNotifications = [
      'bubbles',
      'home',
      'admin-panel',
      'profile',
      'societies',
    ];

    // The message type will be reverted to the bubbles type in the
    // future and this will handle that when there is a mismatch
    if (type === 'messages' || type === 'message') type = 'bubbles';

    var {notifications, error} = await this._getNotifications();
    if (!error) {
      if (!notifications) notifications = {};
      if (notifications[type] === undefined) notifications[type] = [];

      // Get the active notification and don't insert into async storage
      // if it meets the active notification
      const activeNotification = await this._getActiveNotificationType();

      if (
        (type !== activeNotification.type ||
          objId !== activeNotification.obj_id) &&
        allowedNotifications.includes(type)
      )
        notifications[type].push({messageId: id, obj_id: objId});

      _AsyncStorage
        .setItem('@notifications', JSON.stringify(notifications))
        .then(() => {
          console.log('Saved notifications', notifications);
          this.updateBadgeCount();
        })
        .catch((err) => analytics.error(err, 'AsyncStorage', 'onNotification'));
    }
  },
  async updateBadgeCount() {
    var {notifications, error} = await this._getNotifications();
    if (!error) {
      // Emit event to listeners to show badges in app
      inAppBadgeEmitter.emit('in-app-badge-change', notifications);

      // Get the count of unique obj ids and set the badge count
      const count = Object.values(notifications)
        .map((value) => {
          var objIds = [...new Set((value || []).map((e) => e.obj_id))];
          return objIds.length;
        })
        .reduce((a, b) => a + b, 0);

      notifee
        .setBadgeCount(count)
        .catch((err) =>
          analytics.error(err, 'AsyncStorage', 'onNotification/setBadgeCount'),
        );
    }
  },
  async _markNotificationsAsRead(type, objId) {
    /**
     * Call this function to mark specified notifications as read.
     * Pass a query object that specifies the type and obj id
     *
     * The function will loop and remove each specified notification
     */
    console.log('Marking notifications as read', {type, objId});
    var {notifications, error} = await this._getNotifications();
    if (!error) {
      var notificationType = notifications[type] || [];

      notificationType = notificationType.filter((obj) => {
        return obj.obj_id !== objId;
      });

      if (type) notifications[type] = notificationType;

      _AsyncStorage
        .setItem('@notifications', JSON.stringify(notifications))
        .then(() => {
          this.updateBadgeCount();
        })
        .catch((err) => analytics.error(err, 'AsyncStorage', 'onNotification'));
    } else analytics.error(error, 'AsyncStorage', '_markNotificationsAsRead');
  },
  async _setActiveNotificationType(type, obj_id) {
    /**
     * Set the active type that the user is at.
     * e.g., if the user is at the Bubble 'abcde', then the app
     * will not save notifications that match type = "bubbles"
     * and obj_id = "abcde"
     *
     * This function will also automatically remove any
     * notifications attached to the type or obj id
     *
     * THIS WILL ONLY BE CALLED BY CAMPUSFUNCS/NOTICATIONS
     */
    if (type && obj_id) this._markNotificationsAsRead(type, obj_id);
    _AsyncStorage
      .setItem(
        '@active_notification',
        JSON.stringify({
          type: type || '',
          obj_id: obj_id || '',
        }),
      )
      .catch((err) =>
        analytics.error(err, 'AsyncStorage', '_setActiveNotificationType'),
      );
  },
  async _getActiveNotificationType() {
    return _AsyncStorage
      .getItem('@active_notification')
      .then((data) => {
        if (data) return JSON.parse(data);
        else return {type: '', obj_id: ''};
      })
      .catch((err) => {
        analytics.error(err, 'AsyncStorage', '_getActiveNotificationType');
        return {type: '', obj_id: ''};
      });
  },
  async _getNotifications() {
    /**
     * Get the notification ids for all types
     */
    return _AsyncStorage
      .getItem('@notifications')
      .then((notifications) => {
        // assign default notifications if empty/null
        const defaultNotifications = {
          bubbles: [],
          home: [],
          societies: [],
          profile: [],
        };
        if (notifications) notifications = JSON.parse(notifications);
        return {
          notifications: notifications || defaultNotifications,
        };
      })
      .catch((err) => {
        analytics.error(err, 'AsyncStorage', '_getNotifications');
        return {error: err};
      });
  },
  resetNotifications() {
    /**
     * To be called when the user is signing out
     */
    _AsyncStorage
      .setItem('@notifications', JSON.stringify({bubbles: []}))
      .catch((err) =>
        analytics.error(err, 'AsyncStorage', '_resetNotifications'),
      );
  },
};

async function getAllUnreadBubbles() {
  return _AsyncStorage
    .getItem('@unread_bubbles')
    .then((bubbles) => {
      bubbles = JSON.parse(bubbles);
      return {bubbles: bubbles || []};
    })
    .catch((err) => {
      return {error: err};
    });
}
async function setUnreadBubbles(bubbles) {
  const json = JSON.stringify(bubbles);

  return _AsyncStorage
    .setItem('@unread_bubbles', json)
    .then(() => {})
    .catch((err) => console.warn('Could not update unread bubbles', err));
}

async function getAllReadBlogs() {
  return _AsyncStorage
    .getItem('@read_blogs')
    .then((blogs) => {
      blogs = JSON.parse(blogs);

      return blogs !== null ? blogs : [];
    })
    .catch((err) => {
      console.warn('Could not get blogs', err);
      return [];
    });
}
