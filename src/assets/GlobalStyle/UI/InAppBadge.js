import React from "react";
import { View, Text } from "react-native";
import { Measurements } from "../Measurements";
import { ColorStyle } from "../ColorStyle";
import PropTypes from "prop-types";
import { inAppBadgeEmitter } from "../../EventEmitter";
import { TextStyle } from "../TextStyle";

export function InAppBadge(props) {
  /**
   * An in-app badge to place in order to draw attention from the user.
   */
  const color = props.color || ColorStyle.getCampusColors().main;

  const textStyleAndSize = { ...textStyle, fontSize: sizes[props.size] * 0.85 };

  return (
    <View
      style={[
        style,
        {
          width: sizes[props.size] * 1.5,
          height: sizes[props.size] * 1.5,
          backgroundColor: color,
          shadowColor: color,
        },
        props.number && {
          paddingHorizontal: 7,
          paddingVertical: 3,
        },
        props.style,
      ]}
    >
      {props.number && <Text style={textStyleAndSize}>{props.number}</Text>}
    </View>
  );
}
const sizes = {
  xsmall: 8,
  small: 10,
  regular: 13,
  large: 15,
  xlarge: 20,
};
const style = {
  position: "absolute",
  zIndex: 1000,

  minWidth: 16,
  minHeight: 16,
  borderRadius: 20,
  backgroundColor: "#f23427",
  marginBottom: -5,
  marginLeft: Measurements.width * 0.8 - 10,

  shadowColor: "#f23427",
  shadowOffset: { width: 0, height: 2 },
  shadowRadius: 2,
  shadowOpacity: 0.3,

  flexDirection: "row",
  alignItems: "center",
  justifyContent: "center",
};
const textStyle = {
  ...TextStyle.bodySmall,
  color: "#ffffff",
  fontWeight: "bold",
};

InAppBadge.defaultProps = {
  style: {},
  size: "regular",
  animate: true,
  key: "-",
  number: false,
};
InAppBadge.propTypes = {
  style: PropTypes.object,
  size: PropTypes.oneOf(["xsmall", "small", "regular", "large", "xlarge"]),
  animate: PropTypes.bool,
  key: PropTypes.string.isRequired,
  number: PropTypes.number,
};
