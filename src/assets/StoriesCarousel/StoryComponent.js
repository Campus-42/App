import React from "react";
import { View, Text } from "react-native";
import PropTypes from "prop-types";
import { StyleSheet, TouchableOpacity } from "react-native";
import { GlobalStyle } from "../GlobalStyle";
import * as Animatable from "react-native-animatable";

export function StoryComponent(props) {
  const { item, colors, navigation } = props;
  const { latest_story } = item;

  const unread = true;

  if (!latest_story) return null;
  return (
    <TouchableOpacity
      style={styles.container}
      onPress={() =>
        props.navigation.navigate("Stories Focus", { id: item.id })
      }
    >
      <View style={[styles.circle, unread && { borderColor: colors.main }]}>
        {latest_story.type === "image" ? (
          <GlobalStyle.UI.Image
            source={{ uri: latest_story.uri }}
            style={styles.graphic}
          />
        ) : (
          latest_story.type === "video" && (
            <GlobalStyle.UI.Video
              source={{ uri: latest_story.uri }}
              style={styles.graphic}
            />
          )
        )}
      </View>
      <Text
        style={styles.title}
        numberOfLines={2}
        adjustsFontSizeToFit
        minimumFontScale={0.8}
      >
        {item.name}
      </Text>
    </TouchableOpacity>
  );
}

const SIZE = GlobalStyle.Measurements.unit * 4;
const PADDING = 4;

const styles = StyleSheet.create({
  container: {
    marginRight: SIZE / 4,
    alignItems: "center",
    justifyContent: "center",
  },
  circle: {
    height: SIZE,
    width: SIZE,
    borderWidth: PADDING * (5 / 6),
    borderColor: "#bbb",

    borderRadius: SIZE / 2,

    marginBottom: GlobalStyle.Measurements.marginQuarter,

    alignItems: "center",
    justifyContent: "center",
  },
  graphic: {
    height: SIZE - PADDING * 3,
    width: SIZE - PADDING * 3,

    borderRadius: (SIZE - PADDING * 3) / 2,

    backgroundColor: "#ddd",
  },
  title: {
    ...GlobalStyle.TextStyle.bodySmall,
    fontWeight: "bold",
    alignSelf: "center",
    textAlign: "center",
    width: SIZE,
  },
});
