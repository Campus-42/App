import React from 'react';
import {
  TouchableHighlight,
  View,
  Appearance,
  TextInput,
  Text,
  Dimensions,
  StyleSheet,
} from 'react-native';
import MaterialIcon from 'react-native-vector-icons/MaterialIcons';
import {createAnimatableComponent} from 'react-native-animatable';
import {triggerHaptic} from '../../../../assets/Haptic/hapticFeedback';
import {HomeFuncs} from '../functions';
import {GlobalStyle} from '../../../../assets/GlobalStyle';

const AnimatableMaterialIcon = createAnimatableComponent(MaterialIcon);

const CONTAINER_HEIGHT = GlobalStyle.Measurements.height * 0.06;

export class SearchBar extends React.Component {
  constructor() {
    super();
    this._icon = React.createRef();
    this._textinput = React.createRef();

    this.state = {
      searching: false,
      searchText: '',
    };
  }
  componentDidUpdate(prevProps) {
    if (prevProps.focusSearch == false && this.props.focusSearch)
      this._textinput.current.focus();
  }
  render() {
    const clear = this.state.searchText.replace(/\s/g, '').length
    const iconName = clear ? 'clear' : 'search';
    return (
      <TouchableHighlight
        style={styles.container}
        onPress={() => this._textinput.current.focus()}
        activeOpacity={0.5}
        underlayColor={'white'}>
        <React.Fragment>
          <TouchableHighlight
            disabled={!clear}
            underlayColor={this.props.colors.extraLight}
            activeOpacity={0.5}
            onPress={this.handleSearchPress}
            style={[styles.icon, {backgroundColor: this.props.colors.main}]}>
            <AnimatableMaterialIcon
              ref={this._icon}
              iterationCount="infinite"
              name={iconName}
              size={GlobalStyle.Measurements.unit}
              color="white"
            />
          </TouchableHighlight>
          <TextInput
            style={GlobalStyle.TextStyle.textInputSmall}
            onFocus={() => {
              this.props.switchSearchFocus('search');
              this.props.textInputIsFocused(true);
            }}
            onEndEditing={() => {
              if (!this.state.searchText.replace(/\s/g, '').length)
                this.props.switchSearchFocus('event');

              this.props.textInputIsFocused(false);
            }}
            placeholder={'Search for an event'}
            ref={this._textinput}
            onChangeText={this.search}
          />
        </React.Fragment>
      </TouchableHighlight>
    );
  }
  search = async (text) => {
    this.setState({searchText: text});
    // Show search panel
    if (!text.replace(/\s/g, '').length) this.props.switchSearchFocus('event');
    else {
      this.props.switchSearchFocus('search', true);

      HomeFuncs.searchEvent(this.props.campusKey, text, this.props.tags)
        .then((events) => {
          this.props.updateSearch(events);
        })
        .catch((err) => {
          console.warn('Could not search', err);
          this.props.updateSearch([], true);
        });
    }
  };

  handleSearchPress = () => {
    this._textinput.current.clear();
    this.setState({events: [], searchText: ''});
    this.props.switchSearchFocus('event');
    this.props.updateSearch([]);
  };
}

export const styles = StyleSheet.create({
  container: {
    width: GlobalStyle.Measurements.width * 0.9,
    alignSelf: 'center',
    height: CONTAINER_HEIGHT,
    flexDirection: 'row',
    backgroundColor: 'white',
    alignItems: 'center',
    justifyContent: 'flex-start',

    borderRadius: GlobalStyle.Measurements.unit,
    marginBottom: GlobalStyle.Measurements.marginQuarter,
  },
  icon: {
    width: CONTAINER_HEIGHT - GlobalStyle.Measurements.marginQuarter * 2.5,
    height: CONTAINER_HEIGHT - GlobalStyle.Measurements.marginQuarter * 2.5,
    margin: GlobalStyle.Measurements.marginQuarter,
    marginRight: GlobalStyle.Measurements.marginHalf,
    borderRadius: GlobalStyle.Measurements.unit / 1.2,
    alignItems: 'center',
    justifyContent: 'center',
  },
});
