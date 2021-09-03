import {db, auth} from '../../../assets/Firebase/Firebase';
import {
  getUsers,
  parseBlog,
  parseEventData,
  parseMessageThread,
  parseSocietyData,
} from '../../../assets/Firebase/functions';
import {AsyncStorage} from '../../../assets/AsyncStorage/functions';
import {DateFuncs} from '../../../assets/Date';
import {CacheFuncs} from '../../../assets/Cache';

async function getDaysAhead(days, startDate = new Date()) {
  const date = new Date(startDate);
  const newDate = date.setDate(date.getDate() + days);
  return newDate;
}
async function getEndOfToday() {
  const date = new Date();
  date.setHours(23, 59, 59);
  return date.getTime();
}

export const HomeFuncs = {
  async getGreeting() {
    // Get a custom greeting based on which time of the day it is
    const hour = new Date().getHours();

    if (hour < 12) {
      return 'Good Morning';
    } else if (hour < 16) {
      return 'Good Afternoon';
    } else if (hour < 24) {
      return 'Good Evening';
    } else {
      return 'Hello';
    }
  },
  async getPopularEvents(
    campus,
    lastDoc = {number_of_participants: 10000000, end_ms: Date.now()},
    limit = 10,
    days = 7,
  ) {
    const dateUpperLimit = await getDaysAhead(days, await getEndOfToday());
    const dateLowerLimit = await DateFuncs.getFutureDateMSInMinutes(0);
    return db
      .collection('campuses')
      .doc(campus)
      .collection('events')
      .where('visible', '==', true)
      .where('confirmed', '==', true)
      .where('end_ms', '>=', dateLowerLimit)
      .where('end_ms', '<=', dateUpperLimit)
      .orderBy('end_ms')
      .orderBy('number_of_participants', 'desc')
      .startAfter(lastDoc.end_ms, lastDoc.number_of_participants)
      .limit(limit)
      .get()
      .then((querySnapshot) => {
        const events = [];
        querySnapshot.forEach(async (doc) => {
          events.push(await parseEventData(doc.data(), doc.id));
          getUsers(doc.data().participants);
        });
        return events;
      })
      .catch((err) => {
        console.warn('Error getting all events', err);
        throw err;
      });
  },
  async getMostPopularEvents(
    campus,
    lastDoc = {number_of_participants: 1000000},
    limit = 10,
  ) {
    return db
      .collection('campuses')
      .doc(campus)
      .collection('events')
      .where('visible', '==', true)
      .where('confirmed', '==', true)
      .orderBy('number_of_participants', 'desc')
      .startAfter([lastDoc.number_of_participants])
      .limit(limit)
      .get()
      .then((querySnapshot) => {
        var events = [];
        querySnapshot.forEach(async (doc) => {
          events.push(await parseEventData(doc.data(), doc.id));
          getUsers(doc.data().participants);
        });

        return events;
      })
      .catch((err) => {
        console.warn('Error getting all most popular events', err);
        throw err;
      });
  },
  async getTodaysEvents(campus, lastDoc = {start_ms: 0}, limit = 10) {
    const dateUpperLimit = await getEndOfToday();
    const dateLowerLimit = await DateFuncs.getFutureDateMSInMinutes(-60);
    return db
      .collection('campuses')
      .doc(campus)
      .collection('events')
      .where('visible', '==', true)
      .where('confirmed', '==', true)
      .where('start_ms', '>=', dateLowerLimit)
      .where('start_ms', '<=', dateUpperLimit)
      .orderBy('start_ms')
      .startAfter(lastDoc.start_ms)
      .limit(limit)
      .get()
      .then((querySnapshot) => {
        const events = [];
        querySnapshot.forEach(async (doc) => {
          events.push(await parseEventData(doc.data(), doc.id));
          getUsers(doc.data().participants);
        });

        return events;
      })
      .catch((err) => {
        throw err;
      });
  },
  async getJoinedEvents(campus, lastDoc = {start_ms: 0}, limit = 10, days = 7) {
    const dateUpperLimit = await getDaysAhead(days);
    const dateLowerLimit = await DateFuncs.getFutureDateMSInMinutes(-60);

    return db
      .collection('campuses')
      .doc(campus)
      .collection('events')
      .where('visible', '==', true)
      .where('confirmed', '==', true)
      .where('start_ms', '<=', dateUpperLimit)
      .where('start_ms', '>=', dateLowerLimit)
      .where(
        'participants',
        'array-contains',
        auth.currentUser !== null ? auth.currentUser.uid : 'empty',
      )
      .orderBy('start_ms')
      .startAfter(lastDoc.start_ms)
      .limit(limit)
      .get()
      .then((querySnapshot) => {
        const events = [];

        querySnapshot.forEach(async (doc) => {
          events.push(await parseEventData(doc.data(), doc.id));
          getUsers(doc.data().participants);
        });

        return events;
      })
      .catch((err) => {
        console.warn('Error getting all joined events', err);
        throw err;
      });
  },
  async getEmergencies(campus = [], permission_groups = []) {
    permission_groups.push('all');
    return db
      .collection('campuses')
      .doc(campus)
      .collection('emergencies')
      .where('visible', '==', true)
      .where(
        'permission_groups',
        'array-contains-any',
        permission_groups.slice(0, 10),
      )
      .get()
      .then((querySnapshot) => {
        const emergencies = [];
        querySnapshot.forEach((doc) =>
          emergencies.push({...doc.data(), id: doc.id}),
        );

        return emergencies;
      })
      .catch((err) => {
        console.warn('Could not get emergencies', err);
        return false;
      });
  },
  async searchEvents(campus, types = [], limit = 5, days = 7) {
    console.trace('DONT USE THIS FUNCTION');
    return db
      .collection('campuses')
      .doc(campus)
      .collection('events')
      .where('visible', '==', true)
      .where('confirmed', '==', true)
      .where('type', 'in', types)
      .where('start_ms', '>', Date.now())
      .limit(limit)
      .get()
      .then((querySnapshot) => {
        const events = [];

        querySnapshot.forEach(async (doc) => {
          events.push(await parseEventData(doc.data(), doc.id));
          getUsers(doc.data().participants);
        });

        return events.length > 0 ? events : false; // Return false if no events we're found
      })
      .catch((err) => {
        console.warn('Error searching for events', err);
        return false;
      });
  },
  async handleTagPress(tag, chosenTags = Array, rawTags = Array) {
    // This function will handle the press on tags and return which tags should be chosen

    const allChosen = chosenTags.length == rawTags.length;
    var newTags = chosenTags;
    const tagAlreadyChosen = chosenTags.includes(tag);
    const tagIsOnly = chosenTags[0] == tag && chosenTags.length == 1;

    if (tagIsOnly) newTags = rawTags;
    else if (tagAlreadyChosen && !allChosen)
      newTags = newTags.filter((elem) => elem != tag);
    else if (tagAlreadyChosen && allChosen) newTags = [tag];
    else newTags.push(tag);

    return newTags;
  },
  async getFilteredEvents(events, chosenTags) {
    return events;
  },
  async getBlogs(campusKey, permissions, user, limit = 10) {
    const readBlogs = user.read_blogs || [];
    return db
      .collection('campuses')
      .doc(campusKey)
      .collection('blogs')
      .where('permissions', 'array-contains-any', permissions.slice(0, 10))
      .where('visible', '==', true)
      .where('confirmed', '==', true)
      .orderBy('start_ms', 'desc')
      .limit(limit)
      .get()
      .then(async (querySnapshot) => {
        var blogs = [];
        querySnapshot.forEach(async (blog) => {
          !readBlogs.includes(blog.id) &&
            blogs.push(await parseBlog(blog.data(), blog.id));
        });
        // Filter out read blogs
        return AsyncStorage.checkIfBlogsRead(blogs)
          .then((unReadBlog) => {
            return unReadBlog;
          })
          .catch(() => {
            return [];
          });
      })
      .catch((err) => {
        throw err;
      });
  },
  async getTickets(campusKey) {
    const startLower = await DateFuncs.getFutureDateMSInMinutes(30);
    return db
      .collection('campuses')
      .doc(campusKey)
      .collection('events')
      .where('visible', '==', true)
      .where('confirmed', '==', true)
      .where('start_ms', '<', startLower)
      .where(
        'participants',
        'array-contains',
        auth.currentUser !== null ? auth.currentUser.uid : 'empty',
      )
      .orderBy('start_ms')
      .get()
      .then(async (querySnapshot) => {
        const events = [];

        querySnapshot.forEach(async (doc) => {
          if (doc.data().end_ms > Date.now())
            events.push(await parseEventData(doc.data(), doc.id));
        });
        return events;
      })
      .catch((err) => {
        throw err;
      });
  },
  async searchEvent(campusKey = '', searchTerm = ' ') {
    const searchArray = searchTerm.toLowerCase().split(' ').slice(0, 10);

    return db
      .collection('campuses')
      .doc(campusKey)
      .collection('events')
      .where('search_index', 'array-contains-any', searchArray)
      .where('visible', '==', true)
      .where('confirmed', '==', true)
      .limit(8)
      .get()
      .then((querySnapshot) => {
        const events = [];

        querySnapshot.forEach(async (doc) =>
          events.push(await parseEventData(doc.data(), doc.id)),
        );

        return events;
      })
      .catch((err) => {
        throw err;
      });
  },
  async getNotificationObject(messageData, campusKey) {
    return db
      .collection('campuses')
      .doc(campusKey)
      .collection(messageData.type == 'event' ? 'events' : 'societies')
      .doc(messageData.id)
      .get()
      .then((doc) => {
        if (messageData.type == 'event')
          return parseEventData(doc.data(), doc.id);
        else return {...doc.data(), id: doc.id};
      })
      .catch((err) => {
        throw err;
      });
  },
  async getRecommendedSocieties(
    campusKey,
    campusSocieties = [],
    joinedSocieties,
    fetchedSocieties = [],
  ) {
    if (fetchedSocieties.length > 0)
      fetchedSocieties = fetchedSocieties.map((elem) => {
        return elem.id;
      });
    // Remove the joined societies from the campus societies and the societies we've already fetched
    campusSocieties = campusSocieties.filter(
      (elem) =>
        !joinedSocieties.includes(elem) && !fetchedSocieties.includes(elem),
    );
    campusSocieties = [...new Set(campusSocieties)];
    campusSocieties = await shuffle(campusSocieties).slice(0, 4);

    const returnSocieties = [];

    await Promise.all(
      campusSocieties.map(async (elem) => {
        return db
          .collection('campuses')
          .doc(campusKey)
          .collection('societies')
          .doc(elem)
          .get()
          .then(async (doc) => {
            doc.data().confirmed &&
              returnSocieties.push(await parseSocietyData(doc.data(), doc.id));
            return true;
          })
          .catch((err) => {
            // console.warn('Could not get society ' + elem, err);
            return false;
          });
      }),
    );

    return returnSocieties;
  },
  async getBubbleInfo(bubble) {
    return db
      .collection('bubbles')
      .doc(bubble)
      .get()
      .then((doc) => {
        return parseMessageThread(doc.data(), doc.id);
      })
      .catch((err) => {
        throw err;
      });
  },
};

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
