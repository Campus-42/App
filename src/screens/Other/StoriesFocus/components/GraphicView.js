import React from "react";
import PropTypes from "prop-types";
import { StyleSheet, View, Text } from "react-native";
import { GlobalStyle } from "../../../../assets/GlobalStyle";
import RNVideo from "react-native-video";
import { Pressable } from "react-native";
import * as Animatable from "react-native-animatable";
import { Dimensions } from "react-native";
import Animated, { Easing } from "react-native-reanimated";
import StaticSafeAreaInsets from "react-native-static-safe-area-insets";

export class GraphicView extends React.PureComponent {
  constructor() {
    super();
    this.animatable = React.createRef();
    this.duration = 0;

    this.state = {
      progress: new Animated.Value(0),
      paused: false,
      startTimestamp: 0,
      playedProgress: 0,
    };
  }
  componentDidUpdate(prevProps) {
    const newGraphic = prevProps.lastIndexChange !== this.props.lastIndexChange;

    if (newGraphic) {
      this.setState({ playedProgress: 0 });
    }
  }
  componentWillUnmount() {
    clearTimeout(this.timeout);
  }

  render() {
    var { graphic } = this.props;
    graphic = graphic || {}; // Error prevent

    var numberOfGraphics = this.props.graphicsFomCurrentAuthor.length;
    if (numberOfGraphics === 0) numberOfGraphics = 1;
    var timeLineWidths =
      MAX_TIMELINE_WIDTH / numberOfGraphics - styles.outerLine.marginRight;

    const animValue = this.state.progress.interpolate({
      inputRange: [0, 1],
      outputRange: [0, timeLineWidths],
    });

    return (
      <React.Fragment>
        <View ref={this.animatable} style={{ backgroundColor: "#000" }}>
          {graphic.type === "image" ? (
            <GlobalStyle.UI.Image
              style={styles.graphic}
              source={{ uri: graphic.uri }}
              resizeMode={"cover"}
              onLoadEnd={this.onLoad}
            />
          ) : (
            graphic.type === "video" && (
              <RNVideo
                style={styles.graphic}
                source={{ uri: graphic.uri }}
                resizeMode={"cover"}
                onLoadEnd={this.onLoad}
                onEnd={this.props.onEndReached}
              />
            )
          )}
        </View>
        <Pressable
          style={[styles.pressable, { alignSelf: "flex-start" }]}
          onPress={this.onLeftPress}
          onLongPress={this.onLongPress}
          onTouchEnd={this.onTouchEnd}
        />
        <Pressable
          style={[styles.pressable, { alignSelf: "flex-end" }]}
          onPress={this.onRightPress}
          onLongPress={this.onLongPress}
          onTouchEnd={this.onTouchEnd}
        />

        {__DEV__ && (
          <View style={styles.debug}>
            <Animated.Text style={styles.debugText}>
              Index: {graphic.index}, Duration: {this.duration}, Graphics:{" "}
              {numberOfGraphics}, Type: '{graphic.type}', Paused:{" "}
              {this.state.paused.toString()}
            </Animated.Text>
          </View>
        )}

        {this.props.headerLayout && (
          <View
            style={[
              styles.timelineContainer,
              {
                top:
                  this.props.headerLayout.height +
                  StaticSafeAreaInsets.safeAreaInsetsTop,
              },
            ]}
          >
            {this.props.graphicsFomCurrentAuthor.map((val, index) => (
              <Animatable.View
                key={`timeline_outer_${index}_${this.props.storyAuthorId}`}
                style={[styles.outerLine, { width: timeLineWidths }]}
                animation={"fadeIn"}
                duration={550}
                delay={450}
                useNativeDriver
              >
                <Animated.View
                  // Set the key to force a re-rendering and avoid lagging animations
                  key={`timeline_${index}_${graphic.index == index}_${
                    this.props.storyAuthorId
                  }`}
                  style={[
                    styles.innerLine,
                    graphic.index == index
                      ? { width: animValue }
                      : graphic.index > index
                      ? { width: timeLineWidths }
                      : { width: 0 },
                  ]}
                />
              </Animatable.View>
            ))}
          </View>
        )}
      </React.Fragment>
    );
  }

  onLoad = (nativeEvent = {}) => {
    this.state.progress.setValue(0);

    const { graphic } = this.props;

    // Set the duration
    var duration;
    if (graphic.type === "image") duration = 8000;
    else duration = nativeEvent.duration;
    console.log("Finished loading", duration);

    this.duration = duration;

    this.animate({ duration });
  };

  animate = ({ duration }) => {
    // Prepare animation
    this.animation = Animated.timing(this.state.progress, {
      toValue: 1,
      duration,
      easing: Easing.linear,
    });

    // Timestamp
    this.setState({ startTimestamp: Date.now() });

    // Call new timeout
    if (this.props.graphic.type === "image") this.setNewTimeout(duration);

    this.animation.start();
  };

  setNewTimeout = (delay) => {
    try {
      clearTimeout(this.timeout);
    } catch (err) {}

    this.timeout = setTimeout(this.props.onEndReached, delay);
  };

  onLeftPress = () => {
    // TODO: Animation when pressed, border flashes
    this.props.onLeftPress();
  };
  onRightPress = () => {
    // TODO: Animation when pressed, border flashes
    this.props.onRightPress();
  };
  onLongPress = () => {
    // TODO: Animation when pressed, border flashes
    this.animation.stop();
    const progress = (Date.now() - this.state.startTimestamp) / this.duration;
    clearTimeout(this.timeout);

    this.setState({ playedProgress: this.state.playedProgress + progress });

    this.setState({ paused: true });
  };
  onTouchEnd = () => {
    // TODO: Animation when pressed, border flashes
    this.animate({ duration: this.duration * (1 - this.state.playedProgress) });
    this.setState({ paused: false });
  };
}

const MAX_TIMELINE_WIDTH = GlobalStyle.Measurements.width * 0.9;

const styles = StyleSheet.create({
  container: {},
  graphic: {
    width: GlobalStyle.Measurements.width,
    height: GlobalStyle.Measurements.height,
    backgroundColor: "#000",
  },
  pressable: {
    position: "absolute",

    width: GlobalStyle.Measurements.width / 2,
    height: GlobalStyle.Measurements.height,
    top: 0,
    bottom: 0,
  },
  debug: {
    position: "absolute",
    bottom: 50,
    backgroundColor: "#00000090",
    borderRadius: 7.5,
    padding: 7.5,
    alignSelf: "stretch",
    marginHorizontal: 10,

    borderColor: "#fff",
    borderWidth: 0.5,
  },
  debugText: {
    ...GlobalStyle.TextStyle.tech,
    color: "#fff",
    fontSize: Dimensions.get("screen").fontScale * 14,
    fontWeight: "700",
  },
  timelineContainer: {
    position: "absolute",
    alignSelf: "center",
    width: MAX_TIMELINE_WIDTH,

    flexDirection: "row",
    alignItems: "center",
    justifyContent: "flex-start",

    paddingTop: GlobalStyle.Measurements.margin,
  },
  innerLine: {
    height: 6,
    borderRadius: 3,

    backgroundColor: "#fff",
  },
  outerLine: {
    height: 6,
    borderRadius: 3,

    marginRight: 5,
    backgroundColor: "#575757",
  },
});

GraphicView.defaultProps = {
  graphic: {},
  onLongPress: () => {},
  onLeftPress: () => {},
  onRightPress: () => {},
  onLoadStart: () => {},
};
GraphicView.propTypes = {
  graphic: PropTypes.object.isRequired,
  onLongPress: PropTypes.func.isRequired,
  onLeftPress: PropTypes.func.isRequired,
  onRightPress: PropTypes.func.isRequired,
  onLoadStart: PropTypes.func.isRequired,
};

const PRESS_ANIMATIONS = {};