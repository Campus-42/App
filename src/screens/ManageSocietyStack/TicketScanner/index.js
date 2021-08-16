import React from 'react';
import {View, Text, Image, TouchableOpacity, Animated} from 'react-native';
import {RNCamera, BarCodeType} from 'react-native-camera';
import {styles, BAR_SIZE} from './style';
import {GlobalStyle} from '../../../assets/GlobalStyle';
import {createAnimatableComponent} from 'react-native-animatable';
import BarcodeMask from 'react-native-barcode-mask';
import MaterialCommunityIcon from 'react-native-vector-icons/MaterialCommunityIcons';
import Ionicon from 'react-native-vector-icons/Ionicons';
import {LoadingCircle} from '../../../assets/LottieAnims/loading';
import {triggerHaptic} from '../../../assets/Haptic/hapticFeedback';
import {TicketFuncs} from './functions';
import {TicketFuncs as xTicketFuncs} from '../../EventStack/HomeScreen/components/TicketCarousel/functions';
import CheckedImage from '../../../assets/Images/checked.png';
import CancelImage from '../../../assets/Images/cancel.png';
import {SuccessAnimation} from '../../../assets/LottieAnims/success';
import {ErrorAnimation} from '../../../assets/LottieAnims/error';
import {analytics} from '../../../assets/Analytics';
const AnimatableTouchableOpacity = createAnimatableComponent(TouchableOpacity);

export class TicketScanner extends React.Component {
  constructor() {
    super();
    this.state = {
      loading: false,
      valid: false,
      invalid: false,
      message: '',
      scanDisabled: false,
    };
    this.validView = React.createRef();
    this.timeout;
  }

  render() {
    return (
      <View>
        <RNCamera
          style={styles.camera}
          onBarCodeRead={
            !this.state.loading && !this.state.scanDisabled
              ? this.onBarCodeRead
              : () => {}
          }
          captureAudio={false}>
          <BarcodeMask
            width={BAR_SIZE}
            height={BAR_SIZE}
            showAnimatedLine={false}
            edgeBorderWidth={1}
            edgeRadius={GlobalStyle.Measurements.unit / 2}
          />
        </RNCamera>
        <View style={styles.textConainer}>
          <Text style={styles.title}>Scan Tickets</Text>
          <Text style={styles.text}>
            Scan participants QR codes and see if tickets are valid
          </Text>
        </View>
        <TouchableOpacity
          onPress={this.props.navigation.goBack}
          style={styles.navButton}>
          <Ionicon
            name="arrow-back"
            color={'#000'}
            size={GlobalStyle.Measurements.unit}
          />
        </TouchableOpacity>
        <AnimatableTouchableOpacity
          activeOpacity={1}
          onAnimationEnd={this.onAnimationEnd}
          onPress={this.handleClaimViewPress}
          ref={this.validView}
          style={styles.claimView}>
          {this.state.loading ? (
            <LoadingCircle size={'large'} />
          ) : this.state.valid ? (
            <View style={styles.lottie}>
              <SuccessAnimation
                style={{
                  alignSelf: 'center',
                  marginBottom: GlobalStyle.Measurements.margin,
                }}
                size={'large'}
              />
              <Text>Valid</Text>
            </View>
          ) : (
            <View style={styles.lottie}>
              <ErrorAnimation
                style={{
                  alignSelf: 'center',
                  marginBottom: GlobalStyle.Measurements.margin,
                }}
                size={'regular'}
              />
              <Text style={styles.claimText}>{this.state.message}</Text>
            </View>
          )}
        </AnimatableTouchableOpacity>
        <TouchableOpacity
          style={styles.eventButton}
          onPress={() => this.props.navigation.navigate('Live Event')}>
          <Text style={styles.eventButtonText}>Participants</Text>
        </TouchableOpacity>
      </View>
    );
  }
  onAnimationEnd = () => {
    setTimeout(() => {
      if (!this.state.scanDisabled)
        try {
          this.validView.current.fadeOut(500);
          this.setState({scanDisabled: false});
        } catch {}
    }, 5000);
  };
  handleClaimViewPress = () => {
    try {
      this.validView.current.fadeOut(500);
    } catch {}
    this.setState({scanDisabled: false, loading: false});
  };
  animatedClaimView = (type = 'IN' || 'OUT') => {};

  onBarCodeRead = async (params) => {
    triggerHaptic('notificationSuccess');
    this.setState({loading: true, scanDisabled: true});
    try {
      this.validView.current.fadeIn(500);
    } catch {}

    const code = params.data;
    console.log('Ticket Scanner Code:', code);

    setTimeout(async () => {
      const eventIDFocus = this.props.store.society.ticketScanEventID;
      const codeExtract = await TicketFuncs.extractCode(code);

      TicketFuncs.claimTicket(
        this.props.store.app.campus.key,
        eventIDFocus,
        codeExtract.event,
        codeExtract.uid,
      )
        .then((res) => {
          this.setState({valid: true, loading: false, message: res});
          triggerHaptic('notificationSuccess');
        })
        .catch((err) => {
          analytics.error(err, 'TicketScanner/index.js', 'claimTicket()');
          const msg = typeof err == 'string' ? err : 'Invalid Ticket';
          this.setState({valid: false, loading: false, message: msg});
          triggerHaptic('notificationError');
        })
        .finally(() => {
          // this.setState({loading: false});
          this.onAnimationEnd();
          // try {
          //
          // this.timeout = setTimeout(() => {
          //   this.animatedClaimView('OUT');
          //   this.setState({scanDisabled: false});
          // }, 5000); // Dismiss claim view after 15 seconds
          // } catch (err) {
          //   console.log('Could not animate', err);
          // }
        });
    }, 1500);
  };
}
