import React from 'react';
import SkeletonContent from 'react-native-skeleton-content-nonexpo';
import {BlogCarousel} from '../../../EventStack/HomeScreen/components/BlogCarousel';
import {GlobalStyle} from '../../../../assets/GlobalStyle';
import {localCarouselStyles} from '../../../EventStack/HomeScreen/components/EventCarousel/EventCarousel';
import FontAwesome5Icon from 'react-native-vector-icons/FontAwesome5';

const SLIDER_WIDTH = GlobalStyle.Measurements.width;
export const ITEM_WIDTH = GlobalStyle.Measurements.width * 0.8;
export const ITEM_HEIGHT = GlobalStyle.Measurements.unit * 7;

export function BlogSkeleton(props) {
  return (
    <SkeletonContent
      containerStyle={{width: GlobalStyle.Measurements.width}}
      key="Joined_Society_Blog_Skeleton"
      isLoading={props.isLoading && props.showSkeleton}
      boneColor="#e1e9ee"
      highlightColor="#f2f8fc"
      layout={[
        {
          key: 'text',
          width: GlobalStyle.Measurements.width * 0.6,
          height: GlobalStyle.Measurements.margin,
          marginHorizontal: localCarouselStyles.text.marginHorizontal,
          marginVertical: localCarouselStyles.text.marginVertical,
        },
        {
          key: 'carousel',
          width: ITEM_WIDTH,
          height: ITEM_HEIGHT,
          marginHorizontal: (SLIDER_WIDTH - ITEM_WIDTH) / 2,
        },
      ]}>
      <BlogCarousel {...props} />
    </SkeletonContent>
  );
}

BlogCarousel.defaultProps = {
  showSkeleton: true,
};