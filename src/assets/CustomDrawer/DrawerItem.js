import React from 'react';
import {StyleSheet} from 'react-native';
import {Pressable, View, Text} from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';
import {GlobalStyle} from '../GlobalStyle';
import {UI} from '../GlobalStyle/UI';

export function renderDrawerItem({
  item,
  navigation,
  index,
  isFocused,
  showBadge,
}) {
  return (
    <Pressable
      key={'customer_drawer_pressable' + item.name}
      onPress={() => {
        navigation.navigate(item.name);
      }}
      style={drawerStyles.view[isFocused]}>
      <View
        style={{
          flexDirection: 'row',
          alignItems: 'center',
          justifyContent: 'flex-start',
        }}>
        <View style={baseStyles.icon}>
          <Icon
            name={getIcon(index, isFocused)}
            color={isFocused ? '#1c95c9' : drawerStyles.text.false.color}
            size={GlobalStyle.Measurements.unit * 0.65}
          />
        </View>
        <Text style={drawerStyles.text[isFocused]}>{item.name}</Text>
      </View>
      {showBadge && (
        <UI.InAppBadge
          size={'small'}
          style={{
            marginLeft: 0,
            marginBottom: -GlobalStyle.Measurements.unit / 2,
          }}
        />
      )}
    </Pressable>
  );
}
function getIcon(index, isFocused) {
  if (index == 0) return 'home' + (!isFocused ? '-outline' : '');
  else if (index == 1) return 'people' + (!isFocused ? '-outline' : '');
  else if (index == 2) return 'chatbubbles' + (!isFocused ? '-outline' : '');
  else if (index == 3) return 'person' + (!isFocused ? '-outline' : '');
  else if (index == 4) return 'options';
}

const baseStyles = StyleSheet.create({
  container: {
    borderRadius: 5,
    marginVertical: 5,
    marginHorizontal: 10,
    padding: 10,
    paddingVertical: 12,
  },
  icon: {
    marginRight: 20,
  },
});

const drawerStyles = {
  text: {
    true: {...GlobalStyle.TextStyle.drawerText, color: '#1c95c9'},
    false: {
      ...GlobalStyle.TextStyle.drawerText,
      color: GlobalStyle.Palettes.text.palette3,
      fontWeight: '400',
    },
  },
  view: {
    true: {
      ...baseStyles.container,
      backgroundColor: '#cdeffe',
    },
    false: {
      ...baseStyles.container,
      backgroundColor: '#00000000',
    },
  },
};
