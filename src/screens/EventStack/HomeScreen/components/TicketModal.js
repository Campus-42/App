import React from 'react';
import {
  Text,
  PanResponder,
  Animated,
  TouchableOpacity,
  TouchableWithoutFeedback,
} from 'react-native';
import PropTypes from 'prop-types';
import {styles} from '../style';

import {View} from 'react-native';
import {GlobalStyle} from '../../../../assets/GlobalStyle';
import ScreenBrightness from 'react-native-screen-brightness';
import {BlurView} from '@react-native-community/blur';

import {TicketFuncs} from './TicketCarousel/functions';
import {TicketModalQRCode} from './TicketModalQRCode';

import CheckedImage from '../../../../assets/Images/checked.png';
import CancelImage from '../../../../assets/Images/cancel.png';
import {db, auth} from '../../../../assets/Firebase/Firebase';
import TouchableShrink from '../../../../assets/TouchableShrink/TouchableShrink';
import FontAwesome5 from 'react-native-vector-icons/FontAwesome5';
import {Campus} from '../../../../assets/Campus';
import {analytics} from '../../../../assets/Analytics';
import FontAwesome5Icon from 'react-native-vector-icons/FontAwesome5';

const AnimatedBlurView = Animated.createAnimatedComponent(BlurView);

export class TicketModal extends React.Component {
  constructor() {
    super();
    this.unsubscribe;

    this.state = {
      pan: new Animated.Value(GlobalStyle.Measurements.height),
      backgroundOpacity: new Animated.Value(0),
      oldScreenBrightness: 0.5,
      code: 'nothing',
      error: false,
      claimed: false,
      firebaseDoc: '',
    };

    this._panResponder = PanResponder.create({
      onMoveShouldSetPanResponder: (evt, gestureState) => {
        const {dx, dy} = gestureState;
        return dx > 2 || dx < -2 || dy > 2 || dy < -2;
      },
      onMoveShouldSetPanResponderCapture: () => true,
      onPanResponderMove: (evt, gesture) => {
        if (
          this.state.pan._value >
            styles.modalTicketContainer.marginVertical - 10 ||
          gesture.dy > 0
        )
          this.state.pan.setValue(
            styles.modalTicketContainer.marginVertical + gesture.dy,
          );
      },
      onPanResponderRelease: (evt, gesture) => {
        this.state.pan.flattenOffset();
        if (
          this.state.pan._value >
          styles.modalTicketContainer.marginVertical + 200
        )
          this.animateTo('close');
        else this.animateTo('restore');
      },
    });
  }
  componentDidUpdate(prevProps) {
    if (this.props.visible && prevProps.visible === false)
      this.animateTo('restore');
  }
  componentDidMount() {
    this.animateTo('restore');
    // Get reference to the member doc in event to get if claimed or not

    this.unsubscribe = db
      .collection('campuses')
      .doc(this.props.campusKey)
      .collection('events')
      .doc(this.props.event.id)
      .collection('participants')
      .doc(auth.currentUser !== null ? auth.currentUser.uid : 'empty')
      .onSnapshot(
        (doc) => {
          if (doc.data() != undefined) {
            const didClaim = !this.state.claimed && doc.data().claimed;
            if (didClaim)
              Campus.Funcs.points.triggerPointEvent(
                'confirmedEventAttendance',
                this.props.campusKey,
                this.props.showPopup,
              );

            this.setState({claimed: doc.data().claimed});
          }
        },
        (err) => {
          analytics.error(err, 'TicketModal', 'componentDidMount()');
          this.componentWillUnmount();
        },
      );

    // Generate bar code
    this.setState({
      code: TicketFuncs.generateCode((this.props.event || {}).id),
      error: false,
    });

    // Get what screen brightness user has to set it once we exit ticket modal
    ScreenBrightness.getBrightness().then((brightness) => {
      this.setState({oldScreenBrightness: brightness});
    });
  }
  componentWillUnmount() {
    // Set brightness to what user had before
    ScreenBrightness.setBrightness(this.state.oldScreenBrightness);
    this.unsubscribe();
  }
  render() {
    return (
      this.props.visible && (
        <React.Fragment>
          <TouchableWithoutFeedback onPress={() => this.animateTo('close')}>
            <AnimatedBlurView
              blurType={'extraDark'}
              style={[styles.modal, {opacity: this.state.backgroundOpacity}]}
            />
          </TouchableWithoutFeedback>
          <Animated.View
            onLayout={this.handleViewOnLayout}
            style={[styles.modalTicketContainer, {marginTop: this.state.pan}]}>
            <View
              style={{
                alignSelf: 'center',
                alignItems: 'center',
                justifyContent: 'space-around',
              }}
              {...this._panResponder.panHandlers}>
              <View>
                <Text style={styles.ticketTitle}>{this.props.event.title}</Text>
                <Text style={styles.ticketSubTitle}>
                  {this.props.event.date.start.toUTCString().substring(0, 11)}{' '}
                  {this.props.event.date.start.toUTCString().substring(17, 22)}
                  {' - '}
                  {this.props.event.date.end
                    .toUTCString()
                    .substring(0, 11)}{' '}
                  {this.props.event.date.end.toUTCString().substring(17, 22)}
                </Text>
                <Text
                  style={[
                    styles.ticketSubTitle,
                    {
                      marginBottom: GlobalStyle.Measurements.marginHalf,
                    },
                  ]}>
                  {this.props.event.society_name}
                </Text>
              </View>
              <TicketModalQRCode
                code={this.state.code}
                error={this.state.error}
              />
            </View>
            <View style={styles.ticketClaimContainer}>
              <Text style={styles.ticketClaimText}>Claimed:</Text>
              <GlobalStyle.UI.ClaimCheck claimed={this.state.claimed} />
            </View>

            <TouchableShrink
              showGradient
              gradientColor={this.props.colors.main}
              onPress={() => this.openEvent()}
              style={GlobalStyle.ButtonStyle.Large}>
              <Text style={GlobalStyle.TextStyle.buttonLarge}>Show Event</Text>
            </TouchableShrink>
          </Animated.View>
        </React.Fragment>
      )
    );
  }
  handleViewOnLayout = async ({nativeEvent}) => {
    const yPos = nativeEvent.layout.y;
    const marginTopFraction =
      styles.modalTicketContainer.marginVertical /
      GlobalStyle.Measurements.height;
    const h =
      GlobalStyle.Measurements.height -
      styles.modalTicketContainer.marginVertical;
    const diff = 1 - this.state.oldScreenBrightness;
    const opac = 1.05 - yPos / h + marginTopFraction; // 0.05 is added to justify for opacity only reaching 0.95 when animating
    const newOpac = diff * opac + this.state.oldScreenBrightness;

    ScreenBrightness.setBrightness(newOpac);
    this.state.backgroundOpacity.setValue(opac);
  };
  animateTo = async (destination = 'restore' || 'close') => {
    var newY = styles.modalTicketContainer.marginVertical;
    if (destination == 'restore')
      newY = styles.modalTicketContainer.marginVertical;
    else if (destination == 'close') newY = GlobalStyle.Measurements.height;
    else newY = styles.modalTicketContainer.marginVertical;

    return Animated.spring(this.state.pan, {
      toValue: newY,
      useNativeDriver: false,
      restDisplacementThreshold: 10,
      restSpeedThreshold: 10,
    }).start(() => {
      if (destination == 'close') this.props.onClose();
      return;
    });
  };
  openEvent = () => {
    console.log('Opening event');
    this.props.navigate('Event Focus', {id: this.props.event.id});
  };
}

TicketModal.defaultProps = {
  visible: false,
  event: {},
};
TicketModal.propTypes = {
  visible: PropTypes.bool.isRequired,
  event: PropTypes.object.isRequired,
};
