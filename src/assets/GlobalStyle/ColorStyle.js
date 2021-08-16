import {Appearance, useColorScheme} from 'react-native';

const useDark = false;
var campusColors = {
  main: '#00000000',
  dark: '#00000000',
  light: '#00000000',
};

export const Palettes = {
  background: {
    palette1: useDark ? 'rgb(142,142,142)' : 'rgb(142,142,142)',
    palette2: useDark ? 'rgb(99,99,99)' : 'rgb(174,174,174)',
    palette3: useDark ? 'rgb(72,72,72)' : 'rgb(99,99,99)',
    palette4: useDark ? 'rgb(58,58,58)' : 'rgb(209,209,209)',
    palette5: useDark ? 'rgb(44,44,44)' : 'rgb(229,229,229)',
    palette6: useDark ? 'rgb(28,28,28)' : 'rgb(255,255,255)',
  },
  text: {
    palette1: !useDark ? 'rgb(142,142,142)' : 'rgb(142,142,142)',
    palette2: !useDark ? 'rgb(99,99,99)' : 'rgb(174,174,174)',
    palette3: !useDark ? 'rgb(72,72,72)' : 'rgb(99,99,99)',
    palette4: !useDark ? 'rgb(58,58,58)' : 'rgb(209,209,209)',
    palette5: !useDark ? 'rgb(44,44,44)' : 'rgb(229,229,229)',
    palette6: !useDark ? 'rgb(28,28,28)' : 'rgb(255,255,255)',
  },
  inverseBackground: {
    palette1: !useDark ? 'rgb(142,142,142)' : 'rgb(142,142,142)',
    palette2: !useDark ? 'rgb(99,99,99)' : 'rgb(174,174,174)',
    palette3: !useDark ? 'rgb(72,72,72)' : 'rgb(99,99,99)',
    palette4: !useDark ? 'rgb(58,58,58)' : 'rgb(209,209,209)',
    palette5: !useDark ? 'rgb(44,44,44)' : 'rgb(229,229,229)',
    palette6: !useDark ? 'rgb(28,28,28)' : 'rgb(255,255,255)',
  },
  inverseText: {
    palette1: useDark ? 'rgb(142,142,142)' : 'rgb(142,142,142)',
    palette2: useDark ? 'rgb(99,99,99)' : 'rgb(174,174,174)',
    palette3: useDark ? 'rgb(72,72,72)' : 'rgb(99,99,99)',
    palette4: useDark ? 'rgb(58,58,58)' : 'rgb(209,209,209)',
    palette5: useDark ? 'rgb(44,44,44)' : 'rgb(229,229,229)',
    palette6: useDark ? 'rgb(28,28,28)' : 'rgb(255,255,255)',
  },
};

export const ColorStyle = {
  greyBackground: useDark ? '#2c2c2e' : '#f0f0f5',
  baseBackground: useDark ? 'rgb(28,28,28)' : '#ffffff',
  textBase: useDark ? '#ffffff' : '#000000',
  textHeading: useDark ? '#ffffff' : '#000000',
  iconColor: useDark ? '#ffffff' : '#000000',
  blueButtonText: '#2482ed',
  redButtonText: '#ff4842',
  boneColor: '#e1e9ee',
  highlightColor: '#f2f8fc',
  confirmationGreen: '#49e20e',
  confirmationRed: '#ff0800',
  unread: '#26b3f0',
  candyRed: '#ff0078',
  pinColour: '#eb8334',
  // referralColour: '#f5e642',
  referralColour: '#c242f5',
  setCampusColors: (colors) => (campusColors = colors),
  getCampusColors: () => campusColors,
};
