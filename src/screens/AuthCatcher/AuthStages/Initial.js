import React from 'react';
import {Text, View} from 'react-native';
import {AuthUI} from '../components';
import {ImageBackground} from 'react-native';
import {StyleSheet} from 'react-native';
import {GlobalStyle} from '../../../assets/GlobalStyle';
import * as Animatable from 'react-native-animatable';

import CampusBuilding from '../../../assets/Images/intro-images/campus-building.jpeg';
import Friends from '../../../assets/Images/intro-images/friends.jpeg';
import Societies from '../../../assets/Images/intro-images/meeting-friends.jpeg';
import Memories from '../../../assets/Images/intro-images/memories.jpeg';
import {Pressable} from 'react-native';
import {Image} from 'react-native';

export class Initial extends React.Component {
  constructor() {
    super();
    this.interval;
    this.carousel = React.createRef();

    this.state = {imageIndex: 0};
  }
  componentDidMount() {
    this.interval = setInterval(() => {
      if (this.carousel.current) this.carousel.current.fadeOutLeft(400);

      setTimeout(() => {
        const currentIndex = this.state.imageIndex;
        var nextIndex = currentIndex + 1;
        if (nextIndex >= IMAGE_CONTENTS.length) nextIndex = 0;

        this.setState({imageIndex: nextIndex});
        if (this.carousel.current) this.carousel.current.fadeInRight(400);
      }, 410);
    }, 4500);
  }

  componentWillUnmount() {
    clearInterval(this.interval);
  }
  render() {
    return (
      <AuthUI.MainContainer style={{justifyContent: 'space-around'}}>
        <Animatable.View ref={this.carousel}>
          <IntroImage content={IMAGE_CONTENTS[this.state.imageIndex]} />
        </Animatable.View>

        <View>
          <AuthUI.PrimaryButton
            title={'Create account'}
            onPress={() => this.props.updateTarget('createaccount')}
          />
          <AuthUI.Line />
          <AuthUI.SecondaryButton
            title={'Sign in'}
            onPress={() => this.props.updateTarget('signin')}
          />
          <Pressable
            style={{alignSelf: 'center'}}
            hitSlop={5}
            onPress={() => this.props.updateTarget('resetpassword')}>
            <Text style={GlobalStyle.TextStyle.bodySmall}>Reset password</Text>
          </Pressable>
        </View>
      </AuthUI.MainContainer>
    );
  }
}

function IntroImage(props) {
  const {style} = props.content;
  return (
    <View style={styles.introImageBackground}>
      <Image
        source={props.content.source}
        style={{
          borderRadius: IMAGE_SIZE / 2,
          height: IMAGE_SIZE,
          width: IMAGE_SIZE,
          alignItems: 'center',
        }}
      />
      <View style={[styles.introImageTextView]}>
        <Text style={styles.introImageText}>{props.content.title}</Text>
      </View>
    </View>
  );
}

const IMAGE_SIZE = GlobalStyle.Measurements.width * 0.5;

const styles = StyleSheet.create({
  swiper: {
    width: GlobalStyle.Measurements.width,
    height: GlobalStyle.Measurements.height * 0.4,

    padding: 10,
  },
  introImageBackground: {
    width: GlobalStyle.Measurements.width,
    alignSelf: 'center',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 10,
  },
  introImageText: {
    ...GlobalStyle.TextStyle.headingLarge,

    textAlign: 'center',
  },
  introImageTextView: {
    // position: 'absolute',
    alignSelf: 'center',
    alignItems: 'center',
  },
});

const IMAGE_CONTENTS = [
  {
    title: 'Discover your campus',
    source: CampusBuilding,
    style: {
      bottom: 0,
      left: GlobalStyle.Measurements.width * 0.15,
    },
  },
  {
    title: 'Meet new friends',
    source: Friends,
    style: {
      top: 0,
      right: 60,
    },
  },
  {
    title: 'Make memories',
    source: Memories,
    style: {
      top: 0,
      left: 40,
    },
  },
];
