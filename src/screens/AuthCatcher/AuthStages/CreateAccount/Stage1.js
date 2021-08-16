import React from 'react';
import {View, Text} from 'react-native';
import {AuthUI} from '../../components';
import {StyleSheet} from 'react-native';
import {styles as textInputStyles} from '../../components/TextInput';
import {Pressable} from 'react-native';
import {GlobalStyle} from '../../../../assets/GlobalStyle';
import {AuthFuncs} from '../../functions';
import {Keyboard} from 'react-native';
import * as Animatable from 'react-native-animatable';

export function Stage1(props) {
  const [filteredCampuses, setFilteredCampuses] = React.useState([]);
  const container = React.useRef();

  function searchCampuses(text) {
    const clear = !text.replace(/\s/g, '').length;

    if (!clear) {
      const filtered = AuthFuncs.searchCampus(props.availableCampuses, text);
      setFilteredCampuses(filtered);
    } else {
      setFilteredCampuses([]);
    }
  }

  function onTextInputFocus() {
    container.current.transitionTo(
      {marginBottom: GlobalStyle.Measurements.height * 0.35},
      650,
    );
  }
  function onTextInputBlur() {
    container.current.transitionTo({marginBottom: 0}, 650);
  }

  return (
    <Animatable.View ref={container} style={styles.searchContainer}>
      <AuthUI.TextInput
        onChangeText={searchCampuses}
        placeholder={'Search for your university'}
        style={[
          {
            shadowOpacity: 0,
            elevation: 0,
            borderWidth: 0,
            marginBottom: 0,
            marginVertical:0,
          },
          filteredCampuses.length > 0 && {
            borderBottomLeftRadius: 0,
            borderBottomRightRadius: 0,
          },
        ]}
        defaultValue={props.selectedCampus ? props.selectedCampus.name : ''}
        onFocus={onTextInputFocus}
        clearButtonMode={'while-editing'}
        onEndEditing={onTextInputBlur}
      />
      {filteredCampuses.map((campus, index) => (
        <SearchComponent
          key={`search_university_${campus.key}`}
          onPress={props.updateCampus}
          campus={campus}
          last={index === filteredCampuses.length - 1}
        />
      ))}
    </Animatable.View>
  );
}
function SearchComponent(props) {
  /**
   * The component in the seach container that
   * shows the campus info
   */
  return (
    <Pressable
      onPress={() => props.onPress(props.campus)}
      style={[
        styles.searchButton,
        props.last && {
          borderBottomLeftRadius: textInputStyles.container.borderRadius,
          borderBottomRightRadius: textInputStyles.container.borderRadius,
        },
      ]}>
      <Text style={styles.searchText}>{props.campus.name}</Text>
      <GlobalStyle.UI.Image
        style={styles.searchLogo}
        source={{uri: props.campus.logo}}
        resizeMode={'contain'}
      />
    </Pressable>
  );
}

const styles = StyleSheet.create({
  searchContainer: {
    shadowColor: textInputStyles.container.shadowColor,
    shadowOffset: textInputStyles.container.shadowOffset,
    shadowOpacity: textInputStyles.container.shadowOpacity,
    shadowRadius: textInputStyles.container.shadowRadius,
    elevation: textInputStyles.container.elevation,
    width: textInputStyles.container.width,
    borderRadius: textInputStyles.container.borderRadius,

    backgroundColor: '#fff',

    flexDirection: 'column',
    alignItems: 'center',
    alignSelf: 'center',
    justifyContent: 'space-between',
  },
  searchText: {
    ...GlobalStyle.TextStyle.bodyMedium,
  },
  searchButton: {
    width: textInputStyles.container.width,
    backgroundColor: textInputStyles.container.backgroundColor,
    padding: textInputStyles.container.paddingHorizontal,

    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  searchLogo: {
    width: 20,
    height: 20,

    backgroundColor: '#00000000',
  },
});
