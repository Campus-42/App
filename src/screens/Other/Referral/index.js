import React from 'react';
import {View, ActivityIndicator, Text} from 'react-native';
import {GlobalStyle} from '../../../assets/GlobalStyle';
import Animation from '../../../assets/Images/friend-notification.json';
import LottieView from 'lottie-react-native';
import {StyleSheet} from 'react-native';
import {CloseButton} from './components/CloseButton';
import {Campus} from '../../../assets/Campus';
import {Alert} from 'react-native';
import {analytics} from '../../../assets/Analytics';

export class Referral extends React.Component {
  constructor() {
    super();
    this.height = false; // The height of the modal
    this.state = {
      playAnimation: false,
      creatingLink: false,
      url: false,
      sent: false,
    };
  }
  componentDidMount() {
    this.setState({creatingLink: true});
    setTimeout(this.createReferralLink, 1000);
  }
  render() {
    const points = (
      (this.props.store.app.campus_point_system || {}).points || {}
    ).external_invite;

    return (
      <React.Fragment>
        <View style={[GlobalStyle.ViewStyle.whiteBackground, styles.container]}>
          <View>
            <Text style={styles.title}>Refer and earn points</Text>
            <Text style={styles.subTitle}>
              Want to earn more points? Invite new friends to the app and you
              both earn points
            </Text>
          </View>
          <LottieView
            source={Animation}
            autoplay
            loop={this.state.playAnimation}
            autoSize
            style={styles.animation}
          />
          <View>
            <GlobalStyle.UI.UserLevels
              user={this.props.store.user}
              campusPointSystem={this.props.store.app.campus_point_system}
              campus={this.props.store.app.campus}
              show={true}
              showShadow
            />

            <View style={{minHeight: GlobalStyle.Measurements.height * 0.2}}>
              {this.state.creatingLink || !this.state.url ? (
                <View style={styles.creatingContainer}>
                  <Text style={styles.pointsText}>Creating link</Text>
                  <ActivityIndicator
                    color={GlobalStyle.ColorStyle.referralColour}
                    size={GlobalStyle.Measurements.unit}
                    style={{marginLeft: 10}}
                  />
                </View>
              ) : (
                !this.state.error && (
                  <>
                    <GlobalStyle.UI.Referral.Large
                      text={'Share with friends'}
                      onPress={this.openShareView}
                    />
                    {this.state.sent ? (
                      <Text style={styles.pointsText}>Successfully sent!</Text>
                    ) : (
                      points && (
                        <Text style={styles.pointsText}>+ {points} points</Text>
                      )
                    )}
                  </>
                )
              )}
            </View>
          </View>
          <CloseButton onPress={this.props.navigation.goBack} />
        </View>
      </React.Fragment>
    );
  }

  createReferralLink = () => {
    this.setState({creatingLink: true});
    Campus.Funcs.referral
      .getReferralLink()
      .then((url) => this.setState({url, error: false}))
      .catch((error) => {
        Alert.alert(
          'Referral error',
          'Something went wrong creating your unique referral link, please try again later',
          [
            {
              text: 'Ok',
              onPress: this.props.store.navigation.goBack,
            },
          ],
        );
        this.setState({error});
      })
      .finally(() => this.setState({creatingLink: false}));
  };

  openShareView = async () => {
    try {
      const shareResult = await Campus.Funcs.referral.openShareView(
        this.state.url,
      );

      if (shareResult.successful) {
        this.setState({sent: true});
        setTimeout(() => this.setState({sent: false}), 4000);
      }
      analytics.breadcrumb('Received share result: ' + shareResult);
    } catch (err) {
      analytics.error(err, 'ReferralFocus', 'openShareView');
      Alert.alert(
        'Unexpected error',
        'Something unexpected happened, please try again later',
      );
    }
  };
}

const color = GlobalStyle.ColorStyle.referralColour;

const styles = StyleSheet.create({
  container: {
    width: GlobalStyle.Measurements.width,
    flex: 1,
    alignSelf: 'center',
    alignItems: 'center',
    justifyContent: 'space-evenly',
    paddingBottom: GlobalStyle.Measurements.height * 0.05,
  },
  animation: {
    maxWidth: GlobalStyle.Measurements.width * 0.8,
    height: GlobalStyle.Measurements.unit * 12,
    alignSelf: 'center',
  },
  title: {
    ...GlobalStyle.TextStyle.headingLarge,
    color,
    marginBottom: GlobalStyle.Measurements.margin,
    alignSelf: 'center',
    textAlign: 'center',
  },
  pointsText: {
    ...GlobalStyle.TextStyle.headingLarge,
    color,
    alignSelf: 'center',
    textAlign: 'center',
  },
  subTitle: {
    ...GlobalStyle.TextStyle.bodyRegular,
    width: GlobalStyle.Measurements.width * 0.8,
    alignSelf: 'center',
    textAlign: 'center',
  },
  creatingContainer: {
    alignSelf: 'center',
    alignItems: 'center',
    justifyContent: 'center',
    flexDirection: 'row',
    marginVertical: 10,
  },
});
