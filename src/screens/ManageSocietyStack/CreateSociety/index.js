import React from 'react';
import {
  Text,
  View,
  Alert,
  ScrollView,
  TouchableOpacity,
  ActivityIndicator,
} from 'react-native';
import {ModalTop} from '../../../assets/ModalTop';
import {styles} from '../ManageSocietyFocus/style';
import {SocietySnap} from '../../../assets/SocietyCarousel/SocietySnap';
import {CustomTextInput} from '../CreateEvent/components/CustomTextInput';
import {GlobalStyle} from '../../../assets/GlobalStyle';
import ImagePicker from 'react-native-image-picker';
import TouchableShrink from '../../../assets/TouchableShrink/TouchableShrink';
import {auth, db, functions} from '../../../assets/Firebase/Firebase';
import {CustomTextInputWithSwitchOrIcon} from '../CreateEvent/components/TextInputWithSwitch';
import {CustomTouchable} from '../CreateEvent/components/CustomTouchable';
import {CreateSocietyFuncs} from './functions';
import {SelectAdmins} from './components/SelectAdmins';
import {SwipeUpViewLarge} from '../../../assets/SwipeUpView';
import {ConfirmationPanel} from '../../../assets/ConfirmationPanel';
import {MembershipPreview, MembershipSwipeUp} from './components/Memberships';
import {KeyboardAvoidingView} from 'react-native';
import {Platform} from 'react-native';
import {Campus} from '../../../assets/Campus';
import {ExecutivePreview, ExecutiveSwipeUp} from './components/Executives';
import {getUsers, parseSocietyData} from '../../../assets/Firebase/functions';
import {analytics} from '../../../assets/Analytics';

export class CreateSociety extends React.Component {
  constructor() {
    super();
    this.societyID;
    this.state = {
      created: false,
      creating: false,
      createError: false,
      users: {},

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

      roleSelector: undefined, // WHich role the swipe up view should change
      /**
       * Pass state down to SocietySnap to display data
       */
      images: {
        logo: '',
        background: '',
      },
      name: '',
      description: '',
      exec_roles: {
        president: false,
        social_secretary: false,
        secretary: false,
      },
      __type: 'society',
      members: [],
      pricing: {show: false, value: ''},
      exec_members: [],
      whatsapp_link: '',
      link: {show: false, url: ''},
      posted_date: Date.now(),
      posted_by: auth.currentUser !== null ? auth.currentUser.uid : 'empty',

      memberships: [],
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
    const societyID = this.props.route.params.id;
    this.societyID = societyID;
    if (societyID) {
      this.getExistingSociety(societyID);
    } else {
      const requiredRoles = {};
      Campus.Constants.Society.requiredRoles.forEach(
        (e) => (requiredRoles[e] = ''),
      );
      this.setState({exec_roles: requiredRoles});
    }
  }
  render() {
    const executiveArray = Object.entries(this.state.exec_roles);
    const isCreating = this.props.route.params.id !== undefined;

    return (
      <KeyboardAvoidingView
        style={{flex: 1}}
        behavior={Platform.OS == 'ios' ? 'padding' : null}>
        <GlobalStyle.Header
          title={this.societyID ? 'Edit Society' : 'Create Society'}
          navigation={this.props.navigation}
          destinationType={'goBack'}
          colors={this.props.store.app.campus.colors}
        />
        <ScrollView
          keyboardShouldPersistTaps={'handled'}
          {...GlobalStyle.Props.focusBackgroundScrollView}
          ref={this._scroll}>
          {this.state.fetchingSociety && (
            <ActivityIndicator
              style={{
                alignSelf: 'center',
                marginVertical: GlobalStyle.Measurements.margin,
              }}
            />
          )}
          <View style={styles.snapContainer}>
            <SocietySnap
              showExec={false}
              data={this.state}
              colors={this.props.store.app.campus.colors}
            />
          </View>
          <GlobalStyle.UI.Sections.Container title={'Information'}>
            <GlobalStyle.UI.Sections.TextInput
              title={'Name'}
              placeholder={'Add a society name'}
              onChangeText={(name) => this.setState({name})}
              error={this.state.validations.name}
              defaultValue={this.state.name}
            />
            <GlobalStyle.UI.Sections.TextInput
              title={'Description'}
              placeholder={'Add a society description'}
              multiline
              onChangeText={(description) => this.setState({description})}
              error={this.state.validations.description}
              defaultValue={this.state.description}
            />
            <GlobalStyle.UI.Sections.Button
              title={'Logo'}
              icon={'image'}
              blue
              onPress={() => this.selectImage('logo')}
              error={this.state.validations.image_logo}
            />
            <GlobalStyle.UI.Sections.Button
              icon={'image'}
              title={'Background image'}
              text={'Optional'}
              textStyle={{color: '#ccc'}}
              onPress={() => this.selectImage('background')}
              error={this.state.validations.image_background}
              blue
            />
            <GlobalStyle.UI.Sections.TextInput
              title={'Website'}
              placeholder={'Add a society website (Optional)'}
              last
              defaultValue={this.state.link.url}
              keyboardType={'url'}
              onChangeText={(website) =>
                this.setState({
                  link: {
                    url: website,
                    show: !!website.replace(/\s/g, '').length,
                  },
                })
              }
              error={this.state.validations.link}
            />
          </GlobalStyle.UI.Sections.Container>
          <GlobalStyle.UI.Sections.Container
            footer={
              <GlobalStyle.UI.PlusButton
                onPress={() =>
                  this.setState({
                    showSwipeUp: true,
                    swipeUpType: 'memberships',
                    membershipSelector: undefined,
                  })
                }
              />
            }
            title={'Memberships'}>
            {this.state.memberships.map((item, index) => (
              <MembershipPreview
                item={item}
                index={index}
                last={index == this.state.memberships.length - 1}
                onPress={() =>
                  this.setState({
                    showSwipeUp: true,
                    swipeUpType: 'memberships',
                    membershipSelector: item.name,
                  })
                }
              />
            ))}
            {this.state.memberships.length < 1 && (
              <Text
                style={[
                  GlobalStyle.TextStyle.bodyRegular,
                  {color: '#ccc', alignSelf: 'center'},
                ]}>
                Add memberships by clicking on the +
              </Text>
            )}
          </GlobalStyle.UI.Sections.Container>
          {(isCreating ||
            this.state.exec_roles.president === auth.currentUser.uid) && (
            <GlobalStyle.UI.Sections.Container
              footer={
                <GlobalStyle.UI.PlusButton
                  onPress={() =>
                    this.setState({
                      showSwipeUp: true,
                      swipeUpType: 'roleselector',
                      roleSelector: undefined,
                    })
                  }
                />
              }
              title={'Executives'}>
              {executiveArray.map(([role, uid], index) => (
                <ExecutivePreview
                  role={role}
                  user={this.state.users[uid] || uid}
                  last={index === executiveArray.length - 1}
                  onPress={() => {
                    this.setState({
                      showSwipeUp: true,
                      swipeUpType: 'roleselector',
                      roleSelector: role,
                    });
                  }}
                  error={this.state.validations[role]}
                />
              ))}
            </GlobalStyle.UI.Sections.Container>
          )}
          <TouchableShrink
            style={[
              styles.largeButton,
              {marginTop: GlobalStyle.Measurements.margin},
            ]}
            showGradient
            gradientColor={this.props.store.app.campus.colors.main}
            showIcon
            onPress={this.createSociety}>
            <Text style={GlobalStyle.TextStyle.buttonLarge}>
              {this.societyID ? 'Edit Society' : 'Create Society'}
            </Text>
          </TouchableShrink>
        </ScrollView>
        <SwipeUpViewLarge
          isActive={this.state.showSwipeUp}
          canScroll={false}
          onClose={() => this.setState({showSwipeUp: false})}>
          {this.state.showSwipeUp &&
          this.state.swipeUpType === 'memberships' ? (
            <MembershipSwipeUp
              updateMembership={(membership, createNew) => {
                const existing = this.state.memberships;
                if (createNew) existing.push(membership);
                else
                  existing[
                    existing.findIndex((x) => x.name === membership.name)
                  ] = membership;

                this.setState({memberships: existing});
              }}
              close={() => this.setState({showSwipeUp: false})}
              item={
                this.state.memberships[
                  this.state.memberships.findIndex(
                    (x) => x.name === this.state.membershipSelector,
                  )
                ]
              }
              deleteMembership={() => {
                var existingMemberships = this.state.memberships;
                existingMemberships = existingMemberships.filter(
                  ({name}) => name !== this.state.membershipSelector,
                );
                this.setState({memberships: existingMemberships});
              }}
            />
          ) : (
            this.state.swipeUpType === 'roleselector' && (
              <ExecutiveSwipeUp
                role={this.state.roleSelector}
                users={this.state.users}
                colors={this.props.store.app.campus.colors}
                campusKey={this.props.store.app.campus.key}
                existingRoles={this.state.exec_roles || {}}
                close={() => this.setState({showSwipeUp: false})}
                updateExecutive={this.updateExecutive}
                deleteExecutive={() => {
                  const existingRoles = this.state.exec_roles;
                  delete existingRoles[this.state.roleSelector];
                  this.setState({exec_roles: existingRoles});
                }}
              />
            )
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
          errorText={`Could not ${
            this.societyID ? 'update' : 'create'
          } society`}
          loadingText={`${this.societyID ? 'Updating' : 'Creating'} society`}
          successText={`${this.societyID ? 'Updated' : 'Created'} society`}
          subTitle={
            !this.societyID &&
            'Once the society has been reviewed members can join it'
          }
          colors={this.props.store.app.campus.colors}
          onClose={() =>
            this.setState({created: false, creating: false, createError: false})
          }
          navigation={this.props.navigation}
        />
      </KeyboardAvoidingView>
    );
  }
  getExistingSociety = (id) => {
    this.setState({fetchingSociety: true});
    setTimeout(
      () =>
        db
          .collection('campuses')
          .doc(this.props.store.app.campus.key)
          .collection('societies')
          .doc(id)
          .get()
          .then(async (doc) => {
            this.setState({
              ...this.state,
              ...parseSocietyData(doc.data(), doc.id),
            });
            const users = await getUsers(doc.data().exec_members);
            this.setState({users});
          })
          .catch((err) => {
            console.warn('Error duie78', err);
            Alert.alert(
              'Edit society',
              'Something went wrong with getting your society. Please try again later',
              [{text: 'Ok', onPress: () => this.props.navigation.goBack()}],
            );
            analytics.error(err, 'Create Society', 'getExistingSociety');
          })
          .finally(() => this.setState({fetchingSociety: false})),
      750,
    );
  };
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
  createSociety = () => {
    this.setState({creating: true});
    CreateSocietyFuncs.validateSociety(this.state).then((vals) => {
      this.setState({validations: vals});

      if (Object.values(vals).every((elem) => elem == false)) {
        console.log('All validations are checked and passed');
        Campus.Funcs.society
          .updateSociety(this.props.store.app.campus.key, this.state)
          .then(() => {
            setTimeout(
              () =>
                this.setState({
                  created: true,
                  creating: false,
                  createError: false,
                }),
              500,
            );
          })
          .catch((err) => {
            setTimeout(
              () =>
                this.setState({
                  created: true,
                  creating: false,
                  createError: true,
                }),
              500,
            );
          });
      } else {
        console.log('There are validation errors', vals);
        this.setState({creating: false, created: true, createError: true});
      }
    });
  };
  selectRole = (user, remove = false) => {
    var {exec_roles, exec_members, roleSelector} = this.state;

    if (remove) exec_roles[roleSelector] = {};
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
  saveUserInfo = (users) => {
    var existingUsers = this.state.users || {};
    users.forEach((user) => (existingUsers[user.uid] = user));
    this.setState({users: existingUsers}, () =>
      console.log('Users j2l3', existingUsers),
    );
  };
  updateExecutive = (nameOfRole, user) => {
    console.log('Updating', nameOfRole, user);

    const existingRoles = this.state.exec_roles;
    const editingRole = this.state.roleSelector;
    if (editingRole !== nameOfRole) delete existingRoles[editingRole];
    existingRoles[nameOfRole] = user.uid || user;
    this.setState({exec_roles: existingRoles});
    console.log('Roles', existingRoles);

    /**
     * If there was only a student id passed
     * then don't save the student id
     */
    const isStudentId =
      typeof user !== 'object' && /^\d+$/.test(user.toString().trim());

    if (!isStudentId) this.saveUserInfo([user]);
  };
}
