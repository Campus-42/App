import React from 'react';
import {
  View,
  Text,
  ScrollView,
  Button,
  FlatList,
  RefreshControl,
} from 'react-native';
import {ModalTop} from '../../../assets/ModalTop';
import {GlobalStyle} from '../../../assets/GlobalStyle';
import {styles} from './style';
import {FetchError} from '../../../assets/FetchError/FetchError';
import {EditEventFuncs} from './functions';
import {EditEventSnap} from './components/EditEventSnap';
import {getTagColors} from '../../../assets/Airtable/functions';
import {Store} from '../../../assets/redux/store';
import {EmptyBox} from '../../../assets/EmptyAnimation';
import {analytics} from '../../../assets/Analytics';

export class UpcomingEvents extends React.Component {
  constructor() {
    super();
    this.state = {
      tagColors: [], // The tag colors
      initDone: false, // When first fetch is done
      refreshing: false, // When component is refreshing, Will not be triggered by first fetch
      error: false, // If error show error component
      upcomingEvents: [], // Events, pass dummy array to show skeleton content
    };
  }
  componentDidMount() {
    

    this.refresh();
  }
  render() {
    return (
      <View style={{flex: 1}}>
       <GlobalStyle.Header
          title={'Upcoming Events'}
          navigation={this.props.navigation}
          destinationType={'goBack'}
          colors={this.props.store.app.campus.colors}
        />
        {this.state.error == false ? (
          this.state.upcomingEvents.length > 0 ? (
            <FlatList
              {...GlobalStyle.Props.focusBackgroundScrollView}
              refreshControl={
                <RefreshControl
                  refreshing={this.state.refreshing}
                  onRefresh={this.refresh}
                />
              }
              key="Edit_Upcoming_Event_Flatlist"
              style={[
                styles.scroll,
                {paddingVertical: GlobalStyle.Measurements.marginHalf},
              ]}
              data={this.state.upcomingEvents}
              renderItem={this._renderItem}
            />
          ) : (
            !this.state.refreshing &&
            this.state.initDone && (
              <View style={styles.fullErrorView}>
                <EmptyBox showButton onPress={this.refresh} />
              </View>
            )
          )
        ) : (
          <View style={styles.fullErrorView}>
            <FetchError
              showButton
              onPress={this.refresh}
              errorText={this.state.errorText}
            />
          </View>
        )}
      </View>
    );
  }
  _renderItem = ({item, index}) => {
    return (
      <EditEventSnap
        tagColors={this.state.tagColors}
        isLoading={!this.state.initDone}
        event={item}
        colors={this.props.store.app.campus.colors}
        openEvent={this.openEvent}
        index={index}
        bookmarks={this.props.store.user.bookmarks}
      />
    );
  };
  openEvent = (event) => {
    // Update redux and navigate to edit current event
    Store.dispatch({type: 'UPDATE_EDIT_EVENT_FOCUS', payload: event});
    this.props.navigation.navigate('Edit Event');
  };
  refresh = async (refreshing = true) => {
    this.setState({refreshing: refreshing});

    this.getUpcomingEvents()
      .then((events) => this.setState({upcomingEvents: events, error: false}))
      .catch((err) => {
        console.warn('Could not get upcoming events', err);
        this.setState({error: true});
      })
      .finally(() => this.setState({initDone: true}));
    const tagColors = await getTagColors();

    this.setState({refreshing: false, tagColors: tagColors});
  };
  getUpcomingEvents = async () => {
    return EditEventFuncs.getUpcomingEvents(
      this.props.store.app.campus.key,
      this.props.store.society.manageSocietyFocus.id,
    )
      .then((events) => {
        return events;
      })
      .catch((err) => {
        throw err;
      });
  };
}
