import React from 'react';
import {View, Text, StyleSheet} from 'react-native';
import {UserImage} from '../../screens/ProfileStack/Profile/components/UserImage';
import {getCampusInfo, updateCampusPointSystem} from '../Firebase/functions';
import {AsyncStorage} from '../AsyncStorage/functions';
import {GlobalStyle} from '../GlobalStyle';
import {Stats} from './Stats';
import {analytics} from '../Analytics';
import {db} from '../Firebase/Firebase';
import {Store} from '../redux/store';
import {Campus} from '../Campus';

const CIRCLE_SIZE = GlobalStyle.Measurements.unit * 5;

export class UserImageWrapper extends React.Component {
  constructor() {
    super();
    this.unsubcribeUserListener = () => {};
    this.state = {
      campus: {
        key: 'university_of_buckingham',
        name: 'University of Buckingham',
        colors: {
          extraLight: '#cdeffe',
          light: '#9ee2ff',
          main: '#26b3f0',
        },
      },
      error: false,
      firstName: '',
      lastName: '',
      user: false,
      campusPoints: {},
    };
  }
  componentDidMount() {
    console.log(
      'User drawer received user',
      this.props.user.welcome_screens_visited,
    );

    this.setState({user: this.props.user});
    this.startUserListener(this.props.user.uid);

    const campus = this.props.user.campus;

    getCampusInfo(campus)
      .then((info) => this.setState({campus: info}))
      .catch((err) =>
        analytics.error(err, 'UserImageWrapper.js', 'getCampusInfo()'),
      );

    updateCampusPointSystem(campus)
      .then((campusPoints) => this.setState({campusPoints}))
      .catch((err) => analytics.error(err, 'UserImageWrapper', 'CustomDrawer'));

    AsyncStorage.getFullName()
      .then((names) =>
        this.setState({
          firstName: names.first,
          lastName: names.last,
        }),
      )
      .catch((err) =>
        analytics.error(err, 'UserImageWrapper.js', 'getFullName()'),
      );
  }
  componentWillUnmount() {
    this.endUserListener();
  }
  render() {
    return (
      <View style={styles.container}>
        <View style={styles.upperContainer}>
          <UserImage
            colors={this.state.campus.colors}
            style={{width: CIRCLE_SIZE, height: CIRCLE_SIZE}}
            user={this.state.user || this.props.user}
            campusPointSystem={this.state.campusPoints}
          />
          <Stats
            eventCount={this.state.user.event_count || 0}
            societyCount={(this.state.user.joined_societies || []).length}
            points={this.state.user.points || 0}
          />
        </View>
        <Text
          style={[
            GlobalStyle.TextStyle.bodyRegular,
            {color: GlobalStyle.Palettes.text.palette4},
          ]}>
          {this.state.campus.name}
        </Text>
      </View>
    );
  }

  startUserListener = (uid) => {
    this.unsubcribeUserListener = db
      .collection('users')
      .doc(uid)
      .onSnapshot(this.updateUser, (err) => {
        if (this.state.user === false)
          Campus.Funcs.points
            .triggerPointEvent(
              '_reload',
              this.props.screenProps.user.campus,
            )
            .catch(console.warn);

        analytics.error(err, 'UserImageWrapper', 'startUserListener()');
        this.endUserListener(true);
      });
  };
  updateUser = (snapShot) => {
    if (snapShot.data()) {
      const user = {
        ...snapShot.data(),
        points: snapShot.data().points.toString().replace(/\D/g, ''),
        uid: snapShot.id,
      };

      Store.dispatch({type: 'UPDATE_USER_INFO', payload: user});

      this.setState({user: {...user}});
    }
  };
  endUserListener = (restart = false) => {
    this.unsubcribeUserListener();
    restart &&
      setTimeout(() => this.startUserListener(this.props.user.uid), 500);
  };
}
const styles = StyleSheet.create({
  container: {
    flex: 2,
    marginTop: GlobalStyle.Measurements.margin,
    marginBottom: GlobalStyle.Measurements.margin * 1.5,
    alignItems: 'center',
    paddingTop: GlobalStyle.Measurements.margin * 2,
    justifyContent: 'space-around',
    backgroundColor: '#fff',
  },
  upperContainer: {
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: GlobalStyle.Measurements.marginHalf,
  },
});
