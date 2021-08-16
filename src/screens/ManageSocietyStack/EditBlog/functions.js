import {auth, db} from '../../../assets/Firebase/Firebase';
import {uploadImage} from '../../../assets/Firebase/functions';

export const EditBlogFuncs = {
  updateBlog: async function (campusKey = String, blog = Object) {
    console.log('Uploading images');

    try {
      const data = {
        society_id: blog.society_id,
        society_name: blog.society_name,
        blog_content: blog.blog_content,
        start_ms: blog.start_ms,
        confirmed: false,
        visible: true,
        permissions: blog.permissions,
        president: blog.president,
        edit_log: blog.edit_log.concat({
          date: new Date(),
          uid: auth.currentUser !== null ? auth.currentUser.uid : 'empty',
          action: 'update',
        }),
      };

      await new Promise(async (res, rej) => {
        console.log('Started promise');

        await data.blog_content.map(async (e, index) => {
          if (e.type == 'Image') {
            const storagePath = [
              'campuses',
              campusKey,
              'blogs',
              `${blog.id}_image_${index}`,
            ];

            const response = await uploadImage(storagePath, e.value, 'preview');
            console.log('upload res', response);
            if (response.error) rej('Could not upload images');
            else {
              data.blog_content[index].value = response.uri;
            }
          }
          if (index == data.blog_content.length - 1) res();
        });
      });
      return db
        .collection('campuses')
        .doc(campusKey)
        .collection('blogs')
        .doc(blog.id)
        .update(data)
        .then(() => {
          return;
        })
        .catch((err) => {
          throw err;
        });
    } catch (err) {
      throw err;
    }
  },
  deleteBlog: async function (campusKey, blog) {
    return db
      .collection('campuses')
      .doc(campusKey)
      .collection('blogs')
      .doc(blog.id)
      .update({
        confirmed: false,
        edit_log: (blog.edit_log || []).concat({
          date: new Date(),
          uid: auth.currentUser !== null ? auth.currentUser.uid : 'empty',
          action: 'delete',
        }),
      })
      .then(() => {
        return;
      })
      .catch((err) => {
        throw err;
      });
  },
};
