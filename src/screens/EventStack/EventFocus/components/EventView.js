import React from 'react';
import {View, TouchableOpacity, Text, Platform} from 'react-native';
import {MapView} from './MapView';
import {Icons} from './Icons';
import PropTypes from 'prop-types';
import {GlobalStyle} from '../../../../assets/GlobalStyle';
import {styles} from '../style';
import {SocietyButtons} from './SocietyButtons';
import {auth} from '../../../../assets/Firebase/Firebase';
import Skeleton from 'react-native-skeleton-content-nonexpo';
import {eventFocusSkeletonLayout} from './Skeleton';
import {FetchError} from '../../../../assets/FetchError/FetchError';
import {BookmarkButton} from '../../../../assets/GlobalStyle/UI/BookmarkButton';
import FontAwesome5Icon from 'react-native-vector-icons/FontAwesome5';

const ERROR_ICON_SIZE = GlobalStyle.Measurements.unit * 0.9;

export class EventView extends React.Component {
  constructor() {
    super();
    this.state = {
      joinedSociety: false, // When user has joined this will be set to true and remove th join society button. This is only temporary
    };
  }
  render() {
    return (
      <Skeleton
        style={{
          alignItems: 'center',
          width: GlobalStyle.Measurements.width,
          flex: 1,
        }}
        isLoading={this.props.event._loading}
        layout={eventFocusSkeletonLayout}>
        {!this.props.error ? (
          <View style={{flex: 1}}>
            <View style={styles.titleContainer}>
              {this.props.event.end_ms < Date.now() && (
                <View
                  style={{
                    flexDirection: 'row',
                    alignItems: 'center',
                    justifyContent: 'center',
                  }}>
                  <View
                    style={{
                      height: ERROR_ICON_SIZE,
                      width: ERROR_ICON_SIZE,
                      borderRadius: ERROR_ICON_SIZE,
                      backgroundColor: GlobalStyle.ColorStyle.redButtonText,
                      marginRight: 10,
                      alignItems: 'center',
                      justifyContent: 'center',
                    }}>
                    <FontAwesome5Icon
                      name={'exclamation'}
                      size={ERROR_ICON_SIZE / 2}
                      color={'#fff'}
                    />
                  </View>
                  <Text
                    style={[
                      GlobalStyle.TextStyle.bodyRegular,
                      {color: GlobalStyle.ColorStyle.redButtonText},
                    ]}>
                    Event has already ended
                  </Text>
                </View>
              )}
            </View>

            <GlobalStyle.UI.Image
              resize
              style={styles.backgroundImage}
              navigate={this.props.navigation.navigate}
              source={{
                uri:
                  this.props.event.images.background ||
                  this.props.event.images.preview ||
                  '',
              }}
            />

            <Icons
              event={this.props.event}
              openMap={this.openMap}
              navigation={this.props.navigation}
            />
            <GlobalStyle.UI.Text
              text={this.props.event.description}
              style={styles.text}
              navigation={this.props.navigation}
            />
            {this.props.event.scraped_event && (
              <View style={styles.labelContainer}>
                <Text style={styles.labelText}>Automated Event</Text>
              </View>
            )}
            {this.props.event.location.show && (
              <MapView
                location={this.props.event.location}
                colors={this.props.colors}
              />
            )}
            {this.props.fetchedSociety && (
              <View style={styles.societyContainer}>
                <Text style={styles.title}>{this.props.societyInfo.name}</Text>
                <GlobalStyle.UI.Text
                  navigation={this.props.navigation}
                  text={this.props.societyInfo.description}
                  style={styles.text}
                />
                <SocietyButtons
                  alreadyMember={
                    this.props.societyInfo.members.includes(
                      auth.currentUser.uid,
                    ) || this.state.joinedSociety
                  }
                  event={this.props.event}
                  society={this.props.societyInfo}
                  colors={this.props.colors}
                  showSocietyPreview={this.showSocietyPreview}
                  navigation={this.props.navigation}
                />
              </View>
            )}
            {this.props.openInviteView &&
              this.props.event.end_ms > Date.now() && (
                <GlobalStyle.UI.GreyBackgroundButton
                  title={'Invite friends'}
                  onPress={this.props.openInviteView}
                  icon={'users'}
                />
              )}
            {this.props.event.bubble_id && this.props.hasJoined && (
              <GlobalStyle.UI.GreyBackgroundButton
                title={'Go to bubble'}
                onPress={() =>
                  this.props.navigation.push('Bubble Focus', {
                    id: this.props.event.bubble_id,
                    type: 'bubble',
                  })
                }
                icon={'comments'}
              />
            )}
          </View>
        ) : (
          <View
            style={{
              flex: 1,
              height: GlobalStyle.Measurements.height * 0.6,
              alignItems: 'center',
              justifyContent: 'center',
            }}>
            <FetchError
              errorText={"We couldn't fetch the event\nPlease try again later"}
            />
          </View>
        )}
      </Skeleton>
    );
  }
  openMap = () => {
    console.log('OPEN MAP');
  };
  openWeb = () => {
    console.log('OPEN WEB');
  };
  showSocietyPreview = () => {
    this.props.navigation.navigate('Society Preview', {
      id: this.props.societyInfo.id,
    });
    // this.props.showSocietyLoading();
    // joinSociety(
    //   this.props.user,
    //   this.props.campusKey,
    //   this.props.societyInfo.id,
    // )
    //   .then(() => {
    //     this.props.showSocietyConfirmation(false);
    //     this.setState({joinedSociety: true});
    //   })
    //   .catch((err) => {
    //     this.props.showSocietyConfirmation(true);
    //     console.warn('Could not join society', err);
    //   });
  };
}

EventView.defaultProps = {
  hasFetchedSociety: false,
  societyInfo: {},
  colors: {main: '#000'},
  event: {},
  editing: false,
  openInviteView: () => {},
};
EventView.propTypes = {
  state: PropTypes.object,
  editing: PropTypes.bool,
  openInviteView: PropTypes.func,
};
