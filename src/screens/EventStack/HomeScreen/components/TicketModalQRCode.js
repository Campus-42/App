import QRCode from 'react-native-qrcode-svg';
import React from 'react';
import {View} from 'react-native';
import {styles} from '../style';
import ErrorAnimation from '../../../../assets/Images/error-animation.json';
import LottieView from 'lottie-react-native';
import {GlobalStyle} from '../../../../assets/GlobalStyle';

const SIZE = GlobalStyle.Measurements.width * 0.5;

export function TicketModalQRCode(props) {
  return (
    <View
      style={[
        styles.qrCode,
        {
          alignItems: 'center',
          justifyContent: 'center',
          marginVertical: GlobalStyle.Measurements.margin * 1.5,
          backgroundColor:
            props.error && GlobalStyle.Palettes.background.palette5,
        },
      ]}>
      {props.error ? (
        <LottieView
          source={ErrorAnimation}
          style={lottie}
          autoPlay
          autoSize
          loop={false}
        />
      ) : (
        <QRCode value={props.code} size={SIZE} />
      )}
    </View>
  );
}

const lottie = {
  width: SIZE / 2.5,
  height: SIZE / 2.5,
};
