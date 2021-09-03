import React from "react";
import { Image } from "react-native";
import { StyleSheet } from "react-native";
import { View } from "react-native";
import StaticSafeAreaInsets from "react-native-static-safe-area-insets";
import { GlobalStyle } from "../../../../assets/GlobalStyle";
import Video from "react-native-video";
import { Graphics } from "./Graphics";

export class PreviewGraphics extends React.Component {
  constructor() {
    super();
    this.state = { graphicsIndex: 0 };
    this.timeout;
  }

  componentDidMount() {
    const { graphics, campusColors } = this.props;
    if (Array.isArray(graphics)) {
      if (graphics[0].type === "image")
        this.timeout = setTimeout(this.handleRevolvingGraphics, 8000);
    }
  }
  componentWillUnmount() {
    clearTimeout(this.timeout);
  }
  render() {
    const graphic = this.props.graphics[this.state.graphicsIndex] || {};

    return (
      <View>
        {graphic.type === "image" ? (
          <Image
            style={[styles.graphic, { resizeMode: "cover" }]}
            source={{ uri: graphic.uri }}
          />
        ) : (
          graphic.type === "video" && (
            <Video
              repeat={this.props.graphics.length === 1}
              style={styles.graphic}
              paused={false}
              source={{ uri: graphic.uri }}
              resizeMode={"cover"}
              muted={this.props.settings.muted}
              ignoreSilentSwitch={"obey"}
              onEnd={this.handleRevolvingGraphics}
              allowsExternalPlayback={true}
            />
          )
        )}
        {this.props.graphics.length > 1 && (
          <Graphics
            graphics={this.props.graphics}
            campusColors={this.props.campusColors}
            showFooter={false}
            selectedIndex={this.state.graphicsIndex}
            onGraphicDeleted={this.onGraphicDeleted}
            onGraphicPress={this.handleRevolvingGraphics}
            containerStyle={styles.graphicsSlider}
            sizeScale={1.2}
          />
        )}
      </View>
    );
  }
  handleRevolvingGraphics = (graphic) => {
    /** If it is an image, then set a timeout for 8 sec
     * If it is video, then change when video is done */

    clearTimeout(this.timeout);
    // Don't run function if graphics is not an array
    const { graphics } = this.props;
    const { index } = graphics;
    if (!Array.isArray(graphics)) return;

    // Set the new index
    const { graphicsIndex } = this.state;
    var newIndex;
    if (graphicsIndex === graphics.length - 1) newIndex = 0;
    else if (index) newIndex = index;
    else newIndex = graphicsIndex + 1;
    this.setState({ graphicsIndex: newIndex });

    // Handle dependent on type
    const newGraphic = graphics[newIndex] || {};
    if (newGraphic.type === "image")
      this.timeout = setTimeout(this.handleRevolvingGraphics, 8000);
  };

  onGraphicDeleted = (index) => {
    this.props.onGraphicDeleted(index);
  };
}

const styles = StyleSheet.create({
  graphic: {
    height:
      GlobalStyle.Measurements.height - StaticSafeAreaInsets.safeAreaInsetsTop,
    width: GlobalStyle.Measurements.width,

    borderTopLeftRadius: GlobalStyle.Measurements.unit,
    borderTopRightRadius: GlobalStyle.Measurements.unit,
  },
  graphicsSlider: {
    top: undefined,
    bottom:
      StaticSafeAreaInsets.safeAreaInsetsBottom +
      GlobalStyle.Measurements.height * 0.08,
  },
});
