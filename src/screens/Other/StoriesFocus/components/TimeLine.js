import React from "react";
import { View, Animated, Easing } from "react-native";
import { StyleSheet } from "react-native";
import * as Animatable from "react-native-animatable";
import { GlobalStyle } from "../../../../assets/GlobalStyle";

export function TimeLine(props) {
  /**
   * The lines under the header that shows
   * how much is left of the story and how
   * much has progressed.
   */

  var { width, index } = props;
  width = width - styles.outer.marginRight;

  const animation = {
    0: { width: 0 },
    1: { width: width },
  };

  console.log("Anim Value:", props.animValue._value);

  return (
    <Animatable.View
      key={`timeline_stories_${index}`}
      animation={animation}
      easing={Easing.linear}
      duration={ANIM_DURATION}
      delay={getAnimDelay(index)}
      style={[styles.outer, { width }]}
    >
      <Animated.View
        ref={this.inner}
        style={[styles.inner, { width: props.animValue.value * width }]}
      />
    </Animatable.View>
  );
}

const HEIGHT = 5;
const ANIM_DURATION = 360;
const ANIM_INIT_DELAY = 250;

function getAnimDelay(index) {
  return ANIM_INIT_DELAY + index * ANIM_DURATION;
}

const styles = StyleSheet.create({
  outer: {
    height: HEIGHT,
    borderRadius: HEIGHT / 2,
    alignSelf: "flex-start",

    backgroundColor: "#aaa",
    marginRight: GlobalStyle.Measurements.marginQuarter,

    shadowColor: "#000",
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.5,
    shadowRadius: 4,
  },
  inner: {
    height: HEIGHT,
    width: 0,
    borderRadius: HEIGHT / 2,

    backgroundColor: "#fff",
  },
});
