import {Alert, Linking} from 'react-native';
import {db, auth} from '../../../assets/Firebase/Firebase';
import {
  getUserInfoForUID,
  uploadImage,
} from '../../../assets/Firebase/functions';
import {Validations} from '../../../assets/Validations/functions';
import {isEmailDomainValid} from '../../Authorization/CreateAccount';
import {sendAppInvite} from '../../../assets/Share';
import {Campus} from '../../../assets/Campus';

export const CreateSocietyFuncs = {
  showWhatsAppLinkInfo: function () {
    Alert.alert(
      'WhatsApp Link',
      'In order for users to chat with your society, there should be a whatsapp link to your society whatsapp chat.\n\nWhen a student has any questions regarding your society they will be able to reach you more easily.\n\nTip: Create a new chat for prospective members.',
      [
        {
          text: 'Show more info',
          onPress: () => {
            Linking.openURL(
              'https://faq.whatsapp.com/android/chats/how-to-create-and-invite-into-a-group/',
            );
          },
        },
        {text: 'Ok'},
      ],
    );
  },
  createSociety: async function (campusKey, society) {
    // Clean and assign executive roles
    const execRoles = {};
    Object.entries(society.exec_roles).map((elem) => {
      if (Object.keys(elem).length !== 0) execRoles[elem[0]] = elem[1].uid;
      else execRoles[elem[0]] = '';
    });

    const search_index = await Campus.Funcs.server.createSearchIndex(society);
    const data = {
      images: {
        logo: '',
        background: '',
      },
      name: society.name,
      pricing: society.pricing,
      members: society.exec_members.filter((elem) => elem != ''),
      description: society.description,
      exec_members: society.exec_members.filter((elem) => elem != ''),
      exec_roles: execRoles,
      whatsapp_link: society.whatsapp_link,
      link: {show: society.link.show, url: society.link.url},
      posted_date: Date.now(),
      posted_by: auth.currentUser !== null ? auth.currentUser.uid : 'empty',
      review_logs: [
        {
          action: 'awaiting',
          message:
            'Your society application is waiting to be reviewed. We will let you know when the status updates',

          timestamp: new Date(),
          uid: auth.currentUser.uid,
        },
      ],
      confirmed: false, // Campus42 has to confirm society
      visible: false, // This field will be set to visible when confirmed as well, thought his field enables Campus42 to hide societies which act against policies or laws
      search_index: search_index,
    };
    const first = await db
      .collection('campuses')
      .doc(campusKey)
      .collection('societies')
      .add(data)
      .then((doc) => {
        return {created: true, id: doc.id};
      })
      .catch((err) => {
        console.log('Could not create society', err);
        return {crated: false};
      });

    if (first.created) {
      const logo = await uploadImage(
        ['campuses', campusKey, 'societies', `${first.id}_logo`],
        society.images.logo,
        'logo',
      );
      const background = await uploadImage(
        ['campuses', campusKey, 'societies', `${first.id}_background`],
        society.images.background,
      );

      return db
        .collection('campuses')
        .doc(campusKey)
        .collection('societies')
        .doc(first.id)
        .update({images: {logo: logo.uri, background: background.uri}})
        .then(() => {
          return {
            ...data,
            id: first.id,
            images: {logo: logo.uri, background: background.uri},
          };
        })
        .catch((err) => {
          throw err;
        });
    } else {
      throw {msg: 'We could not create first doc at firebase'};
    }
  },
  capitalizeEveryWord: function (string = String) {
    return string
      .replace('_', ' ')
      .split(' ')
      .map((word) => {
        return word.substring(0, 1).toUpperCase() + word.substring(1);
      })
      .join(' ');
  },
  deCapitalizeEveryWord: function (string = String) {
    return string
      .replace('_', ' ')
      .split(' ')
      .map((word) => {
        return word.substring(0, 1).toLowerCase() + word.substring(1);
      })
      .join(' ');
  },
  getExecUsers: async function (execRoles) {
    const execUsers = {};
    await Promise.all(
      Object.entries(execRoles).map(async (elem) => {
        if (elem[1] == null) execUsers[elem[0]] = {};
        else
          await getUserInfoForUID(elem[1])
            .then((user) => {
              execUsers[elem[0]] = user;
            })
            .catch((err) => {
              console.warn('Could not get exec user', err);
              execUsers[elem[0]] = {};
            });
      }),
    );
    return execUsers;
  },
  updateSociety: async function (campusKey, society, updateReview) {
    // Clean and assign executive roles
    const execRoles = {};
    Object.entries(society.exec_roles).map((elem) => {
      if (Object.keys(elem).length !== 0) execRoles[elem[0]] = elem[1].uid;
      else execRoles[elem[0]] = '';
    });
    const search_index = await Campus.Funcs.server.createSearchIndex(society);
    console.log('Update review', updateReview);
    const data = {
      images: {
        logo: '',
        background: '',
      },
      name: society.name,
      pricing: society.pricing,
      description: society.description,
      members: society.members,
      exec_members: society.exec_members.filter((elem) => elem != ''),
      exec_roles: execRoles,
      whatsapp_link: society.whatsapp_link,
      link: {show: society.link.show, url: society.link.url},
      posted_date: Date.now(),
      posted_by: auth.currentUser !== null ? auth.currentUser.uid : 'empty',
      confirmed: society.confirmed,
      search_index: search_index,
      ...(updateReview
        ? {
            review_logs: society.review_logs.concat([
              {
                action: 'awaiting',
                message:
                  'Your society application is waiting to be reviewed. We will let you know when the status updates',
                timestamp: new Date(),
                uid: auth.currentUser.uid,
              },
            ]),
          }
        : {}),
    };

    const logo = await uploadImage(
      ['campuses', campusKey, 'societies', `${society.id}_logo`],
      society.images.logo,
      'logo',
    )
      .then((res) => {
        return res;
      })
      .catch((err) => {
        throw err;
      });
    const background = await uploadImage(
      ['campuses', campusKey, 'societies', `${society.id}_background`],
      society.images.background,
    )
      .then((res) => {
        return res;
      })
      .catch((err) => {
        throw err;
      });

    return db
      .collection('campuses')
      .doc(campusKey)
      .collection('societies')
      .doc(society.id)
      .update({...data, images: {logo: logo.uri, background: background.uri}})
      .then(() => {
        console.log('Updated society');
        return {...data, images: {logo: logo.uri, background: background.uri}};
      })
      .catch((err) => {
        throw err;
      });
  },
  validateSociety: async function (society) {
    return {
      name: await Validations.validateText(society.name, null, 5),
      description: await Validations.validateText(
        society.description,
        null,
        10,
      ),
      link: society.link.show
        ? await Validations.validateUrl(society.link.url)
        : false,
      president: !society.exec_roles.president.toString().replace(/\s/g, '')
        .length
        ? 'This role is required'
        : false,
      social_secretary: !society.exec_roles.social_secretary
        .toString()
        .replace(/\s/g, '').length
        ? 'This role is required'
        : false,
      secretary: !society.exec_roles.secretary.toString().replace(/\s/g, '')
        .length
        ? 'This role is required'
        : false,

      image_logo: await Validations.validateImage(society.images.logo),
      image_background: society.images.background
        ? await Validations.validateImage(society.images.background)
        : false,
    };
  },
  inviteExecToApp: async function (campus, society, user, email) {
    email = email.toLowerCase().trim();

    // Check if email is valid
    const emailCheck = await isEmailDomainValid(email);
    if (emailCheck.error) throw emailCheck.error;
    else {
      // Check if email exists
      const emailExists = await doesEmailExist(email);
      if (emailExists.error) throw emailExists.error;
      else {
        if (emailExists.exists)
          Alert.alert(
            'Already joined',
            "This person has already joined under the name '" +
              emailExists.user.first_name +
              "'",
          );
        else
          return sendAppInvite(
            user,
            'society exec',
            society.name,
            society.id,
            campus,
          );
      }
    }
  },
  validateMembership: async function (membership) {
    return {
      name: await Validations.validateText(membership.name),
      price: await Validations.validateNumber(membership.price),
      /**
       * Valid period has a custom function to make sure it has some value
       */
      valid_period: !(membership.valid_period || '')
        .toString()
        .replace(/\s/g, '').length,
    };
  },
};

async function doesEmailExist(email) {
  return db
    .collection('users')
    .where('email', '==', email)
    .get()
    .then((querySnapShot) => {
      const users = [];
      querySnapShot.forEach((usr) => users.push({...usr.data(), uid: usr.id}));
      return {exists: users.length > 0, user: users[0]};
    })
    .catch((err) => {
      return {error: err};
    });
}
