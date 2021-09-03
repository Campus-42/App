import React from 'react';
import {View, Text} from 'react-native';
import {styles} from '../style';
import {GlobalStyle} from '../../../../assets/GlobalStyle';
import TouchableShrink from '../../../../assets/TouchableShrink/TouchableShrink';

export const ActionButtons = (props) => {
  return (
    <View style={{marginTop: GlobalStyle.Measurements.margin * 3}}>
      {/* <GlobalStyle.UI.GeneralButton
        title="Create Event"
        onPress={() => props.navigation.navigate('Create Event')}
      /> */}
      {/* <GlobalStyle.UI.GeneralButton
        title="Create Announcement"
        onPress={() => props.navigation.navigate('Create Blog')}
      /> */}
      <GlobalStyle.UI.GeneralButton
        title="Manage Members"
        onPress={() => props.navigation.navigate('Manage Members')}
      />
      {/* <GlobalStyle.UI.GeneralButton
        title="Edit Events"
        onPress={() => props.navigation.navigate('Upcoming Events')}
        />
        <GlobalStyle.UI.GeneralButton
        title="Edit Announcements"
        onPress={() => props.navigation.navigate('All Blogs')}
      /> */}
      <GlobalStyle.UI.GeneralButton
        disabled
        title="Post Story"
        onPress={() => props.navigation.navigate('Story Camera')}
      />
      <Text
        style={[
          GlobalStyle.TextStyle.bodySmall,
          {
            width: GlobalStyle.Measurements.width * 0.9,
            alignSelf: 'center',
            textAlign: 'center',
            marginTop: GlobalStyle.Measurements.margin,
          },
        ]}>
        We're currently working on implementing new features for you to reach
        more students
      </Text>
    </View>
  );
};
