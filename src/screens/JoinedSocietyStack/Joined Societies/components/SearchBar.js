import React from 'react';
import {TextInput, TouchableHighlight} from 'react-native';
import {styles as xStyles} from '../../../EventStack/HomeScreen/components/SearchBar';
import MaterialIcon from 'react-native-vector-icons/MaterialIcons';
import {GlobalStyle} from '../../../../assets/GlobalStyle';
import {JoinedSocietyFuncs} from '../functions';
import {updateReduxSocieties} from '../../../../assets/redux/functions';

export const SearchBar = (props) => {
  const textinput = React.useRef(null);
  const [search, setSearch] = React.useState('');
  const [focusedSearch, setFocusSearch] = React.useState(false); // When it changes from false to true, search will be focused

  // Catch if we should focus in on searchbar
  React.useEffect(() => {
    if (focusedSearch === false && props.focusInSearchBar === true) {
      textinput.current.focus();
      props.focusSearch(false);
    }
    return;
  });

  const clear = search.replace(/\s/g, '').length;
  const icon = clear ? 'clear' : 'search';

  return (
    <TouchableHighlight
      style={[
        xStyles.container,
        {marginVertical: GlobalStyle.Measurements.marginHalf},
      ]}
      onPress={() => textinput.current.focus()}
      activeOpacity={0.5}
      underlayColor={'white'}>
      <React.Fragment>
        <TouchableHighlight
          style={[xStyles.icon, {backgroundColor: props.colors.main}]}
          onPress={iconPress}
          underlayColor={props.colors.extraLight}>
          <MaterialIcon
            name={icon}
            size={GlobalStyle.Measurements.unit}
            color="white"
          />
        </TouchableHighlight>
        <TextInput
          ref={textinput}
          onFocus={() => {
            props.viewFocus('search');
            props.userIsTyping(true);
          }}
          style={GlobalStyle.TextStyle.textInputSmall}
          onChangeText={onChangeText}
          placeholder="Search for a society"
          onEndEditing={onEnd}
        />
      </React.Fragment>
    </TouchableHighlight>
  );
  function iconPress() {
    console.log('clear', clear);
    if (clear) {
      console.log('YEP');
      textinput.current.clear();
      props.viewFocus('normal');
      setSearch('');
    } else {
      console.log('NOPE');
      textinput.current.focus();
      props.viewFocus('search');
    }
  }
  function onEnd() {
    props.userIsTyping(false);
    const noSpace = search.replace(/\s/g, '').length;
    if (!noSpace) props.viewFocus('normal');
  }
  function onChangeText(text) {
    const noSpace = text.replace(/\s/g, '').length;
    props.userIsTyping(true);
    setSearch(text);

    if (noSpace) {
      // setIcon('clear');
      setSearch(text);
      onSubmit(text);
      props.viewFocus('search');
    } else {
      // setIcon('search');
      // props.viewFocus('normal');
    }
  }
  function onSubmit(text) {
    const noSpace = text.replace(/\s/g, '').length;

    if (noSpace) {
      props.setSearchLoading();
      JoinedSocietyFuncs.searchSocieties(props.campusKey, text)
        .then((societies) => {
          props.updateSearchResult(societies);

          updateReduxSocieties(societies, props.societies);
        })
        .catch((err) => {
          console.warn('Could not get searched events', err);
          props.updateSearchResult([], true);
        });
    }
  }
};
