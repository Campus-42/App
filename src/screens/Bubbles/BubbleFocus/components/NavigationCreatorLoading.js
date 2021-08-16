import React from 'react';
import {StyleSheet, View} from 'react-native';
import {Dimensions} from 'react-native';
import {ActivityIndicator, Text, TouchableOpacity} from 'react-native';
import {GlobalStyle} from '../../../../assets/GlobalStyle';
import {LoadingCircle} from '../../../../assets/LottieAnims/loading';
import {SuccessAnimation} from '../../../../assets/LottieAnims/success';
import {ErrorAnimation} from '../../../../assets/LottieAnims/error';

export function NavigationCreatorLoading(props) {
  return (
    <View style={styles.container}>
      <Text style={styles.text}>Creating bubble</Text>
      {props.error ? (
        <ErrorAnimation size={'regular'} style={{alignSelf: 'center'}} />
      ) : props.created ? (
        <SuccessAnimation size={'regular'} style={{alignSelf: 'center'}} />
      ) : (
        <LoadingCircle size={'regular'} style={{alignSelf: 'center'}} />
      )}

      {props.error && (
        <Text style={styles.errorText}>
          {typeof props.error === 'string'
            ? props.error
            : 'Could not create bubble, try again later'}
        </Text>
      )}
      <GlobalStyle.UI.GreyBackgroundButton
        style={styles.button}
        textStyle={styles.buttonText}
        title={'Cancel'}
        disabled={props.created}
        onPress={props.goBack}
      />
    </View>
  );
}

const SIZE = GlobalStyle.Measurements.unit * 8;

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    alignSelf: 'center',

    minWidth: SIZE,
    padding: GlobalStyle.Measurements.marginHalf,
    borderRadius: GlobalStyle.Measurements.unit,

    top: (GlobalStyle.Measurements.height - SIZE) / 2.5,

    backgroundColor: '#fff',

    shadowColor: '#000',
    shadowOffset: {width: 0, height: 3},
    shadowOpacity: 0.15,
    shadowRadius: 5,

    elevation: 4,
  },
  text: {
    ...GlobalStyle.TextStyle.bodyLargeBold,
    alignSelf: 'center',
    textAlign: 'center',

    marginBottom: GlobalStyle.Measurements.margin,
    width: SIZE,
  },
  button: {
    width: SIZE,
    marginVertical: 0,

    height: SIZE / 4.5,
    paddingVertical: 5,
    marginTop: GlobalStyle.Measurements.margin,
  },
  buttonText: {
    fontSize: Dimensions.get('screen').fontScale * 14,
  },

  errorText: {
    ...GlobalStyle.TextStyle.bodySmall,
    width: SIZE,

    textAlign: 'center',
    alignSelf: 'center',

    marginTop: GlobalStyle.Measurements.marginHalf,
  },
});
