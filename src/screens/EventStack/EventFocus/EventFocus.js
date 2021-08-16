import React from 'react';
import {View, ScrollView} from 'react-native';
import {GlobalStyle} from '../../../assets/GlobalStyle/index';
import {FloatingButtons} from './components/FloatingButtons';
import {db, auth, functions} from '../../../assets/Firebase/Firebase';
import {EventView} from './components/EventView';
import {ModalTop} from '../../../assets/ModalTop';
import {ConfirmationPanel} from '../../../assets/ConfirmationPanel';
import {InviteView} from '../../../assets/InviteView';
import {EventFuncs} from './functions';
import {Store} from '../../../assets/redux/store';
import {getUsers, trySignInUser} from '../../../assets/Firebase/functions';
import {updateReduxEvents} from '../../../assets/redux/functions';
import {analytics} from '../../../assets/Analytics';
import {Button} from 'react-native';
import {Campus} from '../../../assets/Campus';

//TODO: When event is hidden??

export class EventFocus extends React.Component {
  constructor() {
    super();
    this._scroll = React.createRef();
    this._floatingButtons = React.createRef();

    this.state = {
      hasJoined: undefined,

      society_info: {link: {show: false}, pricing: {show: false}, name: ''},
      fetched_Society: false,
      confirmed: false,
      confirmationError: false,
      confirming: false,
      confirmationType: '',
      showInvite: false,
      event: {_loading: true},
      invitation: false,
      eventID: null,
      askConfirmation: false, // Ask user to confirm the joining action
      confirmedJoin: false, // If user has confirmed that they joined

      fetchEventError: false, // If error is encountered when fetching event

      // Confirmation panel
      loadingText: '',
      successText: '',
      errorText: '',
      subTitle: '',
    };
  }
  componentDidMount() {
    setTimeout(() => {
      const params = {id: '', ...this.props.route.params};
      const eventID = params.id;
      this.setState({eventID: eventID});
      this.fetchEvent(eventID);

      if (params !== undefined) {
        if (Object.keys(params).includes('invitation'))
          this.setState({invitation: params.invitation});
      }
    }, 1000);
  }
  componentDidUpdate(prevProps) {
    // Compare the present and past ids and if they are difference update the state with the new event
    const pastID = prevProps.store.event.id;
    const presentID = this.props.store.event.id;

    if (pastID !== presentID) {
      this._scroll.current.scrollTo({y: 0});
      this.setState({event: this.props.store.event}, () => this.fetchEvent());
    }
  }
  componentWillUnmount() {
    Store.dispatch({type: 'UPDATE_EVENT_FOCUS', payload: {_loading: true}}); // Set loading to true so that when user navigates here before the loading of event is done, they'll see a loading skeleton
  }
  render() {
    const event = {...this.props.store.event, ...this.state.event};

    return (
      <View style={{flex: 1}}>
        <View style={[GlobalStyle.ViewStyle.whiteBackground, {flex: 1}]}>
          <ModalTop
            onPress={() => this.props.navigation.goBack()}
            title={event.title}
            subTitle={!event._loading ? 'Event' : ''}
            bookmarks={this.props.store.user.bookmarks}
            bookmarkType={'event'}
            objId={event.id}
          />
          <ScrollView
            {...GlobalStyle.Props.focusBackgroundScrollView}
            style={[
              GlobalStyle.Props.focusBackgroundScrollView.style,
              {backgroundColor: GlobalStyle.Palettes.background.palette6},
            ]}
            ref={this._scroll}>
            <EventView
              openWeb={() => {}}
              openMap={() => {}}
              event={event}
              error={this.state.fetchEventError}
              state={this.state}
              colors={this.props.store.app.campus.colors}
              fetchedSociety={this.state.fetched_Society}
              societyInfo={this.state.society_info}
              user={this.props.store.user}
              campusKey={this.props.store.app.campus.key}
              showSocietyLoading={this.showSocietyLoading}
              showSocietyConfirmation={this.showSocietyConfirmation}
              navigation={this.props.navigation}
              bookmarks={this.props.store.user.bookmarks}
              openInviteView={this.openInviteView}
              hasJoined={this.state.hasJoined}
            />
            {this.state.hasJoined && this.state.init && (
              <GlobalStyle.UI.GreyBackgroundButton
                title={'Leave event'}
                onPress={this.updateParticipationStatus}
                red={true}
              />
            )}
          </ScrollView>
          {event.end_ms > Date.now() && (
            <GlobalStyle.UI.FloatingButton
              title={'Join event'}
              colors={this.props.store.app.campus.colors}
              show={!this.state.hasJoined && this.state.init}
              onPress={this.updateParticipationStatus}
            />
          )}
        </View>
        <ConfirmationPanel
          dontGoBack
          isModal
          askConfirmation={this.state.askConfirmation}
          onConfirmationPress={this.handleConfirmationPress}
          askConfirmationText={'Have you signed up?'}
          isActive={this.state.confirmed || this.state.confirming}
          error={this.state.confirmationError}
          loading={this.state.confirming}
          onClose={this.onConfirmationClose}
          navigation={this.props.navigation}
          colors={this.props.store.app.campus.colors}
          loadingText={this.state.loadingText}
          successText={this.state.successText}
          errorText={this.state.errorText}
          subTitle={this.state.subTitle}
          bodyTexts={this.state.bodyTexts}
          invitation={this.state.invitation}
          playConfetti={
            this.state.invitation &&
            this.state.confirmed &&
            !this.state.confirming &&
            !this.state.confirmationError &&
            this.state.confirmationType == 'joined'
          }
          navigationTitle={
            event.bubble_id &&
            event.participants.includes(auth.currentUser.uid) &&
            'Go to event bubble'
          }
          onNavigationPress={() =>
            this.props.navigation.navigate('Bubble Focus', {
              id: this.state.eventID,
            })
          }
        />
        {this.state.eventID !== null && (
          <InviteView
            isActive={this.state.showInvite}
            onClose={() => this.setState({showInvite: false})}
            campus={this.props.store.app.campus}
            type="event"
            senderType="user"
            obj={{...event, id: this.state.eventID}}
            user={this.props.store.user}
            participants={event.participants}
            campusPointSystem={this.props.store.app.campus_point_system}
          />
        )}
      </View>
    );
  }
  updateParticipationStatus = (showLoading = true) => {
    if (showLoading)
      this.showEventLoading(this.state.hasJoined ? 'left' : 'joined');

    // SU events with prices must be confirmed to have been
    // bought before they can confirm their acquisition of
    // the ticket
    const event = this.state.event;
    if (
      event.join_link !== undefined &&
      event.join_link.show &&
      !this.state.hasJoined &&
      !this.state.confirmedJoin
    ) {
      this.props.navigation.navigate('Web View', {url: event.join_link.url});
      setTimeout(() => this.updateAskConfirmation(true), 500);
    } else
      Campus.Funcs.event
        .updateParticipationStatus(
          this.props.store.app.campus.key,
          this.state.eventID,
          !this.state.hasJoined,
        )
        .then(({hasJoined}) => {
          this.showEventConfirmation(
            this.state.hasJoined ? 'left' : 'joined',
            false,
          );
          this.setState({hasJoined});
          return {hasJoined};
        })
        .then(({hasJoined}) => {
          if (this.state.invitation) {
            EventFuncs.claimInvitation(
              this.props.store.app.campus.key,
              this.state.invitation.users,
              this.state.invitation.points,
              this.state.invitation.id,
            ).then(() => {
              Store.dispatch({
                type: 'UPDATE_INVITATION_IDS',
                payload: this.props.store.app.invitationIDs.filter(
                  (elem) => elem != this.state.invitation.id,
                ),
              });
            });
          }
        })
        .catch((err) => {
          console.warn(err);
          this.showEventConfirmation(
            this.state.hasJoined ? 'left' : 'joined',
            true,
          );
        });
  };

  updateEvent = (event) => {
    this.setState({event: {...this.state.event, ...event}});
    updateReduxEvents([event], this.props.store.app.events);
  };

  fetchEvent = (eventID, fetchSociety = true) =>
    EventFuncs.fetchEvent(this.props.store.app.campus.key, eventID)
      .then(async (event) => {
        this.setState({
          hasJoined: event.participants.includes(auth.currentUser.uid),
          fetchEventError: false,
          event: {...event, _loading: false},
          confirmationType: event.participants.includes(auth.currentUser.uid)
            ? 'left'
            : 'joined',
        });
        fetchSociety && this.fetchSocietyInfo(event.society_id);

        getUsers(event.participants);
      })
      .catch((err) => {
        console.warn('Could not get event', err);
        this.setState({fetchEventError: true});
      })
      .finally(() => this.setState({init: true}));

  openInviteView = () => {
    !this.state.event._loading && this.fetchEvent(this.state.event.id, false);
    this.setState({showInvite: true});
  };
  updateAskConfirmation = (status = false) =>
    this.setState({
      askConfirmation: status,
      confirmedJoin: false,
      subTitle: 'You need to confirm your attendance on the SU website',
    });
  handleConfirmationPress = (status) => {
    // this.setState({askConfirmation: false, askConfirmationStatus: status});
    if (status == true) {
      this.setState({confirmedJoin: true, askConfirmation: false}, () => {
        this.updateParticipationStatus(false);
      });
    } else this.onConfirmationClose();
  };
  showSocietyLoading = () =>
    this.setState({
      confirming: true,
      confirmed: false,
      confirmationError: false,
      loadingText: 'Joining society',
      successText: 'You have joined the society',
      error: 'Something went wrong joining',
      bodyTexts: [
        `Society: ${this.state.society_info.name}`,
        `Members: ${this.state.society_info.members.length} members`,
      ],
    });

  showSocietyConfirmation = (error) =>
    this.setState({
      confirmed: true,
      confirming: false,
      confirmationError: error,
    });

  showEventLoading = (type = undefined) => {
    // const event = this.props.store.event;
    this.setState({
      confirming: true,
      confirmed: false,
      confirmationError: false,
      loadingText: 'Updating Event',
      subTitle: '',
      successText:
        type == 'joined' ? 'You have joined' : 'You have left the event',
      errorText:
        type == 'joined'
          ? 'Something went wrong joining'
          : 'Something went wrong leaving',
      subTitle:
        type == 'joined'
          ? 'You will find your ticket on the Home screen 30 min before the event starts'
          : 'You can find other great events by searching on the Home screen',
    });
  };
  showEventConfirmation = (type = 'joined' || 'left', error = Boolean) => {
    setTimeout(
      () =>
        this.setState({
          confirmationType: type,
          confirming: false,
          confirmed: true,
          confirmationError: error,
        }),
      500,
    );
  };

  onConfirmationClose = () => {
    this.setState({
      confirmed: false,
      confirming: false,
      confirmedJoin: false,
      successText:
        this.state.confirmationType == 'joined'
          ? 'You have joined'
          : 'You have left the event',
      errorText:
        this.state.confirmationType == 'joined'
          ? 'Something went wrong joining'
          : 'Something went wrong leaving',
      subTitle:
        this.state.confirmationType == 'joined'
          ? 'You will find your ticket on the Home screen 30 min before the event starts'
          : 'You can find other great events by searching on the Home screen',
      confirmationError: false,
    });
  };

  fetchSocietyInfo = (society_id) => {
    /* Fetch the society for this event
     * The function will also update the state to let the component know that it has fetched the society info
     */
    db.collection('campuses')
      .doc(this.props.store.app.campus.key)
      .collection('societies')
      .doc(society_id)
      .get()
      .then((doc) =>
        this.setState({
          society_info: {...doc.data(), id: doc.id},
          fetched_Society: Object.keys(doc.data()).length > 5,
        }),
      )
      .then(() => console.log('Fetched society: ' + society_id))
      .catch((err) => {
        // console.warn('Could not get Society info for event focus', err);
        this.setState({fetched_Society: false});
      });
  };
}
