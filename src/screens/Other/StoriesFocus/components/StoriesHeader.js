import React from "react";
import { Pressable } from "react-native";
import { StyleSheet } from "react-native";
import { TouchableOpacity } from "react-native";
import { View, Image, Text } from "react-native";
import StaticSafeAreaInsets from "react-native-static-safe-area-insets";
import FontAwesome5Icon from "react-native-vector-icons/FontAwesome5";
import { GlobalStyle } from "../../../../assets/GlobalStyle";
import * as Animatable from "react-native-animatable";
import { TimeLine } from "./TimeLine";
import { Dimensions } from "react-native";

export class StoriesHeader extends React.Component {
  render() {
    var { currentStoryAuthor, currentGraphicIndex } = this.props;

    return (
      <View style={styles.container} onLayout={this.props.onLayout}>
        <View style={styles.row}>
          {(currentStoryAuthor || __DEV__) && (
            <Animatable.View
              animation={"flipInX"}
              useNativeDriver
              duration={500}
              delay={550}
              style={styles.authorContainer}
            >
              <GlobalStyle.UI.Image
                source={{ uri: (currentStoryAuthor || {}).image }}
                style={styles.authorImage}
              />
              <View style={styles.column}>
                <Text
                  style={styles.authorTitle}
                  numberOfLines={this.props.showJoin ? 1 : 2}
                >
                  {(currentStoryAuthor || {}).name}
                </Text>
                {this.props.showJoin && (
                  <TouchableOpacity
                    style={styles.authorButton}
                    onPress={this.props.onJoinPress}
                  >
                    <Text style={styles.authorButtonText}>JOIN</Text>
                  </TouchableOpacity>
                )}
              </View>
            </Animatable.View>
          )}
          <Pressable
            onPress={this.props.goBack}
            style={styles.icon}
            hitSlop={8}
          >
            <FontAwesome5Icon
              name={"chevron-down"}
              size={CHEVRON_SIZE}
              color={"#fff"}
            />
          </Pressable>
        </View>
      </View>
    );
  }
}

const CHEVRON_SIZE = GlobalStyle.Measurements.unit;
const PADDING = GlobalStyle.Measurements.marginHalf;
const OUTER_PADDING = GlobalStyle.Measurements.margin;
const AUTHOR_IMAGE_SIZE = GlobalStyle.Measurements.unit * 2;
const TITLE_WIDTH =
  GlobalStyle.Measurements.width * 0.5 -
  (AUTHOR_IMAGE_SIZE - CHEVRON_SIZE - PADDING * 2 - OUTER_PADDING * 2);
const TIME_LINE_CONTAINER_WIDTH =
  GlobalStyle.Measurements.width - OUTER_PADDING * 2;

const styles = StyleSheet.create({
  container: {
    position: "absolute",
    top: StaticSafeAreaInsets.safeAreaInsetsTop,

    paddingHorizontal: OUTER_PADDING,

    width: GlobalStyle.Measurements.width,
  },
  row: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  timeLinesContainer: {
    width: TIME_LINE_CONTAINER_WIDTH,
    flexDirection: "row",
    justifyContent: "flex-start",
    alignItems: "center",

    paddingTop: GlobalStyle.Measurements.marginHalf,
  },
  icon: {
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.5,
    shadowRadius: 4,
    elevation: 5,
  },

  authorContainer: {
    backgroundColor: "#fff",
    paddingHorizontal: PADDING,
    paddingVertical: PADDING / 2,
    borderRadius: GlobalStyle.Measurements.unit / 2,

    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  authorTitle: {
    ...GlobalStyle.TextStyle.bodyMedium,
    width: TITLE_WIDTH,
  },
  authorImage: {
    height: AUTHOR_IMAGE_SIZE,
    width: AUTHOR_IMAGE_SIZE,
    borderRadius: AUTHOR_IMAGE_SIZE / 4,
    marginVertical: PADDING / 2,

    marginRight: PADDING,

    backgroundColor: GlobalStyle.ColorStyle.boneColor,
  },
  authorButton: {
    paddingHorizontal: 6,
    paddingVertical: 4,
    marginTop: 4,
    backgroundColor: GlobalStyle.ColorStyle.blueButtonText,
    alignSelf: "flex-start",
    borderRadius: 100,
  },
  authorButtonText: {
    ...GlobalStyle.TextStyle.bodySmall,
    fontWeight: "bold",
    letterSpacing: 1,
    color: "#fff",
  },
  column: {
    flexDirection: "column",
    justifyContent: "space-between",
    alignItems: "center",
  },
  debugRow: {
    width: TIME_LINE_CONTAINER_WIDTH,
    flexDirection: "row",
    justifyContent: "flex-start",
    alignItems: "center",

    marginTop: 10,
    padding: 5,
    borderRadius: 5,
    backgroundColor: "#ffffff20",
  },
  debugText: {
    ...GlobalStyle.TextStyle.tech,
    fontWeight: "600",
    fontSize: Dimensions.get("screen").fontScale * 14,
    color: "#fff",
  },
});
