import {db, auth} from '../../../assets/Firebase/Firebase';
import {parseSocietyData} from '../../../assets/Firebase/functions';

export const JoinedSocietyFuncs = {
  getSocieties: async function (campusKey, lastDoc = {}) {
    return db
      .collection('campuses')
      .doc(campusKey)
      .collection('societies')
      .where(
        'members',
        'array-contains',
        auth.currentUser !== null ? auth.currentUser.uid : 'empty',
      )
      .where('visible', '==', true)
      .where('confirmed', '==', true)

      .get()
      .then((querySnapShot) => {
        const societies = [];
        querySnapShot.forEach((elem) =>
          societies.push(parseSocietyData(elem.data(), elem.id)),
        );
        return societies;
      })
      .catch((err) => {
        throw err;
      });
  },
  searchSocieties: async function (campusKey, search) {
    const arr = search.toLowerCase().split(' ');
    return db
      .collection('campuses')
      .doc(campusKey)
      .collection('societies')
      .where('search_index', 'array-contains-any', arr.slice(0, 10))
      .where('confirmed', '==', true)
      .where('visible', '==', true)
      .get()
      .then((querySnapShot) => {
        const societies = [];
        querySnapShot.forEach((elem) =>
          societies.push({...elem.data(), id: elem.id}),
        );
        return societies;
      })
      .catch((err) => {
        throw err;
      });
  },
  async getRecommendedSocieties(
    campusKey,
    campusSocieties = [],
    permissions,
    fetchedSocieties = [],
  ) {
    // Get all the joined societies
    var joinedSocieties = permissions.map((elem = '') => {
      if (elem.startsWith('society_')) {
        return elem.split('society_')[1];
      } else {
        return null;
      }
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
          .then((doc) => {
            doc.data().confirmed &&
              doc.data().visible &&
              returnSocieties.push({...doc.data(), id: doc.id});
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
  async getSubmittedSocieties(campusKey) {
    return db
      .collection('campuses')
      .doc(campusKey)
      .collection('societies')
      .where('posted_by', '==', auth.currentUser.uid)
      .where('confirmed', '==', false)
      .get()
      .then((querySnapShot) => {
        const societies = [];
        querySnapShot.forEach((doc) =>
          societies.push({...doc.data(), id: doc.id}),
        );
        return societies;
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
