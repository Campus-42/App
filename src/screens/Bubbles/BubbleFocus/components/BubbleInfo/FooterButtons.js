import React from 'react';
import {StyleSheet, Text, View} from 'react-native';
import {GlobalStyle} from '../../../../../assets/GlobalStyle';
import {TouchableOpacity} from 'react-native';

export function FooterButtons(props) {
  return (
    <View
      style={[
        styles.container,
        !props.hasAccess && {justifyContent: 'center'},
      ]}>
      {props.showLeave && (
        <GlobalStyle.UI.GreyBackgroundButton
          title={'Leave'}
          red
          style={styles.button}
          textStyle={GlobalStyle.TextStyle.buttonSmall}
          onPress={props.askLeave}
        />
      )}
      {props.hasAccess && (
        <GlobalStyle.UI.GreyBackgroundButton
          title={'Invite'}
          style={styles.button}
          textStyle={GlobalStyle.TextStyle.buttonSmall}
          onPress={props.showInviteView}
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    width: GlobalStyle.Measurements.width * 0.9,

    flexDirection: 'row',
    alignSelf: 'center',
    alignItems: 'center',
    justifyContent: 'space-around',
    marginVertical: GlobalStyle.Measurements.marginHalf,
  },

  button: {
    width: GlobalStyle.Measurements.width * 0.3,
    borderRadius: 12.5,
    paddingHorizontal: 10,
    padding: 10,
  },
});

/**
 * {hasAccess && (
            <GlobalStyle.UI.Touchable
              style={styles.inviteButton}
              iconColor={GlobalStyle.ColorStyle.blueButtonText}
              onPress={() => setShowInviteView(true)}>
              <Text
                style={[
                  GlobalStyle.TextStyle.buttonMedium,
                  {color: GlobalStyle.ColorStyle.blueButtonText},
                ]}>
                Invite to bubble
              </Text>
            </GlobalStyle.UI.Touchable>
          )}
          {props.bubble.member_uids.length > 2 && (
            <GlobalStyle.UI.Touchable
              style={styles.inviteButton}
              iconColor={GlobalStyle.ColorStyle.blueButtonText}
              onPress={askLeave}>
              <Text
                style={[
                  GlobalStyle.TextStyle.buttonMedium,
                  {color: GlobalStyle.ColorStyle.redButtonText},
                ]}>
                Leave bubble
              </Text>
            </GlobalStyle.UI.Touchable>
          )}
 */
