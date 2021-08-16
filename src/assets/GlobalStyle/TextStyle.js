import {Dimensions, Platform, StyleSheet} from 'react-native';
import {ColorStyle, Palettes} from './ColorStyle';
const {fontScale} = Dimensions.get('screen');
import {Measurements} from './Measurements';

// const fontBody = 'RoundedMplus1c-Regular';
const fontBody = 'Oxygen-Regular';
const fontHeading = 'Ubuntu-Regular';
const fontLevel = 'ConcertOne-Regular';
// const fontHeading = 'RoundedMplus1c-Regular';
const fontTech = 'Menlo';

const fontSizes = {
  body: {
    small: {letterSpacing: 0.5, fontSize: fontScale * 11},
    regular: {letterSpacing: 0.5, fontSize: fontScale * 13},
    medium: {letterSpacing: 0.5, fontSize: fontScale * 13},
    large: {letterSpacing: 0.5, fontSize: fontScale * 15},
  },
  heading: {
    small: {letterSpacing: 0.3, fontSize: fontScale * 15},
    regular: {letterSpacing: 0.3, fontSize: fontScale * 17},
    medium: {letterSpacing: 0.3, fontSize: fontScale * 17},
    large: {letterSpacing: 0.3, fontSize: fontScale * 21},
  },
  logo: {
    small: {fontSize: fontScale * 24},
    regular: {fontSize: fontScale * 30},
  },
  textInput: {
    small: {letterSpacing: 0.2, fontSize: fontScale * 15},
    regular: {letterSpacing: 0.2, fontSize: fontScale * 17},
    medium: {letterSpacing: 0.2, fontSize: fontScale * 17},
  },
};

const fontStylesAndColor = StyleSheet.create({
  regular:
    Platform.OS == 'android'
      ? {
          fontFamily: fontBody,
          fontWeight: '400',
        }
      : {fontWeight: '400'},
  medium:
    Platform.OS == 'android'
      ? {
          fontFamily: fontBody.replace('Regular', 'Medium'),
          fontWeight: '700',
        }
      : {fontWeight: '700'},
  bold:
    Platform.OS == 'android'
      ? {
          fontFamily: fontBody.replace('Regular', 'Bold'),
          fontWeight: 'bold',
        }
      : {fontWeight: 'bold'},
});

export const TextStyle = StyleSheet.create({
  levelText: {
    ...fontSizes.heading.medium,
    fontFamily: fontLevel,
    color: ColorStyle.textBase,
  },
  bodySmall: {
    ...fontSizes.body.small,
    ...fontStylesAndColor.regular,
    color: ColorStyle.textBase,
    fontFamily: fontBody,
    letterSpacing: 0.5,
  },
  bodyRegular: {
    ...fontSizes.body.regular,
    ...fontStylesAndColor.regular,
    color: ColorStyle.textBase,

    fontFamily: fontBody,
  },
  bodyMedium: {
    ...fontSizes.body.medium,
    ...fontStylesAndColor.medium,
    color: ColorStyle.textBase,

    fontFamily: fontBody,
  },
  bodyLarge: {
    ...fontSizes.body.large,
    ...fontStylesAndColor.regular,
    color: ColorStyle.textBase,

    fontFamily: fontBody,
  },
  bodyLargeBold: {
    ...fontSizes.body.large,
    ...fontStylesAndColor.bold,
    color: ColorStyle.textBase,

    fontFamily: fontBody,
  },
  headingSmall: {
    ...fontSizes.heading.small,
    ...fontStylesAndColor.regular,
    color: ColorStyle.textHeading,
    fontFamily: fontHeading,
  },
  headingRegular: {
    ...fontSizes.heading.regular,
    ...fontStylesAndColor.regular,
    color: ColorStyle.textHeading,

    fontFamily: fontHeading,
  },
  headingMedium: {
    ...fontSizes.heading.medium,
    ...fontStylesAndColor.medium,
    color: ColorStyle.textHeading,
    marginVertical: 5,

    fontFamily: fontHeading,
  },
  headingLarge: {
    ...fontSizes.heading.large,
    ...fontStylesAndColor.medium,
    color: ColorStyle.textHeading,
    marginVertical: 5,

    fontFamily: fontHeading,
  },
  logoSmall: {
    ...fontSizes.logo.small,
    ...fontStylesAndColor.bold,
    color: ColorStyle.textHeading,

    fontFamily: fontBody,
  },
  logoRegular: {
    ...fontSizes.logo.regular,
    ...fontStylesAndColor.bold,
    color: Palettes.text.palette6,

    fontFamily: fontBody,
  },
  placeHolder: {
    color: Palettes.text.palette1,
  },
  textInputSmall: {
    ...fontSizes.textInput.small,
    ...fontStylesAndColor.regular,
    color: ColorStyle.textBase,
    fontFamily: fontBody,
    minWidth: Measurements.width * 0.6,
  },
  textInputRegular: {
    ...fontSizes.textInput.regular,
    ...fontStylesAndColor.regular,
    color: ColorStyle.textBase,

    fontFamily: fontBody,
  },
  textInputMedium: {
    ...fontSizes.textInput.medium,
    ...fontStylesAndColor.medium,
    color: ColorStyle.textBase,

    fontFamily: fontBody,
  },
  tech: {
    ...fontSizes.body.small,
    color: ColorStyle.textBase,

    fontFamily: fontTech,
  },
  buttonLarge: {
    ...fontSizes.body.large,
    ...fontStylesAndColor.medium,

    color: '#ffffff',
    fontSize: Dimensions.get('screen').fontScale * 17,
  },
  buttonMedium: {
    ...fontSizes.body.medium,
    ...fontStylesAndColor.medium,
    fontWeight: '500',

    fontSize: Dimensions.get('screen').fontScale * 15,
  },
  buttonSmall: {
    ...fontSizes.body.small,
    ...fontStylesAndColor.regular,

    fontSize: Dimensions.get('screen').fontScale * 14,
  },
  bodyHeadingMedium: {
    ...fontSizes.heading.medium,
    ...fontStylesAndColor.medium,
    color: ColorStyle.textHeading,

    fontFamily: fontBody,
  },
  drawerText: {
    ...fontSizes.body.medium,
    ...fontStylesAndColor.medium,
    color: ColorStyle.textBase,
  },
  blueText: {
    ...fontSizes.body.small,
    ...fontStylesAndColor.regular,

    fontSize: Dimensions.get('screen').fontScale * 14,
    color: ColorStyle.blueButtonText,
  },
  redText: {
    ...fontSizes.body.small,
    ...fontStylesAndColor.regular,

    fontSize: Dimensions.get('screen').fontScale * 14,
    color: ColorStyle.redButtonText,
  },
});
