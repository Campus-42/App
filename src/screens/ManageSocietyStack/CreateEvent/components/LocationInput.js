import React from 'react';
import {View, Text, RefreshControl, TextInput, ScrollView} from 'react-native';
import RNDatePicker from 'react-native-date-picker';
import {styles} from '../../ManageSocietyFocus/style';
import {GlobalStyle} from '../../../../assets/GlobalStyle';
import TouchableShrink from '../../../../assets/TouchableShrink/TouchableShrink';
import {DateFuncs} from '../../../../assets/Date';
import {searchPlace} from '../functions';
import * as Animatable from 'react-native-animatable';
import {SearchElementInScroll} from './SearchElementInScroll';

const AnimtableScrollView = Animatable.createAnimatableComponent(ScrollView);

export class LocationInput extends React.Component {
  constructor() {
    super();
    this._upper = React.createRef();
    this.addressInput = React.createRef();

    this.state = {
      search: '',
      //Results of search
      addressSearch: [],
      address: '',
      addressSearchStatus: '',
      loadingAddresses: false,
      name: '',
      coordinates: {lat: 0, lng: 0},
    };
  }
  componentDidMount() {
    this.animateScrollViews();
  }
  render() {
    return (
      <View
        style={[
          styles.pickerContainer,
          {
            alignItems: 'center',
            height: GlobalStyle.Measurements.height * 0.75,
          },
        ]}>
        <Text style={styles.heading}>{this.props.title}</Text>
        <View
          style={[
            styles.swipeUpContainer,
            {height: GlobalStyle.Measurements.height * 0.65},
          ]}>
          <GlobalStyle.UI.TextInput
            ref={this.addressInput}
            placeholder={'Search Address'}
            autoCapitalize={'words'}
            clearButtonMode={'while-editing'}
            onChangeText={(text) => this.setState({search: text})}
            onEndEditing={this.searchAddress}
            onFocus={() => this.animateScrollViews('upper')}
            showSearchIcon
          />
          <AnimtableScrollView
            ref={this._upper}
            style={{maxHeight: 0}}
            refreshControl={
              <RefreshControl
                onRefresh={this.searchAddress}
                refreshing={this.state.loadingAddresses}
              />
            }>
            {this.state.addressSearch.length > 0 ? (
              this.state.addressSearch.map((address) => {
                return (
                  <SearchElementInScroll
                    isSelected={
                      this.state.address ===
                      `${address.name}, ${address.formatted_address}`
                    }
                    textStyle={GlobalStyle.TextStyle.bodyRegular}
                    key={address.formatted_address}
                    colors={this.props.colors}
                    value={`${address.name}, ${address.formatted_address}`}
                    onPress={() => this.onElementChosen(address)}
                  />
                );
              })
            ) : this.state.loadingAddresses === false &&
              this.state.addressSearchStatus !== '' ? (
              <this.FetchError />
            ) : null}
          </AnimtableScrollView>

          <GlobalStyle.UI.TextInput
            ref={this.nameInput}
            autocorrect={false}
            placeholder={'Where in Building e.g. Room 3'}
            autoCapitalize={'words'}
            clearButtonMode={'while-editing'}
            onChangeText={(text) => this.setState({name: text})}
            onEndEditing={this.updateParentState}
            onFocus={() => this.animateScrollViews('lower')}
          />
        </View>
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
          disabled={
            this.state.address.length == 0 && this.state.name.length == 0
          }
          showIcon
          icon="chevron-down"
          onPress={this.props.onSwipeUpViewClose}>
          <Text style={GlobalStyle.TextStyle.buttonLarge}>Continue</Text>
        </TouchableShrink>
      </View>
    );
  }
  onElementChosen = (address) => {
    this.setState({
      coordinates: {
        latitude: address.geometry.location.lat,
        longitude: address.geometry.location.lng,
      },
      address: `${address.name ? `${address.name}, ` : ''}${
        address.formatted_address
      }`,
    });
    this.updateParentState();
  };
  updateParentState = () => {
    const {address, coordinates, name} = this.state;
    this.props.onLocationUpdate({
      ...coordinates,
      show: true,
      address: address,
      name: name,
    });
  };
  searchAddress = async () => {
    if (this.state.search != '') {
      this.addressInput.current.toggleLoading(true);
      //Don't perform search if user didn't enter anything
      this.setState({loadingAddresses: true});
      const result = await searchPlace(this.state.search);
      this.setState({
        addressSearch: result.data,
        addressSearchStatus: result.status,
        loadingAddresses: false,
      });
      this.addressInput.current.toggleLoading(false);
    }
  };
  animateScrollViews = (open = String) => {
    if (open === 'upper') {
      this._upper.current.transitionTo({maxHeight: scrollViewHeight});
    } else if (open === 'lower') {
      this._upper.current.transitionTo({maxHeight: 0});
    } else {
      this._upper.current.transitionTo({maxHeight: 0});
    }
  };
  FetchError = () => {
    // Specify text based on error
    var text = 'Oops, something went wrong.\nTry again later';
    if (this.state.addressSearchStatus === 'ZERO_RESULTS')
      text = "Oops, we couldn't find any addresses.\nSearch something else";
    else if (this.state.addressSearchStatus === 'INVALID_REQUEST')
      text = 'Oops, this search term is not valid.\nSearch something else';

    return (
      <View style={styles.scrollViewElementError}>
        <Text style={GlobalStyle.TextStyle.bodyLarge}>{text}</Text>
      </View>
    );
  };
}

const scrollViewHeight = GlobalStyle.Measurements.height * 0.3;
