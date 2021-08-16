import React from 'react';
import {View, Image, Text} from 'react-native';
import {AuthUI} from '../../components';
import {AuthFuncs} from '../../functions';
import * as Animatable from 'react-native-animatable';
import {Keyboard} from 'react-native';
import {Pressable} from 'react-native';
import {GlobalStyle} from '../../../../assets/GlobalStyle';
import {CardScanner} from './CardScanner';
import {Stage1} from './Stage1';
import {Stage2} from './Stage2';
import {Stage3} from './Stage3';
import {Stage4} from './Stage4';
import {dynamicLinks} from '../../../../assets/Firebase/Firebase';
import {analytics} from '../../../../assets/Analytics';
import {ReferralView} from '../../components/ReferralView';

export class CreateAccount extends React.Component {
  /**
   * When the user creates the account they will go
   * through 3 different stages
   *
   * 1. Search for their university
   * 2. Enter their personal information
   * 3. Choose sign up method (card or email)
   * 4. Verify email (if applicable)
   */
  constructor() {
    super();
    this.stageContainer = React.createRef();

    this.state = {
      stageIndex: 0,
      highestIndexReached: 0,
      availableCampuses: {},
      selectedCampus: false,
      isUserReferred: false,
      referralSender: false,

      user: {
        first_name: '',
        last_name: '',
        password1: '',
        password2: '',
        student_id: '',
      },
    };
  }
  componentDidMount() {
    console.log('Create account mounted');

    AuthFuncs.getAvailableCampuses()
      .then((availableCampuses) => {
        this.setState({availableCampuses, error: false});
      })
      .catch((err) => {
        console.warn('Error getting available campuses', err);
        this.setState({error: true});
      })
      .finally(() => this.setState({init: true}));

    /**
     * Check for referral links
     * Start by getting the initial link
     * Then start a listener
     */
    this.checkForReferralLink();
    this.referralForeground = dynamicLinks.onLink(
      this.handlePotentialReferralLink,
    );
  }
  componentWillUnmount() {
    try {
      if (this.referralForeground) this.referralForeground();
    } catch (err) {
      console.warn('Could not unsubscribe referral forefround listener', err);
    }
  }
  onStageChange = (index = 0) => {
    this.props.setScrollIsEnabled(index === 1);

    if (index !== this.state.stageIndex) {
      const goingBack = index < this.state.stageIndex;
      Keyboard.dismiss();
      const duration = 450;
      if (goingBack) this.stageContainer.current.fadeOutRight(duration);
      else this.stageContainer.current.fadeOutLeft(duration);

      setTimeout(() => {
        this.setState({stageIndex: index, showContinueButton: false});

        if (goingBack) this.stageContainer.current.fadeInLeft(duration);
        else this.stageContainer.current.fadeInRight(duration);
      }, duration + 10);
    }
    if (index > this.state.highestIndexReached)
      this.setState({highestIndexReached: index});
  };

  render() {
    const showLeftArrow =
      this.state.stageIndex > 0 && this.state.stageIndex !== 3;
    const showRightArrow =
      this.state.stageIndex < this.state.highestIndexReached;
    return (
      <React.Fragment>
        <AuthUI.MainContainer
          style={{justifyContent: 'space-between', flex: 1}}>
          <View>
            <AuthUI.ScreenTitle
              title={'Create account'}
              showLeftArrow={showLeftArrow}
              showRightArrow={showRightArrow}
              onLeftArrowPress={() =>
                this.onStageChange(this.state.stageIndex - 1)
              }
              onRightArrowPress={() =>
                this.onStageChange(this.state.stageIndex + 1)
              }
            />
            <Animatable.View ref={this.stageContainer} useNativeDriver={false}>
              <View>
                {this.state.stageIndex === 0 ? (
                  <Stage1
                    selectedCampus={this.state.selectedCampus}
                    availableCampuses={this.state.availableCampuses}
                    updateCampus={(selectedCampus) => {
                      this.setState({selectedCampus});
                      this.onStageChange(1);
                    }}
                  />
                ) : this.state.stageIndex === 1 ? (
                  <Stage2
                    setAgreeTerms={(hasAgreedToTerms) =>
                      this.setState({hasAgreedToTerms})
                    }
                    hasAgreedToTerms={this.state.hasAgreedToTerms}
                    user={this.state.user}
                    updateUser={(user) => this.setState({user})}
                    showContinueButton={(showContinueButton) =>
                      this.setState({showContinueButton})
                    }
                    setScrollIsEnabled={this.props.setScrollIsEnabled}
                  />
                ) : this.state.stageIndex === 2 ? (
                  <Stage3
                    studentId={this.state.user.student_id}
                    updateStudentId={(student_id) => {
                      this.setState({user: {...this.state.user, student_id}});
                      this.setState({
                        showContinueButton: student_id.trim().length === 7,
                      });
                    }}
                    showCardScanner={() =>
                      this.setState({showCardScanner: false}, () =>
                        this.setState({
                          showCardScanner: true,
                          verificationMethod: 'card',
                        }),
                      )
                    }
                    createAccountWithEmail={() => {
                      this.setState({verificationMethod: 'email'});
                    }}
                    setScrollIsEnabled={this.props.setScrollIsEnabled}
                  />
                ) : this.state.stageIndex === 3 ? (
                  <Stage4
                    showPopup={this.props.showPopup}
                    verificationMethod={this.state.verificationMethod}
                    user={this.state.user}
                    campus={this.state.selectedCampus}
                    updateSignedIn={this.props.updateSignedIn}
                    updateUser={(user) => this.setState({user})}
                    referralSender={
                      this.state.isUserReferred && this.state.referralSender
                    }
                  />
                ) : null}
              </View>
            </Animatable.View>
          </View>
          <View>
            {this.state.showContinueButton ? (
              <AuthUI.PrimaryButton
                title={'Continue'}
                onPress={() => this.onStageChange(this.state.stageIndex + 1)}
              />
            ) : (
              this.state.isUserReferred && (
                <ReferralView sender={this.state.referralSender} />
              )
            )}
            <Pressable
              style={{alignSelf: 'center'}}
              onPress={() => this.props.updateTarget('signin')}>
              <Text style={GlobalStyle.TextStyle.bodySmall}>Sign in</Text>
            </Pressable>
          </View>
        </AuthUI.MainContainer>
        <CardScanner
          isActive={this.state.showCardScanner}
          onClose={() => this.setState({showCardScanner: false})}
          onCardRead={this.onCardRead}
        />
      </React.Fragment>
    );
  }

  onCardRead = (studentId) => {
    if (
      (studentId || '').toString().length === 7 &&
      this.state.studentId != studentId
    ) {
      this.setState({
        user: {...this.state.user, student_id: studentId},
        showCardScanner: false,
      });
      setTimeout(() => this.onStageChange(3)), 250;
    }
  };
  checkForReferralLink = async () => {
    const initialLink = await dynamicLinks.getInitialLink();
    analytics.breadcrumb('Initial link: ' + initialLink);
    this.handlePotentialReferralLink(initialLink);
  };
  handlePotentialReferralLink = (link) => {
    if ((link || {}).url) {
      const {url, minimumAppVersion} = link;
      const baseUrl = 'https://campus42.page.link/referral/';
      const isReferral = url.includes(baseUrl);
      const sender = url.split(baseUrl)[1];

      analytics.referralDetected(url);

      this.setState({
        isUserReferred: isReferral,
        referralSender: sender,
      });
    }
  };
}
