import React from 'react';
import {View, Text} from 'react-native';
import {UserImageWrapper} from './UserImageWrapper';
import {Logo} from './Logo';
import {renderDrawerItem} from './DrawerItem';
import {inAppBadgeEmitter} from '../EventEmitter';
import {TouchableOpacity} from 'react-native';
import {StyleSheet} from 'react-native';
import {PointsReferralButton} from '../../screens/University/PointEvents/components/ReferralButton';
import {GlobalStyle} from '../GlobalStyle';

const badgeKeys = {
  0: 'home',
  1: 'societies',
  2: 'bubbles',
  3: 'profile',
  4: 'admin-panel',
};

export function CustomDrawer(props) {
  const [badges, setBadges] = React.useState({
    home: [],
    societies: [],
    bubbles: [],
    profile: [],
    'admin-panel': [],
  });

  function handleBadgeChange(data) {
    console.log('Drawer badges', data);
    setBadges({
      home: [],
      societies: [],
      bubbles: [],
      profile: [],
      'admin-panel': [],
      ...data,
    });
  }

  React.useEffect(() => {
    inAppBadgeEmitter.addListener('in-app-badge-change', handleBadgeChange);
    return () =>
      inAppBadgeEmitter.removeListener(
        'in-app-badge-change',
        handleBadgeChange,
      );
  });

  return (
    <View
      style={{
        flexDirection: 'column',
        justifyContent: 'space-between',
        flex: 3.5,
      }}>
      <UserImageWrapper {...props} user={props.screenProps.user} />
      <View
        style={{
          flex: 3,
        }}>
        {props.state.routes.map((item, index) =>
          renderDrawerItem({
            item,
            navigation: props.navigation,
            isFocused: index == props.state.index,
            index,
            showBadge: badges[badgeKeys[index]].length > 0,
          }),
        )}
      </View>
      <>
        <PointsReferralButton
          style={styles.referralButton}
          text={'Earn extra points!'}
          navigate={props.navigation.push}
        />
        <Logo />
      </>
    </View>
  );
}

const styles = StyleSheet.create({
  referralButton: {
    width: GlobalStyle.Measurements.width * 0.6,
    alignSelf: 'center',
    marginBottom: GlobalStyle.Measurements.margin,
  },
  referral: {},
});
