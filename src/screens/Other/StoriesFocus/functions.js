import { analytics } from "../../../assets/Analytics";
import { db } from "../../../assets/Firebase/Firebase";
import { parseStoryData } from "../../../assets/Firebase/functions";

export const StoriesFocusFuncs = {
  getStoryGraphics: async function (campusKey, storyId, latestDoc) {
    /**
     * Get the graphics for a story.
     * And if a latest doc is passed,
     * then it will start at its timestamp.
     */
    var ref = db
      .collection("campuses")
      .doc(campusKey)
      .collection("stories")
      .doc(storyId)
      .collection("graphics")
      .orderBy("timestamp_ms")

    if (latestDoc) ref = ref.startAfter(latestDoc.timestamp_ms);

    return ref
      .get()
      .then((querySnapShot) => {
        const graphics = [];
        
        querySnapShot.forEach(async (doc, index) => {
          graphics.push(await parseStoryData(doc.data(), doc.id));
        });

        return graphics;
      })
      .catch((err) => {
        analytics.error(err, "StoriesFocus/Funcs", "getStoryGraphics");
        throw err;
      });
  },
  getStoryAuthor: async function (campusKey, storyId) {
    return db
      .collection("campuses")
      .doc(campusKey)
      .collection("stories")
      .doc(storyId)
      .get()
      .then((doc) => {
        return { ...doc.data(), id: doc.id };
      })
      .catch((err) => {
        analytics.error(err, "StoriesFocus/Funcs", "getStoryAuthor");
        throw err;
      });
  },
};
