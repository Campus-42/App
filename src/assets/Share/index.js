import React from 'react';
import {Share} from 'react-native';
import {functions} from '../Firebase/Firebase';

async function extractInviteType(type, name) {
  switch (type) {
    case 'society':
      return name;
    case 'event':
      return `the event ${name}`;
    case 'society exec':
      return `be a society executive of ${name}`;
    default:
      return 'Campus42';
  }
}

export async function sendAppInvite(
  sender = {first_name: '', uid: ''} /** The user who sends the invite */,
  type = 'app' /** Can be app | society | invite | society exec */,
  objName = '' /** The event/society name */,
  objID = '' /** Event or society id */,
  campus = {key: '', externalInvitePoints: 0},
) {
  /** The endpoint link that shows the app store buttons */
  const link = 'https://campus42.firebaseapp.com/';

  /** Extract what string should be filled in depending on the type */
  //   const typeString = await extractInviteType(type, name);

  /** The final string to include in the actual invite */
  const string = `${sender.first_name} has invited you to the connected campus on Campus42.\n\nDownload the app and earn ${campus.externalInvitePoints} points 🤩 and see what's happening on your campus today!\n${link}`;

  /** Share the text to some endpoint */
  const share = await Share.share({
    message: string,
    title: 'Campus42 invite',
  });

  /** Handle the share result */
  console.log('Share result', share);
  try {
    if (share.action == Share.sharedAction) {
      functions
        .httpsCallable('handleAppInvite')({
          campus_key: campus.key,
          invite_type: type,
          obj_id: objID,
          share_type: share.activityType,
          sender: sender.uid,
        })
        .then((res) => console.log('Created app invite on firebase:\n', res))
        .catch((err) =>
          console.warn('Could not create firebase app invite:\n', err),
        );
    } else if (share.action == Share.dismissedAction) {
      // Dismissed
    }
  } catch (err) {
    console.warn('Could not check share result', err);
  }
}
