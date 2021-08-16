import React from 'react';
import {Text, View} from 'react-native';
import {db, auth} from '../../../assets/Firebase/Firebase';
import {analytics} from '../../../assets/Analytics';
import {ModalTop} from '../../../assets/ModalTop';
import {FlatList} from 'react-native';
import {FetchError} from '../../../assets/FetchError/FetchError';
import {GlobalStyle} from '../../../assets/GlobalStyle';
import {StyleSheet} from 'react-native';
import {RefreshControl} from 'react-native';
import * as Animatable from 'react-native-animatable';
import {Store} from '../../../assets/redux/store';
import {PointsReferralButton} from './components/ReferralButton';

export class PointEvents extends React.Component {
  constructor() {
    super();
    this.state = {
      lastUpdate: false,
      init: false,
      refreshing: false,
      pointEvents: [],
    };
  }
  componentDidMount() {
    this.getPointEvents(true);
  }
  render() {
    return (
      <View>
        <ModalTop
          title={'Points'}
          subTitle={
            this.state.lastUpdate &&
            `Last updated: ${this.state.lastUpdate
              .toTimeString()
              .substring(0, 5)}`
          }
          onPress={this.props.navigation.goBack}
        />
        <FlatList
          data={this.state.pointEvents.sort(sortPointEvents)}
          style={styles.flatlist}
          contentInset={{bottom: GlobalStyle.Measurements.height * 0.15}}
          refreshControl={
            <RefreshControl
              refreshing={this.state.refreshing}
              onRefresh={this.getPointEvents}
            />
          }
          contentContainerStyle={styles.flatlistContainer}
          renderItem={this.renderItem}
          ListEmptyComponent={
            !this.state.refreshing &&
            this.state.init && (
              <FetchError
                style={{marginTop: GlobalStyle.Measurements.margin * 2}}
                showButton
                onPress={this.getPointEvents}
                errorText={
                  "We couldn't get the points at your university\nPlease try again later"
                }
              />
            )
          }
        />
      </View>
    );
  }
  renderItem = ({item, index}) => {
    // Show a referral button for the referral component
    const showReferralButton = item.key === 'confirmedReferralInvite';

    return (
      <Animatable.View
        style={styles.itemContainer}
        animation={'fadeInUpBig'}
        duration={500}
        delay={50 * index}>
        <View style={styles.row}>
          <View style={styles.itemTextContainer}>
            <Text style={GlobalStyle.TextStyle.bodyLargeBold}>{item.name}</Text>
            <Text style={GlobalStyle.TextStyle.bodySmall}>{item.criteria}</Text>
          </View>
          <Text style={styles.pointText}>{item.points} points</Text>
        </View>
        {showReferralButton && (
          <PointsReferralButton
            parentStyle={styles.itemContainer}
            navigate={this.props.navigation.push}
          />
        )}
      </Animatable.View>
    );
  };
  getPointEvents = (refreshing = false) => {
    this.setState({refreshing});
    analytics.breadcrumb(
      `Getting point events, refreshing = ${refreshing}`,
      'PointEvents',
      'getPointEvents',
    );
    setTimeout(() => {
      db.collection('campuses')
        .doc(this.props.store.app.campus.key)
        .collection('data')
        .doc('point_system')
        .get()
        .then((doc) => {
          Store.dispatch({
            type: 'UPDATE_CAMPUS_POINT_SYSTEM',
            payload: doc.data(),
          });
          this.setState({pointEvents: doc.data().point_events, error: false});
        })
        .catch((err) => {
          this.setState({error: true});
          analytics.error(err, 'PointEvents', 'getPointEvents');
        })
        .finally(() =>
          this.setState({
            refreshing: false,
            lastUpdate: new Date(),
            init: true,
          }),
        );
    }, 1000);
  };
}

const styles = StyleSheet.create({
  flatlist: {
    height: GlobalStyle.Measurements.height,
  },
  flatlistContainer: {
    paddingVertical: GlobalStyle.Measurements.marginQuarter,
  },
  itemContainer: {
    width: GlobalStyle.Measurements.width * 0.9,
    borderRadius: GlobalStyle.Measurements.unit,
    padding: GlobalStyle.Measurements.margin,

    backgroundColor: GlobalStyle.Palettes.background.palette6,
    marginVertical: GlobalStyle.Measurements.marginQuarter,

    alignSelf: 'center',
    alignItems: 'center',
    justifyContent: 'center',
  },
  row: {
    alignItems: 'center',
    justifyContent: 'space-between',
    flexDirection: 'row',
  },
  itemTextContainer: {
    width: GlobalStyle.Measurements.width * 0.6,
  },
  pointText: {
    ...GlobalStyle.TextStyle.levelText,
    fontSize: GlobalStyle.TextStyle.bodyRegular.fontSize,
  },
});

function sortPointEvents(a, b) {
  return b.points - a.points;
}
