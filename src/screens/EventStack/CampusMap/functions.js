import {CameraRoll} from 'react-native';
import {db} from '../../../assets/Firebase/Firebase';

export const CampusMapFuncs = {
  getCampusMapFeatures: async function (campusKey) {
    return db
      .collection('campuses')
      .doc(campusKey)
      .collection('data')
      .doc('geography')
      .get()
      .then((doc) => {
        return doc.data().map_features;
      })
      .catch((err) => {
        throw err;
      });
  },
  getCameraForMarkerAnimation: function (elem) {
    return {
      center: elem.coordinate || elem.coordinates,
      zoom: 18,
      altitude: 600,
      pitch: 10,
      heading: 0,
    };
  },
  queryMapFeatures: function (query, features) {
    return features
      .filter((e) => {
        var prop = e.properties;

        let description = (prop.description || '').toLowerCase();
        let name = (prop.name || '').toLowerCase();
        let type = (prop.type || '').toLowerCase();
        let address = (prop.address || '').toLowerCase();
        let department = (prop.department || []).join(' ').toLowerCase();
        return [description, name, type, department, address].some((e) =>
          e.includes(query.toLowerCase()),
        );
      })
      .sort((a, b) => a.rank || 3 - b.rank || 3); // 1-5
  },
};
