import React from 'react';
import {View} from 'react-native';
import SkeletonContent from 'react-native-skeleton-content-nonexpo';
import {GlobalStyle} from '../../../../assets/GlobalStyle';
import {EventSnap} from '../../../EventStack/HomeScreen/components/EventCarousel/EventSnap';
import * as Animatable from 'react-native-animatable';

export const EditEventSnap = (props) => {
  return (
    // <SkeletonContent
    //   containerStyle={{
    //     marginVertical: GlobalStyle.Measurements.marginHalf,
    //     alignSelf: 'center',
    //   }}
    //   key={`Edit Event Snap Skeleton ${props.event.id}`}
    //   isLoading={props.isLoading}
    //   layout={[
    //     {
    //       key: `Edit Event Snap Skeleton Layout ${props.event.id}`,
    //       width: GlobalStyle.Measurements.width * 0.8,
    //       height: GlobalStyle.Measurements.unit * 7,
    //       borderRadius: GlobalStyle.Measurements.unit / 2,
    //     },
    //   ]}>
    <Animatable.View
      style={{
        marginVertical: GlobalStyle.Measurements.marginHalf,
        alignSelf: 'center',
      }}
      duration={500}
      animation={"fadeInUpBig"}
      delay={props.index * 50}
      >
      <EventSnap
        shouldOnPress
        openEvent={props.openEvent}
        data={props.event}
        colors={props.colors}
        tagColors={props.tagColors}
        bookmarks={props.bookmarks}
      />
    </Animatable.View>
    // </SkeletonContent>
  );
};
