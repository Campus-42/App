import { Dimensions } from "react-native";
import { StyleSheet } from "react-native";
import { ColorStyle, Palettes } from "../../ColorStyle";
import { Measurements } from "../../Measurements";
import { TextStyle } from "../../TextStyle";

export const MARGIN = Measurements.margin;
const WIDTH = Measurements.width * 0.9;
const INNER_WIDTH = WIDTH - MARGIN * 2;

export const ICON_SIZE = Measurements.unit * 0.6;
export const ICON_COLOUR = Palettes.text.palette3;

export const styles = StyleSheet.create({
  container: {
    width: WIDTH,
    marginVertical: MARGIN / 2,
    borderRadius: Measurements.unit,
    padding: MARGIN,

    backgroundColor: Palettes.background.palette6,
  },
  containerTitle: {
    ...TextStyle.headingMedium,
  },
  containerTitleWrapper: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: MARGIN,
  },
  childrenView: {
    flexDirection: "row",

    alignItems: "center",
    justifyContent: "space-between",
    marginVertical: MARGIN / 2,
  },
  childrenSubView: {
    flexDirection: "column",
    width: INNER_WIDTH - ICON_SIZE * 2 - 10 - MARGIN,
  },
  childrenTitle: {
    ...TextStyle.bodyRegular,
    fontWeight: "500",
    fontSize: Dimensions.get("screen").fontScale * 14,
  },
  childrenText: {
    ...TextStyle.bodyRegular,
    color: Palettes.text.palette4,
  },
  errorContainer: {
    backgroundColor: "#ff000010",
    borderRadius: Measurements.unit / 3,
    borderWidth: 1,
    borderColor: "#ff000070",
    padding: 4,
  },
  errorText: {
    ...TextStyle.bodySmall,
    color: "#ff0000",
    alignSelf: "flex-end",
  },
  icon: {
    backgroundColor: "#ff0000",
    borderRadius: 5,
    alignItems: "center",
    justifyContent: "center",
    marginRight: 10,

    width: Measurements.unit * 1.15,
    height: Measurements.unit * 1.15,
  },
});
