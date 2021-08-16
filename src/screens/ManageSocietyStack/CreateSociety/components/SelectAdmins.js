import React from 'react';
import {
  View,
  Text,
  ScrollView,
  TextInput,
  TouchableOpacity,
  ActivityIndicator,
} from 'react-native';
import {GlobalStyle} from '../../../../assets/GlobalStyle';
import TouchableShrink from '../../../../assets/TouchableShrink/TouchableShrink';
import {styles} from '../../ManageSocietyFocus/style';
import {UserComponent} from '../../../../assets/InviteView/UserComponent';
import {searchForUser} from '../../../../assets/Firebase/functions';
import Swiper from 'react-native-swiper';
import FontAwesome5Icon from 'react-native-vector-icons/FontAwesome5';
import {CreateSocietyFuncs} from '../functions';
import {ErrorAnimation} from '../../../../assets/LottieAnims/error';
import {SuccessAnimation} from '../../../../assets/LottieAnims/success';

export class SelectAdmins extends React.Component {
  constructor() {
    super();
    this._textInput = React.createRef();
    this._inviteTextInput = React.createRef();
    this._swiper = React.createRef();
    this.state = {
      execs: [],
      loading: false,
      search: [],
      searching: false,
      error: false,
    };
  }
  inviteView = (toInvite = false) => {
    this._swiper.current.scrollBy(toInvite ? 1 : -1, true);
  };
  componentDidMount() {
    if (this.props.execRoles[this.props.roleSelector].uid != undefined)
      this.setState({search: [this.props.execRoles[this.props.roleSelector]]});
  }

  render() {
    return (
      <View
        style={[
          styles.pickerContainer,
          {height: GlobalStyle.Measurements.height * 0.75},
        ]}>
        {/* <Swiper
          ref={this._swiper}
          containerStyle={[styles.pickerContainer, {height: '100%'}]}
          horizontal
          showsPagination={false}
          showsButtons={false}
          loop={false}
          scrollEnabled={false}> */}
        <this.NormalView key={'normal_view_select_admin'} />
        {/* <this.InviteView key={'invite_view_select_admin'} /> */}
        {/* </Swiper> */}

        <TouchableShrink
          style={[
            GlobalStyle.ButtonStyle.Large,
            {
              justifyContent: 'space-between',
              alignSelf: 'center',
              paddingHorizontal: GlobalStyle.Measurements.margin,
            },
          ]}
          showGradient
          gradientColor={this.props.colors.main}
          showIcon
          icon="chevron-down"
          onPress={this.props.close}>
          <Text style={GlobalStyle.TextStyle.buttonLarge}>Continue</Text>
        </TouchableShrink>
      </View>
    );
  }
  NormalView = () => (
    <View style={styles.pickerContainer}>
      <Text style={styles.heading}>Select {this.props.title}</Text>
      <Text style={styles.subText}>Select the perfect representative</Text>
      <GlobalStyle.UI.TextInput
        ref={this._textInput}
        onChangeText={this.onSubmit}
        showSearchIcon
        placeholder={'Search for a student'}
      />
      <ScrollView
      keyboardShouldPersistTaps={"handled"}
        style={styles.swipeUpContainer}
        contentContainerStyle={{alignItems: 'center'}}>
        {this.state.search.length != 0
          ? this.state.search.map((user) => (
              <UserComponent
                user={user}
                invited={
                  this.props.execRoles[this.props.roleSelector].uid !==
                    undefined &&
                  this.props.execRoles[this.props.roleSelector].uid == user.uid
                }
                colors={this.props.colors}
                onPress={this.handlePress}
              />
            ))
          : null}
        {/* {this.state.searching && (
          <View style={{marginTop: GlobalStyle.Measurements.margin * 1.5}}>
            <Text style={GlobalStyle.TextStyle.bodyRegular}>
              Can't find your executive?
            </Text>
            <TouchableOpacity onPress={() => this.inviteView(true)}>
              <Text style={GlobalStyle.ButtonStyle.TextButton}>
                Invite them
              </Text>
            </TouchableOpacity>
          </View>
        )} */}
      </ScrollView>
    </View>
  );
  onSubmit = async (text) => {
    this.setState({loading: true, searching: true, search: []});

    const notEmpty = text.replace(/\s/g, '').length;
    if (notEmpty)
      searchForUser(text.trim().toLowerCase().split(' '), this.props.campusKey)
        .then((users) => this.setState({search: users, error: false}))
        .catch((err) => {
          this.setState({error: true});
          console.warn('Could not search for users', err);
        })
        .finally(() => {
          this.setState({loading: false});
        });
  };
  handlePress = async (user) => {
    this.props.selectRole(user);
  };
  InviteView = () => (
    <View style={[styles.pickerContainer, {height: '100%'}]}>
      <View
        style={{
          flexDirection: 'row',
          alignItems: 'center',
          justifyContent: 'space-between',
          width: GlobalStyle.Measurements.width * 0.8,
        }}>
        <TouchableOpacity onPress={() => this.inviteView(false)}>
          <FontAwesome5Icon
            name={'chevron-left'}
            color={GlobalStyle.ColorStyle.blueButtonText}
            size={GlobalStyle.Measurements.unit * 0.7}
          />
        </TouchableOpacity>
        <Text style={styles.heading}>Invite {this.props.title}</Text>
        <View style={{width: GlobalStyle.Measurements.unit * 0.7}} />
      </View>
      <Text style={styles.subText}>
        Invite them and we'll remember their e-mail until they join
      </Text>
      <TouchableOpacity
        activeOpacity={1}
        style={styles.searchTextInput}
        onPress={() => this._inviteTextInput.current.focus()}>
        <TextInput
          ref={this._inviteTextInput}
          style={[
            styles.textInput,
            {
              width:
                GlobalStyle.Measurements.width * 0.8 -
                styles.searchTextInput.padding * 2,
            },
          ]}
          autoFocus
          autoCorrect={false}
          autoCompleteType={'email'}
          clearTextOnFocus={false}
          placeholder="University e-mail"
          keyboardType={'email-address'}
          autoCapitalize={'none'}
          returnKeyLabel={'Invite'}
          returnKeyType={'send'}
          defaultValue={''}
          onSubmitEditing={({nativeEvent}) =>
            CreateSocietyFuncs.inviteExecToApp(
              this.props.campusKey,
              this.props.society.id,
              this.props.user,
              nativeEvent.text,
            )
          }
        />
      </TouchableOpacity>
      <View
        style={[
          styles.swipeUpContainer,
          {
            alignItems: 'center',
            height: GlobalStyle.Measurements.height * 0.425,
          },
        ]}></View>
    </View>
  );
}
