import React from 'react';
import {View, Text, RefreshControl, ScrollView} from 'react-native';
import {GlobalStyle} from '../../../assets/GlobalStyle';
import {styles} from './style';
import {SocietyCarousel} from '../../../assets/SocietyCarousel/SocietyCarousel';
import {JoinedSocietyFuncs} from './functions';
import {Heading} from '../../ManageSocietyStack/ManageSociety/components/AdminView/Heading';
import {SearchBar} from './components/SearchBar';
import {SearchView} from './components/SearchView';
import {FetchError} from '../../../assets/FetchError/FetchError';
import {LoadingCircle} from '../../../assets/LottieAnims/loading';
import {Store} from '../../../assets/redux/store';
import TouchableShrink from '../../../assets/TouchableShrink/TouchableShrink';
import {EventsSoonCarousel} from '../../ManageSocietyStack/ManageSociety/components/AdminView/components/EventsSoonCarousel';
import {getTagColors} from '../../../assets/Airtable/functions';
import {ManageFuncs} from '../../ManageSocietyStack/ManageSociety/functions';
import {ConfirmEventCarousel} from '../../ManageSocietyStack/ManageSociety/components/AdminView/components/ConfirmEventCarousel';
import {getCampusInfo} from '../../../assets/Firebase/functions';
import {HomeFuncs} from '../../EventStack/HomeScreen/functions';
import {updateReduxSocieties} from '../../../assets/redux/functions';
import {InReviewSocieties} from '../../../assets/InReviewSocieties';
import {analytics} from '../../../assets/Analytics';
import {Campus} from '../../../assets/Campus';

export class Societies extends React.Component {
  constructor() {
    super();
    this.header = React.createRef();
    this.scroll = React.createRef();
    this.joinedSocieties = React.createRef();
    this.recommendedSocieties = React.createRef();

    this.state = {
      refreshing: false,
      societies: [],
      recommendedSocieties: [],
      societiesError: false,
      searchFocus: false,
      searchResult: [],
      searchError: false,
      searchLoading: false,
      societyInit: false,
      recommendedSocietyInit: false,
      focusInSearchBar: false, // IF true then focus in searchbar
      userIsTyping: false,
      submits: [],
      tagColors: [],
      eventsSoon: [],
      eventConfs: [],
      blogConfs: [],
    };
  }
  componentDidMount() {
    Campus.Funcs.user.checkIfWelcomePopupShouldShow(
      this.props.store.user,
      this.props.route.name,
      this.props.route.params.showPopup,
      this.props.navigation.navigate,
      'general/societies-welcome',
    );

    setTimeout(
      () => this.refresh(false),
      !(this.props.store.user.welcome_screens_visited || []).includes(
        'Societies',
      )
        ? 3000
        : 1000,
    );
  }
  render() {
    const init = this.state.societyInit && this.state.recommendedSocietyInit;

    return (
      <View style={GlobalStyle.ViewStyle.backgroundView}>
        <GlobalStyle.Header
          ref={this.header}
          navigation={this.props.navigation}
          destinationType={'openDrawer'}
          badgeKey={'societies'}
        />
        <ScrollView
          {...GlobalStyle.Props.scrollViewWithAnimatingHeaderTitle}
          ref={this.scroll}
          style={styles.scroll}
          contentContainerStyle={{paddingBottom: 50}}
          showsVerticalScrollIndicator={false}
          onScroll={this.handleScroll}
          refreshControl={
            <RefreshControl
              onRefresh={this.refresh}
              refreshing={this.state.refreshing}
            />
          }>
          <Heading
            colors={this.props.store.app.campus.colors}
            title="Societies"
            subtitle="View all the societies you have joined or find new ones"
            screen="join"
          />
          <SearchBar
            colors={this.props.store.app.campus.colors}
            placeholder="Search for societies"
            viewFocus={this.viewFocus}
            updateSearchResult={this.updateSearchResult}
            campusKey={this.props.store.app.campus.key}
            focusInSearchBar={this.state.focusInSearchBar}
            setSearchLoading={this.setSearchLoading}
            focusSearch={this.focusSearch}
            userIsTyping={(status = true) =>
              this.setState({userIsTyping: status})
            }
            societies={this.props.store.app.societies}
          />
          {this.state.searchError || this.state.societiesError ? (
            <View style={styles.errorView}>
              <FetchError
                errorText={
                  'We could not get societies\nPlease check your internet connection'
                }
                showButton
                onPress={this.refresh}
              />
            </View>
          ) : this.state.searchFocus === false ? (
            <View>
              {this.state.eventsSoon.length > 0 && init && (
                <EventsSoonCarousel
                  data={this.state.eventsSoon}
                  colors={this.props.store.app.campus.colors}
                  navigate={this.props.navigation.navigate}
                  tagColors={this.state.tagColors}
                />
              )}
              <ConfirmEventCarousel
                confirmations={this.state.eventConfs.concat(
                  this.state.blogConfs,
                )}
                removeEvent={() => {}}
                campusKey={this.props.store.app.campus.key}
                navigation={this.props.navigation}
                updateConfirms={this.updateConfirms}
              />
              {(this.state.societies.length > 0 || !init) && (
                <SocietyCarousel
                  {...this.props}
                  ref={this.joinedSocieties}
                  data={this.state.societies.sort(sortSocietyiesByExecOrNot)}
                  title={'Your Societies'}
                  loading={!init}
                  focusSearch={this.focusSearch}
                  onPress={(elem) => this.openSociety(elem)}
                  emptyText={"You haven't joined any societies yet 😭"}
                  refresh={() => {}}
                  reduxSocieties={this.props.store.app.societies}
                  bookmarks={this.props.store.user.bookmarks}
                />
              )}
              {(this.state.recommendedSocieties.length > 0 || !init) && (
                <SocietyCarousel
                  {...this.props}
                  ref={this.recommendedSocieties}
                  data={this.state.recommendedSocieties}
                  title={'Recommended Societies'}
                  loading={!init}
                  focusSearch={this.focusSearch}
                  onPress={(elem) => this.previewSociety(elem)}
                  emptyText={"We couldn't find any societies 🧐"}
                  refresh={this.getRecommendedSocieties}
                  reduxSocieties={this.props.store.app.societies}
                  bookmarks={this.props.store.user.bookmarks}
                />
              )}
              {this.state.submits.length > 0 && init && (
                <InReviewSocieties
                  societies={this.state.submits}
                  navigate={this.props.navigation.navigate}
                />
              )}
            </View>
          ) : this.state.searchLoading ? (
            <View style={styles.errorView}>
              <LoadingCircle loading={true} />
            </View>
          ) : (
            <SearchView
              openSociety={this.previewSociety}
              colors={this.props.store.app.campus.colors}
              data={this.state.searchResult}
              searching={this.state.searchLoading}
              userIsTyping={this.state.userIsTyping}
            />
          )}
        </ScrollView>
      </View>
    );
  }
  updateConfirms = (id, error = false) => {
    const newEvents = this.state.eventConfs.filter((elem) => elem.id !== id);
    this.setState({eventConfs: newEvents});
    this.setState({blogConfs: newEvents});
  };
  focusSearch = (value = true) => {
    this.setState({focusInSearchBar: value});
  };
  setSearchLoading = () =>
    this.setState({
      searchLoading: true,
      searchError: false,
    });
  openSociety = (item) => {
    Store.dispatch({type: 'UPDATE_SOCIETY_FOCUS', payload: item});
    this.props.navigation.navigate('Joined Society Focus', {id: item.id});
  };
  previewSociety = (item) => {
    this.props.navigation.navigate('Society Preview', {
      id: item.id,
    });
  };
  refresh = (refreshing = true) => {
    this.setState({refreshing: refreshing});
    getCampusInfo(this.props.store.app.campus.key);
    this.getSocieties(refreshing);
    this.getRecommendedSocieties(refreshing);
    // this.getSubmittedSocieties();
    this.getEventsSoon();
    this.getConfirmations();
    getTagColors().then((colors) => this.setState({tagColors: colors}));
  };
  viewFocus = (view) => {
    this.setState({searchFocus: view == 'search'});
    if (this.state.searchFocus && view == 'normal')
      this.setState({searchResult: []});
  };
  updateSearchResult = (result = Array, error = false) => {
    this.setState({
      searchResult: result,
      searchError: error,
      searchLoading: false,
    });
  };
  handleScroll = ({nativeEvent}) =>
    GlobalStyle.UX.onScrollForAnimatingHeader(
      nativeEvent,
      this.header,
      this.scroll,
    );

  getSocieties = async (refreshing) => {
    refreshing && this.joinedSocieties.current.animateToIndex(0);
    JoinedSocietyFuncs.getSocieties(this.props.store.app.campus.key)
      .then((societies) => {
        this.setState({societies: societies, societiesError: false});
        updateReduxSocieties(societies, this.props.store.app.societies);
      })
      .catch((err) => {
        console.warn('Could not get joined societies', err);
        this.setState({societies: [], societiesError: true});
      })
      .finally(() => this.setState({refreshing: false, societyInit: true}));
  };
  getRecommendedSocieties = async (refreshing = false) => {
    refreshing && this.recommendedSocieties.current.animateToIndex(0);
    HomeFuncs.getRecommendedSocieties(
      this.props.store.app.campus.key,
      this.props.store.app.campus.societies,
      this.props.store.user.joined_societies,
      refreshing ? [] : this.state.recommendedSocieties,
    )
      // JoinedSocietyFuncs.getRecommendedSocieties(
      //   this.props.store.app.campus.key,
      //   this.props.store.app.campus.societies,
      //   this.props.store.user.permissions,
      //   refreshing ? [] : this.state.recommendedSocieties,
      // )
      .then((societies) => {
        this.setState({
          recommendedSocieties: refreshing
            ? societies
            : this.state.recommendedSocieties.concat(societies),
        });
        updateReduxSocieties(societies, this.props.store.app.societies);
      })
      .catch((err) => {
        console.log('Could not get recommended socieities', err);
      })
      .finally(() => this.setState({recommendedSocietyInit: true}));
  };
  getSubmittedSocieties = async () => {
    JoinedSocietyFuncs.getSubmittedSocieties(this.props.store.app.campus.key)
      .then((submits) => {
        this.setState({submits: submits});
      })
      .catch((err) => {
        this.setState({submits: []});
        console.warn('Could not get submitted societies', err);
      });
  };
  getEventsSoon = async () => {
    ManageFuncs.getEventsHappeningSoon(this.props.store.app.campus.key)
      .then((events) => this.setState({eventsSoon: events}))
      .catch((err) => {
        this.setState({eventsSoon: []});
        console.warn('Could not get events happening soon', err);
      });
  };
  getConfirmations = async () => {
    ManageFuncs.getEventConfirmations(this.props.store.app.campus.key)
      .then((confirmations) => this.setState({eventConfs: confirmations}))
      .catch((err) => {
        this.setState({eventConfs: []});
        console.warn('Could not get event confirmations', err);
      });
    ManageFuncs.getBlogConfirmations(this.props.store.app.campus.key)
      .then((confirmations) => this.setState({blogConfs: confirmations}))
      .catch((err) => {
        this.setState({
          blogConfs: [],
        });
        console.warn('Could not get blog confirmations', err);
      });
  };
}

function sortSocietyiesByExecOrNot(a, b) {
  return a.isExec === b.isExec ? 0 : a.isExec ? -1 : 1;
}
