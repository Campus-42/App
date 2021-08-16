import React, {Component} from 'react';
import {View, Text, SafeAreaView, ScrollView} from 'react-native';
import {ModalTop} from '../../../assets/ModalTop';
import {GlobalStyle} from '../../../assets/GlobalStyle';
import {styles} from './style';
import {LiveEventFuncs} from './functions';
import {db} from '../../../assets/Firebase/Firebase';
import {ParticipantRow} from './ParticipantRow';
import TouchableShrink from '../../../assets/TouchableShrink/TouchableShrink';
import {Store} from '../../../assets/redux/store';
import {analytics} from '../../../assets/Analytics';

export class LiveEvent extends Component {
  constructor() {
    super();
    this.header = React.createRef();
    this.scroll = React.createRef();
    this.state = {
      claimedIDs: [],
      signedUp: [],
      time: {mins: 0, hrs: 0},
    };
  }
  componentDidMount() {
    

    this.startTimeLeftInterval();
    this.getParticipants();
  }
  componentWillUnmount() {
    clearInterval(this.timeLeftInterval);
  }
  render() {
    const event = this.props.store.editEventFocus;
    const started = event.start_ms < Date.now();
    const ended = event.end_ms < Date.now();

    return (
      <View style={GlobalStyle.ViewStyle.backgroundView}>
        <GlobalStyle.Header
          ref={this.header}
          destinationType={'goBack'}
          navigation={this.props.navigation}
        />
        <ScrollView
          ref={this.scroll}
          {...GlobalStyle.Props.scrollViewWithAnimatingHeaderTitle}
          style={styles.scroll}
          onScroll={this.handleScroll}
          scrollEventThrottle={15}>
          <Text style={styles.title}>{event.title}</Text>
          <Text style={styles.subTitle}>
            This page automatically updates if any tickets are claimed
          </Text>
          <View style={styles.statRow}>
            <View style={styles.statComponent}>
              <Text style={styles.statTitle}>Participants</Text>
              <View style={{flexDirection: 'row'}}>
                <Text style={styles.statText}>
                  {this.state.claimedIDs.length}{' '}
                </Text>
                <Text
                  style={[
                    styles.statText,
                    {color: GlobalStyle.Palettes.text.palette2},
                  ]}>
                  / {this.state.signedUp.length}
                </Text>
              </View>
            </View>
            <View style={styles.statComponent}>
              <Text style={styles.statTitle}>
                {!started ? 'Starts in' : !ended ? 'Ends in' : 'Ended'}
              </Text>
              <Text style={styles.statText}>
                {!ended
                  ? `${this.state.time.hrs}h : ${this.state.time.mins}min`
                  : '0h : 0min'}
              </Text>
            </View>
          </View>

          <View style={styles.participantsComponent}>
            {this.state.signedUp.length > 0 ? (
              this.state.signedUp
                .sort((elem) => elem.first_name)
                .map((participant, index) => (
                  <ParticipantRow
                    key={`participant_${participant.email}`}
                    participant={participant}
                    last={index == this.state.signedUp.length - 1}
                    claimed={this.state.claimedIDs.includes(participant.id)}
                  />
                ))
            ) : (
              <Text style={styles.participantText}>
                There are no participants 😩
              </Text>
            )}
          </View>
          <TouchableShrink
            onPress={() => {
              this.props.navigation.navigate('Event Focus', {
                id: event.id,
              });
            }}
            style={[GlobalStyle.ButtonStyle.Large, {alignSelf: 'center'}]}
            gradientColor={this.props.store.app.campus.colors.main}
            showGradient>
            <Text style={GlobalStyle.TextStyle.buttonLarge}>Show Event</Text>
          </TouchableShrink>
        </ScrollView>
      </View>
    );
  }
  startTimeLeftInterval = () => {
    this.getTime();
    this.timeLeftInterval = setInterval(() => this.getTime(), 5000);
  };
  getTime = () => {
    const event = this.props.store.editEventFocus;
    const started = event.start_ms < Date.now();
    const ended = event.end_ms < Date.now();

    const ms = !started
      ? event.start_ms - Date.now()
      : !ended
      ? event.end_ms - Date.now()
      : 0;
    var mins = Math.floor(ms / 60000);
    const hrs = Math.floor(mins / 60);
    mins = mins % 60;

    this.setState({time: {mins: mins, hrs: hrs}});
  };
  getParticipants = () => {
    this.unsubscribe = db
      .collection('campuses')
      .doc(this.props.store.app.campus.key)
      .collection('events')
      .doc(this.props.store.editEventFocus.id)
      .collection('participants')
      .orderBy('first_name')
      .onSnapshot(
        async (querySnapshot) => {
          const signedUp = [];
          const claimedIDs = [];

          querySnapshot.forEach((doc) => {
            signedUp.push({...doc.data(), id: doc.id});
            if (doc.data().claimed) claimedIDs.push(doc.id);
          });
          this.setState({
            signedUp: signedUp,
            claimedIDs: claimedIDs,
          });
        },
        (err) => {
          this.unsubscribe();
          analytics.error(err, 'LiveEvent', 'getParticipants()');
        },
      );
  };
  handleScroll = ({nativeEvent}) =>
    GlobalStyle.UX.onScrollForAnimatingHeader(
      nativeEvent,
      this.header,
      this.scroll,
    );
}
