import React from 'react';
import {RefreshControl, Text} from 'react-native';
import {ScrollView, View} from 'react-native';
import {Campus} from '../../../assets/Campus';
import {GlobalStyle} from '../../../assets/GlobalStyle';
import {AdminPreviewStats} from './components/AdminPreviewStats';
import {SubmittedSocietiesCarousel} from './components/SubmittedSocietiesCarousel';

export class AdminPanel extends React.Component {
  constructor() {
    super();
    this.state = {
      submittedSocieties: null,
      pendingReportedUsers: null,
    };
  }

  componentDidMount() {
    this.refresh(false);
  }

  render() {
    const isLoading = !(
      this.state.submittedSocieties && this.state.pendingReportedUsers
    );
    return (
      <View style={{flex: 1}}>
        <GlobalStyle.Header
          title={'Admin Panel'}
          navigation={this.props.navigation}
          destinationType={'openDrawer'}
          badgeKey={"admin-panel"}
        />
        <ScrollView
          {...GlobalStyle.Props.backgroundScrollView}
          refreshControl={
            <RefreshControl
              onRefresh={this.refresh}
              refreshing={this.state.refreshing}
            />
          }>
          <AdminPreviewStats />
          <SubmittedSocietiesCarousel
            isLoading={isLoading}
            data={this.state.submittedSocieties}
            colors={this.props.store.app.campus.colors}
            navigate={this.props.navigation.navigate}
          />
        </ScrollView>
      </View>
    );
  }

  refresh = (refreshing = true) => {
    refreshing && this.setState({refreshing});

    const campusKey = this.props.store.app.campus.key;

    Campus.Funcs.admin
      .fetchSubmittedSocieties(campusKey)
      .then((submittedSocieties) => this.setState({submittedSocieties}))
      .catch(() => this.setState({submittedSocieties: []}));

    Campus.Funcs.admin
      .fetchPendingReportedUsers(campusKey)
      .then((pendingReportedUsers) => this.setState({pendingReportedUsers}))
      .catch(() => this.setState({pendingReportedUsers: false}));

    this.setState({refreshing: false});
  };
}
