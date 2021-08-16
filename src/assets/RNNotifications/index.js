const {Notifications} = require('react-native-notifications');

Notifications.getInitialNotification()
  .then((notification) => {
    console.log(
      'Initial notification was:',
      notification ? notification.payload : 'N/A',
    );
  })
  .catch((err) => console.error('getInitialNotifiation() failed', err));
