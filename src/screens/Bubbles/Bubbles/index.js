import React from "react";
import { View, SafeAreaView } from "react-native";
import { GlobalStyle } from "../../../assets/GlobalStyle";
import { CreateThread } from "./components/CreateThread";
import { ConfirmationPanel } from "../../../assets/ConfirmationPanel";
import { MessageFuncs } from "./functions";
import { FlatList } from "react-native";
import { NoThreads } from "./components/NoThreads";
import { MessageRow } from "./components/MessageRow";
import { RefreshControl } from "react-native";
import { AsyncStorage } from "../../../assets/AsyncStorage/functions";
import { Campus } from "../../../assets/Campus";
import { SegmentControl } from "../../../assets/SegmentControl";
import { PinnedBubblesAndChannels } from "./components/PinnedBubblesAndChannels";
import { StyleSheet, Text } from "react-native";
import { ListOfConversations } from "./components/ListOfConversations";
import * as Animatable from "react-native-animatable";
import { analytics } from "../../../assets/Analytics";
import { Platform } from "react-native";

export class BubblesAndChannels extends React.Component {
  constructor() {
    super();
    this.unreadListener;
    this.state = {
      threadSwipeup: false,
      bubbles: [
        { _loading: true, member_names: {}, id: "1" },
        { _loading: true, member_names: {}, id: "2" },
        { _loading: true, member_names: {}, id: "3" },
        { _loading: true, member_names: {}, id: "4" },
        { _loading: true, member_names: {}, id: "5" },
        { _loading: true, member_names: {}, id: "6" },
      ],
      channels: [
        { _loading: true, member_names: {}, id: "1" },
        { _loading: true, member_names: {}, id: "2" },
        { _loading: true, member_names: {}, id: "3" },
        { _loading: true, member_names: {}, id: "4" },
        { _loading: true, member_names: {}, id: "5" },
        { _loading: true, member_names: {}, id: "6" },
      ],
      refreshing: false,
      createId: "-",
      created: false,
      creating: false,
      error: false,
      unreadBubbles: [],
      init: false,
      segmentIndex: 0, // The segment to show
      hasChangedSegment: false, // Once user changes segment, governs initial animation

      layouts: { segment: false, header: false }, // Set the height layouts for key components
    };
  }
  componentDidMount() {
    this.startBubbleListener();

    Campus.Funcs.user.checkIfWelcomePopupShouldShow(
      this.props.store.user,
      this.props.route.name,
      this.props.route.params.showPopup,
      this.props.navigation.navigate,
      "bubbles/bubbles-channels-welcome"
    );
    this.getChannels(false);

    this.focusChange = this.props.navigation.addListener("focus", () => {
      this.getBubbles(false, true);
      this.getChannels(false);
      console.log("Navigation focus changed");
    });
  }
  componentWillUnmount() {
    clearInterval(this.bubbleListener);
    this.setState({ listening: false });
    try {
      this.focusChange();
    } catch (err) {
      console.warn(err);
    }
  }
  render() {
    /**
     * Get if there are any conversations
     * that are unread and show badges at
     * segment controller
     */
    const pinnedBubbles = this.state.bubbles.filter(({ id }) =>
      ((this.props.store.user.bookmarks || {}).bubble || []).includes(id)
    );
    const nonPinnedBubbles = this.state.bubbles.filter(
      ({ id }) =>
        !((this.props.store.user.bookmarks || {}).bubble || []).includes(id)
    );
    const pinnedChannels = this.state.channels.filter(({ id }) =>
      ((this.props.store.user.bookmarks || {}).channel || []).includes(id)
    );
    const nonPinnedChannels = this.state.channels.filter(
      ({ id }) =>
        !((this.props.store.user.bookmarks || {}).channel || []).includes(id)
    );

    return (
      <View {...GlobalStyle.Props.backgroundScrollView}>
        <GlobalStyle.Header
          navigation={this.props.navigation}
          destinationType={"openDrawer"}
          title={"Bubbles & Channels"}
          onRightPress={() =>
            this.setState({ threadSwipeup: !this.state.threadSwipeup })
          }
          onLayout={({ nativeEvent }) =>
            this.handleLayouts(nativeEvent, "header")
          }
          badgeKey={"bubbles"}
          rightIcon={"add"}
        />
        <SegmentControl
          onLayout={({ nativeEvent }) =>
            this.handleLayouts(nativeEvent, "segment")
          }
          // badgeIndexes={[unreadBubbles, unreadConversation]}
          segments={SEGMENTS}
          index={this.state.segmentIndex}
          onIndexChange={(segmentIndex) =>
            this.setState({ segmentIndex, hasChangedSegment: true })
          }
        />
        {this.state.segmentIndex === 0 ? (
          <Animatable.View
            animation={this.state.hasChangedSegment && "fadeInLeft"}
            useNativeDriver
            delay={450}
            style={{ flex: Platform.OS === "android" && 1 }}
            duration={650}
          >
            <ListOfConversations
              type={"bubble"}
              heightDeductions={Object.values(this.state.layouts)}
              data={nonPinnedBubbles}
              pinnedData={this.state.init && pinnedBubbles}
              colors={this.props.store.app.campus.colors}
              onFooterPress={() =>
                this.setState({
                  threadSwipeup: !this.state.threadSwipeup,
                })
              }
              openThread={this.openThread}
              footerText={"Create bubble"}
              onRefresh={this.getBubbles}
              init={this.state.init}
              refreshing={this.state.refreshing}
            />
          </Animatable.View>
        ) : (
          this.state.segmentIndex === 1 && (
            <Animatable.View
              animation={"fadeInRight"}
              useNativeDriver
              delay={450}
              style={{ flex: Platform.OS === "android" && 1 }}
              duration={650}
            >
              <ListOfConversations
                type={"channel"}
                heightDeductions={Object.values(this.state.layouts)}
                data={nonPinnedChannels}
                pinnedData={pinnedChannels}
                colors={this.props.store.app.campus.colors}
                openThread={this.openThread}
                onRefresh={this.getChannels}
                init={this.state.init}
                refreshing={this.state.refreshing}
              />
            </Animatable.View>
          )
        )}
        <CreateThread
          isActive={this.state.threadSwipeup}
          onClose={() => this.setState({ threadSwipeup: false })}
          campus={this.props.store.app.campus}
          createThread={this.createThread}
        />
        <ConfirmationPanel
          isActive={this.state.creating || this.state.created}
          loading={this.state.creating}
          error={this.state.error}
          colors={this.props.store.app.campus.colors}
          onPress={() => {
            this.openNewThread();
            this.setState({ created: false, creating: false, error: false });
          }}
          onClose={() =>
            this.setState({ created: false, creating: false, error: false })
          }
          errorText={this.state.errortext}
          successText={"Created new bubble"}
          loadingText={"Creating new bubble"}
        />
      </View>
    );
  }
  startBubbleListener = () => {
    this.bubbleListener = setInterval(() => this.getBubbles(false), 5000);
  };
  getBubbles = (refreshing = true, override = false) => {
    /**
     * Function to get the bubbles.
     *
     * As a default it will only get the bubbles where there has been activity
     * since the last fetched. This is controlled by the latest_timestamp_ms field.
     *
     * However, when the user is refreshing, the function will update
     * the state to show the appropriate refresh control
     *
     * Also, when the user navigates to this screen, they will override and get all
     * of the bubbles again since the latest timestamp will be irrelevant.
     */
    this.setState({ refreshing });

    // Get the current bubbles, return empty array if one of three params are met
    var currentBubbles =
      !this.state.init || refreshing || override ? [] : this.state.bubbles;

    // Get the latest timestamp from the bubbles, else return 0
    const latestTimestamp =
      currentBubbles.length > 0 ? currentBubbles[0].latest_timestamp_ms : 0;

    // Get the bubbles
    MessageFuncs.getBubbles(latestTimestamp)
      .then((bubbles) => {
        // Update the current bubbles if the bubble has already been fetched
        // Else, push it to the array
        bubbles.forEach((b) => {
          var index = currentBubbles.findIndex((s) => s.id === b.id);
          const exists = index !== -1;
          if (!exists) currentBubbles.push(b);
          else currentBubbles[index] = b;
        });

        this.setState({
          bubbles: currentBubbles.sort(MessageFuncs.sortBubbles),
          error: false,
        });
      })
      .catch((err) => this.setState({ error: true, bubbles: [] }))
      .finally(() => this.setState({ init: true }))
      .finally(() =>
        setTimeout(() => this.setState({ refreshing: false }), 750)
      );
  };
  getChannels = (refreshing = true) => {
    this.setState({ refreshing });
    MessageFuncs.getChannels(this.props.store.app.campus.key)
      .then((channels) => this.setState({ channels, channelError: false }))
      .catch((err) => this.setState({ channelError: err }))
      .finally(() => this.setState({ channelInit: true, refreshing: false }));
  };
  openNewThread = () => {
    const id = this.state.createId || false;
    if (id !== false) this.openThread(id);
    else this.setState({ created: false, creating: false, error: false });
  };
  openThread = (id, type) => {
    console.log("Opening bubble focus with params", { id, type });
    this.props.navigation.navigate("Bubble Focus", { id, type });
    clearInterval(this.unreadListener);
    this.setState({ listening: false });
  };
  createThread = (members) => {
    const user = this.props.store.user; // get the current user

    this.setState({ creating: true, threadSwipeup: false, createId: false }); // set loading state and hide create view
    if (members[user.uid] === undefined) members[user.uid] = user; // add user if they ar enot already added

    if (Object.keys(members).length < 2)
      this.setState({
        error: true,
        created: true,
        creating: false,
        errortext: "A bubble needs at least two people",
      });
    else
      MessageFuncs.createThread(members, user)
        .then((res) =>
          this.setState(
            {
              error: false,
              created: true,
              creating: false,
              createId: res.id,
            },
            () => console.log(this.state.createId)
          )
        )
        .catch((err) => {
          analytics.error(err, "Bubbles", "createThread");
          this.setState({
            error: true,
            errortext: "Could not create bubble",
            created: true,
            creating: false,
            createId: false,
          });
        });
  };
  handleLayouts = (nativeEvent, key) => {
    /** Function to update the state for the key components layouts */
    const { layouts } = this.state;
    if (!layouts[key]) {
      layouts[key] = nativeEvent.layout.height;
      this.setState({ layouts });
    }
  };
}

const SEGMENTS = ["Bubbles", "Channels"];

const styles = StyleSheet.create({
  swiper: {
    width: GlobalStyle.Measurements.width,
  },
});
