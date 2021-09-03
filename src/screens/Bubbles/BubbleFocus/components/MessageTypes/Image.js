import React from 'react';
import {Pressable, StyleSheet, View} from 'react-native';
import {auth} from '../../../../../assets/Firebase/Firebase';
import {GlobalStyle} from '../../../../../assets/GlobalStyle';
import {UserImage} from '../../../../ProfileStack/Profile/components/UserImage';
import {LikeContainer} from '../LikeContainer';
import {styles as textStyles} from './NormalText';

export function ImageMessage(props) {
  const {item} = props;
  const isSender = item.creator == auth.currentUser.uid;

  return (
    <GlobalStyle.UI.Touchable
      style={[
        textStyles.container,
        props.showAvatar && {
          marginBottom: 10,
        },
      ]}
      allowDoublePress={props.allowLiking}
      onLongPress={() => props.onHold(item.id)}
      onPress={() => props.navigate('Image Focus', {uri: item.image})}
      onDoublePress={() => props.toggleLike(item)}>
      <View style={textStyles.avatarContainer}>
        {props.showAvatar && (
          <UserImage
            user={props.user}
            style={{
              height: GlobalStyle.Measurements.unit * 1.5,
              width: GlobalStyle.Measurements.unit * 1.5,
            }}
            dontShowLevelBadge
          />
        )}
      </View>
      <View style={styles.imageWrapper}>
        <GlobalStyle.UI.Image source={{uri: item.image}} style={styles.image} />
        <LikeContainer
          item={item}
          isSender={isSender}
          onPress={props.onLikeContainerPress}
          members={props.members}
        />
      </View>
    </GlobalStyle.UI.Touchable>
  );
}
const styles = StyleSheet.create({
  image: {
    width: GlobalStyle.Measurements.width * 0.4,
    height: GlobalStyle.Measurements.height * 0.22,
    marginVertical: 5,
    borderRadius: GlobalStyle.Measurements.unit,
    marginRight: 10,
    borderWidth: 0.5,
    borderColor: '#e5e5e5',
  },

  imageWrapper: {
    shadowColor: '#000',
    shadowOffset: {width: 0, height: 3},
    shadowOpacity: 0.1,
    shadowRadius: 5,
    elevation: 6,
  },
});
