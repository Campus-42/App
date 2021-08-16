import React from 'react';
import {Pressable} from 'react-native';
import {Keyboard} from 'react-native';
import {StyleSheet} from 'react-native';
import {FlatList, Text, View} from 'react-native';
import {GlobalStyle} from '../../../../assets/GlobalStyle';

export function QueryView(props) {
  function renderItem({item, index}) {
    return (
      <Pressable
        style={styles.container}
        onPress={() => {
          Keyboard.dismiss();
          props.selectFeature({
            nativeEvent: {
              coordinate: {
                latitude: item.geometry.coordinates[1],
                longitude: item.geometry.coordinates[0],
              },
              id: item.id,
            },
          });
        }}>
        {item.properties.image && (
          <GlobalStyle.UI.Image
            source={{uri: item.properties.image}}
            style={styles.image}
          />
        )}
        <View
          style={[
            styles.infoContainer,
            !item.properties.image && {
              width: WIDTH - PADDING * 2,
            },
          ]}>
          <Text style={styles.nameText}>{item.properties.name}</Text>
          <Text style={styles.typeText} numberOfLines={1}>
            {item.properties.type || item.properties.description}
          </Text>
        </View>
      </Pressable>
    );
  }

  return props.data.length > 0 ? (
    <FlatList
      data={props.data.slice(0, 14)}
      style={styles.flatlist}
      renderItem={renderItem}
      keyboardShouldPersistTaps={'handled'}
    />
  ) : null;
}

const IMG_SIZE = GlobalStyle.Measurements.height * 0.05;
const WIDTH = GlobalStyle.Measurements.width * 0.8;
const PADDING = 7.5;

const styles = StyleSheet.create({
  flatlist: {
    width: WIDTH,
    maxHeight: (IMG_SIZE + PADDING * 2) * 6,
  },
  container: {
    flexDirection: 'row',
    width: WIDTH - PADDING * 2,
    padding: PADDING,
  },
  image: {
    height: IMG_SIZE,
    width: IMG_SIZE,
    borderRadius: GlobalStyle.Measurements.unit / 2,
    marginRight: 5,
  },
  infoContainer: {
    alignItems: 'flex-start',
    justifyContent: 'center',
    width: WIDTH - PADDING * 4 - IMG_SIZE,
    height: IMG_SIZE,
  },
  nameText: {
    ...GlobalStyle.TextStyle.bodyMedium,
  },
  typeText: {
    ...GlobalStyle.TextStyle.bodySmall,
  },
});
