import {auth, db, messaging, storage, functions} from './Firebase';
import {AsyncStorage} from '../AsyncStorage/functions';
import {Store} from '../redux/store';
import ImageResizer from 'react-native-image-resizer';
import {analytics} from '../Analytics';
import {CacheFuncs} from '../Cache';
import {ColorStyle} from '../GlobalStyle/ColorStyle';

function shuffle(array) {
  var currentIndex = array.length,
    temporaryValue,
    randomIndex;

  //While there remain elements to shuffle...
  while (0 !== currentIndex) {
    // Pick a remaining element...
    randomIndex = Math.floor(Math.random() * currentIndex);
    currentIndex -= 1;

    // And swap with the current element...
    temporaryValue = array[currentIndex];
    array[currentIndex] = array[randomIndex];
    array[randomIndex] = temporaryValue;
  }
  return array;
}

export function requestUserPermission() {
  messaging
    .requestPermission({
      sound: true,
      announcement: true,
      badge: true,
      alert: true,
    })
    .catch((err) => console.warn('Could not ask for user permission'));
}

export async function trySignInUser() {
  /** Check if user is signed in or try. If user is signed in it will return true and if not it will return false */

  let signInInfo = await AsyncStorage.getSignIn();

  //Check if none of the values include null
  let noneIsNull = signInInfo.every(isSecondElemNotNull);

  if (noneIsNull) {
    // Sign in user and return true if it works
    return auth
      .signInWithEmailAndPassword(signInInfo[0][1], signInInfo[1][1])
      .then(() => {
        return auth.currentUser.reload();
      })
      .then(async () => {
        const user = await getSignedInUserInfo();
        const campus = await getCampusInfo(user.campus);
        return {couldSignIn: true, user, campus};
      })
      .catch((err) => {
        throw err;
      });
  } else {
    // One of the sign in credentials were null
    analytics.error(err, 'Firebase/functions.js', 'trySignInUser()');
    return false;
  }
}

//Filter component
const isSecondElemNotNull = (elem) => elem[1] != null;

export async function uploadImage(
  paths = Array,
  imageURI = String,
  type = 'normal',
) {
  /**
   * Upload an image to the specified path
   * It will construct the path from the path components and then create a storage ref
   * Then it will read and store the file and put the image in the storage bucket
   */
  var width = 900,
    height = 1400;
  if (type == 'preview') {
    width = 800;
    height = 1200;
  } else if (type == 'logo') {
    width = 600;
    height = 1000;
  }
  if (
    !imageURI.startsWith('https://firebasestorage') &&
    !imageURI.includes('su.buckingham.ac.uk')
  )
    return ImageResizer.createResizedImage(
      encodeURI(imageURI),
      width,
      height,
      'JPEG',
      100,
    )
      .then(async (img) => {
        const path = paths.join('/');
        const storageRef = storage.ref(path);
        // const res = await RNFetchBlob.fetch(encodeURI(img.uri));
        // const blob = await res.blob();
        // console.log('SECOND SIZE', blob.size);

        return storageRef
          .putFile(img.uri)
          .then(async () => {
            return {uploaded: true, uri: await storageRef.getDownloadURL()};
          })
          .catch((err) => {
            throw err;
          });
      })
      .catch((err) => {
        analytics.error(err, 'Firebase/functions.js', 'uploadImage()');
        throw err;
      });
  else
    return {
      uploaded: false,
      exists: true,
      uri: imageURI,
      error: 'Could not upload the image for unknown reason',
    };
}

export async function parseEventData(docData, id) {
  return {
    ...docData,
    id: id,
    search_index: [],
    date: {end: docData.date.end.toDate(), start: docData.date.start.toDate()},
    __type: 'event',
  };
}
export async function parseMessageThread(docData, id) {
  var created = new Date();
  if (docData.created) created = docData.created.toDate();

  return {
    ...docData,
    id: id,
    created,
    _loading: false,
  };
}
export function parseSocietyData(docData, id) {
  const uid = (auth.currentUser || {}).uid;
  const images = docData.images || {};
  return {
    ...docData,
    id: id,
    isExec: docData.exec_members.includes(uid),
    images: {
      logo: images.logo || 'null',
      background: images.background || 'null',
    },
    __type: 'society',
  };
}
export async function parseMessage(docData, id) {
  const system = docData.__type !== 'user' || docData.system;
  return {
    ...docData,
    timestamp: docData.timestamp.toDate(),
    createdAt: docData.timestamp.toDate(),
    custom: docData.custom,
    id: id,
    _id: id,
    user: !system ? {name: docData.creator_name, _id: docData.creator} : {},
    system: system,
  };
}

export function parseUserData(docData, id = (auth.currentUser || {}).uid) {
  const bookmarks =
    docData.bookmarks == false || docData.bookmarks == undefined
      ? {}
      : docData.bookmarks;
  return {...docData, bookmarks: bookmarks, uid: id};
}

export async function getPermissions(campusKey) {
  db.collection('campuses')
    .doc(campusKey)
    .collection('societies')
    .where('confirmed', '==', true)
    .where('visible', '==', true)
    .where(
      'members',
      'array-contains',
      auth.currentUser !== null ? auth.currentUser.uid : 'empty',
    )
    .get()
    .then((querSnapShot) => {
      const permissions = ['all', 'student'];
      querSnapShot.forEach((society) =>
        permissions.push(`society_${society.id}`),
      );
      Store.dispatch({type: 'UPDATE_PERMISSIONS', payload: permissions});
      return;
    })
    .catch((err) => {
      console.warn('ERROR, Could not get permissions from societies', err);
      return;
    });
}

export async function getSignedInUserInfo() {
  return db
    .collection('users')
    .doc(auth.currentUser !== null ? auth.currentUser.uid : 'empty')
    .get()
    .then((doc) => {
      const bookmarks =
        doc.data().bookmarks == false || doc.data().bookmarks == undefined
          ? {}
          : doc.data().bookmarks;

      Store.dispatch({
        type: 'UPDATE_USER_INFO',
        payload: {...doc.data(), bookmarks: bookmarks, uid: doc.id},
      });
      return {...doc.data(), bookmarks: bookmarks, uid: doc.id};
    })
    .catch((err) => {
      console.warn('Could not get user info', err);
      throw err;
    });
}

export async function getCampusInfo(campusKey) {
  return db
    .collection('campuses')
    .doc(campusKey)
    .get()
    .then((doc) => {
      ColorStyle.setCampusColors(doc.data().colors);
      Store.dispatch({type: 'UPDATE_CAMPUS_INFO', payload: doc.data()});
      return doc.data();
    })
    .catch((err) => {
      console.log('Could not get campus info', err);
      throw err;
    });
}

export async function parseBlog(docData, id) {
  const editLog = (docData.edit_log || []).map((elem) => {
    return {
      ...elem,
      date: elem.date ? elem.date.toDate() : new Date(),
    };
  });
  return {...docData, edit_log: editLog, id: id, __type: 'announcement'};
}

export async function getUserInfoForUID(uid) {
  return db
    .collection('users')
    .doc(uid)
    .get()
    .then((doc) => {
      return {...doc.data(), _id: doc.id, id: doc.id, uid: doc.id};
    })
    .catch((err) => {
      throw err;
    });
}
export async function getUsers(uids = [], shuffleUsers = true) {
  return new Promise(async (resolve) => {
    var users = (await CacheFuncs.getUsers().users) || {};

    uids
      .filter((e) => users[e] == undefined)
      .forEach(async (uid, index) => {
        await getUserInfoForUID(uid)
          .then((usr) => {
            if (usr.first_name !== undefined && usr.last_name !== undefined)
              users[uid] = usr;
          })
          .catch(console.warn);
        if (index == uids.length - 1) {
          CacheFuncs.cacheUsers(Object.values(users));
          setTimeout(() => resolve(users), 250);
        }
      });
  });
}

export async function searchForUser(searchArray, campusKey) {
  return db
    .collection('users')
    .where('search_index', 'array-contains-any', searchArray.slice(0, 10))
    .where('campus', '==', campusKey)
    .get()
    .then((querySnapShot) => {
      const users = [];
      querySnapShot.forEach((user) =>
        users.push({...user.data(), uid: user.id}),
      );
      return users;
    })
    .catch((err) => {
      throw err;
    });
}

export async function getInvitations(campusKey) {
  console.warn(
    'getInvitations() is DEPRECEATED, use Campus.Funcs.invite instead',
  );
}

export async function getInviteObj(campusKey, id, type) {
  console.warn(
    'getInviteObj() is DEPRECEATED, use Campus.Funcs.invite instead',
  );
}
export async function joinSociety(user, campusKey, societyID) {
  if (auth.currentUser.uid != null) {
    const data = {
      first_name: user.first_name,
      last_name: user.last_name,
      joined: new Date(),
      uid: auth.currentUser.uid,
      email: auth.currentUser.email,
    };

    if (!user.permissions.includes(societyID))
      db.collection('users')
        .doc(auth.currentUser.uid)
        .update({
          permissions: [...new Set(user.permissions)].concat(
            `society_${societyID}`,
          ),
        })
        .then((doc) => console.log('Joined society', doc))
        .catch((err) => console.warn('Could not join society', err));

    const ref = db
      .collection('campuses')
      .doc(campusKey)
      .collection('societies')
      .doc(societyID);

    const first = await ref
      .get()
      .then((doc) =>
        ref
          .update({
            members: doc.data().members.concat([auth.currentUser.uid]),
          })
          .then(() => {
            console.log('Updated members');
            return true;
          })
          .catch((err) => {
            console.warn('Could not update members');
            return err;
          }),
      )
      .catch((err) => {
        console.warn('Could not join society', err);
      });

    if (first !== true) throw err;
    else
      return ref
        .collection('data')
        .doc('members')
        .get()
        .then(async (doc) => {
          if (!doc.data().members_data.includes(data))
            return ref
              .collection('data')
              .doc('members')
              .update({
                members_data: doc.data().members_data.concat([data]),
              })
              .then(() => {
                console.log('Updated members data');
                return true;
              })
              .catch((err) => {
                throw err;
              });
        })
        .catch((err) => {
          // console.log('Could not get society members', err);
          throw err;
        });
  }
}

export async function updateBlogRead(blogID, read = true) {
  /**
   * read can be set to false to set blog as not read
   */
  return getUserInfoForUID(auth.currentUser.uid)
    .then(async (user) => {
      var blogs = [];

      // Check if read_blogs key exists and is an array
      console.log('typeof read_blogs is: ' + typeof user.read_blogs);
      if (Object.keys(user).includes('read_blogs'))
        if (typeof user.read_blogs == 'object') blogs = user.read_blogs;

      if (read == true) blogs.push(blogID);
      else if (read == false && blogs.includes(blogID))
        blogs = blogs.filter((elem) => elem != blogID);

      return db
        .collection('users')
        .doc(auth.currentUser.uid)
        .update({read_blogs: blogs})
        .then(() => {
          console.log('Updated read blogs for user');
          return true;
        })
        .catch((err) => {
          throw err;
        });
    })
    .catch((err) => {
      throw err;
    });
}

export async function incrementFieldValue(
  path,
  field = 'read_count',
  value = 1,
) {
  functions
    .httpsCallable('incrementFieldValue')({
      path: path,
      field: field,
      value: value,
    })
    .then((res) => console.log('Successfully incremented field value', res))
    .catch((err) => console.warn('Could not increment field value', err));
}

export async function getRecommendedEvents(
  campusKey,
  limit = 5,
  onlyJoined = false /** Only get joined events */,
) {
  var ref = db
    .collection('campuses')
    .doc(campusKey)
    .collection('events')
    .where('visible', '==', true)
    .where('confirmed', '==', true);

  if (onlyJoined)
    ref = ref.where('participants', 'array-contains', auth.currentUser.uid);

  return ref
    .limit(limit)
    .get()
    .then((querySnapshot) => {
      const events = [];
      querySnapshot.forEach(async (doc) =>
        events.push(await parseEventData(doc.data(), doc.id)),
      );
      return shuffle(events);
    })
    .catch((err) => {
      throw err;
    });
}

export async function updateCampusPointSystem(campusKey) {
  return db
    .collection('campuses')
    .doc(campusKey)
    .collection('data')
    .doc('point_system')
    .get()
    .then((doc) => {
      Store.dispatch({
        type: 'UPDATE_CAMPUS_POINT_SYSTEM',
        payload: doc.data(),
      });
      return doc.data();
    })
    .catch((err) => {
      analytics.error(err, 'UserLevels.js');
      throw err;
    });
}
