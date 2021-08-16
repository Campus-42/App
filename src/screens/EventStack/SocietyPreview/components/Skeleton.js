import {GlobalStyle} from '../../../../assets/GlobalStyle';
import {styles} from '../style';
import {styles as evtStyles} from '../../EventFocus/style';
import {styles as localCarouselStyles} from '../../HomeScreen/components/EventCarousel/EventSnap';
import {
  ITEM_HEIGHT,
  SLIDER_WIDTH,
  ITEM_WIDTH,
} from '../../HomeScreen/components/EventCarousel/EventCarousel';

const textDummy = {
  ...evtStyles.text,
  marginVertical: 5,
  height: evtStyles.text.fontSize,
  width: GlobalStyle.Measurements.width * 0.9,
};
const iconDummy = {
  ...evtStyles.iconsContainer,
  height: evtStyles.icon.height,
  width: GlobalStyle.Measurements.width * 0.9,
};

const buttonDummy = {
  ...GlobalStyle.ButtonStyle.Large,
  backgroundColor: GlobalStyle.ColorStyle.boneColor,
  marginBottom: GlobalStyle.Measurements.margin,
};

export const societyPreviewSkeletonLayout = [
  {
    ...styles.background,
    key: 'background_image_society_preview',
  },
  {
    ...iconDummy,
    key: 'first_icon_society_preview',
  },
  {
    ...iconDummy,
    key: 'second_icon_society_preview',
  },
  {
    ...iconDummy,
    key: 'third_icon_society_preview',
    marginBottom: GlobalStyle.Measurements.margin,
  },
  {
    ...textDummy,
    key: 'description_1',
  },
  {
    ...textDummy,
    key: 'description_2',
  },
  {
    ...textDummy,
    key: 'description_3',
  },
  {
    ...textDummy,
    key: 'description_4',
    marginBottom: GlobalStyle.Measurements.margin,
  },
  {
    key: 'text_1',
    width: GlobalStyle.Measurements.width * 0.6,
    height: GlobalStyle.Measurements.margin,
    marginHorizontal: localCarouselStyles.text.marginHorizontal,
    marginVertical: localCarouselStyles.text.marginVertical,
    alignSelf: 'flex-start',
    marginLeft: GlobalStyle.Measurements.margin,
  },
  {
    key: 'carousel_1',
    width: ITEM_WIDTH,
    height: ITEM_HEIGHT,
    marginHorizontal: (SLIDER_WIDTH - ITEM_WIDTH) / 2,
    alignSelf: 'center',
    marginBottom: GlobalStyle.Measurements.margin * 1.5,
  },
  {
    key: 'text_2',
    width: GlobalStyle.Measurements.width * 0.6,
    height: GlobalStyle.Measurements.margin,
    marginHorizontal: localCarouselStyles.text.marginHorizontal,
    marginVertical: localCarouselStyles.text.marginVertical,
    alignSelf: 'flex-start',
    marginLeft: GlobalStyle.Measurements.margin,
  },
  {
    key: 'carousel_2',
    width: ITEM_WIDTH,
    height: ITEM_HEIGHT,
    marginHorizontal: (SLIDER_WIDTH - ITEM_WIDTH) / 2,
    alignSelf: 'center',
    marginBottom: GlobalStyle.Measurements.margin * 1.5,
  },
  {...buttonDummy, key: 'chat_button'},
  {...buttonDummy, key: 'web_button'},
];
