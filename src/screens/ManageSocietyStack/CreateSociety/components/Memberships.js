import React from 'react';
import {
  Dimensions,
  TouchableWithoutFeedback,
  TouchableOpacity,
} from 'react-native';
import {ScrollView} from 'react-native';
import {Platform} from 'react-native';
import {KeyboardAvoidingView} from 'react-native';
import {StyleSheet} from 'react-native';
import {Text, View} from 'react-native';
import {Campus} from '../../../../assets/Campus';
import {GlobalStyle} from '../../../../assets/GlobalStyle';
import {styles as manageStyles} from '../../ManageSocietyFocus/style';
import {Picker} from '@react-native-community/picker';
import {Alert} from 'react-native';
import {CreateSocietyFuncs} from '../functions';

export class MembershipSwipeUp extends React.Component {
  constructor() {
    super();
    this.scrollview = React.createRef();
    this.state = {
      name: undefined,
      price: undefined,
      valid_period: undefined,
      extra_info: undefined,
      selectedValidity: 0,

      validationErrors: {},
    };
  }
  componentDidMount() {
    const item = this.props.item || {};
    this.setState({
      name: item.name,
      price: item.price,
      valid_period: item.valid_period,
      extra_info: item.extra_info,
    });
  }
  render() {
    const creatingMembership = this.props.item === undefined; // If the item is undefined then the user is creating it for the first time
    const item = this.props.item || {};
    return (
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : null}
        style={[
          manageStyles.pickerContainer,
          {height: GlobalStyle.Measurements.height * 0.85},
        ]}>
        <ScrollView
          ref={this.scrollview}
          keyboardShouldPersistTaps={'handled'}
          contentInset={{bottom: GlobalStyle.Measurements.height * 0.25}}
          style={[
            manageStyles.swipeUpContainer,
            {height: GlobalStyle.Measurements.height * 0.85},
          ]}
          contentContainerStyle={{alignItems: 'center'}}>
          <Text style={manageStyles.heading}>Membership</Text>
          <GlobalStyle.UI.TextInput
            placeholder={'Name of the membership'}
            defaultValue={item.name}
            onChangeText={(name) => this.setState({name})}
            error={this.state.validationErrors['name']}
            errorText={'Invalid name of membership'}
          />
          <Text style={styles.swipeup.textinputSubTitle}>
            Name of the membership
          </Text>
          <GlobalStyle.UI.TextInput
            placeholder={'What is the price'}
            defaultValue={(item.price || '').toString()}
            keyboardType={'decimal-pad'}
            onChangeText={(price) => this.setState({price})}
            error={this.state.validationErrors['price']}
            errorText={'Invalid price for membership'}
          />
          <Text style={styles.swipeup.textinputSubTitle}>
            Price of the membership
          </Text>
          <TouchableWithoutFeedback>
            <Picker
              style={
                Platform.OS === 'android'
                  ? styles.swipeup.pickerAndroid
                  : styles.swipeup.pickerIos
              }
              selectedValue={this.state.selectedValidity}
              onValueChange={(selectedValidity) =>
                this.setState({selectedValidity})
              }>
              {VALIDITY_TERMS.map((x, index) => (
                <Picker.Item
                  label={x.name}
                  value={index}
                  key={`membership_swipeup_${item.key}_${x.key}`}
                />
              ))}
            </Picker>
          </TouchableWithoutFeedback>
          {this.state.selectedValidity === VALIDITY_TERMS.length - 1 && (
            <GlobalStyle.UI.TextInput
              placeholder={'How many days is it valid?'}
              keyboardType={'number-pad'}
              onChangeText={(customValidPeriod) =>
                this.setState({customValidPeriod})
              }
              error={this.state.validationErrors['valid_period']}
              errorText={'Invalid length of membership'}
              contextMenuHidden // diable copy and paste option
            />
          )}
          <Text style={styles.swipeup.textinputSubTitle}>
            Length of the membership
          </Text>
          <GlobalStyle.UI.TextInput
            placeholder={'Extra information (Optional)'}
            defaultValue={item.extra_info}
            multiline
            onChangeText={(extra_info) => this.setState({extra_info})}
            onFocus={() =>
              this.scrollview.current.scrollTo({
                y: GlobalStyle.Measurements.height * 0.25,
              })
            }
          />
          <Text style={styles.swipeup.textinputSubTitle}>
            Extra information
          </Text>
          <GlobalStyle.UI.GreyBackgroundButton
            title={
              creatingMembership ? 'Create membership' : 'Update membership'
            }
            style={{marginTop: GlobalStyle.Measurements.margin * 3}}
            onPress={this.updateMembership}
          />
          {!creatingMembership && (
            <GlobalStyle.UI.GreyBackgroundButton
              red
              title={'Delete membership'}
              onPress={this.deleteMembership}
            />
          )}
        </ScrollView>
      </KeyboardAvoidingView>
    );
  }
  updateMembership = async () => {
    const validPeriod =
      this.state.selectedValidity === VALIDITY_TERMS.length - 1
        ? this.state.customValidPeriod
        : VALIDITY_TERMS[this.state.selectedValidity].key;

    const membership = {
      name: this.state.name,
      price: this.state.price,
      valid_period: validPeriod,
      extra_info: this.state.extra_info,
    };

    const validationErrors = await CreateSocietyFuncs.validateMembership(
      membership,
    );
    this.setState({validationErrors});
    console.log('Validations', validationErrors);
    if (Object.values(validationErrors).every((x) => x === false)) {
      this.props.updateMembership(membership, this.props.item === undefined);
      this.props.close();
    }
  };
  deleteMembership = () =>
    Alert.alert(
      'Delete membership',
      'Are you sure you want to delete this membership?',
      [
        {
          style: 'destructive',
          text: 'Delete',
          onPress: () => {
            this.props.deleteMembership();
            this.props.close();
          },
        },
        {text: 'Cancel'},
      ],
    );
}

export function MembershipPreview(props) {
  var hasNumber = /\d/;

  const validText = hasNumber.test(props.item.valid_period)
    ? props.item.valid_period == 1
      ? `${props.item.valid_period} day`
      : `${props.item.valid_period} days`
    : `a ${props.item.valid_period}`;

  return (
    <View>
      <TouchableOpacity
        style={styles.preview.container}
        onPress={props.onPress}>
        <View>
          <Text style={styles.preview.title}>{props.item.name}</Text>
          <Text style={styles.preview.validityText}>Valid for {validText}</Text>
          {props.item.notes && (
            <Text style={styles.preview.notesText}>{props.item.notes}</Text>
          )}
        </View>
        <Text style={styles.preview.priceText}>£ {props.item.price}</Text>
      </TouchableOpacity>
      {!props.last && <GlobalStyle.Line />}
    </View>
  );
}

const PREVIEW_WIDTH = GlobalStyle.Measurements.width * 0.8;
const VALIDITY_TERMS = [
  {name: 'Term', key: 'term'},
  {name: 'Year', key: 'year'},
  {name: 'Lifetime', key: 'lifetime'},
  {name: 'Custom...', key: 'custom'},
];

const styles = {
  swipeup: StyleSheet.create({
    textinputSubTitle: {
      ...GlobalStyle.TextStyle.bodySmall,
      alignSelf: 'flex-start',
      marginLeft: GlobalStyle.Measurements.width * 0.1,
      marginBottom: GlobalStyle.Measurements.marginHalf,
    },
    pickerIos: {
      height: GlobalStyle.Measurements.height * 0.3,
      width: GlobalStyle.Measurements.width * 0.85,
      alignSelf: 'center',
      borderRadius: GlobalStyle.Measurements.unit / 2,
    },
    pickerAndroid: {
      width: GlobalStyle.Measurements.width * 0.85,
      alignSelf: 'center',
    },
  }),
  preview: StyleSheet.create({
    container: {
      width: PREVIEW_WIDTH,
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-between',
      marginVertical: 4,
    },
    title: {
      ...GlobalStyle.TextStyle.bodyRegular,
      fontWeight: '500',
      fontSize: Dimensions.get('screen').fontScale * 14,
      width: PREVIEW_WIDTH * 0.8,
      color: GlobalStyle.ColorStyle.blueButtonText,
    },
    priceText: {
      ...GlobalStyle.TextStyle.bodyRegular,
      width: PREVIEW_WIDTH * 0.175,
      textAlign: 'right',
    },
    validityText: {
      ...GlobalStyle.TextStyle.bodyRegular,
      width: PREVIEW_WIDTH * 0.8,
    },
    editIcon: {
      width: PREVIEW_WIDTH * 0.065,
      alignItems: 'center',
      justifyContent: 'center',
    },
    notesText: {
      ...GlobalStyle.TextStyle.bodySmall,
      width: PREVIEW_WIDTH * 0.8,
      color: GlobalStyle.Palettes.text.palette4,
      marginTop: 2,
    },
  }),
};
