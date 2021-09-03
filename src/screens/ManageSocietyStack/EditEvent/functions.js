import {uploadImage} from '../../../assets/Firebase/functions';
import {db, auth} from '../../../assets/Firebase/Firebase';
import {DateFuncs} from '../../../assets/Date';
import {Campus} from '../../../assets/Campus';

export const Funcs = {
  updatEvent: async function (event, prevEvent, campusKey) {
    // Compare image uris and if it has changed uplaod new images
    var preview = event.images.preview;
    var background = event.images.background;

    if (event.images.preview !== prevEvent.images.preview) {
      const img = await uploadImage(
        ['campuses', campusKey, 'events', `${event.id}_preview`],
        event.images.preview,
        'preview',
      );
      preview = img.uri;
    }
    if (event.images.background !== prevEvent.images.background) {
      const img = await uploadImage(
        ['campuses', campusKey, 'events', `${event.id}_background`],
        event.images.background,
        'background',
      );
      background = img.uri;
    }

    // Update edit log
    const edit_log = event.edit_log;
    edit_log.push({
      date: new Date(),
      uid: auth.currentUser !== null ? auth.currentUser.uid : 'empty',
      action: 'update',
    });

    const search_index = await Campus.Funcs.server.createSearchIndex(event);
    // The data to upload. Images will be uploaded later
    const data = {
      title: event.title,
      date: {start: event.date.start, end: event.date.end},
      start_ms: event.date.start.getTime(),
      end_ms: event.date.end.getTime(),
      description: event.description,
      society_id: event.society_id,
      location: event.location,
      tags: event.tags,
      pricing: event.pricing,
      link: event.link,
      participants: event.participants,
      number_of_participants: 0,
      images: {preview: preview, background: background},
      repeat: event.repeat,
      origin_event: event.repeat.doesRepeat ? event.id : null,
      next_event_ms: event.repeat.doesRepeat
        ? await DateFuncs.getFutureDateMSInDays(
            event.repeat.interval,
            event.date.start,
          )
        : null,
      president: event.president,
      confirmed: false,
      visible: true,
      search_index: search_index,
      edit_log: edit_log, // Keep log when something was done and by whom
    };

    return db
      .collection('campuses')
      .doc(campusKey)
      .collection('events')
      .doc(event.id)
      .update(data)
      .then(() => {
        console.log(`Successfully updated event ${event.id}`);
        return true;
      })
      .catch((err) => {
        console.warn('Could not update event', err);
        throw err;
      });
  },
  deleteEvent: async function (campusKey, event) {
    event.edit_log.push({
      uid: auth.currentUser !== null ? auth.currentUser.uid : 'empty',
      action: 'delete',
      date: new Date(),
    });
    return db
      .collection('campuses')
      .doc(campusKey)
      .collection('events')
      .doc(event.id)
      .update({
        edit_log: event.edit_log,
        confirmed: false,
      })
      .then(() => {
        return;
      })
      .catch((err) => {
        throw err;
      });
  },
};
