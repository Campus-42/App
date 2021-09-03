import React from 'react';
import {Dimensions, StyleSheet} from 'react-native';
import {TouchableOpacity} from 'react-native';
import {Platform} from 'react-native';
import {ScrollView} from 'react-native';
import {KeyboardAvoidingView} from 'react-native';
import {Alert} from 'react-native';
import {View} from 'react-native';
import {Text} from 'react-native';
import {Campus} from '../../../../assets/Campus';
import {GlobalStyle} from '../../../../assets/GlobalStyle';
import {UserComponent} from '../../../../assets/InviteView/UserComponent';
import {Validations} from '../../../../assets/Validations/functions';
import {styles as manageStyles} from '../../ManageSocietyFocus/style';
import {Text as AnimText} from 'react-native-animatable';

export class ExecutiveSwipeUp extends React.Component {
  constructor() {
    super();

    this.nameTextInput = React.createRef();
    this.searchTextInput = React.createRef();

    this.state = {
      users: [],
      selectedUser: false,
      error: false,
      validationErrors: {},
    };
  }
  componentDidMount() {
    this.componentDidUpdate({});
  }
  componentDidUpdate(prevProps) {
    if (prevProps.role !== this.props.role) {
      const existingSelectedUid = this.props.existingRoles[this.props.role];
      var existingUser = false;
      if (existingSelectedUid)
        existingUser = this.props.users[existingSelectedUid];

      this.setState({
        users: [],
        error: false,
        searchTerm: '',
        validationErrors: {},
        nameOfRole: this.props.role ? stripString(this.props.role) : undefined,
        selectedUser: existingUser,

        requiredRole: Campus.Constants.Society.requiredRoles.includes(
          this.props.role,
        ),
      });
    }
  }
  render() {
    const nameKey = (this.state.nameOfRole || ' ')
      .trim()
      .toLowerCase()
      .split(' ')
      .join('_');

    const existingRole =
      this.props.role !== undefined ||
      this.props.existingRoles[nameKey] !== undefined;

    return (
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : null}
        style={[
          manageStyles.pickerContainer,
          {height: GlobalStyle.Measurements.height * 0.85},
        ]}>
        <ScrollView
          keyboardShouldPersistTaps={'handled'}
          contentInset={{bottom: GlobalStyle.Measurements.height * 0.25}}
          style={manageStyles.swipeUpContainer}
          contentContainerStyle={{alignItems: 'center'}}>
          <Text style={manageStyles.heading}>Executive</Text>
          {this.props.role && (
            <Text style={styles.swipeup.subTitle}>
              {stripString(this.props.role)}
            </Text>
          )}
          {!this.state.requiredRole && (
            <React.Fragment>
              <GlobalStyle.UI.TextInput
                placeholder={'Name of executive role'}
                onChangeText={(nameOfRole) => this.setState({nameOfRole})}
                error={
                  this.state.validationErrors['nameOfRole'] ||
                  this.state.validationErrors['roleAlreadyExists']
                }
                errorText={
                  this.state.validationErrors['roleAlreadyExists']
                    ? 'Role already exists'
                    : 'This name is invalid'
                }
                defaultValue={this.state.nameOfRole}
              />
              <Text style={styles.swipeup.textinputSubTitle}>
                Name of executive role
              </Text>
            </React.Fragment>
          )}
          <GlobalStyle.UI.TextInput
            placeholder={'Search student'}
            showSearchIcon
            onChangeText={this.searchUsers}
            error={this.state.validationErrors['selectedUser']}
            errorText={'Select a student'}
            defaultValue={this.state.searchTerm}
          />
          <Text style={styles.swipeup.textinputSubTitle}>Student</Text>
          {this.state.selectedUser && (
            <UserComponent
              user={this.state.selectedUser}
              dontShowLevelBadge
              colors={this.props.colors}
              invited={true}
              onPress={() => this.selectUser(this.state.selectedUser)}
            />
          )}
          {this.state.users
            .filter((x) => x.uid !== this.state.selectedUser.uid)
            .map((user) => (
              <UserComponent
                user={user}
                dontShowLevelBadge
                colors={this.props.colors}
                invited={this.state.selectedUser.uid === user.uid}
                onPress={() => this.selectUser(user)}
              />
            ))}
          {this.state.searchTerm !== '' && this.state.users.length === 0 && (
            <AnimText
              style={styles.swipeup.requiredRoleText}
              delay={1500}
              animation={'fadeIn'}
              duration={750}>
              If the student can't be found, enter their student id only and
              we'll automatically sign them up when they join the app
            </AnimText>
          )}
          <GlobalStyle.UI.GreyBackgroundButton
            title={existingRole ? 'Update role' : 'Create role'}
            style={{marginTop: GlobalStyle.Measurements.margin * 3}}
            onPress={this.updateExecutive}
          />
          {existingRole && !this.state.requiredRole && (
            <GlobalStyle.UI.GreyBackgroundButton
              red
              title={'Delete role'}
              onPress={this.deleteExecutive}
            />
          )}
          {this.state.requiredRole && (
            <Text style={styles.swipeup.requiredRoleText}>
              This role is required and can't be deleted or renamed
            </Text>
          )}
        </ScrollView>
      </KeyboardAvoidingView>
    );
  }
  selectUser = (selectedUser) => {
    const alreadySelected =
      (this.state.selectedUser || {}).uid === selectedUser.uid;

    const userIsAlreadyExecutive = Object.entries(this.props.existingRoles)
      .filter(([key]) => key !== this.props.role)
      .some(([key, uid]) => uid === selectedUser.uid || uid === selectedUser);

    if (userIsAlreadyExecutive)
      Alert.alert(
        'Already executive',
        'This student is already an executive in your society',
      );
    else if (alreadySelected) this.setState({selectedUser: false});
    else this.setState({selectedUser});
  };
  searchUsers = (text) => {
    this.setState({searchTerm: text});
    Campus.Funcs.user
      .searchUsers(text, this.props.campusKey)
      .then((users) => {
        users = users.filter((u) => u.uid !== this.state.selectedUser.uid);
        this.setState({users, error: false});
      })
      .catch((err) => this.setState({error: true}));
  };
  updateExecutive = async () => {
    /**
     * Validate the input
     * then update the executive role
     * then close the swipeup
     */

    /**
     * If there is no selected user and the search input
     * is just numbers. Then we will remeber the student
     * id instead
     */
    const remeberStudentId =
      !this.state.selectedUser &&
      /^\d+$/.test((this.state.searchTerm || '').trim());

    const validationErrors = {
      nameOfRole:
        (await Validations.validateText(this.state.nameOfRole)) &&
        !this.state.requiredRole,
      roleAlreadyExists:
        Object.keys(this.props.existingRoles).includes(this.state.nameOfRole) &&
        !this.state.requiredRole,
      selectedUser:
        (await Validations.validateText(this.state.selectedUser.uid)) &&
        !remeberStudentId,
    };
    this.setState({validationErrors});

    if (Object.values(validationErrors).every((x) => x === false)) {
      /**
       * If the seachterm is filled off numbers
       * and the selected user is false. Then this
       * function execute will be called in an Aler.
       * However, if the selected user is filled in
       * then this function will be called without
       * and Alert.
       */
      const studentId = (this.state.searchTerm || '').trim().replace(/\D/g, '');

      const execute = () => {
        const role = (this.state.nameOfRole || this.props.role)
          .trim()
          .toLowerCase()
          .split(' ')
          .join('_');

        const user = this.state.selectedUser || studentId;

        this.props.updateExecutive(role, user);
        this.props.close();
        this.setState({users: [], searchTerm: ''});
      };
      if (remeberStudentId)
        Alert.alert(
          'Executive role',
          "You are about to register a student's id as an executive. Please confirm this action",
          [
            {onPress: () => execute(), text: 'Confirm'},
            {text: 'Cancel', style: 'destructive'},
          ],
        );
      else execute();
    }
  };
  deleteExecutive = () => {
    Alert.alert(
      'Delete role',
      'Are you sure you want to delete this executive role?',
      [
        {
          style: 'destructive',
          text: 'Delete',
          onPress: () => {
            this.props.deleteExecutive();
            this.props.close();
          },
        },
        {text: 'Cancel'},
      ],
    );
  };
}

export function ExecutivePreview(props) {
  const user = props.user || {};
  const isStudentId = /^\d+$/.test(user.toString().trim());

  

  return (
    <View>
      <View style={props.error && styles.preview.errorContainer}>
        <TouchableOpacity
          style={styles.preview.container}
          onPress={props.onPress}>
          <View>
            <Text style={styles.preview.title}>{stripString(props.role)}</Text>
            <Text style={styles.preview.subTitle}>
              {isStudentId
                ? props.user
                : `${user.first_name || ''} ${user.last_name || ''}`}
            </Text>
          </View>
          {Campus.Constants.Society.requiredRoles.includes(props.role) && (
            <Text style={styles.preview.requiredText}>*</Text>
          )}
        </TouchableOpacity>
        {props.error && (
          <Text style={styles.preview.errorText}>{props.error}</Text>
        )}
      </View>
      {!props.last && <GlobalStyle.Line />}
    </View>
  );
}

function stripString(string) {
  const split = string.split('_');

  var returnString = split[0].substring(0, 1).toUpperCase();
  returnString += split[0].substring(1);
  returnString += ' ';
  returnString += split.slice(1).join(' ').trim();

  return returnString;
}
const PREVIEW_WIDTH = GlobalStyle.Measurements.width * 0.8;

const styles = {
  preview: StyleSheet.create({
    container: {
      width: PREVIEW_WIDTH * 0.97,
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-between',
      marginVertical: 4,
    },
    title: {
      ...GlobalStyle.TextStyle.bodyRegular,
      fontWeight: '500',
      fontSize: Dimensions.get('screen').fontScale * 14,
      color: GlobalStyle.ColorStyle.blueButtonText,
      width: PREVIEW_WIDTH * 0.9,
    },
    subTitle: {
      ...GlobalStyle.TextStyle.bodyRegular,
      width: PREVIEW_WIDTH * 0.9,
    },
    requiredText: {
      ...GlobalStyle.TextStyle.bodyLargeBold,
      color: '#ff0000',
    },
    errorContainer: {
      borderRadius: GlobalStyle.Measurements.unit / 2,
      borderWidth: 1,
      borderColor: '#ff0000',
      backgroundColor: '#ff000010',
      padding: 2,
    },
    errorText: {
      ...GlobalStyle.TextStyle.bodySmall,
      color: '#ff0000',
      alignSelf: 'flex-end',
      marginRight: 5,
    },
  }),
  swipeup: StyleSheet.create({
    subTitle: {
      ...GlobalStyle.TextStyle.bodyRegular,
      marginBottom: GlobalStyle.Measurements.margin,
    },
    textinputSubTitle: {
      ...GlobalStyle.TextStyle.bodySmall,
      alignSelf: 'flex-start',
      marginLeft: GlobalStyle.Measurements.width * 0.1,
      marginBottom: GlobalStyle.Measurements.marginHalf,
    },
    requiredRoleText: {
      ...GlobalStyle.TextStyle.bodyRegular,
      color: GlobalStyle.Palettes.text.palette4,
      textAlign: 'center',
      alignSelf: 'center',
      marginHorizontal: GlobalStyle.Measurements.width * 0.075,
    },
  }),
};
