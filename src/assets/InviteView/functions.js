import { db, auth } from "../Firebase/Firebase";
import { getUserInfoForUID } from "../Firebase/functions";
import { DateFuncs } from "../Date";
import { bubbleFuncs } from "../Campus/functions/bubble";
import { MessageFuncs } from "../../screens/Bubbles/Bubbles/functions";
import { Campus } from "../Campus";

export const InviteFuncs = {
  search: async function (search, campus_key) {
    const arr = search.toLowerCase().split(" ");
    return db
      .collection("users")
      .where("campus", "==", campus_key)
      .where("search_index", "array-contains-any", arr.slice(0, 10))
      .get()
      .then((querySnapShot) => {
        const users = [];
        querySnapShot.forEach((elem) => {
          elem.id !== auth.currentUser.uid &&
            users.push({ ...elem.data(), uid: elem.id });
        });
        return users;
      })
      .catch((err) => {
        throw err;
      });
  },
  invite: async function (
    sender,
    receiver,
    objName,
    type = "event" || "society",
    senderType = "user" || "society",
    campusKey,
    date,
    image,
    objId,
    obj
  ) {
    /**
     * Receives the info for event/society and necessary user info
     */

    console.log(arguments);

    const tags = type === "event" ? obj.tags : [];
    const event_end_date = type == "event" ? obj.date.end : new Date();
    const members =
      type == "society"
        ? obj.members.length
        : type == "bubble"
        ? obj.member_uids
        : obj.participants.length;

    const points = Campus.Constants.Points.getPointEvent("confirmedInvitation");

    return db
      .collection("campuses")
      .doc(campusKey)
      .collection("invites")
      .add({
        type: type,
        sender: auth.currentUser.uid,
        sender_name: `${sender.first_name} ${sender.last_name}`,
        receiver: receiver.uid,
        sender_type: senderType,
        obj_name: objName,
        create_date: Date.now(),
        date: date,
        valid_until: await DateFuncs.getFutureDateMSInDays(14),
        search_index: [receiver.uid, auth.currentUser.uid],
        image: image,
        obj_id: objId,
        points,
        claimed: false,
        event_tags: tags,
        event_end_date: event_end_date,
        members: members,
        visible: true,
      })
      .then((doc) => {
        __DEV__ && alert("Yes");
        console.log("Created new invite", doc.id);
        if (type == "bubble") {
          MessageFuncs.sendBubbleSystemMessage(
            objId,
            `${sender.first_name} ${sender.last_name} invited ${receiver.first_name} ${receiver.last_name}`,
            obj
          );
        }
      })

      .catch((err) => {
        __DEV__ && alert("No");
        console.warn("Could not create invite", err);
        setError(true);
      });
  },
  getSuggestions: async function (campusKey) {
    return db
      .collection("campuses")
      .doc(campusKey)
      .collection("invites")
      .where("visible", "==", true)
      .where("search_index", "array-contains", auth.currentUser.uid)
      .orderBy("create_date", "desc")
      .limit(10)
      .get()
      .then(async (querySnapShot) => {
        var users = [];
        querySnapShot.forEach(async (elem) => {
          const otherUser = elem
            .data()
            .search_index.filter((elem) => elem !== auth.currentUser.uid);
          if (
            otherUser[0] !== undefined &&
            otherUser[0] !== auth.currentUser.uid
          )
            users.push(otherUser[0]);
        });

        users = [...new Set(users)];
        const suggestions = await Promise.all(
          users.map(async (uid) => {
            return getUserInfoForUID(uid)
              .then((data) => {
                return data;
              })
              .catch((err) => console.warn("Could not get user info", err));
          })
        );

        return suggestions.filter(
          (elem) => elem !== undefined && Object.keys(elem).length > 5
        );
      })
      .catch((err) => {
        throw err;
      });
  },
  getFilteredSuggestions: async function (invitees, rawSuggestions) {
    const newSuggestions = rawSuggestions.filter(
      (elem1) => !invitees.some((elem2) => elem1.uid === elem2.uid)
    );
    return newSuggestions;
  },
  getAlreadyInvited: async function (campusKey, type, objID) {
    return db
      .collection("campuses")
      .doc(campusKey)
      .collection("invites")
      .where("obj_id", "==", objID)
      .where("visible", "==", true)
      .where("type", "==", type)
      .get()
      .then((querySnapShot) => {
        const uids = [];
        querySnapShot.forEach((elem) => uids.push(elem.data().receiver));
        return uids;
      })
      .catch((err) => {
        throw err;
      });
  },
};
