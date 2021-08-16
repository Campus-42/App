import React from 'react';
import {StyleSheet, ImageBackground} from 'react-native';

export function EmptySocietyView(props) {
  return (
    <View style={styles.container}>
      <ImageBackground style={styles.image}>
        <Text>We could not find any societies</Text>
      </ImageBackground>
    </View>
  );
}
const styles = StyleSheet.create({
  container: {
    backgroundColor: GlobalStyle.Palettes.background.palette6,
    width: GlobalStyle.Measurements.width * 0.8,
    height: GlobalStyle.Measurements.unit * 7,
    borderRadius: GlobalStyle.Measurements.unit / 2,
  },
  image: {
    resizeMode: 'contain',
    alignSelf: 'center',
    alignItems: 'center',
    flexDirection: 'column',
    minWidth: GlobalStyle.Measurements.width * 0.8,
    minHeight: GlobalStyle.Measurements.unit * 7,
  },
});
