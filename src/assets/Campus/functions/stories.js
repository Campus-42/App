import { analytics } from "../../Analytics";
import { db, functions, messaging } from "../../Firebase/Firebase";
import {
  parseStoryData,
  uploadImage,
  uploadVideo,
} from "../../Firebase/functions";
import RNFS from "react-native-fs";

export const storiesFuncs = {
  uploadStories: async function (graphics, campusKey, storiesId) {
    /**
     * Upload the files by creating a uuid for them
     * and them uploading them to cloud storage. Followed
     * by creating a doc for them.
     */

    // Create the docs info
    const deviceToken = await messaging.getToken();
    const successfulUploads = [];

    // Get info and upload to storage
    await new Promise((resolve, reject) => {
      graphics.forEach(async (graphic, index) => {
        // Make uuid
        const timestamp = new Date();
        const uuid = `${index}-${timestamp.getTime()}-${deviceToken}`; // Truly unique
        const data = {
          ...graphic,
          uuid,
          timestamp,
          timestamp_ms: timestamp.getTime(),
        };

        await this._uploadIndividualStory(data, campusKey, storiesId);
        successfulUploads.push(data);

        if (index === graphics.length - 1) setTimeout(resolve, 350);
      });
    });

    return functions.httpsCallable("updateStoriesDoc")({
      graphic: successfulUploads.slice(0, -1)[0],
      storiesId,
      campusKey,
    });
  },
  _uploadIndividualStory: async function (graphic, campusKey, storiesId) {
    const paths = [
      "campuses",
      campusKey,
      "stories-",
      storiesId,
      "graphics",
      graphic.uuid,
    ];

    var upload;
    if (graphic.type === "image")
      upload = await uploadImage(paths, graphic.uri);
    else if (graphic.type === "video")
      upload = await uploadVideo(paths, graphic.uri);
    graphic.uri = upload.uri; // Update the uri

    const doc = await functions.httpsCallable("uploadIndividualStory")({
      graphic,
      campusKey,
      storiesId,
    });

    return { doc, upload, successful: true };
  },
  getLatestStories: async function (
    campusKey,
    latestDoc = false,
    limit = false
  ) {
    var ref = db
      .collection("campuses")
      .doc(campusKey)
      .collection("stories")
      .orderBy("latest_timestamp_ms", "desc");

    if (latestDoc) ref = ref.startAfter([latestDoc.latest_timestamp_ms]);
    if (limit) ref = ref.limit(limit);

    return ref
      .get()
      .then(async (querySnapShot) => {
        const docs = [];
        querySnapShot.forEach((doc) => {
          docs.push({ ...doc.data(), id: doc.id });
        });
        return docs;
      })
      .catch((err) => {
        analytics.err(err, "CampusFuncs/Stories", "getLatestStories");
        throw err;
      });
  },
  cacheGraphics: async function (graphics) {
    /**
     * Save the files to a local file
     */
    const savedFiles = {}; // Keys are graphic id
    await new Promise((resolve) => {
      graphics.forEach(async (g, index) => {
        const fetched = await fetch(g.uri);
      });
    });
  },
};
