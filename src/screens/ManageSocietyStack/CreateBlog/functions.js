import {block} from 'react-native-reanimated';
import {Campus} from '../../../assets/Campus';
import {db, auth} from '../../../assets/Firebase/Firebase';
import {
  parseBlog,
  parseEventData,
  uploadImage,
} from '../../../assets/Firebase/functions';
import {Validations} from '../../../assets/Validations/functions';

export const Funcs = {
  getEvent: async function (campusKey, eventID) {
    return db
      .collection('campuses')
      .doc(campusKey)
      .collection('events')
      .doc(eventID)
      .get()
      .then(async (doc) => {
        const event = await parseEventData(doc.data(), doc.id);
        return event;
      })
      .catch((err) => {
        throw err;
      });
  },
  searchEvent: async function (searchTerm, campusKey, societyID) {
    const arr = searchTerm.toLowerCase().split(' ');

    return db
      .collection('campuses')
      .doc(campusKey)
      .collection('events')
      .where('visible', '==', true)
      .where('confirmed', '==', true)
      .where('search_index', 'array-contains-any', arr.slice(0,10))
      .get()
      .then(async (querySnapshot) => {
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
  createBlog: async function (
    campusKey = String,
    societyID = String,
    societyName = String,
    presidentID = String,
    blogContent = Array,
  ) {
    const data = {
      society_id: societyID,
      society_name: societyName,
      blog_content: blogContent,
      search_index: societyName.toLowerCase().split(' '),
      start_ms: Date.now(),
      confirmed: false,
      visible: true,
      permissions: [`society_${societyID}`],
      members: [],
      president: presidentID,
      edit_log: [
        {
          date: new Date(),
          uid: auth.currentUser !== null ? auth.currentUser.uid : 'empty',
          action: 'create',
        },
      ],
    };
    const firstDoc = await db
      .collection('campuses')
      .doc(campusKey)
      .collection('blogs')
      .add(data)
      .then((doc) => {
        console.log('Created first doc');
        return {id: doc.id, created: true};
      })
      .catch((err) => {
        console.warn('ERROR, Could not create the first blog doc', err);
        return {created: false, err: err};
      });

    if (firstDoc.created) {
      var imageCounter = 0;

      await new Promise(async (res, rej) => {
        console.log('Started promise');

        await blogContent.map(async (e, index) => {
          if (e.type == 'Image') {
            const storagePath = [
              'campuses',
              campusKey,
              'blogs',
              `${firstDoc.id}_image_${imageCounter}`,
            ];

            const response = await uploadImage(storagePath, e.value, 'preview');
            console.log('upload res', response);
            if (response.error) rej('Could not upload images');
            else {
              data.blog_content[index].value = response.uri;
            }
            imageCounter++;
          }
          if (index == blogContent.length - 1) res();
        });
      });

      return db
        .collection('campuses')
        .doc(campusKey)
        .collection('blogs')
        .doc(firstDoc.id)
        .update({blog_content: data.blog_content})
        .then(() => {
          return true;
        })
        .catch((err) => {
          throw err;
        });
    } else {
      throw firstDoc.err;
    }
  },
  validateBlog: async function (blogContent = []) {
    return Promise.all(
      blogContent.map((elem) => {
        if (elem.type === 'Text' || elem.type === 'Heading')
          return Validations.validateText(elem.value, null, 5);
        else if (elem.type === 'Image')
          return Validations.validateImage(elem.value);
        else if (elem.type === 'Event') return false;
        // Should we validate by fetching the event again?
        else return false;
      }),
    );
  },
  placeHeadingFirst: function (content) {
    /**
     * Make sure that the heading is the first element and that it cannot be changed
     */

    return content.sort((a, b) => {
      return a.start === b.start || false ? 0 : a.start ? -1 : 1;
    });
  },
  fetchBlog: async function (blogId, campusKey) {
    return db
      .collection('campuses')
      .doc(campusKey)
      .collection('blogs')
      .doc(blogId)
      .get()
      .then((doc) => {
        return parseBlog(doc.data(), doc.id);
      })
      .catch((err) => {
        throw err;
      });
  },
};
