import React from 'react';
import {StyleSheet} from 'react-native';
import {View, Text} from 'react-native';
import {GlobalStyle} from '../../../../../assets/GlobalStyle';
import {UserLeaderboard} from '../../../../../assets/UserLeaderboard';

export function System(props) {
  const item = props.item;
  const type = (item.__data || {}).type;

  return (
    <View>
      <Text style={styles.text}>{props.item.text}</Text>
      {type == 'period points leaderboard' && (
        <UserLeaderboard
          users={Object.values(props.members)
            .map((user) => {
              return {
                ...user,
                period_points: item.__data.users_points[user.uid] || 'N/A',
              };
            })
            .slice(0, 5)}
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  text: {
    ...GlobalStyle.TextStyle.bodySmall,
    color: GlobalStyle.Palettes.text.palette1,
    marginVertical: 10,
  },
});
