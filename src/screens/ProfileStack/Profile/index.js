import React from 'react';
import {Text, ScrollView, View, TouchableOpacity} from 'react-native';
import {styles} from './style';
import {UserImage} from './components/UserImage';
import {GlobalStyle} from '../../../assets/GlobalStyle';
import {ProfileButtons} from './components/ProfileButtons';
import {ProfileFuncs} from './functions';
import {auth, db} from '../../../assets/Firebase/Firebase';
import {
  getSignedInUserInfo,
  uploadImage,
} from '../../../assets/Firebase/functions';
import {analytics} from '../../../assets/Analytics';
import {Pressable} from 'react-native';
import {Campus} from '../../../assets/Campus';
import {Alert} from 'react-native';
import {ActivityIndicator} from 'react-native';
import {Button} from 'react-native';
import deviceInfoModule from 'react-native-device-info';

export class Profile extends React.Component {
  constructor() {
    super();
    this.state = {
      loadingImage: false,
    };
  }
  componentDidMount() {}

  render() {
    return (
      <View style={GlobalStyle.ViewStyle.backgroundView}>
        <GlobalStyle.Header
          navigation={this.props.navigation}
          destinationType="openDrawer"
        />
        <ScrollView {...GlobalStyle.Props.backgroundScrollView}>
          <TouchableOpacity
            onPress={this.changeProfileImage}
            style={styles.imageWrapper}>
            <UserImage
              style={styles.userImageContainer}
              user={this.props.store.user}
              colors={this.props.store.app.campus.colors}
              campusPointSystem={this.props.store.app.campus_point_system}
            />
            {this.state.loadingImage && (
              <View style={styles.loadingContainer}>
                <ActivityIndicator
                  size={styles.loadingContainer.width * 0.75}
                />
              </View>
            )}
          </TouchableOpacity>
          <GlobalStyle.UI.UserLevels
            user={this.props.store.user}
            campusPointSystem={this.props.store.app.campus_point_system}
            campus={this.props.store.app.campus}
            show={true}
            showTitle={false}
            navigate={this.props.navigation.navigate}
          />
          <ProfileButtons
            navigation={this.props.navigation}
            colors={this.props.store.app.campus.colors}
            unclaimedNotifications={
              this.props.store.user.unclaimed_notifications
            }
            isCampus42Admin={this.props.store.user.campus42_admin}
            showPopup={this.props.route.params.showPopup}
          />
          <TouchableOpacity
            style={[
              GlobalStyle.ButtonStyle.DestructiveTextButton,
              {padding: 10},
            ]}
            onPress={ProfileFuncs.signOut}>
            <Text
              style={[
                GlobalStyle.ButtonStyle.DestructiveTextButton,
                {marginVertical: 0},
              ]}>
              Sign Out
            </Text>
          </TouchableOpacity>
          <Text style={styles.appVersion}>
            Version {deviceInfoModule.getVersion()}
          </Text>
        </ScrollView>
      </View>
    );
  }
  changeProfileImage = () => {
    const uid = this.props.store.user.uid;

    Campus.Funcs.images.selectImage((res) => {
      if (res.error) onImageError(res.error);
      else if (!res.cancelled) {
        this.setState({loadingImage: true});
        uploadImage(['users', uid], res.uri)
          .then((doc) => {
            db.collection('users')
              .doc(uid)
              .update({image: doc.uri})
              .then(() => this.setState({loadingImage: false}))
              .catch((err) => {
                onImageError(err);
                this.setState({loadingImage: false});
              });
          })
          .catch((err) => {
            onImageError(err);
            this.setState({loadingImage: false});
          });
      }
    });
  };
}
const onImageError = (err) => {
  Alert.alert(
    'Image',
    'Something went wrong changing your profile image, we apologize',
  );
  analytics.error(err, 'Profile/index.js', 'changeProfileImage()');
};
