import React from 'react';
import {ScrollView, View, SafeAreaView} from 'react-native';
import {GlobalStyle} from '../../../assets/GlobalStyle/index';
import {styles} from './style';
import {ActionButtons} from './components/ActionButtons';
import {analytics} from '../../../assets/Analytics';

export class ManageSocietyFocus extends React.Component {
  componentDidMount() {
    
  }
  render() {
    return (
      <View {...GlobalStyle.Props.backgroundScrollView} style={styles.top}>
        <GlobalStyle.Header
          navigation={this.props.navigation}
          destinationType="goBack"
          title={this.props.store.society.manageSocietyFocus.name}
        />
        <ScrollView
          {...GlobalStyle.Props.backgroundScrollView}
          scrollEnabled={false}
          style={styles.scroll}>
          <ActionButtons
            navigation={this.props.navigation}
            colors={this.props.store.app.campus.colors}
            society={this.props.store.society.manageSocietyFocus}
          />
        </ScrollView>
      </View>
    );
  }
}
