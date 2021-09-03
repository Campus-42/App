import {Measurements} from './Measurements';
import {FONT_SIZE} from './Header';

export const UX = {
  onScrollForAnimatingHeader: async function (
    nativeEvent,
    header,
    margin = Measurements.margin * 2.2,
  ) {
    // header.current.setOffset(nativeEvent.contentOffset.y, margin);
  },
  onScrollReleaseForAnimatingHeader: async function (
    nativeEvent,
    header,
    scroll,
    margin = Measurements.margin * 2.2,
  ) {
    // console.log('RELEASED');
    // const half = margin / 2;
    // const passedHalf = Math.abs(nativeEvent.locationY) >= half;
    // const destination = passedHalf ? 'up' : 'down';
    // const newOpacity = passedHalf ? 1 : 0;
    // header.current.animateOffset(destination, newOpacity);
    // scroll.current.scrollTo({y: passedHalf ? nativeEvent.locationY : 0});
  },
  howToOpenEvent: async function (event, navigate) {},
};
