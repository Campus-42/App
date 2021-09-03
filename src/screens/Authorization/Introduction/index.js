import React from 'react';
import Swiper from 'react-native-swiper';
import {getSignedInUserInfo} from '../../../assets/Firebase/functions';
import {NotificationPage} from './NotificationPage';
import {styles} from './style';

export function Introduction(props) {
  const swiper = React.useRef();
  const [index, setIndex] = React.useState(0);

  async function next() {
    if (index + 1 === swiper.current.state.total) {
      getSignedInUserInfo()
        .then((user) => props.updateSignIn(true, user, true))
        .catch((err) => console.warn('DO SOMETHING', err))
        .finally(() => {
          return;
        });
    } else {
      swiper.current.scrollBy(index + 1);
      return;
    }
  }
  return (
    <Swiper
      ref={swiper}
      onIndexChanged={() => setIndex(index)}
      style={styles.swiper}
      horizontal
      showsPagination
      scrollEnabled={false}>
      <NotificationPage next={next} />
    </Swiper>
  );
}
