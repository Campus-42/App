import {analytics, db} from '../../Firebase/Firebase';
import {parseBlog} from '../../Firebase/functions';

export const announcementFuncs = {
  getBookmarked: async function (campusKey, ids, start) {
    const announcements = [];
    var error = false;
    const length = ids.length;
    const index = length - 1 - start;

    await Promise.all(
      ids.slice(start, start + 5).map(async (id) => {
        return db
          .collection('campuses')
          .doc(campusKey)
          .collection('blogs')
          .doc(id)
          .get()
          .then(async (doc) =>
            announcements.push(await parseBlog(doc.data(), doc.id)),
          )
          .catch((err) => {
            error = true;
            analytics.error(err);
          });
      }),
    );
    return {announcements: announcements, error: error};
  },
};
