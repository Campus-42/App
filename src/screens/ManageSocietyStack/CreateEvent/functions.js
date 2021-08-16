import {db, storage, auth} from '../../../assets/Firebase/Firebase';
import {GOOGLE_GENERAL_API_KEY} from '../../../assets/credentials/api_keys';
import {uploadImage} from '../../../assets/Firebase/functions';
import {Validations} from '../../../assets/Validations/functions';
import {DateFuncs} from '../../../assets/Date';
import {Campus} from '../../../assets/Campus';
import {analytics} from '../../../assets/Analytics';

export async function createEvent(
  event = Object,
  campusKey = String,
  societyID = String,
  presidentID = String,
  societyName = String,
) {
  const search_index = await Campus.Funcs.server.createSearchIndex(event);

  // The data to upload. Images will be uploaded later
  const data = {
    title: event.title,
    date: {start: event.date.start, end: event.date.end},
    start_ms: event.date.start.getTime(),
    end_ms: event.date.end.getTime(),
    description: event.description,
    society_id: societyID,
    society_name: societyName,
    location: event.location,
    origin_event: event.repeat.doesRepeat ? event.id : null,
    next_event_ms: event.repeat.doesRepeat
      ? await DateFuncs.getFutureDateMSInDays(
          event.repeat.interval,
          event.date.start,
        )
      : null,
    tags: event.tags,
    pricing: event.pricing,
    participants: event.participants,
    link: event.link,
    number_of_participants: 0,
    images: {preview: '', background: ''},
    repeat: event.repeat,
    president: presidentID,
    confirmed: false,
    visible: true,
    search_index: search_index,
    edit_log: [
      {
        date: new Date(),
        uid: auth.currentUser !== null ? auth.currentUser.uid : 'empty',
        action: 'create',
      },
    ], // Keep log when something was done and by whom
  };
  // The ref to where we're uploading the event on firestore
  const docRef = db.collection('campuses').doc(campusKey).collection('events');

  const firstDoc = await docRef
    .add(data)
    .then((doc) => {
      return {id: doc.id, created: true};
    })
    .catch((err) => {
      console.warn('Could not create event', err);
      analytics.error(
        err,
        'CreateEvent/functions.js',
        'createEvent()/firstDoc',
      );
      return {id: '', created: false};
    });

  if (firstDoc.created) {
    // Upload the images and await their uri
    const preview = await uploadImage(
      ['campuses', campusKey, 'events', `${firstDoc.id}_preview`],
      event.images.preview,
      'preview',
    );
    const background = await uploadImage(
      ['campuses', campusKey, 'events', `${firstDoc.id}_background`],
      event.images.background,
      'background',
    );
    if (preview.uploaded && background.uploaded) {
      const images = {preview: preview.uri, background: background.uri};
      // Upload image uris
      return docRef
        .doc(firstDoc.id)
        .update({images: images})
        .then(() => {
          console.log('Successfully updated the event with the new images');
          return true;
        })
        .catch((err) => {
          analytics.error(
            err,
            'CreateEvent/functions.js',
            'createEvent()/secondUpload',
          );
          console.warn('Could not upload the image uris to event', err);

          throw err;
        });
    } else {
      throw {msg: 'Could not create event'};
    }

    // When we have the uri we will update the newly created event on firebase
  } else {
    throw {msg: 'Could not create event'};
  }
}

export async function searchPlace(string = String) {
  const url = `https://maps.googleapis.com/maps/api/place/findplacefromtext/json?input=${string}&inputtype=textquery&language=en&fields=formatted_address,name,geometry&key=${GOOGLE_GENERAL_API_KEY}`;

  return fetch(url)
    .then((response) => response.json())
    .then((json) => {
      // return json.movies;
      console.log(json);
      return {status: json.status, data: json.candidates};
    })
    .catch((error) => {
      console.warn(error);
      return {status: json.status};
    });
}

export async function validateEvent(event) {
  /**
   * Create a new object and validate each child
   * Return object and if one is wrong get appropriate error texts
   */
  return {
    title: await Validations.validateText(event.title, null, 5),
    pricing: event.pricing.show
      ? await Validations.validateNumber(event.pricing.price, null, 0)
      : false,
    tags: await Validations.validateTags(event.tags),
    description: await Validations.validateText(event.description, null, 50),
    link: event.link.show
      ? await Validations.validateUrl(event.link.url)
      : false,
    repeat: await Validations.validateNumber(event.repeat.interval),
    location:
      event.location.show &&
      (await Validations.validateLocation(event.location)),
    images_preview: await Validations.validateImage(event.images.preview),
    images_background: await Validations.validateImage(event.images.background),
  };
}
