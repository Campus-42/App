import {auth, db} from '../../Firebase/Firebase';
import {
  parseEventData,
  parseMessageThread,
  parseSocietyData,
} from '../../Firebase/functions';
import {Store} from '../../redux/store';

export const inviteFuncs = {
  claimInvitation: async function (
    campusKey,
    invitationID,
    reduxInvitations = false,
  ) {
    /**
     * Claim the invitation and return whether it worked or not
     * This function will also update the redux invitation ids if passsed
     */
    return db
      .collection('campuses')
      .doc(campusKey)
      .collection('invites')
      .doc(invitationID)
      .update({
        claimed: true,
      })
      .then(() => {
        if (reduxInvitations)
          Store.dispatch({
            type: 'UPDATE_INVITATION_IDS',
            payload: reduxInvitations.filter((inv) => inv !== invitationID),
          });
      })
      .then(() => {
        console.log('Successfully claimed invitation', invitationID);
        return {
          timestamp: Date.now(),
          claimed: true,
        };
      })
      .catch((err) => {
        throw err;
      });
  },
  getInvitations: async function (
    campusKey,
    callback = () => {},
    latestDoc = false,
    limit = 4,
    onlyGetUnclaimed = true,
  ) {
    const uid = (auth.currentUser || {}).uid;
    var ref = db
      .collection('campuses')
      .doc(campusKey)
      .collection('invites')
      .where('create_date', '<=', Date.now());

    if (onlyGetUnclaimed) ref = ref.where('claimed', '==', false);

    ref = ref
      .where('visible', '==', true)
      .where('receiver', '==', uid)
      .orderBy('create_date', 'desc');

    if (!onlyGetUnclaimed) ref = ref.orderBy('claimed', 'desc');

    if (latestDoc)
      ref = ref.startAfter([latestDoc.claimed, latestDoc.create_date]);

    return ref
      .limit(limit)
      .get()
      .then(async (querySnapShot) => {
        const inviteIds = [];
        const inviteObjects = [];

        // await new Promise.all(async (resolve, reject) => {
        querySnapShot.forEach(async (doc, index) => {
          const {shouldClaimInvite, obj} = await inviteFuncs.getInviteObj(
            campusKey,
            doc.data().obj_id,
            doc.data().type,
          );
          if (!shouldClaimInvite || onlyGetUnclaimed == false) {
            !shouldClaimInvite && inviteIds.push(doc.id);
            inviteObjects.push({
              invite: {...doc.data(), id: doc.id},
              obj: obj,
            });
          } else inviteFuncs.claimInvitation(campusKey, doc.id);

          if (index == querySnapShot.size - 1) {
            Store.dispatch({
              type: 'UPDATE_INVITATION_IDS',
              payload: inviteIds,
            });
            callback(inviteObjects);
          }
        });
      })
      .catch((err) => {
        throw err;
      });
  },
  getInviteObj: async function (campusKey, id, type) {
    const uid = auth.currentUser !== null ? auth.currentUser.uid : '-';
    var ref = db
      .collection('campuses')
      .doc(campusKey)
      .collection(type === 'event' ? 'events' : 'societies')
      .doc(id);

    // Change if it is bubble
    if (type == 'bubble') ref = db.collection('bubbles').doc(id);

    return ref
      .get()
      .then(async (doc) => {
        var data = {};
        if (type == 'event') data = await parseEventData(doc.data(), doc.id);
        else if (type == 'society')
          data = await parseSocietyData(doc.data(), doc.id);
        else if (type == 'bubble')
          data = await parseMessageThread(doc.data(), doc.id);
        else
          throw new Error(
            "Passed type was not accepted as 'society', 'bubble' or 'event'",
          );

        if (
          (data.participants || data.members || data.member_uids).includes(uid)
        )
          return {shouldClaimInvite: true, obj: data};
        else return {shouldClaimInvite: false, obj: data};
      })
      .catch((err) => {
        console.trace('[Error] getInviteObj', err);
      });
  },
};
