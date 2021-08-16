import React from 'react';
import {SafeAreaView, Text, Image, View, TouchableOpacity} from 'react-native';
import {GlobalStyle} from '../../../assets/GlobalStyle';
import TouchableShrink from '../../../assets/TouchableShrink/TouchableShrink';
import {styles} from './style';
import {Notifications} from 'react-native-notifications';
import {messaging} from '../../../assets/Firebase/Firebase';
import {UI} from '../../../assets/GlobalStyle/UI';

export function NotificationPage(props) {
  const [disableButton, setDisabledButton] = React.useState(false);
  function next() {
    setDisabledButton(true);
    props.next();
  }
  function requestNotificationAuthorization() {
    setDisabledButton(true);
    Notifications.registerRemoteNotifications();
    props.next();
  }
  return (
    <SafeAreaView style={styles.page}>
      <View style={styles.infoContainer}>
        <View style={styles.appiconContainer}>
          <Image
            source={require('../../../assets/Images/logo.png')}
            style={styles.appicon}
          />
          <UI.InAppBadge
            style={{
              marginBottom: -5,
              marginLeft: styles.appicon.width - 10,
            }}
            animate={false}
            size="xlarge"
          />
        </View>
        <Text style={styles.appiconText}>
          {
            "Do you want to know when you're getting a message or when your event is starting?\nAllow notification to not miss a thing"
          }
        </Text>
      </View>
      <View>
        <TouchableShrink
          onPress={requestNotificationAuthorization}
          style={GlobalStyle.ButtonStyle.Large}
          showGradient
          gradientColor={'#26b3f0'}>
          <Text style={GlobalStyle.TextStyle.buttonLarge}>Grant access</Text>
        </TouchableShrink>
        <TouchableOpacity
          disabled={disableButton}
          onPress={next}
          style={{marginTop: GlobalStyle.Measurements.margin}}>
          <Text style={GlobalStyle.ButtonStyle.TextButton}>
            Remind me later
          </Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}
