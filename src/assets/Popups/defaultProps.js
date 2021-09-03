import RNRestart from 'react-native-restart';
import {GlobalStyle} from '../GlobalStyle';
import CelebrationConfetti from '../Images/celebration-confetti.gif';

import ErrorLottie from '../Images/error-animation.json';

const blueButton = {
  text: 'Okay',
  style: {
    backgroundColor: GlobalStyle.ColorStyle.blueButtonText,
  },
  textStyle: {...GlobalStyle.TextStyle.buttonMedium, color: '#fff'},
};

export const Default = {
  toast: {
    message: {
      title: 'New message',
      text: 'Someone has sent you a message',
      user: false,
      onPress: () => {},
    },
    invite: {
      title: "You've been invited!",
      text: 'Check your profile invitations to see more',
      onPress: () => {},
    },
    'email-verify': {
      title: 'Verification email sent',
      text: 'Check your inbox and come back to login',
      icon: 'envelope',
      iconColor: '#23ebae',
      onPress: () => {},
    },
    'password-reset': {
      title: 'Password reset email has been sent',
      text: 'Check your inbox for the link to reset the password',
      icon: 'envelope',
      iconColor: '#23ebae',
      onPress: () => {},
    },
    error: {
      title: 'Something went wrong',
      text: "We don't know exactly what went wrong but are on it!",
      icon: 'exclamation',
      iconColor: '#f23838',
      onPress: () => {},
    },
    points: {
      title: 'Campus Points',
      text: 'You have claimed campus points!',
      image: CelebrationConfetti,
    },
    info: {
      title: 'Hey there, this is just a test popup',
      text: 'If you can see this it means everything is working fine',
      icon: 'info',
      iconColor: '#23ebae',
      onPress: () => {},
    },
    'saved-image': {
      title: 'Successfully saved image',
      text: 'You have successfully saved the image to your cameraroll',
      icon: 'image',
      iconColor: '#23ebae',
    },
    'error-save-image': {
      title: 'Error saving image',
      icon: 'image',
      iconColor: '#f23838',
      text:
        'We could not save your image to your cameraroll. Please check your permissions for the app',
    },
  },
  popup: {
    info: {
      title: 'Heads up',
      text:
        'All Simpsons characters are advised to evacuate due to Mr. Burns enraged behaviour',
      icon: 'info-circle',
      iconColor: GlobalStyle.ColorStyle.blueButtonText,
      buttons: [
        {
          ...blueButton,
          text: 'Okay',
        },
      ],
    },
    welcome: {
      title: 'Welcome',
      text:
        'Feast your eyes on this beauty that has been created by the one almighty Campus42',
      buttons: [
        {
          text: 'Learn more',
          learnmore: true, // Specify that the learnmore prop will be activated here
        },
        {
          ...blueButton,
          text: 'Okay',
        },
      ],
    },
    critical: {
      title: 'Critical Error',
      text: 'This is embarassing, we sincerely apologize for this',
      lottie: ErrorLottie,
      loopLottie: true,
      iconSize: GlobalStyle.Measurements.unit * 3,
      buttons: [
        {
          text: 'Restart app',
          onPress: () => RNRestart.Restart(),
          style: {backgroundColor: GlobalStyle.ColorStyle.redButtonText},
          textStyle: {...GlobalStyle.TextStyle.buttonMedium, color: '#fff'},
        },
      ],
    },
  },
};

export const WelcomeTexts = {
  Home: {
    title: 'Hi There!',
    text:
      'Welcome to Campus42.\nYour campus in your pocket.\nReady to get started?\n',
    buttons: [{...blueButton, text: "I'm Ready!"}],
  },
  Societies: {
    title: 'Societies',
    text:
      'Now you can view and manage your favourite societies in one place. Easily create a new society and organise the roles within seconds.',
  },
  Bubbles: {
    title: 'Introducing Bubbles',
    text:
      'Create bubbles to plan and discuss your next social event\n\nInvite your friends to chat together inside a bubble',
    buttons: [
      {
        text: 'Learn more',
        learnmore: true, // Specify that the learnmore prop will be activated here
      },
      {
        ...blueButton,
        text: 'Get Started',
      },
    ],
  },
  'Bubbles & Channels': {
    title: 'Introducing Bubbles & Channels',
    text:
      'Create bubbles to plan and discuss your next social event. Or stay updated in channels to be sure not to miss anything',
    buttons: [
      {
        text: 'Learn more',
        learnmore: true, // Specify that the learnmore prop will be activated here
      },
      {
        ...blueButton,
        text: 'Get Started',
      },
    ],
  },
};
