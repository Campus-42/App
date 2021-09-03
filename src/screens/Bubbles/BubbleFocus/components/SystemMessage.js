import React from 'react';
import {Dimensions} from 'react-native';
import {View, Text} from 'react-native';
import {GlobalStyle} from '../../../../assets/GlobalStyle';
import {UserLeaderboard} from '../../../../assets/UserLeaderboard';

export function SystemMessage(props) {
  const msg = props.currentMessage;
  const type = (msg.__data || {}).type;

  return (
    <View
      style={{
        alignSelf: 'center',
        marginVertical: 10,
        alignItems: 'center',
        justifyContent: 'center',
      }}>
      <Text
        style={[
          GlobalStyle.TextStyle.bodySmall,
          {color: GlobalStyle.Palettes.text.palette1},
        ]}>
        {msg.text}
      </Text>
      {type == 'period points leaderboard' && (
        <UserLeaderboard
          users={Object.values(props.members)
            .map((user) => {
              return {
                ...user,
                period_points: msg.__data.users_points[user.uid] || 'N/A',
              };
            })
            .slice(0, 5)}
        />
      )}
    </View>
  );
}
