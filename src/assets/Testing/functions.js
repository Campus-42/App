import {auth, db, functions} from '../Firebase/Firebase';

export const Funcs = {
  deletePreviousLinkedAccount: async function (email) {
    /**
     * This function will delete the previous linked account if there is one.
     * If there is not a linked account then it will return
     */
    console.log('Test account = true');
    console.log('Will delete all accounts related to ' + email);

    return functions
      .httpsCallable('deleteTestAccounts')({email})
      .then((response) => {
        console.log('Test, delete prev accounts', response);
        return {response};
      })
      .catch((err) => {
        console.warn('Test, delete prev accounts', err);

        return {error: err};
      });
  },
  getEmailLinkedAccount: async function (email) {
    /**
     * Return the linked account uids (not the data)
     */
    return db
      .collection('users')
      .where('email', '==', email)
      .get()
      .then((querySnapShot) => {
        return {accounts: querySnapShot.docs.map((e) => e.id)};
      })
      .catch((err) => {
        throw err;
      });
  },
};
