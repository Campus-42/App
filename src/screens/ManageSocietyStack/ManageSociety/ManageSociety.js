import React from 'react';
import {
  View,
  RefreshControl,
  SafeAreaView,
  Text,
  Alert,
  ScrollView,
} from 'react-native';
import {GlobalStyle} from '../../../assets/GlobalStyle';
import {styles} from './styles';
import {NotAdminView} from './components/NotAdminView/NotAdminView';
import {AdminView} from './components/AdminView/AdminView';
import {ManageFuncs} from './functions';
import TouchableShrink from '../../../assets/TouchableShrink/TouchableShrink';
import {Heading} from './components/AdminView/Heading';
import {updateReduxSocieties} from '../../../assets/redux/functions';

export class ManageSociety extends React.Component {
  constructor() {
    super();
    this.header = React.createRef();
    this.scroll = React.createRef();
    this.state = {
      refreshing: false,
      admin: true,
      societies: [],
      confirmations: [],
      eventsSoon: [],
    };
  }
  componentDidMount() {
    this.refresh(false);
  }
  render() {
    return (
      <SafeAreaView style={GlobalStyle.ViewStyle.backgroundView}>
        <GlobalStyle.Header
          title={'Manage Society'}
          navigation={this.props.navigation}
          destinationType={'goBack'}
          colors={this.props.store.app.campus.colors}
        />
        <ScrollView
          {...GlobalStyle.Props.scrollViewWithAnimatingHeaderTitle}
          onScroll={this.handleScroll}
          contentInset={{bottom: GlobalStyle.Measurements.height * 0.15}}
          style={styles.container}
          showsVerticalScrollIndicator={false}
          refreshControl={
            <RefreshControl
              onRefresh={this.refresh}
              refreshing={this.state.refreshing}
            />
          }>
          <Heading
            colors={this.props.store.app.campus.colors}
            admin={this.state.admin}
          />
          {this.state.admin ? (
            <AdminView
              store={this.props.store}
              societies={this.state.societies}
              confirmations={this.state.confirmations}
              navigation={this.props.navigation}
              refresh={this.refresh}
              refreshing={this.state.refreshing}
              removeEvent={this.removeEvent}
              eventsSoon={this.state.eventsSoon}
            />
          ) : (
            <NotAdminView user={this.props.store.user} />
          )}
          <TouchableShrink
            style={styles.createSocietyButton}
            gradientColor={this.props.store.app.campus.colors.main}
            showGradient
              showIcon
            onPress={() => this.props.navigation.navigate('Create Society')}>
            <Text style={GlobalStyle.TextStyle.buttonLarge}>
              Create Society
            </Text>
          </TouchableShrink>
        </ScrollView>
      </SafeAreaView>
    );
  }
  refresh = async (refreshing = true) => {
    this.setState({refreshing: refreshing});
    await this.getSocieties(true);
    await this.getConfirmations();
    this.setState({refreshing: false});
  };
  removeEvent = async (eventID = String) => {
    var {confirmations} = this.state;
    const confirmationEvent = confirmations.find(
      (event) => event.id == eventID,
    );
    // Remove confirmation from confirmations
    const index = confirmations.indexOf(confirmationEvent);
    if (index > -1) {
      confirmations = confirmations.filter((event) => event.id !== eventID);
    }
    // Update state
    this.setState({confirmations: confirmations});
  };
  getSocieties = async (init = false) => {
    init === false && this.setState({refreshingSocieties: true}); // Don't show refresh wheel on the initial fetch

    const societies = await ManageFuncs.getAdminSocieties(
      this.props.store.app.campus.key,
    );
    console.log('ADMIN SOCIETIES', societies);
    this.getEventsHappeningSoon(societies.societyIDs);

    this.setState({
      admin: societies.isAdmin,
      societies: societies.societies,
      refreshingSocieties: false,
    });
    updateReduxSocieties(societies.societies, this.props.store.app.societies);
  };
  getConfirmations = async () => {
    const confirmations = await ManageFuncs.getConfirmations(
      this.props.store.app.campus.key,
    );
    this.setState({confirmations: confirmations.data});
  };
  getEventsHappeningSoon = async (adminSocieties) => {
    ManageFuncs.getEventsHappeningSoon(
      this.props.store.app.campus.key,
      adminSocieties,
    )
      .then((events) => {
        this.setState({eventsSoon: events});
      })
      .catch((err) => {
        console.warn('Could not get events happening soon', err);
      });
  };
  handleScroll = ({nativeEvent}) =>
    GlobalStyle.UX.onScrollForAnimatingHeader(
      nativeEvent,
      this.header,
      this.scroll,
    );
}
