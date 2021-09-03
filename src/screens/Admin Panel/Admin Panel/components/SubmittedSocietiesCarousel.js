import React from 'react';
import SkeletonContent from 'react-native-skeleton-content-nonexpo';
import PropTypes from 'prop-types';
import {SocietyCarousel} from '../../../../assets/SocietyCarousel/SocietyCarousel';

export function SubmittedSocietiesCarousel(props) {
  return (Array.isArray(props.data) && props.data.length > 0) ||
    props.isLoading ? (
    <SocietyCarousel
      data={props.data || []}
      onPress={(item) => props.navigate('Society Preview', {id: item.id})}
      refresh={() => {}}
      dontShowBookmark
      loading={props.isLoading}
      colors={props.colors}
      title={'Submitted societies'}
    />
  ) : null;
}

SubmittedSocietiesCarousel.defaultProps = {
  isLoading: true,
  data: false,
};

SubmittedSocietiesCarousel.propTypes = {
  isLoading: PropTypes.bool,
  data: PropTypes.oneOfType([PropTypes.bool, PropTypes.array]),
};
