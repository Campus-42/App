import React from 'react';
import {FlatList} from 'react-native';
import {View, Text} from 'react-native';
import {HomeFuncs} from '../../screens/EventStack/HomeScreen/functions';
import {getTagColors} from '../Airtable/functions';
import {EmptyBox} from '../EmptyAnimation';
import {GlobalStyle} from '../GlobalStyle';
import {SwipeUpViewLarge} from '../SwipeUpView';
import {SWIPEUP_LARGE_HEIGHT} from '../SwipeUpView/SwipeUpViewLarge';
import {styles} from './style';
import PropTypes from 'prop-types';
import {EventSnap} from '../../screens/EventStack/HomeScreen/components/EventCarousel/EventSnap';
import {getRecommendedEvents} from '../Firebase/functions';
import {SocietySnap} from '../SocietyCarousel/SocietySnap';
import {Campus} from '../Campus';

export class EventSocietySearch extends React.Component {
  constructor() {
    super();
    this.searchbar = React.createRef();
    this.state = {
      tagColors: [],
      events: [],
      initEvents: [],
      societies: [],

      searchbarHeight: null,
      titleHeight: null,

      searching: false,
      searchText: '',
    };
  }
  componentDidMount() {
    getTagColors().then((colors) => this.setState({tagColors: colors}));
    getRecommendedEvents(this.props.store.app.campus.key, 3)
      .then((events) => this.setState({events: events, initEvents: events}))
      .catch(console.warn);
    HomeFuncs.getRecommendedSocieties(
      this.props.store.app.campus.key,
      this.props.store.app.campus.societies,
      this.props.store.user.joined_societies,
      [],
    )
      .then((societies) => this.setState({societies: societies}))
      .catch(console.warn);
  }
  render() {
    var events = this.state.events;
    var societies = this.state.societies;

    if (events.length > 0)
      events = [{__type: 'title', id: '1', title: 'Events'}].concat(events);
    if (societies.length > 0)
      societies = [{__type: 'title', id: '2', title: 'Societies'}].concat(
        societies,
      );

    const flatlistData = events.concat(societies);

    return (
      <SwipeUpViewLarge
        isActive={this.props.isActive}
        onClose={this.props.onClose}>
        <View style={styles.container}>
          <Text
            style={styles.title}
            onLayout={({nativeEvent}) =>
              this.onLayouts(nativeEvent.layout.height, 'title')
            }>
            Search Events & Societies
          </Text>
          <GlobalStyle.UI.TextInput
            ref={this.searchbar}
            onLayout={({nativeEvent}) =>
              this.onLayouts(nativeEvent.layout.height, 'searchbbar')
            }
            showSearchIcon
            placeholder={'Search your campus'}
            onChangeText={this.onChangeText}
            onFocus={() => this.setState({searching: true})}
            onEndEditing={this.onEndEditing}
          />
          <FlatList
            {...GlobalStyle.Props.focusBackgroundScrollView}
            showsVerticalScrollIndicator={false}
            contentInset={{bottom: GlobalStyle.Measurements.height * 0.1}}
            scrollEnabled={flatlistData.length > 0}
            style={[
              styles.flatlist,
              {
                height:
                  SWIPEUP_LARGE_HEIGHT -
                  this.state.searchbarHeight -
                  this.state.titleHeight -
                  GlobalStyle.Measurements.height * 0.12 -
                  styles.flatlist.marginTop,
              },
            ]}
            // contentContainerStyle={{alignItems: 'center'}}
            keyExtractor={(item) =>
              `event_society_search_${item.__type}_${item.id}`
            }
            ListHeaderComponent={
              <Text style={styles.subtitle}>Double click to select</Text>
            }
            ListEmptyComponent={
              !this.state.searching && (
                <EmptyBox
                  style={{marginTop: GlobalStyle.Measurements.height * 0.1}}
                  errorText={
                    "Hmm, your campus doesn't have this\nTry something else"
                  }
                />
              )
            }
            data={flatlistData}
            renderItem={({item, index}) => (
              <View
                style={{marginVertical: GlobalStyle.Measurements.marginHalf}}>
                {item.__type == 'title' ? (
                  <Text style={styles.flatlistTitles}>{item.title}</Text>
                ) : item.__type == 'event' ? (
                  <EventSnap
                    bookmarks={this.props.store.user.bookmarks}
                    allowDoublePress={true}
                    reduxEvent={this.props.store.app.events[item.id]}
                    showShadow
                    tagColors={this.state.tagColors}
                    data={item}
                    colors={this.props.store.app.campus.colors}
                    navigation={this.props.navigation}
                    openEvent={(event) =>
                      this.props.navigation.navigate('Event Focus', {
                        id: event.id,
                      })
                    }
                    onDoublePress={() => {
                      this.props.onSelect(item);
                      setTimeout(() => this.props.onClose(), 500);
                    }}
                  />
                ) : (
                  <SocietySnap
                    bookmarks={this.props.store.user.bookmarks}
                    showShadow
                    allowDoublePress={true}
                    data={item}
                    colors={this.props.store.app.campus.colors}
                    reduxSociety={this.props.store.app.societies[item.id]}
                    onPress={() =>
                      this.props.navigation.navigate('Society Preview', {
                        id: item.id,
                      })
                    }
                    onDoublePress={() => {
                      this.props.onSelect(item);
                      setTimeout(() => this.props.onClose(), 500);
                    }}
                  />
                )}
              </View>
            )}
          />
        </View>
      </SwipeUpViewLarge>
    );
  }
  onChangeText = (text) => {
    const clear = !text.replace(/\s/g, '').length;

    if (!clear) {
      this.searchbar.current.toggleLoading(true);
      Campus.Funcs.event
        .searchEvents(this.props.store.app.campus.key, text)
        .then((events) => this.setState({events: events}))
        .catch((err) => {
          this.setState({events: []});
          console.warn('Could not get events', err);
        });
      Campus.Funcs.society
        .searchSocieties(this.props.store.app.campus.key, text)
        .then((societies) => this.setState({societies: societies}))
        .catch((err) => {
          this.setState({societies: []});
          console.warn('Could not get societies', err);
        });
    }
    this.setState({searchText: text});
  };
  onEndEditing = () => {
    this.setState({searching: false});
    const clear = !this.state.searchText.replace(/\s/g, '').length;

    if (clear) this.setState({events: this.state.initEvents});

    this.searchbar.current.toggleLoading(false);
  };
  onLayouts = (height, object) => {
    this.state[`${object}Heigth`] === null &&
      this.setState({[`${object}Heigth`]: height});
  };
}

EventSocietySearch.defaultProps = {
  isActive: false,
  store: {},
  closeDelay: 500,
  closeAtSelect: true,
  onSelect: () => {},
  onClose: () => {},
};
EventSocietySearch.propTypes = {
  store: PropTypes.object.isRequired,
  onSelect: PropTypes.func,
  closeDelay: PropTypes.number,
  closeAtSelect: PropTypes.bool,
  isActive: PropTypes.bool,
  onClose: PropTypes.func,
};
