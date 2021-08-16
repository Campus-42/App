import React from 'react';
import {View, TouchableOpacity, ScrollView, Text} from 'react-native';
import {auth, functions} from '../../../assets/Firebase/Firebase';
import {GlobalStyle} from '../../../assets/GlobalStyle';
import {ModalTop} from '../../../assets/ModalTop';
import {SocietySnap} from '../../../assets/SocietyCarousel/SocietySnap';
import {CustomTextInput} from '../CreateEvent/components/CustomTextInput';
import {CustomTextInputWithSwitchOrIcon} from '../CreateEvent/components/TextInputWithSwitch';
import {CreateSocietyFuncs} from '../CreateSociety/functions';
import {styles} from '../ManageSocietyFocus/style';
import ImagePicker from 'react-native-image-picker';
import {SwipeUpViewLarge} from '../../../assets/SwipeUpView';
import {SelectAdmins} from '../CreateSociety/components/SelectAdmins';
import TouchableShrink from '../../../assets/TouchableShrink/TouchableShrink';
import {ConfirmationPanel} from '../../../assets/ConfirmationPanel';
import {CustomTouchable} from '../CreateEvent/components/CustomTouchable';
import {analytics} from '../../../assets/Analytics';
import {ActionSheetIOS} from 'react-native';

export class EditSociety extends React.Component {
  constructor() {
    super();
    this.state = {
      created: false,
      creating: false,
      createError: false,

      validations: {
        name: false,
        description: false,
        pricing: false,
        link: false,
        whatsapp_link: false,
        president: false,
        social_secretary: false,
        secretary: false,
        vice_president: false,
      },

      roleSelector: '', // WHich role the swipe up view should change
      /**
       * Pass state down to SocietySnap to display data
       */
      images: {
        logo:
          'https://cdn.dribbble.com/users/1477594/screenshots/4377583/untitled-1.jpg',
        background:
          'https://mir-s3-cdn-cf.behance.net/project_modules/disp/04e36325659471.56348c980ab84.jpg',
      },
      name: '',
      number_of_members: 0,
      description: '',
      exec_roles: {
        president: {},
        secretary: {},
        social_secretary: {},
        vice_president: {},
      },
      __type: 'society',
      members: [],
      exec_members: [],
      whatsapp_link: '',
      link: {show: false, url: ''},
      posted_date: Date.now(),
      posted_by: auth.currentUser !== null ? auth.currentUser.uid : 'empty',
      pricing: {show: false, value: 0},

      // Get the users for each of the exec roles
      gettingUsers: false,
    };

    /**
     * Refs
     */
    this._scroll = React.createRef();
    this.__name = React.createRef();
    this.__description = React.createRef();
    this.__website = React.createRef();
    this.__whatsapp = React.createRef();
    this.__pricing = React.createRef();
  }
  componentDidMount() {
    this.setState(
      {
        ...this.state,
        ...this.props.store.society.manageSocietyFocus,
        gettingUsers: true,
      },
      () =>
        this.setState({
          exec_roles: {
            president: {},
            secretary: {},
            social_secretary: {},
            vice_president: {},
          },
        }),
    );
    this.getExecUsers();

    const {type} = {...{type: undefined}, ...this.props.route.type};
    this.setState({
      updateReview: type == 'update_review',
    });
  }
  render() {
    return (
      <View style={{flex: 1}}>
        <GlobalStyle.Header
          title={'Edit Society'}
          navigation={this.props.navigation}
          destinationType={'goBack'}
          colors={this.props.store.app.campus.colors}
        />
        <ScrollView
          {...GlobalStyle.Props.focusBackgroundScrollView}
          style={styles.scroll}
          ref={this._scroll}>
          <View style={styles.snapContainer}>
            <SocietySnap
              showExec={false}
              data={this.state}
              colors={this.props.store.app.campus.colors}
            />
          </View>
          <View style={styles.textInputContainer}>
            <CustomTextInput
              onLayout={(event) => (this.__name = event.nativeEvent.layout)}
              focus={() => this.scrollTo(this.__name)}
              defaultValue={this.state.name}
              type="Society name"
              placeHolder="What name should the society have?"
              onChangeText={(text) => this.setState({name: text})}
              error={this.state.validations.name}
              minLength={5}
            />
            <GlobalStyle.Line />
            <CustomTextInput
              onLayout={(event) =>
                (this.__description = event.nativeEvent.layout)
              }
              focus={() => this.scrollTo(this.__description)}
              multiline
              defaultValue={this.state.description}
              type="Description"
              placeHolder="Describe the society and what makes it so special"
              onChangeText={(text) => this.setState({description: text})}
              error={this.state.validations.description}
              minLength={50}
            />
            <GlobalStyle.Line />
            <CustomTextInputWithSwitchOrIcon
              type="Membership fee"
              onLayout={(event) => (this.__pricing = event.nativeEvent.layout)}
              keyboardType="decimal-pad"
              defaultValue={this.state.pricing.value}
              focus={() => this.scrollTo(this.__pricing)}
              placeHolder="Flip switch to show your annual fee"
              onChangeText={(text) =>
                this.setState({pricing: {...this.state.pricing, value: text}})
              }
              onValueChange={(value) => {
                this.setState({pricing: {...this.state.pricing, show: value}});
              }}
              isChecked={this.state.pricing.show}
              error={this.state.validations.pricing}
            />
            <GlobalStyle.Line />
            <CustomTextInputWithSwitchOrIcon
              type="Website"
              onLayout={(event) => (this.__website = event.nativeEvent.layout)}
              keyboardType="url"
              defaultValue={this.state.link.url}
              focus={() => this.scrollTo(this.__website)}
              placeHolder="Flip switch to show"
              onChangeText={(text) =>
                this.setState({link: {...this.state.link, url: text}})
              }
              onValueChange={(value) => {
                this.setState({link: {...this.state.link, show: value}});
              }}
              isChecked={this.state.link.show}
              error={this.state.validations.link}
            />
            <GlobalStyle.Line />
            {/* <CustomTextInputWithSwitchOrIcon
              type="WhatsApp link"
              onLayout={(event) => (this.__whatsapp = event.nativeEvent.layout)}
              keyboardType="url"
              defaultValue={this.state.whatsapp_link}
              focus={() => this.scrollTo(this.__website)}
              placeHolder="Copy & Paste WhatsApp Chat Link"
              onChangeText={(text) => this.setState({whatsapp_link: text})}
              showIcon
              icon="ios-information-circle-outline"
              onIconPress={CreateSocietyFuncs.showWhatsAppLinkInfo}
              error={this.state.validations.whatsapp_link}
            />
            <GlobalStyle.Line /> */}
            <CustomTouchable
              onPress={() => this.selectImage('logo')}
              text={'Select logo'}
            />
            <GlobalStyle.Line />
            <CustomTouchable
              onPress={() => this.selectImage('background')}
              text={'Select background image'}
            />
            <GlobalStyle.Line />
            {Object.keys(this.state.exec_roles)
              .sort()
              .map((role, index) => (
                <View>
                  <CustomTouchable
                    required={[
                      'president',
                      'social_secretary',
                      'secretary',
                    ].includes(role)}
                    text={
                      'Select ' + CreateSocietyFuncs.deCapitalizeEveryWord(role)
                    }
                    error={this.state.validations[role]}
                    onPress={() =>
                      this.setState({
                        showSwipeUp: true,
                        swipeUpType: 'admins',
                        roleSelector: role,
                      })
                    }
                    subText={
                      !this.state.gettingUsers &&
                      Object.keys(this.state.exec_roles[role]).length !== 0 &&
                      `${this.state.exec_roles[role].first_name} ${this.state.exec_roles[role].last_name}`
                    }
                  />
                  {index != Object.keys(this.state.exec_roles).length - 1 && (
                    <GlobalStyle.Line />
                  )}
                </View>
              ))}
          </View>
          <TouchableShrink
            style={styles.largeButton}
            showGradient
            gradientColor={this.props.store.app.campus.colors.main}
              showIcon
            onPress={this.updateSociety}>
            <Text style={GlobalStyle.TextStyle.buttonLarge}>
              Update Society
            </Text>
          </TouchableShrink>
        </ScrollView>
        <SwipeUpViewLarge
          isActive={this.state.showSwipeUp}
          canScroll={false}
          onClose={() => this.setState({showSwipeUp: false})}>
          {this.state.swipeUpType == 'admins' && this.state.showSwipeUp && (
            <SelectAdmins
              colors={this.props.store.app.campus.colors}
              title={CreateSocietyFuncs.capitalizeEveryWord(
                this.state.roleSelector,
              )}
              close={() => this.setState({showSwipeUp: false})}
              campusKey={this.props.store.app.campus.key}
              emails={this.state.exec_members}
              execRoles={this.state.exec_roles}
              roleSelector={this.state.roleSelector}
              selectRole={this.selectRole}
              society={this.state}
              user={this.props.store.user}
              campus={this.props.store.app.campus}
            />
          )}
        </SwipeUpViewLarge>
        <ConfirmationPanel
          validationError={Object.values(this.state.validations).some(
            (elem) => elem !== false,
          )}
          dontGoBack={this.state.created === false || this.state.createError}
          loading={this.state.creating}
          isActive={this.state.created || this.state.creating}
          error={this.state.createError}
          errorText="Could not update society"
          loadingText="Updating society"
          successText="Updated society"
          subTitle="Keep your society up to date to attract more members"
          colors={this.props.store.app.campus.colors}
          onClose={() =>
            this.setState({created: false, creating: false, createError: false})
          }
          navigation={this.props.navigation}
        />
      </View>
    );
  }
  scrollTo = (ref) => {
    this._scroll.current.scrollTo({
      y: GlobalStyle.Measurements.safeheight * 0.2 + ref.y,
      animated: true,
    });
  };
  selectImage = (type = String) => {
    const imageOptions = {
      title: 'Select Image',
      storageOptions: {
        skipBackup: true,
        path: 'images',
      },
    };
    ImagePicker.showImagePicker(imageOptions, (response) => {
      if (response.didCancel) {
        console.log('User cancelled image picker');
      } else if (response.error) {
        console.log('ImagePicker Error: ', response.error);
        Alert.alert(
          'Camera Unavailable',
          "We couldn't access your camera, please check your settings for the app",
          [
            {text: 'Settings', onPress: () => Linking.openSettings()},
            {text: 'Ok'},
          ],
        );
      } else {
        const source = response.uri;
        const stateUpdate = {...this.state.images};
        stateUpdate[type] = source;

        this.setState({
          images: stateUpdate,
        });
      }
    });
  };
  selectRole = (user, remove = false) => {
    var {exec_roles, exec_members, roleSelector} = this.state;

    if (remove) exec_roles[roleSelector] = {};
    else if (exec_roles[roleSelector].uid == user.uid)
      exec_roles[roleSelector] = {};
    else exec_roles[roleSelector] = user;

    exec_members = Object.values(exec_roles).map((elem) => {
      if (elem.uid != undefined) return elem.uid;
      else return '';
    });

    this.setState({
      exec_roles: exec_roles,
      exec_members: exec_members,
    });
  };
  getExecUsers = async () => {
    CreateSocietyFuncs.getExecUsers(
      this.props.store.society.manageSocietyFocus.exec_roles,
    )
      .then((execUsers) => this.setState({exec_roles: execUsers}))
      .catch((err) => console.warn('Could not get exec users', err))
      .finally(() => this.setState({gettingUsers: false}));
  };
  updateSociety = async () => {
    this.setState({creating: true});
    CreateSocietyFuncs.validateSociety(this.state).then((vals) => {
      this.setState({validations: vals}, () =>
        console.log('new', this.state.validations),
      );

      if (Object.values(vals).every((elem) => elem == false)) {
        console.log('All validations are checked and passed');
        CreateSocietyFuncs.updateSociety(
          this.props.store.app.campus.key,
          this.state,
          this.state.updateReview,
        )
          .then((newSociety) => {
            setTimeout(
              () =>
                this.setState({
                  created: true,
                  creating: false,
                  createError: false,
                }),
              500,
            );
            functions
              .httpsCallable('handleSocietyEdit')({
                campusKey: this.props.store.app.campus.key,
                prevSociety: this.props.store.society.manageSocietyFocus,
                society: newSociety,
                societyID: this.props.store.society.manageSocietyFocus.id,
              })
              .then((res) => console.log(res))
              .catch((err) => console.warn(err));

            this.state.updateReview &&
              functions
                .httpsCallable('onSubmittedSociety')({
                  society: newSociety,
                  societyID: newSociety.id,
                  campusKey: this.props.store.app.campus.key,
                })
                .catch((err) => console.warn('onSubmittedSociety:', err));
          })
          .catch((err) => {
            this.setState({
              created: true,
              creating: false,
              createError: true,
            });
            console.warn('Could not update society', err);
          });
      } else {
        console.log('There are validation errors', vals);
        this.setState({creating: false, created: true, createError: true});
      }
    });
  };
}
