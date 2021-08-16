import React from 'react';
import {View, ScrollView, Text} from 'react-native';
import {GlobalStyle} from '../../../../../assets/GlobalStyle';
import {MessageFuncs} from '../../../Bubbles/functions';
import {getMemberNames} from '../../../Bubbles/components/MessageRow';
import {styles} from '../../style';
import {BubbleInfoHeader} from './BubbleInfoHeader';
import {UserComponent} from '../../../../../assets/InviteView/UserComponent';
import {uploadImage} from '../../../../../assets/Firebase/functions';
import {Campus} from '../../../../../assets/Campus';
import {Alert} from 'react-native';
import {auth, db, functions} from '../../../../../assets/Firebase/Firebase';
import {TextInput} from 'react-native';
import {InviteView} from '../../../../../assets/InviteView';
import {ActivityIndicator} from 'react-native';
import {UserLeaderboard} from '../../../../../assets/UserLeaderboard';
import {FooterButtons} from './FooterButtons';
import {TouchableOpacity} from 'react-native';
import {analytics} from '../../../../../assets/Analytics';
import Entypo from 'react-native-vector-icons/Entypo';

export function BubbleInfo(props) {
  const type = props.isChannel ? 'channel' : 'bubble';
  const isPinned = ((props.user.bookmarks || {})[type] || []).includes(
    props.bubble.id,
  );

  const uid = auth.currentUser !== null ? auth.currentUser.uid : '-';
  const name = props.bubble.name || getMemberNames(props.bubble.member_names);
  const hasAccess =
    ((props.bubble.admins || []).includes(uid) ||
      props.bubble.__type == 'private_bubble') &&
    props.bubble.member_uids.includes(auth.currentUser.uid);

  const [img, setImg] = React.useState(false);
  const [loadingImage, setLoadingImage] = React.useState(false);
  const [tempName, setName] = React.useState(false);
  const [showInviteView, setShowInviteView] = React.useState(false);
  const [pendingPin, setPendingPin] = React.useState(false);

  function updateImg(res) {
    // Update the bubble and the state of the bubble info only
    db.collection('bubbles')
      .doc(props.bubble.id)
      .update({image: res})
      .then(() => setImg(res))
      .then(() => props.getConversation())
      .catch((err) => {
        Alert.alert(
          'Bubble Image',
          "Something went wrong, we couldn't update the image right now",
        );
      });
  }
  function updateName(text) {
    console.log('CHange to', text);
    // Check membership
    const isMember = Campus.Funcs.bubble.isUserMember(
      props.bubble.member_uids,
      props.navigation.goBack,
    );
    if (!isMember) return;

    // Update the bubble and the state of the bubble info only
    db.collection('bubbles')
      .doc(props.bubble.id)
      .update({name: text.trim()})
      .then(() => setName(text))
      .then(() => sendNewNameMessage(props.bubble))
      .then(() => props.getConversation())
      .then(() =>
        Alert.alert('Bubble name', 'Successfully updated the bubble name'),
      )
      .catch((err) => {
        analytics.error(err, 'BubbleInfo', 'updateName');
        Alert.alert(
          'Bubble Info',
          "Something went wrong, we couldn't update the name right now",
        );
      });
  }

  function leaveBubble() {
    MessageFuncs.toggleSignedInUserIsAMember(
      props.bubble,
      props.user,
      'leave',
    ).then(() => {
      analytics.leftBubble(props.bubble);
      props.navigation.goBack();
    });
  }
  function askLeave() {
    Alert.alert('Leave Bubble', 'Are you sure you want to leave the bubble?', [
      {
        text: 'Leave',
        style: 'destructive',
        onPress: leaveBubble,
      },
      {text: 'Cancel'},
    ]);
  }
  function togglePinnedBubble() {
    setPendingPin(true);
    Campus.Funcs.user
      .toggleBookmark(props.bubble.id, type, !isPinned)
      .then(console.log)
      .catch(console.warn)
      .finally(() => setPendingPin(false));
  }

  const leaderboardUsers = Object.values(props.bubble.member_names).filter(
    (e) => {
      return props.bubble.member_uids.includes(e.id || e._id || e.uid);
    },
  );

  return (
    <React.Fragment>
      <View {...GlobalStyle.Props.focusBackgroundViewWhite}>
        <BubbleInfoHeader
          onPress={() => props.goBack()}
          title={tempName || name}
        />
        <ScrollView
          style={styles.infoContainer}
          contentInset={{bottom: GlobalStyle.Measurements.height * 0.1}}
          contentContainerStyle={{alignItems: 'center', alignSelf: 'center'}}>
          {((props.bubble.member_uids || []).length > 2 ||
            props.bubble.__type !== 'private_bubble') && (
            <TouchableOpacity
              style={styles.infoImageWrapper}
              disabled={
                props.bubble.__type !== 'private_bubble' ||
                (props.bubble.member_uids || []).length < 2
              }
              onPress={() =>
                hasAccess &&
                changeImage(
                  props.bubble,
                  updateImg,
                  setLoadingImage,
                  props.navigation,
                )
              }>
              <GlobalStyle.UI.Image
                source={{uri: img || props.bubble.image}}
                style={styles.infoImage}
              />
              {loadingImage && (
                <View style={styles.loadingContainer}>
                  <ActivityIndicator
                    size={styles.loadingContainer.width * 0.75}
                  />
                </View>
              )}
            </TouchableOpacity>
          )}

          {hasAccess &&
            (props.bubble.member_uids || []).length > 2 &&
            props.bubble.__type == 'private_bubble' && (
              <GlobalStyle.UI.View style={styles.infoTextInputContainer}>
                <Text style={GlobalStyle.TextStyle.bodySmall}>Change name</Text>
                <TextInput
                  defaultValue={props.bubble.name || ''}
                  placeholder={'Give your bubble a name'}
                  style={styles.infoTextInput}
                  onSubmitEditing={({nativeEvent}) =>
                    updateName(nativeEvent.text)
                  }
                  clearButtonMode={'while-editing'}
                  maxLength={25}
                />
              </GlobalStyle.UI.View>
            )}
          {props.bubble.description && (
            <View style={styles.bubbleInfoComponentContainer}>
              <Text style={GlobalStyle.TextStyle.bodyLargeBold}>
                Description
              </Text>
              <Text style={[GlobalStyle.TextStyle.bodyRegular, {padding: 3}]}>
                {props.bubble.description}
              </Text>
            </View>
          )}
          {leaderboardUsers.length > 0 &&
            !['customer_service'].includes(props.bubble.__type) && (
              <UserLeaderboard users={leaderboardUsers} />
            )}
          {props.invitedUsers.length > 0 && (
            <React.Fragment>
              <Text style={styles.infoMembersText}>Invited</Text>
              {Object.values(props.invitedUsers).map((item, index) => (
                <UserComponent
                  key={`bubble_info_invited_${item.id}`}
                  user={item}
                  colors={props.campus.colors}
                  showIcon={false}
                  animation={false}
                  style={{opacity: 1}}
                  disabled
                  dontFadeDisabled
                  campusPointSystem={props.campusPointSystem}
                />
              ))}
            </React.Fragment>
          )}
          <TouchableOpacity
            style={styles.pinButtonContainer}
            onPress={togglePinnedBubble}>
            <Text style={GlobalStyle.TextStyle.bodyLargeBold}>
              {isPinned ? 'Unpin' : 'Pin'} {type}
            </Text>
            <View
              style={[
                styles.pinButtonIconContainer,
                !isPinned && {backgroundColor: '#ffffff00'},
              ]}>
              {pendingPin ? (
                <ActivityIndicator
                  size={styles.pinButtonIconContainer.width * 0.45}
                  color={'#eb8334'}
                />
              ) : (
                <Entypo
                  name={'pin'}
                  color={'#eb8334'}
                  size={styles.pinButtonIconContainer.width * 0.45}
                />
              )}
            </View>
          </TouchableOpacity>
          {props.bubble.__type == 'event' && props.bubble.linked_id && (
            // Must have the linked id to allow navigation
            <TouchableOpacity
              style={styles.pinButtonContainer}
              onPress={() =>
                props.navigation.navigate('Event Focus', {
                  id: props.bubble.linked_id,
                })
              }>
              <Text style={GlobalStyle.TextStyle.bodyLargeBold}>
                Go to event
              </Text>
              <View
                style={{
                  padding: GlobalStyle.Measurements.marginQuarter,
                  backgroundColor: GlobalStyle.ColorStyle.blueButtonText,
                  borderRadius: 100,
                }}>
                <Entypo
                  name={'chevron-right'}
                  color={'#fff'}
                  size={styles.pinButtonIconContainer.width * 0.6}
                />
              </View>
            </TouchableOpacity>
          )}

          {props.bubble.__type === 'private_bubble' && (
            <FooterButtons
              hasAccess={hasAccess}
              showInviteView={() => setShowInviteView(true)}
              askLeave={askLeave}
              showLeave={(props.bubble.member_uids || []).length > 2}
            />
          )}
        </ScrollView>
      </View>
      {props.bubble.id && (
        // Make sure there is a bubble id before allowing invite view to open
        <InviteView
          isActive={showInviteView}
          onClose={() => setShowInviteView(false)}
          campus={props.campus}
          campusPointSystem={props.campusPointSystem}
          obj={props.bubble}
          type={'bubble'}
          user={props.user}
          invitedUsers={props.invitedUsers.map((e) => e.uid)}
        />
      )}
    </React.Fragment>
  );
}

function changeImage(
  bubble,
  updateImg = () => {},
  setLoadingImage = () => {},
  navigation,
) {
  const isMember = Campus.Funcs.bubble.isUserMember(
    bubble.member_uids,
    navigation.goBack,
  );
  if (!isMember) return;

  const uploadPath = ['bubbles', bubble.id, 'bubble_image'];

  Campus.Funcs.images.selectImage(async (res) => {
    if (!res.error && !res.cancelled) {
      setLoadingImage(true);

      const upload = await uploadImage(uploadPath, res.uri, 'logo')
        .then((response) => {
          return response;
        })
        .catch((err) => {
          setLoadingImage(false);
          analytics.error(err, 'BubbleInfo', 'changeImage/uploadImage');
          Alert.alert(
            'Bubble Image',
            "Something went wrong, we couldn't update the image right now",
          );
        });

      if (upload.error) throw upload.error;

      const user =
        bubble.member_names[
          auth.currentUser !== null ? auth.currentUser.uid : '-'
        ];
      const creator_name = `${user.first_name} ${user.last_name}`;

      const msg = {
        system: true,
        __type: 'bubble_edit',
        creator: auth.currentUser !== null ? auth.currentUser.uid : '-',
        creator_name: creator_name,
        createdAt: new Date(),
        timestamp: new Date(),
        timestamp_ms: Date.now(),
        _id: `bubble_image_${Date.now()}`,
        bubble: bubble.id,
        __data: null,
        text: `${creator_name} changed the bubble image`,
      };

      functions
        .httpsCallable('createMessage')(msg)
        .then((doc) => {
          console.log('Uploaded image');
          setLoadingImage(false);
          updateImg(upload.uri);
        })
        .catch((err) => {
          analytics.error(err, 'BubbleInfo', 'changeImage');
          Alert.alert(
            'Bubble Image',
            "Something went wrong, we couldn't update the image right now",
          );
          setLoadingImage(false);
        });
    } else if (res.error) {
      analytics.error(res.error, 'BubbleInfo', 'changeImage');
      setLoadingImage(false);
      Alert.alert(
        'Bubble Image',
        "Something went wrong, we couldn't update the image right now",
      );
    }
  });
}

function sendNewNameMessage(bubble) {
  const user =
    bubble.member_names[auth.currentUser !== null ? auth.currentUser.uid : '-'];
  const creator_name = `${user.first_name} ${user.last_name}`;

  const msg = {
    system: true,
    __type: 'bubble_edit',
    creator: auth.currentUser !== null ? auth.currentUser.uid : '-',
    creator_name: creator_name,
    createdAt: new Date(),
    timestamp: new Date(),
    timestamp_ms: Date.now(),
    _id: `bubble_name_${Date.now()}`,
    bubble: bubble.id,
    __data: null,
    text: `${creator_name} changed the bubble name`,
  };
  functions
    .httpsCallable('createMessage')(msg)
    .then(() =>
      Alert.alert('Bubble Name', 'Successfully changed the bubble name'),
    )
    .catch((err) => {
      throw err;
    });
}
