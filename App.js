console.disableYellowBox = true;
import 'react-native-gesture-handler';
import React from 'react';
import {Platform, AppState} from 'react-native';
import {Provider, connect} from 'react-redux';
import {NavigationContainer} from '@react-navigation/native';
import {createStackNavigator, TransitionPresets} from '@react-navigation/stack';
import {createDrawerNavigator} from '@react-navigation/drawer';
import MaterialIcon from 'react-native-vector-icons/MaterialIcons';
import MaterialCommunityIcon from 'react-native-vector-icons/MaterialCommunityIcons';
import FontAwesome from 'react-native-vector-icons/FontAwesome';
import Ionicon from 'react-native-vector-icons/Ionicons';
import Entypo from 'react-native-vector-icons/Entypo';
import {
  auth,
  crashlytics,
  db,
  dynamicLinks,
  firebaseAnalytics,
  messaging,
} from './src/assets/Firebase/Firebase';
import {Store} from './src/assets/redux/store';
import {AsyncStorage} from './src/assets/AsyncStorage/functions';
import {analytics, updateAnalyticsInfo} from './src/assets/Analytics';
import deviceInfoModule from 'react-native-device-info';
import notifee from '@notifee/react-native';

/**  Import Screens */
import {HomeScreen} from './src/screens/EventStack/HomeScreen/HomeScreen';
import {EventFocus} from './src/screens/EventStack/EventFocus/EventFocus';
import {ManageSocietyFocus} from './src/screens/ManageSocietyStack/ManageSocietyFocus/ManageSocietyFocus';
import {ManageMembers} from './src/screens/ManageSocietyStack/ManageMembers/ManageMembers';
import {CreateEvent} from './src/screens/ManageSocietyStack/CreateEvent/index.js';
import {CreateSociety} from './src/screens/ManageSocietyStack/CreateSociety';
import {UpcomingEvents} from './src/screens/ManageSocietyStack/UpcomingEvents';
import {EditEvent} from './src/screens/ManageSocietyStack/EditEvent';
import {CreateBlog} from './src/screens/ManageSocietyStack/CreateBlog';
import {BlogFocus} from './src/screens/EventStack/BlogFocus';
import {TicketScanner} from './src/screens/ManageSocietyStack/TicketScanner';
import {LiveEvent} from './src/screens/ManageSocietyStack/LiveEvent';
import {Profile} from './src/screens/ProfileStack/Profile';
import {CustomDrawer} from './src/assets/CustomDrawer';
import {GlobalStyle} from './src/assets/GlobalStyle';
import {AllBlogs} from './src/screens/ManageSocietyStack/AllBlogs';
import {EditBlog} from './src/screens/ManageSocietyStack/EditBlog';
import {Societies} from './src/screens/JoinedSocietyStack/Joined Societies';
import {JoinedSocietyFocus} from './src/screens/JoinedSocietyStack/SocietyFocus';
import {ProfileInvitations} from './src/screens/ProfileStack/ProfileInvitations';
import {SocietyPreview} from './src/screens/EventStack/SocietyPreview';
import {EditSociety} from './src/screens/ManageSocietyStack/EditSociety';
import {WebView} from './src/assets/WebView';
import {BubblesAndChannels} from './src/screens/Bubbles/Bubbles';
import {BubbleFocus} from './src/screens/Bubbles/BubbleFocus';
import {Campus} from './src/assets/Campus';
import {Popups} from './src/assets/Popups';
import {Bookmarks} from './src/screens/ProfileStack/Bookmarks';
import {FAQ} from './src/screens/ProfileStack/FAQ';
import {CampusMap} from './src/screens/EventStack/CampusMap';
import {AdminPanel} from './src/screens/Admin Panel/Admin Panel';
import {ImageFocus} from './src/screens/Other/ImageFocus';
import {StoryCamera} from './src/screens/ManageSocietyStack/StoryCamera';
import {PointEvents} from './src/screens/University/PointEvents';
import {AuthCatcher} from './src/screens/AuthCatcher';
import {Referral} from './src/screens/Other/Referral';

messaging.setBackgroundMessageHandler(Campus.Funcs.notifications.onBackground);

function mapStateToProps(store, ownProps) {
  return {
    store: store,
  };
}

const ModalPresentation = {
  ...(Platform.OS == 'ios'
    ? TransitionPresets.ModalPresentationIOS
    : TransitionPresets.RevealFromBottomAndroid),
};

/** Specifying navigator const */
const nav_HomeScreen = connect(mapStateToProps)(HomeScreen);
const nav_EventFocus = connect(mapStateToProps)(EventFocus);
const nav_ManageSocietyFocus = connect(mapStateToProps)(ManageSocietyFocus);
const nav_ManageMembers = connect(mapStateToProps)(ManageMembers);
const nav_CreateEvent = connect(mapStateToProps)(CreateEvent);
const nav_CreateSociety = connect(mapStateToProps)(CreateSociety);
const nav_UpcomingEvents = connect(mapStateToProps)(UpcomingEvents);
const nav_EditEvent = connect(mapStateToProps)(EditEvent);
const nav_CreateBlog = connect(mapStateToProps)(CreateBlog);
const nav_BlogFocus = connect(mapStateToProps)(BlogFocus);
const nav_TicketScanner = connect(mapStateToProps)(TicketScanner);
const nav_LiveEvent = connect(mapStateToProps)(LiveEvent);
const nav_Profile = connect(mapStateToProps)(Profile);
const nav_AllBlogs = connect(mapStateToProps)(AllBlogs);
const nav_EditBlog = connect(mapStateToProps)(EditBlog);
const nav_Societies = connect(mapStateToProps)(Societies);
const nav_JoinedSocietyFocus = connect(mapStateToProps)(JoinedSocietyFocus);
const nav_ProfileInvitations = connect(mapStateToProps)(ProfileInvitations);
const nav_SocietyPreview = connect(mapStateToProps)(SocietyPreview);
const nav_EditSociety = connect(mapStateToProps)(EditSociety);
const nav_WebView = connect(mapStateToProps)(WebView);
const nav_BubblesAndChannels = connect(mapStateToProps)(BubblesAndChannels);
const nav_BubbleFocus = connect(mapStateToProps)(BubbleFocus);
const nav_Bookmarks = connect(mapStateToProps)(Bookmarks);
const nav_FAQ = connect(mapStateToProps)(FAQ);
const nav_Map = connect(mapStateToProps)(CampusMap);
const nav_AdminPanel = connect(mapStateToProps)(AdminPanel);
const nav_Image = connect(mapStateToProps)(ImageFocus);
const nav_StoryCamera = connect(mapStateToProps)(StoryCamera);
const nav_PointEvents = connect(mapStateToProps)(PointEvents);
const nav_Referral = connect(mapStateToProps)(Referral);

const Stack = createStackNavigator();
const Drawer = createDrawerNavigator();

function MyDrawer(props) {
  const showPopup = {
    initialParams: {
      showPopup: props.route.params.showPopup,
      isUserNew: props.route.params.isUserNew,
    },
  };
  return (
    <Drawer.Navigator
      initialRouteName={'Home'}
      headerMode={'none'}
      openByDefault={false}
      drawerContent={(info) => (
        <CustomDrawer {...info} screenProps={props.route.params} />
      )}
      drawerStyle={{
        activeTintColor: '#1c95c9',
        activeBackgroundColor: '#cdeffe',
        inactiveTintColor: GlobalStyle.Palettes.text.palette2,
        borderTopRightRadius: GlobalStyle.Measurements.unit,
        borderBottomRightRadius: GlobalStyle.Measurements.unit,
      }}
      screenOptions={{cardOverlayEnabled: true}}>
      <Drawer.Screen name={'Home'} component={nav_HomeScreen} {...showPopup} />
      <Drawer.Screen
        name={'Societies'}
        component={nav_Societies}
        {...showPopup}
      />
      <Drawer.Screen
        name={'Bubbles & Channels'}
        component={nav_BubblesAndChannels}
        {...showPopup}
      />
      <Drawer.Screen name={'Profile'} component={nav_Profile} {...showPopup} />
    </Drawer.Navigator>
  );
}

function MyStack(props) {
  const showPopup = {initialParams: {showPopup: props.screenProps.showPopup}};

  return (
    <Stack.Navigator
      headerMode={'none'}
      screenOptions={{
        cardOverlayEnabled: true,
      }}
      initialRouteName={'Drawer'}>
      <Stack.Screen
        name={'Drawer'}
        component={MyDrawer}
        initialParams={props.screenProps}
      />
      <Stack.Screen
        name={'Manage Society Focus'}
        component={nav_ManageSocietyFocus}
        {...showPopup}
      />
      <Stack.Screen
        name={'Create Event'}
        component={nav_CreateEvent}
        {...showPopup}
      />
      <Stack.Screen
        name={'Edit Society'}
        component={nav_CreateSociety}
        {...showPopup}
      />
      <Stack.Screen
        name={'Manage Members'}
        component={nav_ManageMembers}
        {...showPopup}
      />
      <Stack.Screen
        name={'Upcoming Events'}
        component={nav_UpcomingEvents}
        {...showPopup}
      />
      <Stack.Screen
        name={'Edit Event'}
        component={nav_EditEvent}
        {...showPopup}
      />
      <Stack.Screen
        name={'Create Blog'}
        component={nav_CreateBlog}
        {...showPopup}
      />
      <Stack.Screen
        name={'Event Focus'}
        component={nav_EventFocus}
        options={ModalPresentation}
        {...showPopup}
      />
      <Stack.Screen
        name={'Live Event'}
        component={nav_LiveEvent}
        {...showPopup}
      />
      <Stack.Screen
        name={'Blog Focus'}
        component={nav_BlogFocus}
        options={ModalPresentation}
        {...showPopup}
      />
      <Stack.Screen
        name={'All Blogs'}
        component={nav_AllBlogs}
        {...showPopup}
      />
      <Stack.Screen
        name={'Profile Invitations'}
        component={nav_ProfileInvitations}
        options={ModalPresentation}
        {...showPopup}
      />
      <Stack.Screen
        name={'Edit Blog'}
        component={nav_EditBlog}
        {...showPopup}
      />
      <Stack.Screen
        name={'Society Preview'}
        component={nav_SocietyPreview}
        options={ModalPresentation}
        {...showPopup}
      />
      <Stack.Screen
        name={'Joined Society Focus'}
        component={nav_JoinedSocietyFocus}
        {...showPopup}
      />
      {/* <Stack.Screen
        name={'Edit Society'}
        component={nav_EditSociety}
        {...showPopup}
      /> */}
      <Stack.Screen
        name={'Web View'}
        component={nav_WebView}
        options={ModalPresentation}
        initialParams={props.screenProps}
        {...showPopup}
      />
      <Stack.Screen
        name={'Ticket Scanner'}
        component={nav_TicketScanner}
        {...showPopup}
      />
      <Stack.Screen
        name={'Bubble Focus'}
        component={nav_BubbleFocus}
        options={ModalPresentation}
        {...showPopup}
      />
      <Stack.Screen
        name={'Bookmarks'}
        component={nav_Bookmarks}
        options={ModalPresentation}
        {...showPopup}
      />
      <Stack.Screen
        name={'FAQ'}
        component={nav_FAQ}
        options={ModalPresentation}
        {...showPopup}
      />
      <Stack.Screen
        name={'Campus Map'}
        component={nav_Map}
        options={ModalPresentation}
        {...showPopup}
      />
      <Stack.Screen
        name={'Image Focus'}
        component={nav_Image}
        options={ModalPresentation}
        {...showPopup}
      />
      <Stack.Screen
        name={'Story Camera'}
        component={nav_StoryCamera}
        {...showPopup}
      />
      <Stack.Screen
        name={'Point Events'}
        component={nav_PointEvents}
        options={ModalPresentation}
        {...showPopup}
      />
      <Stack.Screen
        name={'Referral Focus'}
        component={nav_Referral}
        options={ModalPresentation}
        {...showPopup}
      />
    </Stack.Navigator>
  );
}

function AppContainer(props) {
  const navRef = React.useRef();

  return (
    <NavigationContainer
      ref={navRef}
      onReady={() =>
        Store.dispatch({
          type: 'NAVIGATION_CHANGE',
          payload: navRef.current.getCurrentRoute(),
        })
      }
      onStateChange={() =>
        Store.dispatch({
          type: 'NAVIGATION_CHANGE',
          payload: navRef.current.getCurrentRoute(),
        })
      }>
      <MyStack {...props} />
    </NavigationContainer>
  );
}

class App extends React.Component {
  /**
   * App will try to sign in user and pass the response to LoadingScreen to handle animations.
   * If this.state.signedIn is false, then LoadingScreen will show a sign in component and the user can switch to create account or send a new password
   */

  constructor() {
    super();
    this.unsubscribeForeground = () => {}; // Messaging handler in foreground
    this.unsubscribeBackground = () => {}; // Messaging handler in background
    this.popups = React.createRef(); // Call for popup animations

    this.state = {
      signInCount: 0,
      signedIn: null,
      initialPosition: null,
      user: {},
      showKeyboardButton: true,
      prevAppState: '',
      popup: {
        level: false,
        type: false,
        active: false,
      },
      isUserNew: false,
    };
  }
  async componentDidMount() {
    // setJSExceptionHandler((err, isFatal) =>
    //   errorHandler(err, isFatal, this.showPopup),
    // );

    db.enableNetwork();
    // Load all vector icons at mount
    MaterialIcon.loadFont();
    MaterialCommunityIcon.loadFont();
    FontAwesome.loadFont();
    Ionicon.loadFont();
    Entypo.loadFont();

    AppState.addEventListener('change', this.handleAppStateChange);

    messaging.setAutoInitEnabled(true);

    notifee.createChannel({
      id: 'general',
      name: 'General android notification',
      sound: 'bubble_pop.mp3',
    });

    auth.onAuthStateChanged(async (user) => {
      // We want to catch when user has been signed out. However, we don't want to catch when they have signed in. This is since then we cannot control the verification process under <LoadingScreen />
      if (user !== true) this.setState({signedIn: false});
      else db.enableNetwork();
    });

    console.log('__DEV__ =', __DEV__);
    const DEBUG = await deviceInfoModule.isEmulator();
    if (!DEBUG && !__DEV__) {
      if (!window.console) window.console = {};
      var methods = ['log', 'debug', 'warn', 'info'];
      for (var i = 0; i < methods.length; i++) {
        console[methods[i]] = function () {};
      }
    }

    crashlytics.setCrashlyticsCollectionEnabled(!__DEV__);
    firebaseAnalytics.setAnalyticsCollectionEnabled(!__DEV__);
    analytics.breadcrumb('App mounted', 'App.js');

    const initialLink = await dynamicLinks.getInitialLink();
    const baseUrl = 'https://campus42.page.link/referral/';
    const isReferral = initialLink.url.includes(baseUrl);
    const sender = initialLink.url.split(baseUrl)[1];
    console.log('Sender', sender);
    console.log('Referral', isReferral);
  }
  componentWillUnmount() {
    AppState.removeEventListener('change', this.handleAppStateChange);
  }
  render() {
    return (
      <Provider store={Store}>
        {this.state.signedIn ? (
          <AppContainer
            screenProps={{
              ...this.props,
              showPopup: this.showPopup,
              isUserNew: this.state.isUserNew,
              user: this.state.user,
            }}
          />
        ) : (
          <AuthCatcher
            {...this.state}
            {...this.props}
            updateSignedIn={this.updateSignedIn}
            showPopup={this.showPopup}
          />
        )}
        <Popups ref={this.popups} {...this.state.popup} />
      </Provider>
    );
  }
  showPopup = ({
    active = false,
    type = false,
    level = false,
    navigate = () => {},
    ...options
  }) => {
    try {
      this.setState({popup: {...options, navigate, active, level, type}});
      active && this.popups.current.animateIn(type);
    } catch (err) {
      analytics.error(err, 'App.js', 'showPopup()');
    }
  };
  handleAppStateChange = (state) => {
    if (state != this.state.prevAppState && state != 'background')
      analytics.appstate(state);

    if (state == 'active') notifee.cancelAllNotifications();
  };
  updateSignedIn = (response, user, isUserNew = false) => {
    response && this.state.signedIn !== true && analytics.signin(user);
    response && this.state.signedIn !== true && updateAnalyticsInfo();
    AsyncStorage.setCampusKey(response ? user.campus : 'undefined');
    /** This function will be passed as a prop to LoadingScreen which will handle it. If it fails LoadingScreen will redirect to a signin component */
    this.setState({
      signedIn: response,
      signInCount: this.state.signInCount + 1,
      user: user,
      isUserNew: isUserNew || false,
    });
  };
}

export default App;
