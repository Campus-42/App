import React from 'react';
import {View} from 'react-native';
import {StyleSheet} from 'react-native';
import {Text} from 'react-native';
import {createAnimatableComponent} from 'react-native-animatable';
import LinearGradient from 'react-native-linear-gradient';
import {auth} from '../../../../../assets/Firebase/Firebase';
import {GlobalStyle} from '../../../../../assets/GlobalStyle';
import {UserImage} from '../../../../ProfileStack/Profile/components/UserImage';
import {LikeContainer} from '../LikeContainer';

const AnimGradient = createAnimatableComponent(LinearGradient);

export function NormalText(props) {
  const {item} = props;
  const isSender = item.creator == auth.currentUser.uid;

  const isNotSenderColors = ['#f0f0f0', '#f0f0f0'];
  const isSenderColors = [
    GlobalStyle.ColorStyle.getCampusColors().light,
    GlobalStyle.ColorStyle.getCampusColors().main,
  ];
  return (
    <View>
      <View
        style={[
          styles.container,
          isSender && {
            justifyContent: 'flex-end',
            marginRight: 20,
          },
          props.showAvatar && {
            marginBottom: 10,
          },
        ]}>
        <View style={styles.avatarContainer}>
          {props.showAvatar &&
            (props.isChannelAdmin ? (
              <GlobalStyle.UI.Image
                source={{uri: props.channelImage}}
                style={{
                  height: GlobalStyle.Measurements.unit * 1.5,
                  width: GlobalStyle.Measurements.unit * 1.5,
                  borderRadius: GlobalStyle.Measurements.unit * 0.75,
                }}
              />
            ) : (
              <UserImage
                user={props.user}
                style={{
                  height: GlobalStyle.Measurements.unit * 1.5,
                  width: GlobalStyle.Measurements.unit * 1.5,
                }}
                dontShowLevelBadge
              />
            ))}
        </View>
        <GlobalStyle.UI.Touchable
          style={{
            flexDirection: 'column',
            alignItems: 'flex-start',
          }}
          onLongPress={() => props.onHold(item.id)}
          allowDoublePress={props.allowLiking}
          onDoublePress={() => props.toggleLike(item)}>
          <AnimGradient
            start={{x: 0.3, y: 0.3}}
            end={{x: 0.8, y: 0.8}}
            colors={isSender ? isSenderColors : isNotSenderColors}
            style={styles.gradient}>
            <GlobalStyle.UI.Text
              navigation={props.navigation}
              selectable={false}
              style={[
                styles.text,
                isSender && {
                  alignSelf: 'flex-end',
                  color: '#fff',
                },
              ]}>
              {item.text}
            </GlobalStyle.UI.Text>
          </AnimGradient>
        </GlobalStyle.UI.Touchable>
      </View>
      <LikeContainer
        item={item}
        isSender={isSender}
        onPress={props.onLikeContainerPress}
        members={props.members}
      />
    </View>
  );
}

export const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    justifyContent: 'flex-start',

    marginVertical: 6,
    marginHorizontal: GlobalStyle.Measurements.width * 0.02,
  },
  gradient: {
    maxWidth: GlobalStyle.Measurements.width * 0.7,
    padding: GlobalStyle.Measurements.unit / 1.5,
    borderRadius: GlobalStyle.Measurements.unit / 1.25,

    minWidth: GlobalStyle.Measurements.width * 0.1,
  },
  text: {
    ...GlobalStyle.TextStyle.bodyRegular,
    textAlign: 'left',
  },
  avatarContainer: {
    width: GlobalStyle.Measurements.unit * 1.5,
    marginRight: 5,
  },
  time: {
    ...GlobalStyle.TextStyle.bodySmall,
    color: GlobalStyle.Palettes.text.palette4,
  },
});
