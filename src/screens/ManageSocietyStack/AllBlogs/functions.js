import {db} from '../../../assets/Firebase/Firebase';
import {parseBlog} from '../../../assets/Firebase/functions';

export const AllBlogsFuncs = {
  getBlogs: async function (campusKey, societyID) {
    return db
      .collection('campuses')
      .doc(campusKey)
      .collection('blogs')
      .where('society_id', '==', societyID)
      .where('confirmed', '==', true)
      .where('visible', '==', true)
      .get()
      .then((querySnapShot) => {
        const blogs = [];
        querySnapShot.forEach(async (blog) =>
          blogs.push(await parseBlog(blog.data(), blog.id)),
        );
        return blogs;
      })
      .catch((err) => {
        console.log('Could not get blogs for society', err);
        throw err;
      });
  },
};
