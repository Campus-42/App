import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  Dimensions,
  TouchableHighlight,
  Linking,
} from 'react-native';
import MaterialIcon from 'react-native-vector-icons/MaterialIcons';
import * as Animatable from 'react-native-animatable';
import {GlobalStyle} from '../../../../assets/GlobalStyle';

const AnimatableTouchableHighlight = Animatable.createAnimatableComponent(
  TouchableHighlight,
);

export class EmergencyComponent extends React.Component {
  constructor() {
    super();

    this.state = {
      focus: false,
    };
  }
  render() {
    console.log('Emergencies', this.props.data);
    return (
      <View>
        {this.props.data.map((elem, index) => (
          <AnimatableTouchableHighlight
            key={elem.id}
            ref={(view) => (this['view' + index] = view)}
            animation="bounceIn"
            style={styles.container}
            onPress={() => this.handlePress(elem, index)}
            underlayColor={styles.container.backgroundColor + '30'}
            activeOpacity={0.5}>
            <View>
              <View
                style={[
                  GlobalStyle.ViewStyle.rowContainer,
                  {justifyContent: 'flex-start'},
                ]}>
                <MaterialIcon
                  name="error"
                  size={GlobalStyle.Measurements.unit}
                  color={'#ff0000'}
                />
                <Text style={styles.title}>{elem.title}</Text>
              </View>
              {this.state.focus === index && (
                <React.Fragment>
                  <Animatable.Text style={styles.text}>
                    {elem.text}
                  </Animatable.Text>
                  <TouchableHighlight
                    underlayColor={'#ffffff10'}
                    style={styles.contact}
                    onPress={() => this.draftEmail(elem.contact, elem.title)}>
                    <React.Fragment>
                      <MaterialIcon
                        name="email"
                        size={GlobalStyle.Measurements.unit * 0.8}
                        color={'black'}
                      />
                      <Text style={GlobalStyle.TextStyle.bodyRegular}>
                        Contact
                      </Text>
                    </React.Fragment>
                  </TouchableHighlight>
                </React.Fragment>
              )}
            </View>
          </AnimatableTouchableHighlight>
        ))}
      </View>
    );
  }
  draftEmail(email = String, emergency = String) {
    // This function will open the email client with a subject line already written
    Linking.openURL(
      'mailto:' +
        email +
        '?subject=Re: Campus42 emergency [' +
        emergency +
        ']&body=\n\n\n\nSent via MyCampus App',
    ).catch((err) => {
      console.warn('We could not open the email client', err);
    });
  }
  handlePress(data, index) {
    const {focus} = this.state;
    const opened = focus === index;
    if (focus === false) {
      // No other emergency is being showed
      this['view' + index].transitionTo(sizes.large);
      this.setState({focus: index});
    } else if (opened) {
      // Current index is already being showed, it will be closed
      this['view' + index].transitionTo(sizes.small);
      this.setState({focus: false});
    } else if (focus !== false && opened == false) {
      this['view' + focus].transitionTo(sizes.small);
      this['view' + index].transitionTo(sizes.large);
      this.setState({focus: index});
    }
  }
}
const sizes = {
  large: {minHeight: GlobalStyle.Measurements.height * 0.1},
  small: {minHeight: 0},
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#ff9999',
    width: GlobalStyle.Measurements.width * 0.9,
    alignSelf: 'center',
    borderRadius: GlobalStyle.Measurements.unit,
    padding: GlobalStyle.Measurements.marginHalf,
    marginVertical: GlobalStyle.Measurements.marginHalf,

    shadowColor: GlobalStyle.Palettes.inverseBackground.palette6,
    shadowOpacity: 0.2,
    shadowOffset: {width: 0, height: 0},
  },
  title: {
    ...GlobalStyle.TextStyle.bodyMedium,
    marginLeft: GlobalStyle.Measurements.marginHalf,
  },
  text: {
    ...GlobalStyle.TextStyle.bodyRegular,
    marginVertical: GlobalStyle.Measurements.marginHalf,
  },
  contact: {
    ...GlobalStyle.ViewStyle.rowContainer,
    justifyContent: 'space-around',
    width: GlobalStyle.Measurements.width * 0.3,
    height: GlobalStyle.Measurements.height * 0.04,
    backgroundColor: '#ffffff30', // Give a lighter background of the red
    borderRadius: GlobalStyle.Measurements.height * 0.02,
    paddingHorizontal: GlobalStyle.Measurements.marginHalf,
    paddingVertical: GlobalStyle.Measurements.marginQuarter / 2,
  },
});
