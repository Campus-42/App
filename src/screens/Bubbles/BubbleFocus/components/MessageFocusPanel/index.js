import React from 'react';
import {ScrollView} from 'react-native';
import {StyleSheet} from 'react-native';
import {TouchableOpacity} from 'react-native';
import {Text, View} from 'react-native';
import {auth, functions} from '../../../../../assets/Firebase/Firebase';
import {GlobalStyle} from '../../../../../assets/GlobalStyle';
import {UserComponent} from '../../../../../assets/InviteView/UserComponent';
import {SwipeUpViewLarge} from '../../../../../assets/SwipeUpView';
import {Message} from '../Message';
import * as Animatable from 'react-native-animatable';
import {
  ReportReasonPicker,
  ReportReasonPickerButton,
} from './ReportReasonPicker';
import {ReportTextInput} from './ReportTextInput';
import {KeyboardAvoidingScrollView} from 'react-native-keyboard-avoiding-scroll-view';
import {Keyboard} from 'react-native';
import TouchableShrink from '../../../../../assets/TouchableShrink/TouchableShrink';
import {Alert} from 'react-native';
import {analytics} from '../../../../../assets/Analytics';
import {Switch} from 'react-native';
import {SendAnonymouslySwitch} from './SendAnonymouslySwitch';
import {MessageFuncs} from '../../../Bubbles/functions';

export class MessageFocusPanel extends React.Component {
  constructor() {
    super();
    this.state = {
      prevMessageId: false, // When a new message is passed, set the new id here
      report: false, // The report variable shows if the user is at the report view
      init: false, // Reset ression when closing
      showReportPicker: false, // Show the report picker
      selectedReason: false, // The selected reason in the reason picker
      reportComment: '', // If the user wants to further comment the report
      sendingReport: false, // To show the loading icon at the send button
      triedToSubmitWithoutReason: false, // If the user tries to submit without a reason
      sendAnonymously: false, // if the user wants to send anonymously
    };
  }

  componentDidUpdate(prevProps) {
    const messageId = (this.props.message || {}).id;
    if (messageId !== this.state.prevMessageId && messageId) {
      /**
       * If there is a new message passed then reset all of the
       * entered information and show the first view
       */

      this.setState({
        prevMessageId: messageId,
        init: false,
        report: false,
        showReportPicker: false,
        selectedReason: false,
        reportComment: '',
        sendingReport: false,
        triedToSubmitWithoutReason: false,
      });
    }
  }

  render() {
    var message = this.props.message || {};
    var bubble = this.props.bubble || {};
    var messageUser = bubble.member_names[message.creator];

    var sentFromUser = message.creator === (auth.currentUser || {}).uid;

    var usersWhoHasRead = Object.entries(bubble.member_names)
      .filter(([_, val]) => {
        return (
          ((val.offline_timestamp_ms || 0) >= (message.timestamp_ms || 0) ||
            (val.online_timestamp_ms || 0) >= (message.timestamp_ms || 0)) &&
          val.uid !== message.creator
        );
      })
      .map(([key]) => {
        return key;
      });

    return (
      <React.Fragment>
        <SwipeUpViewLarge
          isActive={this.props.isActive}
          onClose={this.props.onClose}>
          <KeyboardAvoidingScrollView
            keyboardShouldPersistTaps={'handled'}
            scrollEventThrottle={10}
            style={styles.scroll}
            contentContainerStyle={styles.scrollContainer}
            contentInset={{
              bottom: GlobalStyle.Measurements.height * 0.25,
              top: 10,
            }}>
            <View style={styles.messageContainer}>
              {message && bubble && (
                <Message
                  item={message}
                  containerStyle={{justifyContent: 'center'}}
                  members={bubble.member_names}
                  user={messageUser}
                  showMessageDate={false}
                  showAvatar
                  allowLiking={false}
                  store={this.props.store}
                  navigate={this.props.navigate}
                  reduxAppStore={this.props.store.app}
                  tagColors={this.props.tagColors}
                />
              )}
              {messageUser && (
                <Text style={styles.sentText}>
                  Sent by{' '}
                  {sentFromUser
                    ? 'you'
                    : `${messageUser.first_name} ${messageUser.last_name}`}
                </Text>
              )}
              <Text style={styles.sentText}>
                At {MessageFuncs.getPreviewDate(message.timestamp_ms)}
              </Text>
            </View>
            {!this.state.report ? (
              <Animatable.View
                useNativeDriver={true}
                animation={!this.state.init && 'fadeInLeft'}
                duration={650}>
                {(message.likes || []).length > 0 && this.props.bubble && (
                  <>
                    <Text style={styles.heading}>Liked</Text>
                    <View style={{alignItems: 'center'}}>
                      {message.likes.map(this.renderUser)}
                    </View>
                  </>
                )}
                {usersWhoHasRead.length > 0 && (
                  <>
                    <Text style={styles.heading}>Read</Text>
                    <View style={{alignItems: 'center'}}>
                      {usersWhoHasRead.map(this.renderUser)}
                    </View>
                  </>
                )}

                {!sentFromUser && (
                  <TouchableOpacity
                    style={{alignSelf: 'center'}}
                    onPress={() => this.setState({report: true})}>
                    <Text style={styles.reportText}>Report message</Text>
                  </TouchableOpacity>
                )}
              </Animatable.View>
            ) : (
              <Animatable.View
                useNativeDriver={true}
                style={{alignItems: 'center'}}
                animation={'fadeInRight'}
                duration={650}>
                <View style={{height: styles.heading.marginTop}} />
                <View
                  style={[
                    styles.row,
                    {width: GlobalStyle.Measurements.width * 0.9},
                  ]}>
                  <Text style={[styles.heading, {marginTop: 0}]}>
                    Report message
                  </Text>
                  <TouchableOpacity
                    onPress={() => this.setState({report: false})}>
                    <Text style={styles.cancelText}>Cancel</Text>
                  </TouchableOpacity>
                </View>
                <ReportReasonPickerButton
                  showRed={
                    this.state.selectedReason === false &&
                    this.state.triedToSubmitWithoutReason
                  }
                  onPress={() => {
                    Keyboard.dismiss();
                    this.setState({showReportPicker: true});
                  }}
                  selected={this.state.selectedReason}
                  onValueChange={(value, index) =>
                    this.setState({selectedReason: {index, value}})
                  }
                />
                <ReportTextInput
                  defaultValue={this.state.reportComment}
                  onChangeText={(text) => this.setState({reportComment: text})}
                  showRed={
                    this.state.selectedOtherReasonWithoutComment &&
                    !this.state.reportComment.replace(/\s/g, '').length
                  }
                />
                <SendAnonymouslySwitch
                  value={this.state.sendAnonymously}
                  onValueChange={(value) =>
                    this.setState({sendAnonymously: value})
                  }
                />
                <Text style={styles.reportDescription}>
                  {`By reporting this message you accept that your Students' Union will receive a copy of the most recent messages in order to justly assess the message and situation.`}
                </Text>
                <TouchableShrink
                  onPress={this.sendReport}
                  icon={'paper-plane'}
                  showIcon
                  disabled={this.state.sendingReport}
                  showGradient
                  gradientColor={this.props.campus.colors.main}
                  loading={this.state.sendingReport}
                  style={[
                    styles.sendReportButton,
                    this.state.selectedReason === false && {
                      backgroundColor: GlobalStyle.Palettes.background.palette4,
                    },
                  ]}>
                  <Text style={GlobalStyle.TextStyle.buttonLarge}>
                    Report user
                  </Text>
                </TouchableShrink>
              </Animatable.View>
            )}
          </KeyboardAvoidingScrollView>
        </SwipeUpViewLarge>
        <ReportReasonPicker
          onValueChange={(value, index) =>
            this.setState({selectedReason: {index, value}})
          }
          isActive={this.state.showReportPicker}
          onClose={() => this.setState({showReportPicker: false})}
        />
      </React.Fragment>
    );
  }

  sendReport = () => {
    var message = this.props.message || {};
    var bubble = this.props.bubble || {};
    const uid = (auth.currentUser || {}).uid;

    if (this.state.selectedReason === false)
      this.setState({triedToSubmitWithoutReason: true});
    else if (
      this.state.selectedReason.value == 'Other reason, please specify...' &&
      !this.state.reportComment.replace(/\s/g, '').length
    )
      this.setState({selectedOtherReasonWithoutComment: true});
    else if (!this.props.message || !this.props.bubble) {
      analytics.error(
        'Either bubble or message was not defined when sending report',
        'MessageFocusPanel',
        'sendReport1',
      );
      Alert.alert(
        'Unexpected error',
        "Something unexpected happend on our side, we're sorry about this",
      );
    } else if (!uid && !this.state.sendAnonymously) {
      analytics.error(
        'No auth current uid could be found when sending report',
        'MessageFocusPanel',
        'sendReport3',
      );

      Alert.alert(
        'Report error',
        'We could not send the report, please check your internet connection and try again',
      );
    } else {
      this.setState({sendingReport: true});
      const path = `/campuses/${this.props.campus.key}/bubbles/${bubble.id}/messages/${message.id}`;

      functions
        .httpsCallable('reportUserBehaviour')({
          reason: this.state.selectedReason.value,
          comment: this.state.reportComment,
          campusKey: this.props.campus.key,
          reported_by: this.state.sendAnonymously ? false : uid,
          reported_uid: message.creator,
          path_to_doc: path,
          report_type: 'message',

          // Type specific fields
          // In order for easier copying of
          // bubble messages
          messageTimestampMs: message.timestamp_ms,
          bubbleId: bubble.id,
        })
        .then(() => {
          Alert.alert(
            'Successfully reported',
            "Thank you for reporting unwanted behaviour on our platform. Your Students' Union will assess the behaviour and take action if suitable",
          );
          // wipe report info to not make user report twice
          this.setState({
            report: false,
            selectedReason: false,
            reportComment: '',
            sendAnonymously: false,
          });
        })
        .catch((err) => {
          analytics.error(err, 'MessageFocusPanel', 'sendReport2');
          Alert.alert(
            'Report error',
            'We could not send the report, please check your internet connection and try again',
          );
        })
        .finally(() =>
          this.setState({
            sendingReport: false,
            selectedOtherReasonWithoutComment: false,
            triedToSubmitWithoutReason: false,
          }),
        );
    }
  };

  renderUser = (item) => {
    let user = this.props.bubble.member_names[item];
    return (
      <UserComponent
        user={user}
        colors={this.props.colors}
        animation={false}
        dontFadeDisabled
        disabled
        showIcon={false}
        style={{opacity: 1, elevation: 2}}
      />
    );
  };
}

const styles = StyleSheet.create({
  scroll: {
    width: GlobalStyle.Measurements.width,
  },
  scrollContainer: {
    alignItems: 'center',
    paddingHorizontal: GlobalStyle.Measurements.width * 0.05,
  },

  messageContainer: {
    flexDirection: 'column',
    alignItems: 'center',
    alignSelf: 'center',
    justifyContent: 'center',
    marginTop: 5,
    marginBottom: GlobalStyle.Measurements.marginHalf,
  },
  sentText: {
    ...GlobalStyle.TextStyle.bodySmall,
    color: GlobalStyle.Palettes.text.palette4,
    alignSelf: 'flex-start',
    marginLeft: GlobalStyle.Measurements.unit * 2.5,
  },

  heading: {
    ...GlobalStyle.TextStyle.headingSmall,
    marginTop: GlobalStyle.Measurements.marginHalf,
  },

  reportText: {
    ...GlobalStyle.TextStyle.bodyRegular,
    color: 'red',
    alignSelf: 'center',
    marginVertical: GlobalStyle.Measurements.margin * 2,
  },
  cancelText: {
    ...GlobalStyle.TextStyle.bodyRegular,
    color: GlobalStyle.ColorStyle.blueButtonText,
  },
  reportDescription: {
    ...GlobalStyle.TextStyle.bodySmall,
    alignSelf: 'center',
    textAlign: 'center',
    width: GlobalStyle.Measurements.width * 0.9,
    marginVertical: GlobalStyle.Measurements.marginHalf,
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  sendReportButton: {
    ...GlobalStyle.ButtonStyle.Large,
    alignSelf: 'center',
    marginVertical: GlobalStyle.Measurements.margin,
    justifyContent: 'space-between',

    backgroundColor: GlobalStyle.ColorStyle.getCampusColors().main,
  },
});
