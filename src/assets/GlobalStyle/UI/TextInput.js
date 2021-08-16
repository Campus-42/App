import React from 'react';
import {
  TextInput as RNTextInput,
  Pressable,
  ActivityIndicator,
  StyleSheet,
  Animated,
  Text,
  Platform,
  View,
} from 'react-native';
import PropTypes from 'prop-types';
import {Measurements} from '../Measurements';
import {Palettes} from '../ColorStyle';
import {TextStyle} from '../TextStyle';
import FontAwesome5 from 'react-native-vector-icons/FontAwesome5';

const AnimTextInput = Animated.createAnimatedComponent(RNTextInput);

const width = Measurements.width * 0.85;
const padding = Measurements.unit * (Platform.OS == 'android' ? 0.4 : 0.5);
const iconWidth = Measurements.unit * 0.55;

export class TextInput extends React.Component {
  /**
   * A functional component for a standard texinput with icons
   * No style can be passed to minimize dimension bugs
   */

  constructor() {
    super();
    this.textinput = React.createRef();
    this.state = {
      loading: false,
      inputWidth: new Animated.Value(styles.textinput.width),
    };
  }
  toggleLoading = (value = !this.state.loading) => {
    /** Toggle the loading value or set explicitly the value */
    this.setState({loading: value});
  };

  render() {
    return (
      <View>
        <Pressable
          style={[styles.container, this.props.error && styles.errorContainer]}
          onPress={() => this.textinput.current.focus()}>
          {!this.state.loading && this.props.showSearchIcon && (
            <FontAwesome5
              name={'search'}
              color={Palettes.text.palette1}
              size={iconWidth}
            />
          )}
          <AnimTextInput
            ref={this.textinput}
            placeholderTextColor={Palettes.text.palette1}
            placeholder={'Enter here'}
            clearButtonMode={this.props.clearButtonMode || 'while-editing'}
            {...this.props}
            onFocus={() => {
              this.props.clearOnFocus && this.textinput.current.clear();
              this.props.onFocus();
            }}
            style={[
              styles.textinput,
              {
                width:
                  this.state.inputWidth._value -
                  (this.state.loading || this.props.showSearchIcon
                    ? iconWidth + padding
                    : 0),
              },
            ]}
          />
          {this.state.loading && (
            <ActivityIndicator
              size={'small'}
              style={{height: iconWidth, width: iconWidth, marginRight: 2}}
            />
          )}
        </Pressable>
        {this.props.error && (
          <Text style={styles.errorText}>{this.props.errorText}</Text>
        )}
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    width: width,
    padding: padding,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    alignSelf: 'center',
    // backgroundColor: ColorStyle.greyBackground,
    backgroundColor: '#e8e8e8',
    borderRadius: Measurements.unit / 2,
    marginVertical: 5,
  },
  textinput: {
    ...TextStyle.bodyRegular,
    width: width - padding * 2,
    padding: 0,
    margin: 0,
    paddingVertical: 0,
  },
  errorContainer: {
    backgroundColor: '#ff000020',
    borderWidth: 1,
    borderColor: '#ff000070',
  },
  errorText: {
    ...TextStyle.bodySmall,
    color: '#ff0000',
    alignSelf: 'flex-end',
  },
});

TextInput.defaultProps = {
  showSearchIcon: false,
  onFocus: () => {},
  clearOnFocus: false,
  error: false,
  errorText: "This doesn't look right",
};
TextInput.propTypes = {
  showSearchIcon: PropTypes.bool,
  clearOnFocus: PropTypes.bool,
  error: PropTypes.bool,
  errorText: PropTypes.string,
};
