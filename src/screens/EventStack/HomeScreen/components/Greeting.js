import React from 'react';
import {View, Text, StyleSheet, Dimensions} from 'react-native';
import {HomeFuncs} from '../functions';

import {AsyncStorage} from '../../../../assets/AsyncStorage/functions';
import {GlobalStyle} from '../../../../assets/GlobalStyle';
import {TodaysDate} from './TodaysDate';

export class Greeting extends React.Component {
  constructor() {
    super();
    this.state = {
      greeting: 'Hello',
      name: '',
    };
  }
  componentDidMount() {
    this.getGreeting();
    this.setState({name: this.props.user.first_name});
  }
  render() {
    return (
      <View style={styles.container}>
        <View style={styles.textContainer}>
          <Text style={[styles.text, {color: `${this.props.textColor}70`}]}>
            {this.state.greeting},
          </Text>
          <Text style={[styles.text, {color: this.props.textColor}]}>
            {this.state.name}
          </Text>
          <TodaysDate {...this.props} />
        </View>
        {this.props.campusLogo && (
          <GlobalStyle.UI.Image
            source={{uri: this.props.campusLogo}}
            style={styles.logo}
            resizeMode={'contain'}
          />
        )}
      </View>
    );
  }
  getGreeting = async () => {
    //Get greeting based on time
    const greeting = await HomeFuncs.getGreeting();
    this.setState({greeting: greeting});
  };
  getName = async () => {
    let names = await AsyncStorage.getFullName();
    this.setState({name: names.first});
  };
}

const styles = StyleSheet.create({
  container: {
    margin: GlobalStyle.Measurements.margin,
    marginBottom: GlobalStyle.Measurements.margin,
    paddingRight: GlobalStyle.Measurements.marginHalf,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  textContainer: {
    flexDirection: 'column',
    alignItems: 'flex-start',
    justifyContent: 'center',
  },
  text: {
    ...GlobalStyle.TextStyle.headingLarge,
    fontSize: Dimensions.get('screen').fontScale * 28,
    marginVertical: 0,
  },
  logo: {
    height: GlobalStyle.Measurements.unit * 2,
    width: GlobalStyle.Measurements.unit * 2,
    backgroundColor: '#ffffff00',
  },
});
