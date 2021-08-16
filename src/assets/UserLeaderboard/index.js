import React from 'react';
import {View, Text} from 'react-native';
import {styles} from './style';
import PropTypes from 'prop-types';
import {GlobalStyle} from '../GlobalStyle';
import {UserImage} from '../../screens/ProfileStack/Profile/components/UserImage';
import LinearGradient from 'react-native-linear-gradient';

export function UserLeaderboard(props) {
  var users = Array.isArray(props.users) ? props.users : [];
  users = users.map((e) => {
    return {...e, period_points: e.period_points || 0};
  });

  function renderItem(user, index) {
    const size = (index < 3 ? 2 : 1.5) * GlobalStyle.Measurements.unit;
    const last = index === (props.users || []).length - 1;

    return (
      <View>
        <View style={styles.userContainer}>
          <View
            style={{
              flexDirection: 'row',
              justifyContent: 'flex-start',
              alignItems: 'center',
            }}>
            <Text style={styles.positionText}>{index + 1}</Text>
            <View style={styles.userImageWrapper}>
              <UserImage
                user={user}
                style={{
                  height: size,
                  width: size,
                }}
              />
            </View>
            <Text style={styles.userName} numberOfLines={1}>
              {user.first_name} {user.last_name}
            </Text>
          </View>
          <View style={styles.pointContainer}>
            <Text style={styles.points}>{user.period_points || 0}</Text>
          </View>
        </View>
        {!last && <GlobalStyle.Line />}
      </View>
    );
  }

  return (
    <View
      style={[
        styles.container,
        props.showShadow && {
          shadowOpacity: 0.15,
          elevation: 3,
        },
      ]}>
      <Text style={styles.title}>{props.title}</Text>
      {users
        .filter(
          (user) =>
            user.first_name !== undefined &&
            user.last_name !== undefined &&
            user.email !== undefined,
        )
        .sort(sortByPoints)
        .slice(0, props.limit)
        .map(renderItem)}
      <Text style={styles.footerText}>{props.footerText}</Text>
    </View>
  );
}
UserLeaderboard.defaultProps = {
  title: 'Bubble Leaderboard',
  footerText: 'Points earned this term',
  users: [],
  showShadow: true,
  limit: 15,
};
UserLeaderboard.propTypes = {
  title: PropTypes.string,
  footerText: PropTypes.string,
  users: PropTypes.array.isRequired,
  showShadow: PropTypes.bool,
  limit: PropTypes.number,
};

function sortByPoints(a, b) {
  if (a.period_points < b.period_points) {
    return 1;
  } else if (a.period_points > b.period_points) {
    return -1;
  }
  return 0;
}

function getLeaderColor(index) {
  switch (index) {
    case 0:
      return '#ffd900';
    case 1:
      return '#aaa9ad99';
    case 2:
      return '#db8a39';
    default:
      return '#d5d5d730';
  }
}
