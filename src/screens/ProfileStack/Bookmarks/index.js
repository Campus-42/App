import React from 'react';
import {View, Text, RefreshControl, FlatList} from 'react-native';
import {GlobalStyle} from '../../../assets/GlobalStyle';
import {ModalTop} from '../../../assets/ModalTop';
import {EmptyBox} from '../../../assets/EmptyAnimation';
import {FetchError} from '../../../assets/FetchError/FetchError';
import {Campus} from '../../../assets/Campus';
import {EventSnap} from '../../EventStack/HomeScreen/components/EventCarousel/EventSnap';
import {getTagColors} from '../../../assets/Airtable/functions';
import {StyleSheet} from 'react-native';
import {SocietySnap} from '../../../assets/SocietyCarousel/SocietySnap';
import {BlogSnap} from '../../EventStack/HomeScreen/components/BlogCarousel/BlogSnap';
import * as Animatable from 'react-native-animatable';
import {SegmentControl} from '../../../assets/SegmentControl';

// The values to show in the segment controller
const segments = ['Events', 'Societies', 'Announcements'];
// The object types so that we can filter away any unwanted objects
const objectTypes = {
  Events: 'event',
  Societies: 'society',
  Announcements: 'announcement',
};

export class Bookmarks extends React.Component {
  constructor() {
    super();
    this.state = {
      selected: 0,
      prev: undefined,
      refreshing: false,
      eventInit: false,
      societyInit: false,
      tagColors: {},
      startIndex: 0,

      Events: [], // These are fetched by the name in the segments, must match!!
      Societies: [], // These are fetched by the name in the segments, must match!!
      Announcements: [], // These are fetched by the name in the segments, must match!!
    };
  }
  componentDidMount() {
    setTimeout(() => this.fetch(false), 1000);
    getTagColors().then((colors) => this.setState({tagColors: colors}));
  }
  render() {
    const init =
      this.state.selected == 0
        ? this.state.eventInit
        : this.state.selected == 1
        ? this.state.societyInit
        : this.state.selected == 2 && this.state.announcementInit;

    const selectedValue = segments[this.state.selected];
    const objectType = objectTypes[selectedValue];

    return (
      <View {...GlobalStyle.Props.focusBackgroundScrollView}>
        <ModalTop title={'Favourites'} onPress={this.props.navigation.goBack} />
        <SegmentControl
          segments={segments}
          index={this.state.selected}
          onIndexChange={this.onIndexChange}
        />
        <FlatList
          {...GlobalStyle.Props.focusBackgroundScrollView}
          showsVerticalScrollIndicator={false}
          data={
            !init || this.state.error
              ? []
              : this.state[selectedValue].filter((e) => e.__type === objectType)
          }
          extraData={this.state}
          refreshing={this.state.refreshing || !init}
          refreshControl={
            <RefreshControl
              refreshing={this.state.refreshing || !init}
              onRefresh={() => this.fetch(true, true)}
            />
          }
          onEndReached={() => this.fetch(false)}
          ListEmptyComponent={
            init && !this.state.error ? (
              <EmptyBox
                style={{marginTop: GlobalStyle.Measurements.margin * 2}}
                buttonText={'Reload'}
                showButton
                errorText={`You haven't bookmarked any ${selectedValue.toLowerCase()}`}
                onPress={this.fetch}
              />
            ) : (
              init &&
              this.state.error && (
                <FetchError
                  style={{marginTop: GlobalStyle.Measurements.margin * 2}}
                  showButton
                  onPress={this.fetch}
                />
              )
            )
          }
          renderItem={this.renderItem}
        />
      </View>
    );
  }
  onIndexChange = (index) => {
    this.setState({selected: index}, () => {
      const dataLength = this.state[segments[index]].length;
      if (dataLength == 0) {
        this.setState({refreshing: true});
        setTimeout(() => this.fetch(true), 750);
      }
    });
  };
  fetch = (refreshing = true, clear = false) => {
    this.setState({refreshing: refreshing});

    const name = segments[this.state.selected];
    const bookmarkName =
      name == 'Events'
        ? 'event'
        : name == 'Societies'
        ? 'society'
        : name == 'Announcements'
        ? 'announcement'
        : '-';

    const rawBookmarks = this.props.store.user.bookmarks;
    const illDefined = rawBookmarks === undefined || rawBookmarks === false;
    const bookmarks = illDefined ? {event: [], society: []} : rawBookmarks;

    const ids = bookmarks[bookmarkName] || [];
    const startIndex = clear ? 0 : this.state[name].length;
    const campusKey = this.props.store.app.campus.key;

    this.setState({startIndex: startIndex}); // So the delay of animation is not huge we will deduct this
    if (this.state.selected == 0)
      Campus.Funcs.event
        .getBookmarked(campusKey, ids, startIndex)
        .then((res) => {
          const existingEvents = this.state.Events;
          const newEvents = [];

          // Don't push an event that's already included
          res.events.forEach(
            (evt) =>
              existingEvents.findIndex((e) => e.id === evt.id) == -1 &&
              newEvents.push(evt),
          );

          this.setState({
            Events: clear ? newEvents : existingEvents.concat(newEvents),
            error: res.error,
          });
        })
        .catch((err) => this.setState({error: true}))
        .finally(() => this.setState({refreshing: false, eventInit: true}));
    else if (this.state.selected == 1)
      Campus.Funcs.society
        .getBookmarked(campusKey, ids, startIndex)
        .then((res) =>
          this.setState({
            Societies: clear
              ? res.societies
              : this.state.Societies.concat(res.societies),
            error: res.error,
          }),
        )
        .catch((err) => this.setState({error: true}))
        .finally(() => this.setState({refreshing: false, societyInit: true}));
    else if (this.state.selected == 2)
      Campus.Funcs.announcement
        .getBookmarked(campusKey, ids, startIndex)
        .then((res) => {
          const existingAnnouncements = this.state.Announcements;
          const newAnnouncements = [];

          res.announcements.forEach(
            (a) =>
              existingAnnouncements.findIndex((e) => e.id === a.id) == -1 &&
              newAnnouncements.push(a),
          );

          this.setState({
            Announcements: clear
              ? newAnnouncements
              : existingAnnouncements.concat(newAnnouncements),

            error: res.error,
          });
        })
        .catch((err) => this.setState({error: true}))
        .finally(() =>
          this.setState({refreshing: false, announcementInit: true}),
        );
  };
  renderItem = ({item, index}) => (
    <Animatable.View
      animation={'fadeInUpBig'}
      duration={500}
      delay={300 + 50 * (index - this.state.startIndex)}>
      {this.state.selected == 0 ? (
        <EventSnap
          style={styles.obj}
          data={item}
          tagColors={this.state.tagColors}
          reduxEvent={this.props.store.app.events[item.id]}
          colors={this.props.store.app.campus.colors}
          openEvent={() =>
            this.props.navigation.navigate('Event Focus', {id: item.id})
          }
          bookmarks={undefined}
          dontShowBookmark
        />
      ) : this.state.selected == 1 ? (
        <SocietySnap
          style={styles.obj}
          data={item}
          colors={this.props.store.app.campus.colors}
          onPress={() =>
            this.props.navigation.navigate('Society Preview', {id: item.id})
          }
          bookmarks={undefined}
          dontShowBookmark
        />
      ) : (
        <BlogSnap
          style={styles.obj}
          blog={item}
          colors={this.props.store.app.campus.colors}
          navigate={this.props.navigation.navigate}
          bookmarks={undefined}
          dontShowBookmark
          large
        />
      )}
    </Animatable.View>
  );
}

const styles = StyleSheet.create({
  container: {},
  obj: {
    marginVertical: GlobalStyle.Measurements.marginHalf,
    alignSelf: 'center',
  },
});
