import React from 'react';
import {View, Text, TextInput, FlatList} from 'react-native';
import {styles as ManageStyles} from '../../ManageSocietyFocus/style';
import {SearchElementInScroll} from '../../CreateEvent/components/SearchElementInScroll';
import {Funcs} from '../functions';
import {EventSnap} from '../../../EventStack/HomeScreen/components/EventCarousel/EventSnap';
import {getTagColors} from '../../../../assets/Airtable/functions';
import {GlobalStyle} from '../../../../assets/GlobalStyle';

export class EventSearch extends React.Component {
  constructor() {
    super();
    this.state = {
      events: [],
      search: '',
      tagColors: [],
    };
  }
  componentDidMount() {
    getTagColors().then((colors) => this.setState({tagColors: colors}));
  }

  render() {
    return (
      <View>
        <Text style={ManageStyles.title}>Search Event</Text>
        <TextInput
          placeholder="Search for an event"
          style={[ManageStyles.textInput, ManageStyles.searchTextInput]}
          onChangeText={this.searchEvent}
        />
        <FlatList
          style={ManageStyles.swipeUpContainer}
          data={this.state.events}
          contentInset={{bottom: GlobalStyle.Measurements.height * 0.1}}
          contentContainerStyle={{alignItems: 'center'}}
          // keyExtractor={({item}) => `Searh Event Flatlist ${item.id}`}
          renderItem={({item}) => (
            <View style={{marginVertical: GlobalStyle.Measurements.marginHalf}}>
              <EventSnap
                showShadow
                tagColors={this.state.tagColors}
                data={item}
                colors={this.props.colors}
                navigation={this.props.navigation}
                openEvent={() => {
                  this.props.close();
                  setTimeout(() => this.props.addContent('Event', item.id), 300);
                }}
              />
            </View>
          )}
        />
      </View>
    );
  }
  searchEvent = async (text) => {
    const clear = !text.replace(/\s/g, '').length;
    if (!clear)
      Funcs.searchEvent(text, this.props.campusKey, this.props.societyID)
        .then((docs) => this.setState({events: docs}))
        .catch((err) => {
          console.warn('ERROR, Could not search for events', err);
          this.setState({error: true});
        });
  };
  handlePress = (eventID) => {
    this.props.addContent('Event', eventID);
    this.props.close();
  };
}
