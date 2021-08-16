import React from 'react';
import {StyleSheet, Text, View} from 'react-native';
import QRCode from 'react-native-qrcode-svg';
import {auth} from '../../../../assets/Firebase/Firebase';
import {GlobalStyle} from '../../../../assets/GlobalStyle';

export function UserQRCode(props) {
  return (
    <View
      style={{
        alignSelf: 'center',
        alignItems: 'center',
        marginTop: GlobalStyle.Measurements.margin,
      }}>
      <Text style={GlobalStyle.TextStyle.bodyLargeBold}>Student id</Text>
      <View style={styles.qr}>
        <QRCode
          value={auth.currentUser !== null ? auth.currentUser.email : 'nothing'}
          size={GlobalStyle.Measurements.width / 2.5}
          backgroundColor="#00000000"
        />
      </View>
    </View>
  );
}
const styles = StyleSheet.create({
  qr: {
    padding: GlobalStyle.Measurements.margin,
    borderRadius: GlobalStyle.Measurements.unit / 2,
    marginVertical: GlobalStyle.Measurements.marginHalf,

    backgroundColor: GlobalStyle.Palettes.background.palette6,
  },
});
