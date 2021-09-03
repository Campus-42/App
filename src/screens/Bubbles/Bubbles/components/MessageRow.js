import React from "react";
import { TouchableOpacity } from "react-native";
import { Pressable } from "react-native";
import { Text } from "react-native";
import { View } from "react-native";
import SkeletonContent from "react-native-skeleton-content-nonexpo";
import { auth, db } from "../../../../assets/Firebase/Firebase";
import { GlobalStyle } from "../../../../assets/GlobalStyle";
import { UserImage } from "../../../ProfileStack/Profile/components/UserImage";
import { MessageFuncs } from "../functions";
import { styles } from "../style";

export function MessageRow(props) {
  // Embedding MessageRow2 as a child since then we know it will receive the proper props and thus not crash
  return (
    <SkeletonContent
      boneColor={GlobalStyle.ColorStyle.boneColor}
      highlightColor={GlobalStyle.ColorStyle.highlightColor}
      layout={skeletonLayout}
      isLoading={props.info._loading}
      containerStyle={[
        styles.messagerowContainer,
        { justifyContent: "center", shadowOpacity: 0, padding: 0 },
      ]}
    >
      <MessageRow2 {...props} />
    </SkeletonContent>
  );
}

export const getMemberNames = (names, onlyFirst = true) =>
  Object.values(names)
    .filter(
      (e) =>
        (e.id || e._id || e.uid) !==
        (auth.currentUser !== null ? auth.currentUser.uid : "-")
    )
    .map((e) => `${e.first_name}${!onlyFirst ? " " + e.last_name : ""}`)

    .slice(0, 5)
    .join(", ");

export function MessageRow2(props) {
  const name = props.info.name || getMemberNames(props.info.member_names);
  const latest = props.info.latest_text || "New message, click to see more";
  const latest_uid = props.info.latest_author_uid;

  const latestIsStillMember = props.info.member_names[latest_uid] !== undefined;

  const latestIsSystem = props.info.latest_text_is_system;
  const latestIsCustom = props.info.latest_text_is_custom;

  /** Get the last author name */
  const latestAuthor =
    props.info.member_names[props.info.latest_author_uid || {}];

  const author = latestIsStillMember
    ? props.info.latest_author_uid === auth.currentUser.uid
      ? "You"
      : latestAuthor.first_name || ""
    : false;

  const timestamp = props.info.latest_timestamp_ms || false;

  const uid = (auth.currentUser || {}).uid;
  const lastOfflineTimestamp =
    (props.info.member_names[uid] || {}).offline_timestamp_ms || 0;
  const lastOnlineTimestamp =
    (props.info.member_names[uid] || {}).online_timestamp_ms || 0;

  const messageTimestamps = props.info.message_timestamps_ms || [];
  const numberOfUnreads = messageTimestamps.filter(
    (m) => m > lastOfflineTimestamp && m > lastOnlineTimestamp
  ).length;

  /**
   * If it is a channel and the latest author is an admin
   * then don't show the name but instead show that it
   * is an admin who sent the message
   */

  const latestIsChannelAdmin =
    props.info.__type === "channel" &&
    (props.info.admins || []).includes(auth.currentUser.uid);

  const isChannel = props.info.__type === "channel";

  return (
    <Pressable
      style={styles.messagerowContainer}
      onPress={() => props.openThread(props.info.id)}
    >
      <View style={styles.threadImageContainer}>
        {props.info.image ? (
          <GlobalStyle.UI.Image
            style={styles.threadImageContainer}
            source={{ uri: props.info.image }}
          />
        ) : (
          !isChannel && (
            <UserImage
              style={styles.threadImageContainer}
              user={
                props.info.member_names[props.info.latest_author_uid] || {
                  first_name: "",
                  last_name: "",
                  image: null,
                }
              }
              colors={props.colors}
              dontShowLevelBadge={true}
            />
          )
        )}
      </View>
      <View style={styles.threadPreviewContainer}>
        <View
          style={{
            flexDirection: "row",
            justifyContent: "space-between",
            alignItems: "center",
            width: "100%",
          }}
        >
          <Text
            numberOfLines={1}
            style={[
              GlobalStyle.TextStyle.bodyLargeBold,
              { width: styles.messagerowContainer.width * 0.45 },
            ]}
          >
            {name}
          </Text>

          {!isChannel && (
            <Text
              style={[GlobalStyle.TextStyle.bodySmall, { marginRight: 10 }]}
            >
              {timestamp && MessageFuncs.getPreviewDate(timestamp)}
            </Text>
          )}
        </View>
        <Text
          numberOfLines={getTagProperties(props.info.__type).text ? 1 : 2} // One line if tag, else 2
          style={styles.previewText}
        >
          {isChannel ? (
            props.info.description
          ) : latestIsSystem ||
            latestIsCustom ||
            author == false ||
            latestIsChannelAdmin ? (
            ""
          ) : (
            <Text style={{ fontWeight: "bold" }}>{author}: </Text>
          )}
          {!isChannel && latest.trim()}
        </Text>
        <MessageRowTag bubble={props.info} />
      </View>
      {numberOfUnreads > 0 && latest_uid !== uid ? (
        <GlobalStyle.UI.InAppBadge
          style={styles.unreadBadge}
          size={"large"}
          number={numberOfUnreads}
        />
      ) : (
        <></>
      )}
    </Pressable>
  );
}

const skeletonLayout = [
  {
    id: "container",
    ...styles.messagerowContainer,
    children: [
      {
        id: "image",
        width: styles.threadImageContainer.width,
        height: styles.threadImageContainer.height,
        borderRadius: styles.threadImageContainer.borderRadius,
      },
      {
        id: "header",
        // marginRight: GlobalStyle.Measurements.width * 0.1,
        // marginLeft: GlobalStyle.Measurements.margin,
        marginTop: 5,
        alignSelf: "flex-start",
        alignItems: "flex-start",
      },

      {
        id: "preview",
        ...styles.threadPreviewContainer,
        children: [
          {
            id: "title",
            width: GlobalStyle.Measurements.width * 0.4,
            height: GlobalStyle.TextStyle.headingRegular.fontSize,
            marginBottom: 10,
          },
          {
            id: "text1",
            width: GlobalStyle.Measurements.width * 0.55,
            height: GlobalStyle.TextStyle.bodyRegular.fontSize,
            marginBottom: 5,
          },
          {
            id: "text1",
            width: GlobalStyle.Measurements.width * 0.45,
            height: GlobalStyle.TextStyle.bodyRegular.fontSize,
          },
        ],
      },
    ],
  },
];

function getTagProperties(type) {
  /** Get the properties for a type if specified */
  switch (type) {
    case "customer_service": {
      return { color: "#0eab3f", text: "Customer service" };
    }
    case "society": {
      return { color: "#d62d30", text: "Society" };
    }
    case "event": {
      return { color: "#3498cf", text: "Event" };
    }
    default: {
      return { color: false, text: false };
    }
  }
}

function MessageRowTag({ bubble }) {
  /** Show a tag for specific types of bubbles */
  const { color, text } = getTagProperties(bubble.__type);

  return color && text ? (
    <View
      style={[styles.messageRowTagContainer, { backgroundColor: `${color}20` }]}
    >
      <Text style={[styles.messageRowTagText, { color }]}>{text}</Text>
    </View>
  ) : null;
}
