import React from 'react';
import {View, Image, Text} from 'react-native';
import {styles} from './style';
import CheckedImage from '../../../assets/Images/checked.png';
import CancelImage from '../../../assets/Images/cancel.png';
import {GlobalStyle} from '../../../assets/GlobalStyle';

export function ParticipantRow(props) {
  return (
    <View>
      <View style={styles.participantRow}>
        <View style={styles.participantRowName}>
          <Text numberOfLines={1} style={styles.participantText}>
            {props.participant.first_name} {props.participant.last_name}
          </Text>
          <Text numberOfLines={1} style={styles.participantSubText}>
            {props.participant.email}
          </Text>
        </View>
        {/* <Image
          style={styles.participantIcon}
          source={props.claimed ? CheckedImage : CancelImage}
        /> */}
        <GlobalStyle.UI.ClaimCheck claimed={props.claimed} />
      </View>
      {!props.last && <GlobalStyle.Line />}
    </View>
  );
}
