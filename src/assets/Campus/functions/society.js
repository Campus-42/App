import {analytics} from '../../Analytics';
import {auth, db, functions} from '../../Firebase/Firebase';
import {parseSocietyData, uploadImage} from '../../Firebase/functions';
import {serverFuncs} from './server';

export const societyFuncs = {
  searchSocieties: async function (campusKey, search, limit = 5) {
    const arr = search.toLowerCase().split(' ');
    return db
      .collection('campuses')
      .doc(campusKey)
      .collection('societies')
      .where('search_index', 'array-contains-any', arr.slice(0, 10))
      .where('confirmed', '==', true)
      .where('visible', '==', true)
      .limit(limit)
      .get()
      .then(async (querySnapShot) => {
        const societies = [];

        querySnapShot.forEach(async (elem) =>
          societies.push(await parseSocietyData(elem.data(), elem.id)),
        );

        return societies;
      })
      .catch((err) => {
        throw err;
      });
  },
  getBookmarked: async function (campusKey, ids, start) {
    const societies = [];
    var error = false;

    await Promise.all(
      ids.slice(start, start + 5).map(async (id) => {
        return db
          .collection('campuses')
          .doc(campusKey)
          .collection('societies')
          .doc(id)
          .get()
          .then(async (doc) =>
            societies.push(await parseSocietyData(doc.data(), doc.id)),
          )
          .catch((err) => {
            error = true;
            analytics.error(err);
          });
      }),
    );

    return {societies: societies, error: error};
  },
  updateMembershipStatus: async function (
    campusKey,
    societyId,
    societyBubble,
    isJoining = false,
    userInfo,
  ) {
    analytics.breadcrumb(
      `updateMembershipStatus isJoining=${isJoining} societyId=${societyId} campusKey=${campusKey}`,
      'CampusFuncs',
      'updateMembershipStatus',
    );
    return functions
      .httpsCallable('handleSocietyMembershipChange')({
        campusKey,
        societyId,
        societyBubble,
        isJoining,
        userInfo,
      })
      .then(({data}) => {
        console.log('Society membership status', data);
        if (!data.successful) throw new Error('Unsuccessful membership status');
        return data;
      })
      .catch((err) => {
        console.warn(err);
        analytics.error(err, 'CampusFuncs', 'updateMembershipStatus');
        throw err;
      });
  },
  updateSociety: async function (campusKey, society) {
    /**
     * Update the society or create if it
     * there is no id passed.
     */
    var id = society.id;
    var creatingSociety = !society.id;

    if (creatingSociety) {
      /**
       * If there is no ID, then a new doc
       * will be created on the database and
       * set an id for the society
       */
      await new Promise((resolve) =>
        db
          .collection('campuses')
          .doc(campusKey)
          .collection('societies')
          .add({
            posted_by: auth.currentUser.uid,
            posted_date: new Date(),
          })
          .then((doc) => {
            id = doc.id;
            return doc.id;
          })
          .catch((err) => {
            throw err;
          })
          .finally(resolve),
      );
      console.log('Society had no ID, a new ID was created:', id);
    }

    /**
     * Create the data to update
     */
    const data = {
      id,
      images: {
        logo: society.logo || '',
        background: society.background || false,
      },
      name: society.name.trim(),
      exec_members: Object.values(society.exec_roles),
      exec_roles: society.exec_roles,
      description: society.description.trim(),
      link: society.link,
      search_index: await serverFuncs.createSearchIndex(society),
      memberships: society.memberships,
      society_bubble: society.society_bubble,
    };

    if (creatingSociety) {
      data.review_logs = [
        {
          action: 'awaiting',
          message:
            "Your society application is awaiting approval from your Students' Union. We will let you know when the status updates",
          timestamp: new Date(),
          uid: auth.currentUser.uid,
        },
      ];
      data.visible = false;
      data.confirmed = false;
      data.members = Object.values(society.exec_roles);
    }

    /**
     * Update the images for the society
     */
    const logoUpload = await uploadImage(
      ['campuses', campusKey, 'societies', `${id}_logo`],
      society.images.logo,
    );
    data.images.logo = logoUpload.uri;
    console.log("Updated society's logo image", logoUpload.uri);

    if (society.images.background) {
      /**
       * If the society has a background image
       * then a background image will be uploaded
       */
      const backgroundUpload = await uploadImage(
        ['campuses', campusKey, 'societies', `${id}_background`],
        society.images.background,
      );
      data.images.background = backgroundUpload.uri;
      console.log("Updated society's background image", backgroundUpload.uri);
    }

    console.log('Updating society: ' + id, data);
    return functions.httpsCallable('updateSociety')({
      society: data,
      campusKey,
      creatingSociety,
    });
  },
};
