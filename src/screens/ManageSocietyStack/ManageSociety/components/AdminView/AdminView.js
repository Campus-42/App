import React from 'react';
import {View, Text, ScrollView, RefreshControl} from 'react-native';
import {SocietyCarousel} from '../../../../../assets/SocietyCarousel/SocietyCarousel';
import {styles} from '../../styles';
import {Heading} from './Heading';
import {ConfirmEvent} from './components/ConfirmEvent';
import {ConfirmEventCarousel} from './components/ConfirmEventCarousel';
import {EventsSoonCarousel} from './components/EventsSoonCarousel';
import {getTagColors} from '../../../../../assets/Airtable/functions';
import {Store} from '../../../../../assets/redux/store';
import {parseSocietyData} from '../../../../../assets/Firebase/functions';

export class AdminView extends React.Component {
  constructor() {
    super();
    this.state = {tagColors: []};
  }
  componentDidMount() {
    getTagColors().then((colors) => this.setState({tagColors: colors}));
  }
  render() {
    return (
      <View>
        <EventsSoonCarousel
          data={this.props.eventsSoon}
          colors={this.props.store.app.campus.colors}
          navigate={this.props.navigation.navigate}
          tagColors={this.state.tagColors}
          bookmarks={this.props.store.user.bookmarks}
        />
        <ConfirmEventCarousel
          confirmations={this.props.confirmations}
          removeEvent={this.props.removeEvent}
          campusKey={this.props.store.app.campus.key}
        />
        <SocietyCarousel
          data={this.props.societies}
          store={this.props.store}
          navigation={this.props.navigation}
          onPress={this.openSociety}
          reduxSocieties={this.props.store.app.societies}
          bookmarks={this.props.store.user.bookmarks}
        />
      </View>
    );
  }
  openSociety = async (society) => {
    console.log('SOCIETY PRESS');
    Store.dispatch({
      type: 'UPDATE_SOCIETY_FOCUS_MANAGE',
      payload: await parseSocietyData(society, society.id),
    });
    this.props.navigation.navigate('Manage Society Focus');
  };
}
