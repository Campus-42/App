import React from 'react';
import {StyleSheet, View} from 'react-native';
import {ActivityIndicator, Text} from 'react-native';
import {GlobalStyle} from '../../../../assets/GlobalStyle';
import {Pressable} from 'react-native';
import {Platform} from 'react-native';
import {LoadingCircle} from '../../../../assets/LottieAnims/loading';

export function LoadingEarlier(props) {
  /**
   * A header for the bubble chat
   * if the props.show is false, then it will
   * only retur a view with a set height. This
   * is to create a padding at the top of the chat
   */
  return props.show ? (
    <View
      style={[
        styles.container,
        !props.init && {marginTop: GlobalStyle.Measurements.height * 0.02},
        Platform.OS === 'android' && props.isLoadingEarlier && {padding: 3},
      ]}>
      {props.isLoadingEarlier ? (
        Platform.OS === 'ios' ? (
          <ActivityIndicator />
        ) : (
          <LoadingCircle size={'xsmall'} />
        )
      ) : (
        <Pressable onPress={() => props.loadMore()}>
          <Text style={styles.text}>Load More</Text>
        </Pressable>
      )}
    </View>
  ) : (
    <View style={{height: GlobalStyle.Measurements.height * 0.035}} />
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 10,
    borderRadius: 100,

    alignSelf: 'center',
    backgroundColor: '#fff',

    shadowColor: '#000',
    shadowOffset: {width: 0, height: 2},
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 7,
    marginTop: GlobalStyle.Measurements.height * 0.065,
    marginBottom: GlobalStyle.Measurements.height * 0.02,
  },
  text: {
    ...GlobalStyle.TextStyle.bodySmall,
    color: GlobalStyle.Palettes.text.palette4,
  },
});
