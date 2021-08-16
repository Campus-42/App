import React from 'react';
import {Text} from 'react-native';
import {StyleSheet} from 'react-native';
import {View} from 'react-native';
import FontAwesome5Icon from 'react-native-vector-icons/FontAwesome5';
import {GlobalStyle} from '../../../../assets/GlobalStyle';
import TouchableShrink from '../../../../assets/TouchableShrink/TouchableShrink';
import {AuthUI} from '../../components';
import * as Animatable from 'react-native-animatable';

export function Stage3(props) {
  const [showEmailTextInput, setShowEmailTextInput] = React.useState(false);

  return (
    <React.Fragment>
      <View style={{alignItems: 'center'}}>
        <Text
          style={[
            GlobalStyle.TextStyle.bodyRegular,
            {alignSelf: 'center', marginTop: 20, marginBottom: 10},
          ]}>
          Choose student verification method
        </Text>
        <StudentIdButton
          title={'Student card'}
          icon={'credit-card'}
          onPress={props.showCardScanner}
        />
        <StudentIdButton
          title={'University e-mail'}
          icon={'envelope'}
          onPress={() => setShowEmailTextInput(true)}
        />
        {showEmailTextInput && (
          <Animatable.View animation={'fadeInUp'} duration={550}>
            <AuthUI.TextInput
              style={styles.buttonContainer}
              placeholder={'What is your student id?'}
              onFocus={() => {
                props.setScrollIsEnabled(true);
                props.updateStudentId(props.studentId);
              }}
              onEndEditing={() => {
                props.createAccountWithEmail();
                props.setScrollIsEnabled(false);
              }}
              onChangeText={props.updateStudentId}
              defaultValue={props.studentId}
              keyboardType={'number-pad'}
            />
          </Animatable.View>
        )}
      </View>
    </React.Fragment>
  );
}

function StudentIdButton(props) {
  return (
    <TouchableShrink
      onPress={props.onPress}
      style={styles.buttonContainer}
      showShadow
      shadowOpacity={0.05}>
      <Text style={styles.buttonText}>{props.title}</Text>

      <FontAwesome5Icon
        name={props.icon}
        color={GlobalStyle.Palettes.text.palette6}
        size={GlobalStyle.Measurements.unit * 0.65}
      />
    </TouchableShrink>
  );
}

const styles = StyleSheet.create({
  buttonContainer: {
    ...GlobalStyle.ButtonStyle.Large,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    alignSelf: 'center',
    marginVertical: GlobalStyle.Measurements.marginHalf,

    backgroundColor: '#fff',
    borderWidth: 0.5,
    borderColor: '#e5e5e5',
  },
  buttonText: {
    ...GlobalStyle.TextStyle.buttonMedium,
  },
});
