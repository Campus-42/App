import {GlobalStyle} from '../GlobalStyle';

export function getSize(size) {
  switch (size) {
    case 'xsmall':
      return GlobalStyle.Measurements.unit * 1.5;
    case 'small':
      return GlobalStyle.Measurements.unit * 2;
    case 'regular':
      return GlobalStyle.Measurements.unit * 3;
    case 'large':
      return GlobalStyle.Measurements.unit * 4;
    default:
      return GlobalStyle.Measurements.unit * 3;
  }
}
