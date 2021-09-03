import React from 'react';
import {} from 'react-native';
import SkeletonContent from 'react-native-skeleton-content-nonexpo';
import PropTypes from 'prop-types';

const boneColor = '#e1e9ee';
const highlightColor = '#f2f8fc';

export function Skeleton(props) {
  return (
    <SkeletonContent
      containerStyle={props.style}
      isLoading={props.loading}
      boneColor={boneColor}
      layout={props.layout}
      highlightColor={highlightColor}>
      {props.children}
    </SkeletonContent>
  );
}

Skeleton.defaultProps = {
  layout: [],
  loading: false,
  style: {},
};
Skeleton.propTypes = {
  layout: PropTypes.array.isRequired,
  loading: PropTypes.bool.isRequired,
  style: PropTypes.object,
};
