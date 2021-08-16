import React from 'react';
import {StyleSheet} from 'react-native';
import {TouchableOpacity} from 'react-native';
import {Linking} from 'react-native';
import {View, Text} from 'react-native';
import CheckBox from 'react-native-check-box';
import {GlobalStyle} from '../../../../assets/GlobalStyle';
import {AuthUI} from '../../components';

export function Stage2(props) {
  /**
   * Ask the user for their personal information
   * and their password
   */

  const [showSecureText, setShowSecureText] = React.useState(false);

  function updateUser(text, key) {
    /**
     * This function is called whenever the text is changed
     * in one of the textinputs.
     */
    const user = props.user;

    user[key] = text;

    props.updateUser(user);
    updateIfShouldShowContinueButton({
      ...user,
      hasAgreedToTerms: props.hasAgreedToTerms,
    });
  }
  function updateIfShouldShowContinueButton(user) {
    /**
     * Whenever the user leaves a textinput then
     * this function will evaluate whether the continue
     * button will be shown or not
     */
    const firstName = !!user.first_name.replace(/\s/g, '').length;
    const lastName = !!user.last_name.replace(/\s/g, '').length;
    const hasAgreed = user.hasAgreedToTerms;

    const passwordsMatch = props.user.password1 === props.user.password2;
    const passwordFieldsNotEmpty =
      !!props.user.password1.replace(/\s/g, '').length &&
      !!props.user.password2.replace(/\s/g, '').length;
    const passwordIsTooShort =
      props.user.password1.replace(/\s/g, '').length < 8;

    props.showContinueButton(
      firstName &&
        lastName &&
        hasAgreed &&
        passwordsMatch &&
        passwordFieldsNotEmpty &&
        !passwordIsTooShort,
    );
  }

  const passwordsMatch = props.user.password1 === props.user.password2;
  const passwordFieldsNotEmpty =
    !!props.user.password1.replace(/\s/g, '').length &&
    !!props.user.password2.replace(/\s/g, '').length;
  const passwordIsTooShort = props.user.password1.replace(/\s/g, '').length < 8;

  return (
    <View>
      <AuthUI.TextInput
        placeholder={'First name'}
        onChangeText={(txt) => updateUser(txt, 'first_name')}
        defaultValue={props.user.first_name}
      />
      <AuthUI.TextInput
        placeholder={'Last name'}
        onChangeText={(txt) => updateUser(txt, 'last_name')}
        defaultValue={props.user.last_name}
      />
      <AuthUI.TextInput
        placeholder={'Password'}
        secureTextEntry
        showSecureText={showSecureText}
        onSecureToggle={(showSecureText) => setShowSecureText(showSecureText)}
        onChangeText={(txt) => updateUser(txt, 'password1')}
        defaultValue={props.user.password1}
      />
      <AuthUI.TextInput
        placeholder={'Confirm password'}
        secureTextEntry
        showSecureText={showSecureText}
        onSecureToggle={(showSecureText) => setShowSecureText(showSecureText)}
        onChangeText={(txt) => updateUser(txt, 'password2')}
        defaultValue={props.user.password2}
      />
      <View style={styles.passwordMatchContainer}>
        {passwordFieldsNotEmpty && (
          <Text style={styles.passwordMatchText}>
            {!passwordsMatch
              ? 'Passwords are not matching'
              : passwordIsTooShort && 'Password is too short'}
          </Text>
        )}
      </View>
      <CheckButton
        isChecked={props.hasAgreedToTerms}
        onPress={(val) => {
          props.setAgreeTerms(val);
          updateIfShouldShowContinueButton({
            ...props.user,
            hasAgreedToTerms: val,
          });
        }}
        text={'I agree to the '}
        linkText={'terms & conditions'}
        link={'https://campus42.co.uk/terms-conditions.html'}
      />
    </View>
  );
}

function CheckButton(props) {
  return (
    <View style={styles.checkContainer}>
      <CheckBox
        onClick={() => props.onPress(!props.isChecked)}
        isChecked={props.isChecked}
        checkBoxColor={GlobalStyle.Palettes.text.palette1}
      />
      <Text style={[styles.checkText, {marginLeft: 10}]}>{props.text}</Text>
      <TouchableOpacity onPress={() => Linking.openURL(props.link)}>
        <Text
          style={[
            styles.checkText,
            {color: GlobalStyle.ColorStyle.blueButtonText},
          ]}>
          {props.linkText}
        </Text>
      </TouchableOpacity>
    </View>
  );
}
const styles = StyleSheet.create({
  checkContainer: {
    flexDirection: 'row',
    alignSelf: 'center',

    alignItems: 'center',
    width: GlobalStyle.Measurements.width * 0.85,
    marginTop: GlobalStyle.Measurements.height * 0.03,
  },
  checkText: {
    ...GlobalStyle.TextStyle.bodyRegular,
  },
  passwordMatchText: {
    ...GlobalStyle.TextStyle.bodySmall,
    alignSelf: 'center',
  },
  passwordMatchContainer: {
    height: GlobalStyle.TextStyle.bodySmall.fontSize + 5,
  },
});
