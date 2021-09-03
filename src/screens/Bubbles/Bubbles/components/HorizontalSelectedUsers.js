import React from 'react';
import {FlatList} from 'react-native';
import {createAnimatableComponent} from 'react-native-animatable';
import PropTypes from 'prop-types';
import {styles} from '../style';
import {UserImage} from '../../../ProfileStack/Profile/components/UserImage';
import {GlobalStyle} from '../../../../assets/GlobalStyle';
import {View} from 'react-native';
import FontAwesome5 from 'react-native-vector-icons/FontAwesome5';

const AnimatableFlatList = createAnimatableComponent(FlatList);

export function HorizontalSelectedUsers(props) {
  return (
    props.users.length > 0 && (
      <AnimatableFlatList
        animation={animation}
        duration={500}
        style={styles.horizontalUsers}
        horizontal={true}
        data={props.users}
        renderItem={renderItem}
        keyExtractor={(e) => `selected_members_thread_${e.uid}`}
      />
    )
  );
  function renderItem({item, index}) {
    return (
      <GlobalStyle.UI.Touchable
        onPress={() => props.removeMember(item)}
        style={{
          margin: GlobalStyle.Measurements.marginHalf,
        }}>
        <UserImage
          fontSize={imgSize * 0.9}
          user={item}
          colors={props.colors}
          style={{
            height: imgSize * 2.5,
            width: imgSize * 2.5,
          }}
          dontShowLevelBadge
        />
        <View style={[styles.userImage, {marginLeft: imgSize * 1.8}]}>
          <FontAwesome5
            name={'times'}
            color={'#fff'}
            size={GlobalStyle.Measurements.unit / 1.6}
          />
        </View>
      </GlobalStyle.UI.Touchable>
    );
  }
}

const imgSize = GlobalStyle.Measurements.unit;
const animation = {0: {maxHeight: 0}, 1: {maxHeight: 100}};

HorizontalSelectedUsers.defaultProps = {
  users: [],
};
HorizontalSelectedUsers.propTypes = {
  users: PropTypes.array,
};
