import React from 'react';
import {Text, View} from 'react-native';
import {auth, db} from '../../../../../assets/Firebase/Firebase';
import {
  parseEventData,
  parseSocietyData,
} from '../../../../../assets/Firebase/functions';
import {SocietySnap} from '../../../../../assets/SocietyCarousel/SocietySnap';
import {
  EventSnap,
  styles,
} from '../../../../EventStack/HomeScreen/components/EventCarousel/EventSnap';
import {View as AnimView} from 'react-native-animatable';
import SkeletonContent from 'react-native-skeleton-content-nonexpo';
import {styles as evtStyles} from '../../../../EventStack/HomeScreen/components/EventCarousel/EventSnap';
import {analytics} from '../../../../../assets/Analytics';
import {GlobalStyle} from '../../../../../assets/GlobalStyle';
import Icon from 'react-native-vector-icons/MaterialIcons';
import {LikeContainer} from '../LikeContainer';

export function Custom(props) {
  const [data, setData] = React.useState({});
  const [error, setError] = React.useState(false);
  const [mounted, setMounted] = React.useState(false);
  const [id, setID] = React.useState(false);
  const [type, setType] = React.useState(false);

  const {item} = props;
  const isSender = item.creator == auth.currentUser.uid;

  if (item.custom && !mounted) {
    setMounted(true);
    setType(item.__data.type);
    setID(item.__data.id);
    if (['event', 'society'].includes(item.__data.type))
      setTimeout(
        () =>
          objFetches[item.__data.type](
            props.reduxAppStore.campus.key,
            item.__data.id,
            setData,
            setError,
          ),
        750,
      );
  }

  const isLoading =
    ['event', 'society'].includes(type) && Object.keys(data).length == 0;

  return item.custom ? (
    <AnimView
      style={{padding: 5, marginVertical: 10}}
      animation={animation}
      duration={500}>
      <SkeletonContent
        isLoading={isLoading && !error}
        layout={skeleton}
        containerStyle={{
          alignSelf: 'center',
          ...skeleton,
        }}>
        {error ? (
          <View
            style={[
              styles.container,
              {
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center',
                padding: GlobalStyle.Measurements.margin,

                shadowOpacity: 0.3,
                shadowRadius: 10,
                elevation: 8,
              },
            ]}>
            <Icon
              name={'error'}
              color={GlobalStyle.ColorStyle.redButtonText}
              size={GlobalStyle.Measurements.unit * 1.5}
              style={{marginBottom: 10}}
            />
            <Text style={GlobalStyle.TextStyle.headingSmall}>
              Could not find {type}
            </Text>
          </View>
        ) : type == 'event' ? (
          <EventSnap
            showShadow
            bookmarks={props.store.user.bookmarks}
            // touchableProps={touchableAnimation}
            data={data}
            reduxEvent={props.reduxAppStore.events[id]}
            tagColors={props.tagColors}
            colors={props.reduxAppStore.campus.colors}
            allowDoublePress={props.allowLiking}
            onDoublePress={() => props.toggleLike(item)}
            openEvent={() => props.navigate('Event Focus', {id: id})}
            onLongPress={() => props.onHold(item.id)}
          />
        ) : type == 'society' ? (
          Object.keys(data).length > 0 && (
            <SocietySnap
              showShadow
              bookmarks={props.store.user.bookmarks}
              // touchableProps={touchableAnimation}
              data={data}
              reduxSociety={props.reduxAppStore.societies[id]}
              allowDoublePress={props.allowLiking}
              onDoublePress={() => props.toggleLike(item)}
              onPress={() => props.navigate('Society Preview', {id: id})}
              colors={props.reduxAppStore.campus.colors}
              onLongPress={() => props.onHold(item.id)}
            />
          )
        ) : null}
        <LikeContainer
          item={item}
          isSender={isSender}
          onPress={props.onLikeContainerPress}
          members={props.members}
          backgroundColor={'#fff'}
          style={{
            marginLeft: -5,
            alignSelf: 'flex-end',
            backgroundColor: '#fff',
            shadowOpacity: 0.1,
          }}
          size={1.35}
        />
      </SkeletonContent>
    </AnimView>
  ) : null;
}

const skeleton = [
  {
    id: 'skeleton_message_custom_view',
    width: evtStyles.container.width,
    height: evtStyles.container.height,
    borderRadius: evtStyles.container.borderRadius,
  },
];

const animation = {
  0: {scale: 0.8},
  1: {scale: 1},
};
export const objFetches = {
  event: function (campusKey, id, setData, setError) {
    db.collection('campuses')
      .doc(campusKey)
      .collection('events')
      .doc(id)
      .get()
      .then(async (doc) => {
        setData(await parseEventData(doc.data(), doc.id));
        setError(doc.exists == false);
      })
      .catch((err) => {
        setError(true);
        analytics.error(err, 'CustomMessageView', 'objFetehces/event');
      });
  },
  society: function (campusKey, id, setData, setError) {
    db.collection('campuses')
      .doc(campusKey)
      .collection('societies')
      .doc(id)
      .get()
      .then(async (doc) => {
        setData(await parseSocietyData(doc.data(), doc.id));
        setError(doc.exists == false);
      })
      .catch((err) => {
        setError(true);
        analytics.error(err, 'CustomMessageView', 'objFetehces/society');
      });
  },
};

// TODO: change to include blogs
// function blog(campusKey, id, setData) {
//   db.collection('campuses')
//     .doc(campusKey)
//     .collection('blogs')
//     .doc(id)
//     .get()
//     .then(async (doc) => {
//       setData(await parseSocietyData(doc.data(), doc.id));
//     });
// }
