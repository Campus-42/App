import React from 'react';
import {
  Text,
  ScrollView,
  View,
  FlatList,
  StyleSheet,
  RefreshControl,
} from 'react-native';
import {styles} from '../ManageSocietyFocus/style';
import {FetchError} from '../../../assets/FetchError/FetchError';
import {GlobalStyle} from '../../../assets/GlobalStyle/index';
import {ManageSocietyFuncs} from '../ManageSocietyFocus/functions';
import {ModalTop} from '../../../assets/ModalTop';
import {UserComponent} from '../../../assets/InviteView/UserComponent';
import TouchableShrink from '../../../assets/TouchableShrink/TouchableShrink';
import {analytics} from '../../../assets/Analytics';
import {getUsers} from '../../../assets/Firebase/functions';

// MEMORY LEAK

export class ManageMembers extends React.Component {
  constructor() {
    super();
    this.state = {
      members: [],
      newMembers: [],
      error: false,
      fetching: false,
    };
  }

  componentDidMount() {
    this.getMembers(false);
  }
  render() {
    return (
      <View style={styles.top}>
        <GlobalStyle.Header
          title={'Manage Members'}
          navigation={this.props.navigation}
          destinationType={'goBack'}
          colors={this.props.store.app.campus.colors}
        />
        <View style={styles.scroll}>
          {this.state.error ? (
            <View
              style={{
                height: GlobalStyle.Measurements.height * 0.8,
                justifyContent: 'center',
              }}>
              <FetchError
                errorText={
                  'Could not get members\nCheck internet and try again'
                }
              />
            </View>
          ) : (
            <View style={{flex: 1}}>
              <ScrollView
                {...GlobalStyle.Props.backgroundScrollView}
                refreshControl={
                  <RefreshControl
                    refreshing={this.state.fetching}
                    onRefresh={this.getMembers}
                  />
                }>
                {Object.values(this.state.members).map(this.renderItem)}
              </ScrollView>
            </View>
          )}
        </View>
      </View>
    );
  }
  renderItem = (item, index) => {
    return (
      <UserComponent
        style={{alignSelf: 'center'}}
        user={item}
        showIcon={false}
        colors={this.props.store.app.campus.colors}
        onPress={() => {}}
        disabled
        delay={1500}
        animation={'fadeInUpBig'}
        dontFadeDisabled
      />
    );
  };
  getMembers = async (fetching = true) => {
    this.setState({fetching: fetching});
    const society = this.props.store.society.manageSocietyFocus;
    const memberUids = [
      ...new Set(society.members.concat(society.exec_members)),
    ];

    getUsers(memberUids)
      .then((members) => {
        this.setState({
          members: members,
          error: false,
        });
      })
      .catch((err) => {
        console.warn('Could not get members of society');
        this.setState({error: true});
      })
      .finally(() => this.setState({fetching: false}));
  };
}
