import React from "react";
import { analytics } from "../../../assets/Analytics";
import { GraphicView } from "./components/GraphicView";
import { StoriesHeader } from "./components/StoriesHeader";
import { StoriesFocusFuncs } from "./functions";
import { ConfirmationPanel } from "../../../assets/ConfirmationPanel";
import { Campus } from "../../../assets/Campus";
import Animated from "react-native-reanimated";

export class StoriesFocus extends React.Component {
  constructor() {
    super();
    this.storyAuthorId;
    this.timeout; // Te timeout to change the graphic
    this.graphicStartTimestamp = Date.now(); // Timestamp when a graphic starts playing
    this.headerLayout = false; // To position the timelines correctly

    this.state = {
      paused: false, // Pause the playing
      progressionBeforePausingGraphic: 0, // If the user pauses the graphic, then keep track of how far they progressed
      lastIndexChange: false, // Update to for example notice if they clicked back but there is no more graphics left, then the index wouldn't change

      currentGraphicIndex: 0,
      currentGraphicDuration: 8000,
      graphicsFomCurrentAuthor: [],
      noMoreGraphicsFromAuthor: false,
      currentStoryAuthor: {},

      currentGraphicsError: false, // If the graphics for the curent author could not be fetched
      currentStoryAuthorError: false, // If we can't get the story author

      nextStoryAuthor: false, // Pre-load the next story author
      nextStoryGraphics: [], // Pre-load the next story graphics
      prevStoryAuthor: false, // Save the previous story author for when we move to the next author
      prevStoryGraphics: [], // Save previous story graphics

      becameSocietyMember: false, // If story author is society, then they can join
      becameEventMember: false, // If an event is linked, then they can join

      showJoiningSociety: false, // Whether to show the confirmation panel for joining a society
      errorJoiningSociety: false, // If they can't join a society
      joiningSociety: false, // Are we currently trying to join the society
    };
  }

  async componentDidMount() {
    this.setState({ loading: true });
    const params = this.props.route.params || {};
    var id = params.id || false;
    this.storyAuthorId = id;

    await this.getStoryAuthor(id);
    this.getStoriesForId(id);
  }

  render() {
    const graphics = this.state.graphicsFomCurrentAuthor || [];
    const currentGraphic = {
      ...graphics[this.state.currentGraphicIndex || 0],
      index: this.state.currentGraphicIndex,
    };

    return (
      <React.Fragment>
        <GraphicView
          graphic={currentGraphic || {}}
          onLeftPress={this.onLeftPress}
          onRightPress={this.onRightPress}
          onLoadStart={this.onGraphicLoadStart}
          onLongPress={this.onLongPress}
          onLongPressRelease={this.onLongPressRelease}
          onEndReached={this.onEndReached}
          graphicsFomCurrentAuthor={graphics}
          headerLayout={this.headerLayout}
          storyAuthorId={this.storyAuthorId}
        />
        <StoriesHeader
          goBack={this.props.navigation.goBack}
          currentStoryAuthor={this.state.currentStoryAuthor}
          showJoin={!this.state.becameSocietyMember}
          onJoinPress={this.onJoinSocietyPress}
          onLayout={this.onHeaderLayout}
        />
        <ConfirmationPanel
          isActive={this.state.showJoiningSociety}
          loading={this.state.joiningSociety}
          error={this.state.errorJoiningSociety}
          onClose={() => this.setState({ showJoiningSociety: false })}
          loadingText={"Joining society"}
          successText={"Successfully joined society"}
          errorText={"Could not join society"}
        />
      </React.Fragment>
    );
  }
  getStoryAuthor = async (id) => {
    analytics.breadcrumb(`Getting story author for id=${id}`);
    StoriesFocusFuncs.getStoryAuthor(this.props.store.app.campus.key, id)
      .then((currentStoryAuthor) => {
        this.setState({ currentStoryAuthor, currentStoryAuthorError: false });
      })
      .catch((err) => {
        this.setState({ currentStoryAuthorError: true });
      });
  };
  getStoriesForId = (id, latestDoc = false) => {
    analytics.breadcrumb(`Getting stories for id='${id}'`);
    StoriesFocusFuncs.getStoryGraphics(
      this.props.store.app.campus.key,
      id,
      latestDoc
    )
      .then((graphicsFomCurrentAuthor) =>
        this.setState({
          graphicsFomCurrentAuthor,
          noMoreGraphicsFromAuthor: graphicsFomCurrentAuthor.length < 5,
          currentGraphicsError: false,
        })
      )
      .catch((err) => this.setState({ currentGraphicsError: true }));
  };
  onLeftPress = () => {
    analytics.breadcrumb("Pressed back for stories");
    this.handleGraphicIndexChange(-1);
  };
  onRightPress = () => {
    analytics.breadcrumb("Pressed forward for stories");
    this.handleGraphicIndexChange(1);
  };
  onGraphicLoadStart = ({ nativeEvent }) => {
    this.graphicStartTimestamp = Date.now();
    this.progressionBeforePausingGraphic = 0; // Restart
    this.timeout = setTimeout(this.onEndReached, nativeEvent.duration);
  };
  onLongPress = () => {
    this.setState({ paused: true });
  };
  onLongPressRelease = () => {
    this.setState({ paused: false });
  };
  onEndReached = () => {
    this.handleGraphicIndexChange(this.state.currentGraphicIndex + 1);
  };
  handleGraphicIndexChange = (indexChange) => {
    console.log("Index change", indexChange);
    const { graphicsFomCurrentAuthor, currentGraphicIndex } = this.state;

    if (indexChange) {
      if (indexChange > 0) indexChange = 1;
      else if (indexChange < 0) indexChange = -1;
      // Set the new index based on the index change
      var newIndex = currentGraphicIndex + indexChange;
      const graphicsLeft = graphicsFomCurrentAuthor.length - newIndex;

      // Prevent a non-graphic to show
      if (newIndex < 0 && !this.state.prevStoryAuthor) {
        console.log("Prevent non-index glitch");
        newIndex = 0;
      }
      // Else go back to previous author
      else if (newIndex < 0 && this.state.prevStoryAuthor) {
        console.log("Go back to previous story author");
        this.goToPreviousStoryAuthor();
        return;
        // Prepare switch to next story
      } else if (graphicsLeft < 3 && !this.state.nextStoryAuthor) {
        console.log("Preparing next story");
        this.getNextStoryAuthor();

        // When it's time to switch to the next story
      } else if (graphicsLeft == 0 && this.state.nextStoryAuthor) {
        console.log("Switching to next story");
        newIndex = 0;
        this.storyAuthorId = this.state.nextStoryAuthor.id;
        this.setState({
          currentStoryAuthor: this.state.nextStoryAuthor,
          graphicsFomCurrentAuthor: this.state.nextStoryGraphics,
          prevStoryAuthor: this.state.currentStoryAuthor,
          prevStoryGraphics: graphicsFomCurrentAuthor,
          nextStoryAuthor: false,
        });
      }

      console.log("Index", newIndex);
      if (newIndex >= graphicsFomCurrentAuthor.length) newIndex = 0;

      this.setState({
        currentGraphicIndex: newIndex,
        lastIndexChange: Date.now(),
      });

      // if (graphicsLeft <= 2 && !noMoreGraphicsFromAuthor) {
      //   analytics.breadcrumb("Getting more graphics from stories author");
      //   const latestDoc = graphicsFomCurrentAuthor[currentGraphicIndex];
      //   this.getStoriesForId(this.storyAuthorId, latestDoc);
      //   this.setState({ currentGraphicIndex: toIndex });
      // } else if (noMoreGraphicsFromAuthor) {
      //   analytics.breadcrumb("Getting the next stories author");
      // }
    }
  };
  goToPreviousStoryAuthor = () => {
    const { prevStoryGraphics, prevStoryAuthor } = this.state;

    if (prevStoryGraphics.length == 0) this.getStoriesForId(prevStoryAuthor.id);
    else this.setState({ graphicsFomCurrentAuthor: prevStoryGraphics });

    this.setState({
      currentGraphicIndex: 0,
      currentStoryAuthor: prevStoryAuthor,
    });
  };
  onJoinSocietyPress = () => {
    analytics.breadcrumb("Joining society in stories");
    this.setState({
      errorJoiningSociety: false,
      showJoiningSociety: true,
      joiningSociety: true,
    });

    if (__DEV__)
      this.setState({
        joiningSociety: false,
        becameSocietyMember: true,
      });
    else
      Campus.Funcs.society
        .updateMembershipStatus(
          this.props.store.app.campus.key,
          this.storyAuthorId,
          this.state.currentStoryAuthor.bubble,
          true,
          this.props.store.user
        )
        .then(() =>
          this.setState({
            joiningSociety: false,
            becameSocietyMember: true,
          })
        )
        .catch(() => this.setState({ errorJoiningSociety: true }));
  };
  onHeaderLayout = ({ nativeEvent }) => {
    if (!this.headerLayout) this.headerLayout = nativeEvent.layout;
  };
  getNextStoryAuthor = () => {
    this.setState({ noMoreStories: false });

    var docs = this.props.store.app.story_docs;
    var docs = docs.sort(sortStoryDocs);
    const next = docs.filter((x) => x.id !== this.storyAuthorId);

    if (next.length > 0) {
      this.setState({ nextStoryAuthor: next[0] });
      this.getNextStoryGraphics(next[0].id);
    } else {
      this.setState({ noMoreStories: true });
    }

    // Campus.Funcs.stories
    //   .getLatestStories(
    //     this.props.store.app.campus.key,
    //     this.state.currentStoryAuthor,
    //     1
    //   )
    //   .then(([nextStoryAuthor]) => {
    //     if (nextStoryAuthor) {
    //       console.log("Received next story author:", nextStoryAuthor.id);
    //       this.setState({ nextStoryAuthor });
    //       this.getNextStoryGraphics(nextStoryAuthor.id);
    //     }
    //   })
    //   .catch(alert);
  };
  getNextStoryGraphics = (id) => {
    StoriesFocusFuncs.getStoryGraphics(this.props.store.app.campus.key, id)
      .then((nextStoryGraphics) => {
        console.log("Quantity of next graphics", nextStoryGraphics.length);
        this.setState({ nextStoryGraphics });
      })
      .catch(alert);
  };
  cacheGraphics = (graphics) => {
    Campus.Funcs.stories.cacheGraphics(graphics);
  };
}

function sortStoryDocs(a, b) {
  return b - a;
}
