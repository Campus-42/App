import React from "react";
import { ScrollView, Animated, RefreshControl } from "react-native";
import { Greeting } from "./components/Greeting";
import { EventCarousel } from "./components/EventCarousel/EventCarousel";
import { HomeFuncs } from "./functions";
import { EmergencyComponent } from "./components/Emergency";
import { FilterCarousel } from "./components/FilterCarousel";
import { SearchBar } from "./components/SearchBar";
import {
  getTagColors,
  updateDeviceTokenFCM,
} from "../../../assets/Airtable/functions";
import { GlobalStyle } from "../../../assets/GlobalStyle/index";
import {
  getCampusInfo,
  updateCampusPointSystem,
} from "../../../assets/Firebase/functions";
import { BlogCarousel } from "./components/BlogCarousel";
import { TicketCarousel } from "./components/TicketCarousel";
import { TicketModal } from "./components/TicketModal";
import { SearchView } from "./components/SearchView";
import { requestUserPermission } from "../../../assets/Firebase/functions";
import { InvitationCarousel } from "./components/InvitationsCarousel";
import {
  auth,
  crashlytics,
  messaging,
} from "../../../assets/Firebase/Firebase";
import { DateFuncs } from "../../../assets/Date";
import { FilterModal } from "./components/FilterModal";
import {
  updateReduxEvents,
  updateReduxSocieties,
} from "../../../assets/redux/functions";
import { analytics } from "../../../assets/Analytics";
import { AsyncStorage } from "../../../assets/AsyncStorage/functions";
import { UnreadMessages } from "./components/UnreadMessages";
import { Campus } from "../../../assets/Campus";
import { HomeScreenFooterButtons } from "./components/HomeScreenFooterButtons";
import { AppCrashedLastTime } from "./components/AppCrashedLastTime";
import Notifee from "@notifee/react-native";
import { Store } from "../../../assets/redux/store";
import { Button } from "react-native";
import RnTestExceptionHandler from "rn-test-exception-handler";
import { inAppBadgeEmitter } from "../../../assets/EventEmitter";
import { StoriesCarousel } from "../../../assets/StoriesCarousel";

const FETCH_LIMIT = 3; // How many new events to get for each carousel

export class HomeScreen extends React.Component {
  /**
   * Navigation options will show an icon in drawer
   */
  constructor() {
    super();
    this.scroll = React.createRef(); // event container
    this.header = React.createRef();

    this.joinedRef = React.createRef();
    this.todayRef = React.createRef();
    this.weekRef = React.createRef();
    this.popularRef = React.createRef();
    this.blogCarousel = React.createRef();

    this.test = React.createRef();

    this.state = {
      appCrashedLastTime: false, // Crashlytics can show us if the app crashed last time
      opacity: new Animated.Value(0), // To animate in safe area view
      initDone: false, // Update when first fetch is done
      showFilterModal: false,
      filter: {
        date: {
          min: new Date().getTime(),
          max: 4133977199000, // Date for ahead in time
        },
        price: {
          min: -1,
          max: 1000000,
        },
      }, // The filter object to be passed to each event carousel
      refreshing: false, // If Scrollview is dragged down to refresh data
      emergencies: [], // Potential emergencies, these will be visble at the top
      popularEvents: { description: "Events This Week", data: [] }, // Popular events in descending order of participants
      todaysEvents: { description: "Events Happening Today", data: [] }, // Joined events in ascending order of start date
      joinedEvents: { description: "Events You Have Joined", data: [] }, // Joined events in ascending order of start date
      mostPopularEvents: {
        description: "Popular Events on Campus",
        data: [],
      }, // Joined events in ascending order of start date
      societies: { data: [], description: "Recommended Societies" }, // Show recommended societies for the user

      chosenEventTags: [], // Create Set of event tags to show available tags to filter
      rawEventTags: ["one", "two", "three"], // The event tags from start
      showEventContainer: true, // Show the hoem screen with all the events, if false it will show search events
      tagColors: {}, // Tag colors will be retrieved from Airtable and parsed into an object
      showSwipeUp: false, // Dynamically open the swipeupview to focus on one event
      swipeUpEvent: {}, // The event that will be shown in swipeupview
      blogs: [], // Add any unread blogs
      tickets: [], // Events that are happening within 15 minutes will show their ticket here
      showTicketModal: false, // Whether to show the ticket modal or not
      ticketFocus: {}, // The event that is shown as a ticket
      searchActive: false, // is search active
      searchLoading: false,
      searchError: false,
      searchResult: [],
      searched: false,
      focusSearch: false, // If true search bar will be focused
      invitations: [], // All the invitations to user
      stories: [], // Campus stories

      textInputIsFocused: false, // If user is focused in on search bar

      joinedCheck: false, // Update each get of events after fetch to stop skeleton loading animation
      todaysCheck: false, // Update each get of events after fetch to stop skeleton loading animation
      popularCheck: false, // Update each get of events after fetch to stop skeleton loading animation
      mostPopularCheck: false, // Update each get of events after fetch to stop skeleton loading animation

      popularLastDoc: undefined, // The last doc is used in pagination to get next batch of events

      unreadBubbles: [],
      selectedBubble: {}, // Info for the selected bubble to show preview
    };
  }
  async componentDidMount() {
    messaging
      .getToken()
      .then((token) => updateDeviceTokenFCM(token))
      .catch((err) => console.warn("Token error", err));

    Animated.timing(this.state.opacity, {
      toValue: 1,
      duration: 500,
      useNativeDriver: true,
    }).start();

    setTimeout(
      () => this.init(false, true),
      !(this.props.store.user.welcome_screens_visited || []).includes("Home")
        ? 3000
        : 2000
    );
    requestUserPermission(); // Request user permission for push notifications
    const initialNotification = await messaging.getInitialNotification();

    if (initialNotification) {
      this.onNotificationOpenedApp(initialNotification);
    }

    messaging.onNotificationOpenedApp(this.onNotificationOpenedApp);

    this.unsubscribeForeground = messaging.onMessage(this.onMessage);

    Campus.Funcs.user.checkIfWelcomePopupShouldShow(
      this.props.store.user,
      this.props.route.name,
      this.props.route.params.showPopup,
      this.props.navigation.navigate,
      "general/home-welcome"
    );

    // Check for unclaimed referral
    const user = this.props.store.user;
    const referral = user.referral || {};
    if (referral.sender && !referral.claimed) {
      console.log("Claiming referral");
      Campus.Funcs.user.claimReferral(this.props.route.params.showPopup);
    }

    Campus.Funcs.points.triggerPointEvent(
      "appLogin",
      this.props.store.app.campus.key,
      this.props.route.params.showPopup
    );
    crashlytics
      .didCrashOnPreviousExecution()
      .then((value) => this.setState({ appCrashedLastTime: value }))
      .catch(console.warn);

    AsyncStorage.updateBadgeCount();
  }
  componentWillUnmount() {
    this.unsubscribeForeground();
  }
  render() {
    // If all fetches are done update tag~~
    var skeletonCheck = this.state.joinedCheck && this.state.popularCheck;

    const reduxEvents = this.props.store.app.events;

    return (
      <Animated.View
        style={{
          backgroundColor: GlobalStyle.ColorStyle.greyBackground,
          flex: 1,
          opacity: this.state.opacity,
        }}
      >
        <GlobalStyle.Header
          ref={this.header}
          navigation={this.props.navigation}
          destinationType={"openDrawer"}
          colors={this.props.store.app.campus.colors}
          badgeKey={"home"}
        />
        <ScrollView
          keyboardShouldPersistTaps={"handled"}
          {...GlobalStyle.Props.backgroundScrollView}
          ref={this.scroll}
          scrollEventThrottle={15}
          onScroll={this.handleScroll}
          refreshControl={
            <RefreshControl
              refreshing={this.state.refreshing}
              onRefresh={() => this.init(true, true)}
            />
          }
        >
          <Greeting
            textColor={this.props.store.app.campus.colors.main}
            user={this.props.store.user}
            campusLogo={this.props.store.app.campus.logo}
          />
          {this.state.emergencies.length !== 0 && (
            <EmergencyComponent data={this.state.emergencies} />
          )}
          <SearchBar
            focusSearch={this.state.focusSearch}
            switchSearchFocus={this.switchSearchFocus}
            campusKey={this.props.store.app.campus.key}
            chosenEventTags={this.state.chosenEventTags}
            colors={this.props.store.app.campus.colors}
            updateSearch={this.updateSearch}
            textInputIsFocused={(status = false) =>
              this.setState({ textInputIsFocused: status })
            }
          />
          {!this.state.searchActive ? (
            <React.Fragment>
              {/* <FilterCarousel
                openFilterModal={() => this.setState({showFilterModal: true})}
                isLoading={!skeletonCheck}
                tagColors={this.state.tagColors}
                tagPress={this.tagPress}
                rawEventTags={this.state.rawEventTags}
                chosenEventTags={this.state.chosenEventTags}
                colors={this.props.store.app.campus.colors}
              /> */}
              {/* <MenuButtons /> */}
              {this.state.appCrashedLastTime && <AppCrashedLastTime />}
              <GlobalStyle.UI.UserLevels
                user={this.props.store.user}
                campusPointSystem={this.props.store.app.campus_point_system}
                campus={this.props.store.app.campus}
                navigate={this.props.navigation.navigate}
              />

              {this.state.tickets.length > 0 && skeletonCheck && (
                <TicketCarousel
                  openTicket={this.openTicket}
                  tickets={this.state.tickets}
                  colors={this.props.store.app.campus.colors}
                  campusKey={this.props.store.app.campus.key}
                  navigate={this.props.navigation.navigate}
                />
              )}
              {skeletonCheck && (
                <InvitationCarousel
                  invitations={this.state.invitations}
                  campusKey={this.props.store.app.campus.key}
                  navigation={this.props.navigation}
                  invitationIDs={this.props.store.app.invitationIDs}
                  colors={this.props.store.app.campus.colors}
                />
              )}
              <EventCarousel
                ref={this.weekRef}
                dontHide
                chosenEventTags={this.state.chosenEventTags}
                openEvent={this.openEvent}
                navigation={this.props.navigation}
                key={`TopEventCarousel_${this.state.popularEvents.description}`}
                text={this.state.popularEvents.description}
                data={this.state.popularEvents.data}
                colors={this.props.store.app.campus.colors}
                tagColors={this.state.tagColors}
                refresh={this.getPopularEvents}
                isLoading={!skeletonCheck}
                emptyText={"Oops, we couldn't find any events"}
                focusSearch={() => this.setState({ focusSearch: true })}
                filter={this.state.filter}
                bookmarks={this.props.store.user.bookmarks}
                reduxEvents={reduxEvents}
              />
              {this.state.storiesInit && this.state.stories.length > 0 && (
                <StoriesCarousel
                  stories={this.state.stories}
                  navigation={this.props.navigation}
                  colors={this.props.store.app.campus.colors}
                />
              )}
              <EventCarousel
                ref={this.popularRef}
                chosenEventTags={this.state.chosenEventTags}
                openEvent={this.openEvent}
                navigation={this.props.navigation}
                key={`TopEventCarousel_${this.state.mostPopularEvents.description}`}
                text={this.state.mostPopularEvents.description}
                data={this.state.mostPopularEvents.data}
                colors={this.props.store.app.campus.colors}
                tagColors={this.state.tagColors}
                refresh={this.getMostPopularEvents}
                isLoading={!skeletonCheck}
                emptyText={"Oops, we couldn't find any events"}
                focusSearch={() => this.setState({ focusSearch: true })}
                filter={this.state.filter}
                bookmarks={this.props.store.user.bookmarks}
                reduxEvents={reduxEvents}
              />
              <EventCarousel
                ref={this.joinedRef}
                chosenEventTags={this.state.chosenEventTags}
                openEvent={this.openEvent}
                navigation={this.props.navigation}
                key={`TopEventCarousel_${this.state.joinedEvents.description}`}
                text={this.state.joinedEvents.description}
                data={this.state.joinedEvents.data}
                colors={this.props.store.app.campus.colors}
                emptyText={"You haven't joined any events yet"}
                tagColors={this.state.tagColors}
                refresh={this.getJoinedEvents}
                isLoading={!skeletonCheck}
                focusSearch={() => this.setState({ focusSearch: true })}
                filter={this.state.filter}
                reduxEvents={reduxEvents}
                bookmarks={this.props.store.user.bookmarks}
              />
              {this.state.blogs.length > 0 && skeletonCheck && (
                <BlogCarousel
                  ref={this.blogCarousel}
                  blogs={this.state.blogs}
                  colors={this.props.store.app.campus.colors}
                  campusKey={this.props.store.app.campus.key}
                  navigate={this.props.navigation.navigate}
                  title={"Campus Announcements"}
                  bookmarks={this.props.store.user.bookmarks}
                />
              )}

              <HomeScreenFooterButtons
                campus={this.props.store.app.campus}
                navigate={this.props.navigation.navigate}
              />
            </React.Fragment>
          ) : (
            <SearchView
              textInputIsFocused={this.state.textInputIsFocused}
              events={this.state.searchResult}
              error={this.state.searchError}
              loading={this.state.searchLoading}
              searched={this.state.searched}
              colors={this.props.store.app.campus.colors}
              tagColors={this.state.tagColors}
              openEvent={this.openEvent}
              bookmarks={this.props.store.user.bookmarks}
              reduxEvents={reduxEvents}
            />
          )}
        </ScrollView>
        {this.state.showTicketModal && (
          <TicketModal
            visible={this.state.showTicketModal}
            event={this.state.ticketFocus}
            onClose={this.onTicketClose}
            colors={this.props.store.app.campus.colors}
            campusKey={this.props.store.app.campus.key}
            navigate={this.props.navigation.navigate}
            showPopup={this.props.route.params.showPopup}
          />
        )}
        <FilterModal
          isActive={this.state.showFilterModal}
          onClose={() => this.setState({ showFilterModal: false })}
          state={this.state}
          updateFilter={(obj) => this.setState({ filter: obj })}
          updateTags={this.tagPress}
          campus={this.props.store.app.campus}
        />
      </Animated.View>
    );
  }
  onMessage = (msg) =>
    Campus.Funcs.notifications.onNotification(
      msg,
      this.props.navigation.push,
      this.props.route.params.showPopup,
      this.props.store.navigation
    );
  onNotificationOpenedApp = (msg) => {
    Campus.Funcs.notifications.onNotificationOpenedApp(
      msg,
      this.props.navigation
    );
  };
  onParticipationStatusChange = (event, action = "joined" || "left") => {};
  updateSearch = (events = [], error = false) => {
    this.setState({
      searchResult: events,
      searchError: error,
      searchLoading: false,
      searched: true,
      focusSearch: false,
    });
  };
  switchSearchFocus = (destination = "event", loadingSearch = false) => {
    this.setState({
      searchActive: destination == "search",
      searchLoading: loadingSearch,
      searched: (destination = !"search"),
      focusSearch: false,
    });
  };
  getPopularEvents = async (clear = false) => {
    // Get all events
    try {
      clear && this.weekRef.current.animateToIndex(0);
    } catch (error) {}
    HomeFuncs.getPopularEvents(
      this.props.store.app.campus.key,
      clear
        ? {
            number_of_participants: 10000000,
            end_ms: await DateFuncs.getFutureDateMSInMinutes(-60),
          }
        : this.state.popularEvents.data[
            this.state.popularEvents.data.length - 1
          ],
      FETCH_LIMIT
    )
      .then((res) => {
        // Should we clear entire (When refreshing we do clear)
        const arr = clear ? res : this.state.popularEvents.data.concat(res);

        this.setState({
          popularEvents: {
            description: this.state.popularEvents.description,
            data: arr,
          },
          popularCheck: true,
        });

        this.setStateForEveryEventTag();
        updateReduxEvents(arr, this.props.store.app.events);
      })
      .catch((err) => {
        console.warn("Could not get popular events", err);
        this.setState({
          popularEvents: {
            description: this.state.popularEvents.description,
            data: [],
          },
          popularCheck: true,
        });
      })
      .finally(() => this.shouldComputeTags());
  };
  getMostPopularEvents = async (clear = false) => {
    try {
      clear && this.popularRef.current.animateToIndex(0);
    } catch (error) {}

    HomeFuncs.getMostPopularEvents(
      this.props.store.app.campus.key,
      clear
        ? { number_of_participants: 1000000 }
        : this.state.mostPopularEvents.data[
            this.state.mostPopularEvents.data.length - 1
          ],
      FETCH_LIMIT
    )
      .then((events) => {
        // Should we clear entire (When refreshing we do clear)
        const arr = clear
          ? events
          : this.state.mostPopularEvents.data.concat(events);

        this.setState(
          {
            mostPopularEvents: {
              description: this.state.mostPopularEvents.description,
              data: arr,
            },
            mostPopularCheck: true,
          },
          () => this.shouldComputeTags()
        );

        updateReduxEvents(arr, this.props.store.app.events);
      })
      .catch((err) => {
        console.warn("Could not get popular events", err);
        this.setState({
          mostPopularEvents: {
            description: this.state.mostPopularEvents.description,
            data: [],
          },
          mostPopularCheck: true,
        });
      })
      .finally(() => this.shouldComputeTags());
  };
  getTodaysEvents = async (clear = false) => {
    // Get all events

    try {
      clear && this.todayRef.current.animateToIndex(0);
    } catch (error) {}

    HomeFuncs.getTodaysEvents(
      this.props.store.app.campus.key,
      clear
        ? undefined
        : this.state.todaysEvents.data[this.state.todaysEvents.data.length - 1],

      FETCH_LIMIT
    )
      .then((events) => {
        const arr = clear
          ? events
          : this.state.todaysEvents.data.concat(events);
        this.setState(
          {
            todaysEvents: {
              description: this.state.todaysEvents.description,
              data: arr,
            },
            todaysCheck: true,
          },
          () => this.shouldComputeTags()
        );
        updateReduxEvents(arr, this.props.store.app.events);
      })
      .catch((err) => {
        console.warn("Could not get today's events", err);
        this.setState({
          todaysEvents: {
            description: this.state.todaysEvents.description,
            data: [],
          },
          todaysCheck: true,
        });
      })
      .finally(() => this.shouldComputeTags());
  };
  getJoinedEvents = async (clear = false) => {
    // Get all joined events
    try {
      clear && this.joinedRef.current.animateToIndex(0);
    } catch (error) {}

    HomeFuncs.getJoinedEvents(
      this.props.store.app.campus.key,
      clear
        ? undefined
        : this.state.joinedEvents.data[this.state.joinedEvents.data.length - 1],
      FETCH_LIMIT
    )
      .then((events) => {
        const arr = clear
          ? events
          : this.state.joinedEvents.data.concat(events);

        this.setState(
          {
            joinedEvents: {
              description: this.state.joinedEvents.description,
              data: arr,
            },
            joinedCheck: true,
          },
          () => this.shouldComputeTags()
        );

        updateReduxEvents(arr, this.props.store.app.events);
      })
      .catch((err) => {
        console.warn("Could not get all joined events", err);
      })
      .finally(() => this.shouldComputeTags());
  };
  getBlogs = async (clear = false) => {
    try {
      clear && this.blogCarousel.current.animateToIndex(0);
    } catch (error) {}

    HomeFuncs.getBlogs(
      this.props.store.app.campus.key,
      this.props.store.user.permissions,
      this.props.store.user
    )
      .then((blogs) => this.setState({ blogs }))
      .catch((err) => console.warn("Could not get blogs", err));
  };
  getTickets = async () => {
    HomeFuncs.getTickets(this.props.store.app.campus.key)
      .then((tickets) => {
        this.setState({ tickets: tickets });
      })
      .catch((err) => {
        console.warn("Could not get tickets", err);
        this.setState({ tickets: [] });
      });
  };
  init = async (refreshing = true, clear = false) => {
    analytics.breadcrumb(
      `Init function called with refreshing = ${refreshing} and clear = ${clear}`,
      "Homescreen.js",
      "init()"
    );
    this.setState({ refreshing: refreshing });

    getCampusInfo(this.props.store.app.campus.key).then(() =>
      this.getRecommendedSocieties(clear)
    );

    // Get potential emergencies from campus and display at top
    if (this.props.store.user.beta_user) this.getStories();
    this.getTickets();
    this.getBlogs(clear);
    this.getInvitations();
    this.getPopularEvents(clear);
    this.getJoinedEvents(clear);
    // this.getTodaysEvents(clear);
    this.getMostPopularEvents(clear);
    this.getBlogs();
    const tagColors = await getTagColors();
    // Set state from fetched info
    this.setState({
      refreshing: false,
      initDone: true,
      tagColors,
    });

    refreshing && updateCampusPointSystem(this.props.store.app.campus.key);
  };
  getInvitations = () =>
    Campus.Funcs.invite
      .getInvitations(this.props.store.app.campus.key, (invites) =>
        this.setState({ invitations: invites })
      )
      .catch((err) => {
        analytics.error(err, "Homescreen.js", "getInvitations()");
        this.setState({ invitations: [] });
      });
  tagPress = async (tag, selectAll) => {
    // This function will choose tags when pressed
    // If all tags are chosen then all will be dechosen but the pressed tag else it will change the chosen tag
    if (!selectAll)
      HomeFuncs.handleTagPress(
        tag,
        this.state.chosenEventTags,
        this.state.rawEventTags
      ).then((tags) => this.setState({ chosenEventTags: tags }));
    // If user wants to select all tags again we will set the tags after raw tags
    else this.setState({ chosenEventTags: this.state.rawEventTags });
  };
  setStateForEveryEventTag() {
    // This function loops through the main array of events and loops thorugh the array to return the type. The type is then concated into a flat array

    const allEvents = [];
    if (this.state.popularEvents.data !== undefined) {
      this.state.popularEvents.data.forEach((elem) => allEvents.push(elem));
    }
    if (this.state.joinedEvents.data !== undefined) {
      this.state.joinedEvents.data.forEach((elem) => allEvents.push(elem));
    }
    if (this.state.todaysEvents.data !== undefined) {
      this.state.todaysEvents.data.forEach((elem) => allEvents.push(elem));
    }
    if (this.state.mostPopularEvents.data !== undefined) {
      this.state.mostPopularEvents.data.forEach((elem) => allEvents.push(elem));
    }
    // this.state.popularEvents.data.concat(this.state.joinedEvents.data);

    let chosenEventTags = allEvents.map((type) => {
      return type.tags.map((tag) => {
        return tag;
      });
    });

    chosenEventTags = [].concat.apply([], chosenEventTags); // Flatten the individiual tags
    const tagString = chosenEventTags.join(" "); // The string to count matches for the sorting

    chosenEventTags.sort(function (a, b) {
      // Sort tags by occurence in descending order
      return (
        tagString.match(new RegExp(b, "g")).length -
        tagString.match(new RegExp(a, "g")).length
      );
    });
    chosenEventTags = Array.from(new Set(chosenEventTags)); // Create array from Set

    // Should we set update chosen tags
    const stateTags = this.state.chosenEventTags;
    var shouldUpdateChosen = false;
    if (
      stateTags.length == 0 ||
      stateTags.length == this.state.rawEventTags.length
    )
      shouldUpdateChosen = true;
    else shouldUpdateChosen = false;

    this.setState({
      chosenEventTags: shouldUpdateChosen
        ? chosenEventTags
        : this.state.chosenEventTags,
      rawEventTags: chosenEventTags,
    });
  }
  openTicket = (event) => {
    this.setState({ ticketFocus: event, showTicketModal: true });
  };
  onTicketClose = () => {
    this.setState({ showTicketModal: false });
  };
  openEvent = (event) => {
    this.props.navigation.navigate("Event Focus", { id: event.id });
  };
  onEventClose = () => {
    // Update state so swipeupview will open when state changes again
    this.setState({ showSwipeUp: false });
  };
  shouldComputeTags = () => {
    if (
      this.state.joinedCheck &&
      this.state.todaysCheck &&
      this.state.popularCheck &&
      this.state.mostPopularCheck
    )
      this.setStateForEveryEventTag();
  };
  handleScroll = ({ nativeEvent }) =>
    GlobalStyle.UX.onScrollForAnimatingHeader(nativeEvent, this.header);
  handleScrollRelease = ({ nativeEvent }) =>
    GlobalStyle.UX.onScrollReleaseForAnimatingHeader(
      nativeEvent,
      this.header,
      this.scroll
    );
  getRecommendedSocieties = (clear = false) => {
    HomeFuncs.getRecommendedSocieties(
      this.props.store.app.campus.key,
      this.props.store.app.campus.societies,
      this.props.store.user.joined_societies,
      clear ? [] : this.state.societies.data
    )
      .then((societies) => {
        this.setState({
          societies: {
            ...this.state.societies,
            data: clear
              ? societies
              : this.state.societies.data.concat(societies),
          },
        });
        updateReduxSocieties(societies, this.props.store.app.societies);
      })
      .catch((err) => {
        console.warn("Could not get recommended societies", err);
      });
  };
  getStories = () => {
    Campus.Funcs.stories
      .getLatestStories(this.props.store.app.campus.key)
      .then((stories) => {
        this.setState({ stories });
        Store.dispatch({ type: "UPDATE_STORIES_DOCS", payload: stories });
      })
      .catch((err) => {
        this.setState({ stories: [] });
      })
      .finally(() => {
        this.setState({ storiesInit: true });
      });
  };
}
