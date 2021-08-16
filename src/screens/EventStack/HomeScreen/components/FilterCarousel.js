import React from 'react';
import {
  FlatList,
  View,
  ScrollView,
  Text,
  TouchableOpacity,
  StyleSheet,
} from 'react-native';
import Ionicon from 'react-native-vector-icons/Ionicons';
import TouchableShrink from '../../../../assets/TouchableShrink/TouchableShrink';
import {GlobalStyle} from '../../../../assets/GlobalStyle';
import SkeletonContent from 'react-native-skeleton-content-nonexpo';

// TODO: Get tag colors

export const FilterCarousel = (props) => {
  return (
    <ScrollView
      contentInset={{right: GlobalStyle.Measurements.margin * 1.5}}
      style={styles.container}
      contentContainerStyle={{
        alignItems: 'center',
        justifyContent: 'flex-start',
      }}
      directionalLockEnabled
      showsHorizontalScrollIndicator={false}
      key="Filter_Scroll_View"
      horizontal>
      {props.rawEventTags.length > 0 && (
        <TouchableOpacity
          style={{padding: 10, marginHorizontal: 10}}
          onPress={props.openFilterModal}>
          <Ionicon
            name={'filter'}
            size={GlobalStyle.TextStyle.headingMedium.fontSize}
            color={GlobalStyle.ColorStyle.blueButtonText}
          />
        </TouchableOpacity>
      )}
      {props.rawEventTags.length > 0 ? (
        props.rawEventTags.slice(0, 3).map((tag) => (
          <SkeletonContent
            isLoading={props.isLoading}
            layout={[
              {
                key: `FilterButton_${tag}_skeleton`,
                width: GlobalStyle.Measurements.width * 0.3,
                height: styles.buttonContainer.paddingVertical * 3.5,
                borderRadius: 50,
                marginHorizontal: styles.buttonContainer.marginHorizontal,
              },
            ]}>
            <FilterButton
              showBorder
              key={`FilterButton_${tag}`}
              tag={tag}
              chosenEventTags={props.chosenEventTags}
              color={props.tagColors[tag]}
              tagPress={() => props.tagPress(tag)}
              campusColor={props.colors.main}
            />
          </SkeletonContent>
        ))
      ) : (
        <Text
          style={[
            GlobalStyle.ButtonStyle.TextButton,
            GlobalStyle.TextStyle.bodyMedium,
          ]}>
          No Tags Available
        </Text>
      )}
    </ScrollView>
  );
};

export const FilterButton = (props) => {
  const color = props.color !== undefined ? props.color : props.campusColor;
  const style = {
    ...styles.buttonContainer,
    backgroundColor: props.chosenEventTags.includes(props.tag)
      ? `${color}40`
      : `${color}07`,
    borderWidth: props.showBorder && 1,
    borderColor: props.chosenEventTags.includes(props.tag)
      ? `${color}10`
      : `${color}70`,
    marginVertical: props.marginVertical || 0,
  };
  return (
    <TouchableShrink
      key={`FilterComponent_${props.tag}_touchable`}
      onPress={props.tagPress}
      triggerHaptic
      hapticScheme={'impactLight'}
      style={style}>
      <Text
        key={`FilterComponent_${props.tag}_text`}
        style={[
          styles.buttonText,
          {
            color: props.color !== undefined ? props.color : props.campusColor,
          },
        ]}>
        {props.tag}
      </Text>
    </TouchableShrink>
  );
};

const styles = StyleSheet.create({
  container: {
    width: GlobalStyle.Measurements.width,
    minHeight: GlobalStyle.Measurements.height * 0.05,
    flexDirection: 'row',
    paddingLeft: GlobalStyle.Measurements.width * 0.05,
    marginVertical: GlobalStyle.Measurements.margin,
  },
  buttonContainer: {
    paddingHorizontal: GlobalStyle.Measurements.marginHalf,
    paddingVertical: GlobalStyle.Measurements.marginHalf,
    borderRadius: GlobalStyle.Measurements.margin,

    alignItems: 'center',
    justifyContent: 'center',

    marginHorizontal: GlobalStyle.Measurements.marginQuarter,
  },
  buttonText: {
    ...GlobalStyle.TextStyle.bodyMedium,
  },
});
