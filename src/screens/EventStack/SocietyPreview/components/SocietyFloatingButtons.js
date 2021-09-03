import React from 'react';
import {Text, Dimensions, Platform} from 'react-native';
import {styles} from '../../EventFocus/style';
import * as Animatable from 'react-native-animatable';
import {db, auth, functions} from '../../../../assets/Firebase/Firebase';
import TouchableShrink from '../../../../assets/TouchableShrink/TouchableShrink';
import {GlobalStyle} from '../../../../assets/GlobalStyle';
import {SocietyPreviewFuncs} from '../functions';
import {joinSociety} from '../../../../assets/Firebase/functions';
import PropTypes from 'prop-types';
import {analytics} from '../../../../assets/Analytics';

const AnimatableTouchableShrink = Animatable.createAnimatableComponent(
  TouchableShrink,
);

export class SocietyFloatingButtons extends React.Component {
  constructor() {
    super();
    this._invite = React.createRef();
    this._joinOrLeave = React.createRef();
    this.state = {
      isMember: null,
      confirmingLeave: false,
    };
  }
  componentDidMount() {
    this.setState({
      isMember: this.props.society.members.includes(auth.currentUser.uid),
    });
  }
  componentDidUpdate(prevProps) {
    if (
      prevProps.society.members.includes(auth.currentUser.uid) !==
      this.props.society.members.includes(auth.currentUser.uid)
    )
      this.setState({
        isMember: this.props.society.members.includes(auth.currentUser.uid),
      });
  }
  render() {
    const extraHeight =
      this.props.isModal && Platform.OS == 'ios'
        ? GlobalStyle.Measurements.safeheight * 0.06
        : 0;

    return this.props.society.visible ? (
      <Animatable.View
        style={[
          styles.floatingButtonsContainer,
          {
            marginTop:
              this.props.isModal && Platform.OS == 'ios'
                ? styles.floatingButtonsContainer.marginTop - extraHeight
                : styles.floatingButtonsContainer.marginTop,
          },
          this.props.style,
        ]}
        animation={'fadeInUp'}
        duration={350}>
        <AnimatableTouchableShrink
          ref={this._invite}
          showGradient
          disabled={this.props.disabled}
          showShadow
          showIcon={this.state.confirmingLeave === false}
          iconMarginLeft={
            this.state.confirmingLeave ? 0 : GlobalStyle.Measurements.marginHalf
          }
          onPress={this.handleInvitePress}
          icon={this.state.confirmingLeave ? 'times' : 'user-plus'}
          iconSize={Dimensions.get('screen').fontScale * 13}
          shadowColor={this.props.colors.main}
          gradientColor={this.props.colors.main}
          style={[
            styles.floatingButton,
            styles.inviteButton,
            this.state.confirmingLeave && {
              justifyContent: 'center',
              alignItems: 'center',
              paddingHorizontal: 0,
            },
          ]}>
          <Text style={styles.floatingButtonText} numberOfLines={1}>
            {this.state.confirmingLeave ? 'Cancel' : 'Invite'}
          </Text>
        </AnimatableTouchableShrink>

        <AnimatableTouchableShrink
          ref={this._joinOrLeave}
          showGradient
          disabled={this.props.disabled}
          showShadow
          showIcon={this.state.confirmingLeave === false}
          onPress={this.handleJoinOrLeavePress}
          icon={this.state.isMember ? 'times' : 'plus'}
          gradientFactor={this.state.confirmingLeave ? 100 : 80}
          shadowColor={this.props.colors.main}
          gradientColor={this.state.isMember ? '#ff0800' : '#20d00b'}
          style={[styles.floatingButton, styles.joinButton]}>
          <Text style={styles.floatingButtonText} numberOfLines={1}>
            {this.state.isMember
              ? this.state.confirmingLeave
                ? 'Sure you want to leave?'
                : 'Leave'
              : 'Join'}
          </Text>
        </AnimatableTouchableShrink>
      </Animatable.View>
    ) : null;
  }
  handleInvitePress = () => {
    if (this.state.confirmingLeave) {
      this.setState({
        confirmingLeave: false,
      });
      // Animate the two buttons
      this._invite.current.transitionTo(
        {
          width: styles.inviteButton.width,
        },
        ANIM_DURATION * 0.8,
      );
      this._joinOrLeave.current.transitionTo(
        {width: styles.joinButton.width},
        ANIM_DURATION,
      );
    } else {
      this.props.openInviteView();
    }
  };
  handleJoinOrLeavePress = async () => {
    // Animate the leave button to be large. Prompting the user for a confirmation
    if (this.state.isMember && this.state.confirmingLeave === false) {
      this._invite.current.transitionTo(
        {width: styles.inviteButton.width - TRANSFER_SIZE},
        ANIM_DURATION * 0.8,
      );
      this._joinOrLeave.current.transitionTo(
        {width: styles.joinButton.width + TRANSFER_SIZE},
        ANIM_DURATION,
      );

      this.setState({confirmingLeave: true});

      // When user confirms, the members document will be updated
    } else if (this.state.isMember && this.state.confirmingLeave) {
      this.props.showConfirmationLoading();
      this.props.updateTexts(
        'You have left the society',
        'Leaving society',
        'Something went wrong leaving',
        'Find other great societies on campus by searching',
      );
      if (this.props.society.exec_members.includes(auth.currentUser.uid))
        this.props.showConfirmation(
          true,
          'You cannot leave a society if you are an executive',
        );
      else
        SocietyPreviewFuncs.leaveSociety(
          this.props.campusKey,
          this.props.society.id,
        )
          .then(() => {
            analytics.leftSociety(this.props.society.id, this.props.campusKey);

            this.props.showConfirmation();
            // Set new state
            this.setState({
              confirmingLeave: false,
              isMember: false,
            });
            // Animate the two buttons
            this._invite.current.transitionTo(
              {
                width: styles.inviteButton.width,
              },
              ANIM_DURATION * 0.8,
            );
            this._joinOrLeave.current.transitionTo(
              {width: styles.joinButton.width},
              ANIM_DURATION,
            );
          })
          .catch((err) => {
            console.warn('Could not leave society', err);
            this.props.showConfirmation(true);
          });
    } else if (!this.state.isMember) {
      analytics.joinedSociety(this.props.society.id, this.props.campusKey);
      this.props.showConfirmationLoading();
      this.props.updateTexts(
        'You have joined the society',
        'Joining society',
        'Something went wrong joining',
        'See all the events and more on the society page',
      );

      joinSociety(this.props.user, this.props.campusKey, this.props.society.id)
        .then(() => {
          this.props.showConfirmation();
          this.setState({
            confirmingLeave: false,
            isMember: true,
          });
        })
        .catch((err) => {
          console.warn('Could not join society', err);
          this.props.showConfirmation(true);
        });
    }
  };
}
const TRANSFER_SIZE = GlobalStyle.Measurements.width * 0.15;
const ANIM_DURATION = 250;
const COMBINED_WIDTH = styles.joinButton.width + styles.inviteButton.width;
const MIDDLE_MARGIN = (GlobalStyle.Measurements.width - COMBINED_WIDTH) / 3;
const MAX_WIDTH = COMBINED_WIDTH + MIDDLE_MARGIN;

SocietyFloatingButtons.defaultProps = {
  society: {members: []},
  style: {},
  isModal: true,
};

SocietyFloatingButtons.propTypes = {
  society: PropTypes.object,
  style: PropTypes.object,
  isModal: PropTypes.bool,
};
