import {analytics} from '../../Analytics';
import {db} from '../../Firebase/Firebase';
import {parseBlog} from '../../Firebase/functions';

export const blogFuncs = {
  getBlog: async function (blogId, campusKey) {
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
        analytics.error(err, 'blogFuncs.js', 'getBlog()');
        throw err;
      });
  },
};
