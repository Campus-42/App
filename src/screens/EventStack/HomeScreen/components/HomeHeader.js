import React from 'react';
import {
  SafeAreaView,
  View,
  Text,
  StyleSheet,
  TouchableHighlight,
  Dimensions,
} from 'react-native';
import {GlobalStyle} from '../../../../assets/GlobalStyle';
import Icon from 'react-native-vector-icons/MaterialIcons';
import {triggerHaptic} from '../../../../assets/Haptic/hapticFeedback';
import {ColorStyle, Palettes} from '../../../../assets/GlobalStyle/ColorStyle';

export class HomeHeader extends React.Component {
  /**
   * @deprecated
   */
  render() {
    return (
      <SafeAreaView style={styles.container}>
        <TouchableHighlight
          style={styles.itemWrapper}
          underlayColor={Palettes.background.palette4}
          activeOpacity={0.5}
          onPress={() => {
            this.props.openDrawer();
          }}>
          <Icon
            name={'menu'}
            size={GlobalStyle.Measurements.unit}
            color={ColorStyle.iconColor}
          />
        </TouchableHighlight>
        <React.Fragment />
        <TouchableHighlight
          style={styles.itemWrapper}
          underlayColor={Palettes.background.palette4}
          activeOpacity={0.5}
          onPress={() => {
            this.props.openDrawer();
          }}>
          <Icon
            name={'person'}
            size={GlobalStyle.Measurements.unit}
            color={ColorStyle.iconColor}
          />
        </TouchableHighlight>
      </SafeAreaView>
    );
  }
}
const styles = StyleSheet.create({
  container: {
    height: GlobalStyle.Measurements.height * 0.115,
    width: GlobalStyle.Measurements.width - GlobalStyle.Measurements.margin * 2,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginHorizontal: GlobalStyle.Measurements.margin,
  },
  itemWrapper: {
    ...GlobalStyle.ButtonStyle.Circle,
    backgroundColor: '#00000000',
    alignItems: 'center',
    justifyContent: 'center',
  },
});
