import {GlobalStyle} from '../../../../assets/GlobalStyle';
import {styles} from '../style';
import {styles as mapStyles} from './MapView';

const textDummy = {
  ...styles.text,
  marginVertical: 5,
  height: styles.text.fontSize,
  width: GlobalStyle.Measurements.width * 0.9,
};
const iconDummy = {
  ...styles.iconsContainer,
  height: styles.icon.height,
  width: GlobalStyle.Measurements.width * 0.9,
  alignSelf: 'flex-start',
  marginLeft: styles.icon.marginHorizontal,
};

export const eventFocusSkeletonLayout = [
  {
    key: 'title_event',
    ...styles.title,
    marginTop: GlobalStyle.Measurements.height * 0.05,
  },
  {...styles.backgroundImage, ...styles.imgStyle, key: 'cover_image'},
  {
    ...iconDummy,
    key: 'icon_1',
  },
  {
    ...iconDummy,
    key: 'icon_2',
  },
  {
    ...iconDummy,
    marginBottom: GlobalStyle.Measurements.margin,
    key: 'icon_3',
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
  },
  {
    ...mapStyles.map,
    marginVertical: GlobalStyle.Measurements.margin,
    key: 'map',
  },
  {
    ...textDummy,
    key: 'description_5',
  },
  {
    ...textDummy,
    key: 'description_6',
  },
  {
    ...textDummy,
    key: 'description_7',
  },
  {
    ...textDummy,
    key: 'description_8',
  },
  {
    ...textDummy,
    key: 'description_9',
  },
  {
    ...textDummy,
    key: 'description_10',
  },
];
