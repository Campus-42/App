import React from 'react';
import {StyleSheet, View, Pressable, TextInput} from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import FontAwesome5Icon from 'react-native-vector-icons/FontAwesome5';
import {GlobalStyle} from '../../../../assets/GlobalStyle';
import {CampusMapFuncs} from '../functions';
import {QueryView} from './QueryView';

export class MapHeader extends React.Component {
  constructor() {
    super();
    this.textinput = React.createRef();
    this.state = {
      queryData: [],
    };
  }
  queryMapFeatures = (text) => {
    const clear = !text.replace(/\s/g, '').length;
    if (!clear) {
      const queryData = CampusMapFuncs.queryMapFeatures(
        text,
        this.props.mapFeatures,
      );
      this.setState({queryData});
    }
  };
  clearQuery = () => {
    this.setState({queryData: []});
  };

  render() {
    return (
      <LinearGradient
        colors={['#ffffff90', '#ffffff00']}
        start={{x: 0, y: 0.1}}
        end={{x: 0, y: 1}}
        style={styles.container}>
        <View style={styles.searchTopWrapper}>
          <Pressable
            style={[
              styles.searchContainer,
              this.state.queryData.length > 0 && styles.searchIsActive,
            ]}
            onPress={() => this.textinput.current.focus()}>
            <View style={styles.icon}>
              <FontAwesome5Icon name={'search'} color={'#aaa'} />
            </View>
            <TextInput
              ref={this.textinput}
              placeholder={'Search your campus'}
              style={styles.textinput}
              onChangeText={this.queryMapFeatures}
              clearButtonMode={'while-editing'}
            />
          </Pressable>
          <QueryView
            data={this.state.queryData}
            selectFeature={(item) => {
              this.props.selectFeature(item);
              this.clearQuery();
            }}
          />
        </View>
        <Pressable
          style={{marginTop: GlobalStyle.Measurements.height * 0.01}}
          onPress={this.props.goBack}
          hitSlop={7}>
          <FontAwesome5Icon
            name={'chevron-down'}
            size={GlobalStyle.Measurements.unit}
            color={GlobalStyle.ColorStyle.blueButtonText}
          />
        </Pressable>
      </LinearGradient>
    );
  }
}

const ICON_SIZE = GlobalStyle.Measurements.unit;
const VIEW_SIZE = ICON_SIZE * 1.75;

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    width: GlobalStyle.Measurements.width,
    flexDirection: 'row',
    minHeight: GlobalStyle.Measurements.height * 0.12,
    alignItems: 'flex-start',
    justifyContent: 'space-between',
    paddingHorizontal: GlobalStyle.Measurements.margin,
    paddingTop: GlobalStyle.Measurements.height * 0.02,
    paddingBottom: GlobalStyle.Measurements.height * 0.04,
  },
  searchContainer: {
    height: VIEW_SIZE,
    width: GlobalStyle.Measurements.width * 0.8,
    borderRadius: VIEW_SIZE / 2,

    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  textinput: {
    ...GlobalStyle.TextStyle.textInputSmall,
    height: VIEW_SIZE,
    width: GlobalStyle.Measurements.width * 0.65,
  },
  icon: {
    height: VIEW_SIZE,
    width: VIEW_SIZE,
    alignItems: 'center',
    justifyContent: 'center',
  },
  searchIsActive: {
    borderBottomRightRadius: 0,
    borderBottomLeftRadius: 0,
  },
  searchTopWrapper: {
    shadowRadius: 5,
    shadowColor: '#000',
    shadowOffset: {width: 0, height: 3},
    shadowOpacity: 0.15,
    elevation:10,

    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',

    borderRadius: VIEW_SIZE / 2,

    backgroundColor: GlobalStyle.Palettes.background.palette6,
    zIndex: 3,
  },
});
