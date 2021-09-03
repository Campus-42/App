import React from 'react';
import {Text, View} from 'react-native';
import {Picker} from '@react-native-community/picker';
import PropTypes from 'prop-types';
import {TouchableOpacity} from 'react-native';
import {SwipeUpViewFlexible} from '../../../../../assets/SwipeUpView';
import {StyleSheet} from 'react-native';
import {GlobalStyle} from '../../../../../assets/GlobalStyle';
import {Dimensions} from 'react-native';
import {Platform} from 'react-native';

export function ReportReasonPickerButton(props) {
  /**
   * Accompanying button to the reason picker
   */
  const [selected, setSelected] = React.useState(false);

  if (selected === false && props.selected === false) {
    setSelected(REASONS[0]);
    props.onValueChange(REASONS[0], 0);
  }

  return (
    <View style={styles.buttonWrapper}>
      {Platform.OS === 'android' ? (
        <View style={{borderRadius: styles.button.borderRadius}}>
          <Picker
            style={{color: GlobalStyle.ColorStyle.blueButtonText}}
            onValueChange={(val, index) => {
              setSelected(val);
              props.onValueChange(REASONS[index], index);
            }}
            numberOfLines={3}
            itemStyle={styles.pickerText}
            selectedValue={selected}>
            {REASONS.map((value, index) => (
              <Picker.Item label={value} value={index} />
            ))}
          </Picker>
        </View>
      ) : (
        <TouchableOpacity
          activeOpacity={0.7}
          style={[styles.button, props.showRed && {borderColor: 'red'}]}
          onPress={props.onPress}>
          <Text
            style={[
              styles.buttonText,
              props.selected && {fontWeight: '500'},
              !props.selected && {color: GlobalStyle.ColorStyle.blueButtonText},
              props.showRed && {color: 'red'},
            ]}>
            {REASONS[props.selected.index] ||
              'What is the reason for reporting?'}
          </Text>
        </TouchableOpacity>
      )}
      <Text style={styles.buttonSubTitle}>Reason for report</Text>
    </View>
  );
}

export function ReportReasonPicker(props) {
  /**
   * A picker for reporting the reason why a message
   * should be reported.
   *
   * When the user clicks on the button (above^) a picker will
   * appear from the bottom from this component.
   *
   * The referred value in 'selected' is the index.
   */
  const [selected, setSelected] = React.useState(false);

  return (
    <SwipeUpViewFlexible
      height={styles.picker.height}
      isActive={props.isActive}
      onClose={props.onClose}>
      <Picker
        style={styles.picker}
        onValueChange={(val, index) => {
          setSelected(val);
          props.onValueChange(REASONS[index], index);
        }}
        numberOfLines={2}
        itemStyle={styles.pickerText}
        selectedValue={selected}>
        {REASONS.map((value, index) => (
          <Picker.Item
            label={value}
            value={index}
            key={`picker_item_${value}`}
          />
        ))}
      </Picker>
    </SwipeUpViewFlexible>
  );
}

export const styles = StyleSheet.create({
  button: {
    backgroundColor: '#efefef',
    alignSelf: 'center',

    borderRadius: 10,
    padding: Platform.OS == 'ios' ? 10 : 1,
    paddingHorizontal: 8,
    width: GlobalStyle.Measurements.width * 0.85,

    borderWidth: 1,
    borderColor: '#00000000',
  },
  pickerAndroid: {
    backgroundColor: '#00000000',
    padding: 1,
  },
  buttonWrapper: {
    marginVertical: GlobalStyle.Measurements.marginHalf,
    width: GlobalStyle.Measurements.width * 0.85,

    flexDirection: 'column',
  },
  buttonSubTitle: {
    ...GlobalStyle.TextStyle.bodySmall,
    marginTop: Platform.OS == 'android' ? 0 : 2,
    marginLeft: 10,
    alignSelf: 'flex-start',
  },
  buttonText: {
    ...GlobalStyle.TextStyle.bodyRegular,
  },
  picker: {
    height: GlobalStyle.Measurements.height * 0.3,
    width: GlobalStyle.Measurements.width,
    alignSelf: 'center',
  },
  pickerText: {
    ...GlobalStyle.TextStyle.bodySmall,
    fontSize: Dimensions.get('screen').fontScale * 12,
  },
});

const REASONS = [
  'Disrespectful or offensive',
  'Includes private information',
  'Includes targeted harassment',
  'It directs hate towards a person or group',
  'Threatening violence or physical harm',
  'This person is contemplating self-harm',
  'Other reason, please specify...',
];

ReportReasonPicker.defaultProps = {
  onValueChange: () => {},
  selectedValue: false,
};
ReportReasonPicker.propTypes = {
  onValueChange: PropTypes.func.isRequired,
  selectedValue: PropTypes.string,
};
