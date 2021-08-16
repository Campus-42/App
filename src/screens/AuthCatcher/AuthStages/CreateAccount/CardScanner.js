import React from 'react';
import {StyleSheet} from 'react-native';
import {View, Text} from 'react-native';
import {SwipeUpViewFlexible} from '../../../../assets/SwipeUpView';
import {RNCamera} from 'react-native-camera';
import BarcodeMask from 'react-native-barcode-mask';

import {GlobalStyle} from '../../../../assets/GlobalStyle';
import {Pressable} from 'react-native';
import Ionicon from 'react-native-vector-icons/Ionicons';
import {Platform} from 'react-native';
import {Linking} from 'react-native';
import {RESULTS, PERMISSIONS, check} from 'react-native-permissions';
import {analytics} from '../../../../assets/Analytics';

const SWIPEUP_HEIGHT = 400;

export function CardScanner(props) {
  const [torch, setTorch] = React.useState(false);
  const [isCameraAvailable, setIsCameraAvailable] = React.useState(false);

  check(
    Platform.OS === 'ios' ? PERMISSIONS.IOS.CAMERA : PERMISSIONS.ANDROID.CAMERA,
  )
    .then((result) => {
      switch (result) {
        case RESULTS.UNAVAILABLE:
          setIsCameraAvailable(false);
          break;
        case RESULTS.DENIED:
          setIsCameraAvailable(false);
          break;
        case RESULTS.LIMITED:
          setIsCameraAvailable(true);
          break;
        case RESULTS.GRANTED:
          setIsCameraAvailable(true);
          break;
        case RESULTS.BLOCKED:
          setIsCameraAvailable(false);
          break;
      }
    })
    .catch((err) => {
      console.warn('Camera error', err);
      analytics.error(err, 'CardScanner', 'check()');
      setIsCameraAvailable(false);
    });

  return (
    <SwipeUpViewFlexible
      height={SWIPEUP_HEIGHT}
      isActive={props.isActive}
      onClose={props.onClose}
      showBar={!isCameraAvailable}
      style={[styles.swipeup, !isCameraAvailable && {backgroundColor: '#fff'}]}>
      {props.isActive ? (
        isCameraAvailable ? (
          <RNCamera
            flashMode={torch && props.isActive ? 'torch' : 'off'}
            captureAudio={false}
            keepAudioSession={false}
            style={styles.camera}
            onBarCodeRead={({data}) => {
              props.onCardRead(data);
              props.onClose();
            }}>
            <BarcodeMask
              width={GlobalStyle.Measurements.width * 0.85}
              height={GlobalStyle.Measurements.unit * 4}
              showAnimatedLine={false}
              edgeBorderWidth={1}
              outerMaskOpacity={0.4}
              edgeRadius={0}
            />
            <View style={styles.bar} />
            <Text style={styles.cameraText}>
              Scan the barcode on your student card
            </Text>
            <Pressable
              onPress={() => setTorch(!torch)}
              style={styles.torchButton}>
              <Ionicon
                name={!torch ? 'flash-off-outline' : 'flash'}
                size={20}
                color={'#000'}
              />
            </Pressable>
          </RNCamera>
        ) : (
          <View style={styles.cameraUnavailable}>
            <Text
              style={[
                GlobalStyle.TextStyle.bodyRegular,
                {alignItems: 'center', textAlign: 'center', marginBottom: 10},
              ]}>
              {"We can't connect to your camera\nPlease check your settings"}
            </Text>
            <GlobalStyle.UI.GreyBackgroundButton
              title={'Go to settings'}
              onPress={() => Linking.openURL('app-settings:')}
            />
          </View>
        )
      ) : null}
    </SwipeUpViewFlexible>
  );
}

const styles = StyleSheet.create({
  cameraUnavailable: {
    backgroundColor: '#fff',
    height: SWIPEUP_HEIGHT - (Platform.OS === 'ios' ? 60 : 70) - 100,

    alignItems: 'center',
    justifyContent: 'center',
    paddingBottom: 20,
  },
  swipeup: {
    backgroundColor: '#000',
    overflow: 'hidden',
  },
  camera: {
    height: SWIPEUP_HEIGHT - (Platform.OS === 'ios' ? 60 : 70),
    borderRadius: 50,
  },
  cameraText: {
    ...GlobalStyle.TextStyle.bodyMedium,
    position: 'absolute',
    alignSelf: 'center',
    color: '#fff',
    top: 30,
  },
  bar: {
    width: GlobalStyle.Measurements.width * 0.2,
    height: 5,
    borderRadius: 2.5,

    backgroundColor: '#fff',
    alignSelf: 'center',
    top: 10,
  },
  torchButton: {
    position: 'absolute',
    alignSelf: 'flex-start',
    marginLeft: GlobalStyle.Measurements.width * 0.8,
    backgroundColor: '#fff',
    padding: 10,
    borderRadius: 100,
    marginTop: SWIPEUP_HEIGHT / 1.3 - (Platform.OS === 'ios' ? 80 : 80),

    alignItems: 'center',
    justifyContent: 'center',
  },
});
