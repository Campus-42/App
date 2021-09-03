import {url, c42_api_key, analytics} from '../../Analytics';
import {auth} from '../../Firebase/Firebase';

export const pointFuncs = {
  triggerPointEvent: async function (
    type = String,
    campusKey = String,
    showPopup = false,
    params = {},
  ) {
    analytics.breadcrumb(
      'Triggering point event',
      'pointFuncs',
      'triggerPointEvent',
      {arguments: arguments},
    );
    console.log('Point trigger => ´' + type + '´');
    const uid = params.uid || (auth.currentUser || {}).uid; // Allow to specify other uid
    return fetch(`${url}/points/trigger/?api_key=${c42_api_key}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        ...params,
        uid,
        campus_key: campusKey,
        type,
      }),
    })
      .then((response) => response.json())
      .then(({response, points, user}) => {
        console.log('Point trigger response', response);

        if (response && typeof showPopup == 'function')
          showPopup({
            active: true,
            type: 'toast',
            level: 'points',
            text: response,
          });
        return {response, points, user};
      })
      .catch((err) => {
        console.warn('Error trigerring point event', err);
        analytics.error(err, 'CampusFuncs/Points', 'triggerPointEvent');
        throw err;
      });
  },
  getLevelColors: function (level) {
    if (level < 5) return '#00a9ec';
    else if (level < 20) return '#12e6bb';
    else if (level < 70) return '#fc822b';
    else if (level <= 100) return '#e011c7';
  },
  getLevelInfoForProgression: function (levelLimits, user) {
    var {level, points} = {...{points: 0, level: 1}, ...user};

    const levelStartPoints = levelLimits[level - 1];
    const nextLevelPoints = levelLimits[level];

    const levelPointsNeeded = nextLevelPoints - levelStartPoints;
    const levelPointsEarned = points - levelStartPoints;
    const remainingPoints = levelPointsNeeded - levelPointsEarned;

    const progress = levelPointsEarned / levelPointsNeeded || 0;

    return {
      progress,
      remainingPoints,
      levelPointsEarned,
      levelPointsNeeded,
      levelStartPoints,
      nextLevelPoints,
    };
  },
};
