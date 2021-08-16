import {db} from '../../assets/Firebase/Firebase';

export const AuthFuncs = {
  getAvailableCampuses: async function () {
    return db
      .collection('general')
      .doc('allowed_campuses')
      .get()
      .then((doc) => {
        return doc.data().campuses;
      })
      .catch((err) => {
        throw err;
      });
  },
  searchCampus: function (availableCampuses, searchTerm) {
    return (availableCampuses || [])
      .filter((e) => {
        let domain = (e.domain || '').toLowerCase();
        let name = (e.name || '').toLowerCase();
        return (
          [name, domain].some((e) => e.includes(searchTerm.toLowerCase())) &&
          (e.show !== false || __DEV__)
        );
      })
      .slice(0, 3);
  },
};
