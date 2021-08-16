import React from 'react';
import {FlatList, Text, View, Animated} from 'react-native';
import {GlobalStyle} from '../../../assets/GlobalStyle';
import {ModalTop} from '../../../assets/ModalTop';
import {MessageFuncs} from '../Bubbles/functions';
import {auth, db, messaging} from '../../../assets/Firebase/Firebase';
import {TextInput} from './components/TextInput';
import {EventSocietySearch} from '../../../assets/EventSocietySearch';
import {getTagColors} from '../../../assets/Airtable/functions';
import {Message} from './components/Message';
import {Keyboard} from 'react-native';
import {Campus} from '../../../assets/Campus';
import {parseMessage, uploadImage} from '../../../assets/Firebase/functions';
import {BubbleInfo} from './components/BubbleInfo';
import {getMemberNames} from '../Bubbles/components/MessageRow';
import {AsyncStorage} from '../../../assets/AsyncStorage/functions';
import {analytics} from '../../../assets/Analytics';
import {Alert} from 'react-native';
import {styles} from './style';
import * as Animatable from 'react-native-animatable';
import {LoadingEarlier} from './components/LoadingEarlier';
import {MessageFocusPanel} from './components/MessageFocusPanel';
import KeyboardSpacer from 'react-native-keyboard-spacer';
import {DisabledView} from './components/DisabledView';
import {CacheFuncs} from '../../../assets/Cache';
import {NavigationCreatorLoading} from './components/NavigationCreatorLoading';
import {Platform} from 'react-native';

const AnimatedFlatList = Animated.createAnimatedComponent(FlatList);

export class BubbleFocus extends React.Component {
  constructor() {
    super();
    this.id = 'empty';
    this.listener; // messages listener
    this.header = 0; // Height of header
    this.modal = 0; // Height of modal
    this.mountedTimestamp = Date.now(); // The timestamp when the component mounted

    this.height = false; // Height of view
    this.textinput = false; // Height of textinput

    this.swiper = React.createRef();
    this.chat = React.createRef();
    this.flatlist = React.createRef();

    this.state = {
      messages: [],
      pending: [],
      errors: [],
      tempIds: {}, // the temporary ids will persist until the user goes out from bubble

      conversation: {member_names: {}, member_uids: [], name: '', admins: []},
      validChannelUids: [], // Only allows messages from these users if it is a channel
      loadingEarlier: true,
      showEventSearch: false,
      tagColors: {},
      noMorePrevMessages: false,
      keyboardShow: false,
      invitedUsers: [],
      tagColors: {},
      screenIndex: 0,
      init: false,
      messageFocus: false, // To show the message focus panel

      keyboardHeight: 200,

      swipe: new Animated.Value(0), // Animated value to show time stamps when swiping to the left
    };
  }
  componentDidMount() {
    this.setKeyboardListener();
    this.setState({loadingEarlier: true});

    const params = {id: 'empty', type: 'bubble', ...this.props.route.params};
    this.id = params.id;
    this.type = params.type;

    console.log('Type is', this.type);

    /**
     * If the user taps a bubble creation button then a
     * a new bubble will be created with either a person
     * or an organisation (societies...)
     *
     * else the bubble will be fetched
     */
    if (params.creation) this.onNavigationCreation();
    else {
      setTimeout(() => this.getConversation(true), 750);

      Campus.Funcs.notifications.setActiveType('bubbles', params.id);
    }
  }
  setKeyboardListener = () => {
    // Set the keyboard height
    this.onWillShow = Keyboard.addListener('keyboardDidShow', (e) => {
      console.log('Keyboard height', e.endCoordinates.height);
      this.setState({keyboardHeight: e.endCoordinates.height});
    });
  };
  componentWillUnmount() {
    try {
      Campus.Funcs.bubble.updateOfflineTimestamp(
        this.id,
        this.type,
        this.props.store.app.campus.key,
      );
      Campus.Funcs.notifications.setActiveType(false, false);
      clearTimeout(this.listener);
      this.onWillShow.remove();
    } catch (err) {
      console.warn('Component will unmount error bubble focus', err);
    }
  }

  render() {
    const loading = !this.state.conversationInit;

    return (
      <View
        onLayout={({nativeEvent}) =>
          this.height === false && (this.height = nativeEvent.layout.height)
        }
        style={GlobalStyle.ViewStyle.backgroundView}>
        {this.state.screenIndex == 0 ? (
          <Animatable.View
            {...GlobalStyle.Props.focusBackgroundViewWhite}
            animation={this.state.init && 'fadeInLeft'}
            duration={500}
            useNativeDriver
            onLayout={({nativeEvent}) => {
              this.modal = nativeEvent.layout.height;
            }}
            style={styles.messageContainer}>
            <ModalTop
              isPinned={true}
              onPinPress={() => {}}
              title={
                this.state.conversation.name ||
                getMemberNames(this.state.conversation.member_names)
              }
              onTitlePress={() => {
                this.setState({screenIndex: 1 - this.state.screenIndex});
              }}
              subTitle={'Click to see bubble info'}
              onPress={this.props.navigation.goBack}
              onLayout={({nativeEvent}) =>
                this.header === false &&
                (this.header = nativeEvent.layout.height)
              }
            />
            <AnimatedFlatList
              ref={this.flatlist}
              style={[
                styles.flatlist,
                {
                  height:
                    (this.height || 0) -
                    (this.header || 0) -
                    (this.textinput || 0),
                },
                this.type === 'channel' &&
                  !this.state.conversation.can_respond && {
                    paddingTop: 30,
                  },
              ]}
              onTouchStart={() => this.setState({touchingFlatList: true})}
              onTouchEnd={() => this.setState({touchingFlatList: false})}
              data={this.state.messages}
              renderItem={this.renderItem}
              inverted
              keyboardShouldPersistTaps={'handled'}
              onEndReached={() =>
                !this.state.loadingEarlier ? this.getPrevMessages() : {}
              }
              onEndReachedThreshold={0}
              onScrollBeginDrag={() => Keyboard.dismiss()}
              contentInset={{bottom: 0, top: 0}}
              ListFooterComponent={
                <LoadingEarlier
                  loadMore={this.getPrevMessages}
                  isLoadingEarlier={this.state.loadingEarlier}
                  show={
                    (this.state.messages.length > 0 &&
                      !this.state.noMorePrevMessages) ||
                    (loading && !this.state.creatingNewBubble)
                  }
                />
              }
              ListHeaderComponent={
                this.disabled && !loading ? (
                  <DisabledView
                    reason={this.state.conversation.disabled_reason}
                  />
                ) : (
                  <KeyboardSpacer
                    topSpacing={
                      Platform.OS === 'android' ? -this.state.keyboardHeight : 0
                    }
                  />
                )
              }
            />

            {!this.disabled &&
              !loading &&
              ((this.type == 'channel' &&
                this.state.conversation.can_respond) ||
                this.type !== 'channel') && (
                <TextInput
                  onLayout={({nativeEvent}) => {
                    if (this.textinput === false)
                      this.textinput = nativeEvent.layout.height;
                  }}
                  colors={this.props.store.app.campus.colors}
                  showEventSearch={() => this.setState({showEventSearch: true})}
                  selectImage={this.selectImage}
                  keyboardShow={this.state.keyboardShow}
                  send={this.send}
                  conversation={this.id}
                  sendSubText={
                    this.type == 'channel' &&
                    (this.isChannelAdmin
                      ? 'This message will be sent as a channel message to all members'
                      : 'This message will only be seen by the admins of the channel')
                  }
                  showMessageFocus={this.state.messageFocus !== false}
                />
              )}
            {this.state.creatingNewBubble && (
              <NavigationCreatorLoading
                created={this.state.createdNewBubble}
                error={this.state.errorCreatingNewBubble}
                goBack={this.props.navigation.goBack}
              />
            )}
            <EventSocietySearch
              isActive={this.state.showEventSearch}
              onClose={() => this.setState({showEventSearch: false})}
              store={this.props.store}
              navigation={this.props.navigation}
              onSelect={this.onSelect}
            />
            <MessageFocusPanel
              isActive={this.state.messageFocus !== false}
              onClose={() => {
                this.setState({messageFocus: false});
                this.startListening();
              }}
              store={this.props.store}
              tagColors={this.state.tagColors}
              campus={this.props.store.app.campus}
              navigate={this.props.navigation.navigate}
              message={
                this.state.messages[
                  this.state.messages.findIndex(
                    (m) => m.id === this.state.messageFocus,
                  )
                ]
              }
              bubble={this.state.conversation}
            />
          </Animatable.View>
        ) : (
          this.state.screenIndex == 1 && (
            <Animatable.View
              animation={'fadeInRight'}
              useNativeDriver
              style={{flex: 1}}
              duration={500}>
              <BubbleInfo
                ref={this.screen2}
                goBack={() => {
                  this.setState({screenIndex: 1 - this.state.screenIndex});
                  this.startListening();
                  this.setState({init: true});
                }}
                getConversation={this.getConversation}
                bubble={this.state.conversation}
                isChannel={this.type === 'channel'}
                campus={this.props.store.app.campus}
                invitedUsers={this.state.invitedUsers}
                user={this.props.store.user}
                navigation={this.props.navigation}
                onPressTest={this.getBubble}
                campusPointSystem={this.props.store.app.campus_point_system}
              />
            </Animatable.View>
          )
        )}
      </View>
    );
  }
  renderItem = ({item, index}) => {
    const nextMessage = index !== 0 && this.state.messages[index - 1];
    const nextCreator = nextMessage && nextMessage.creator;
    const nextCustom = nextMessage && nextMessage.custom;
    const nextSystem = nextMessage && nextMessage.system;
    const nextMsgDate = nextMessage.timestamp_ms;
    const id = item.id || this.state.tempIds[item.id];

    return (
      <Message
        nextMessageExists={nextMessage}
        nextCustom={nextCustom}
        nextCreator={nextCreator}
        nextSystem={nextSystem}
        nextMsgDate={nextMsgDate}
        error={this.state.errors.includes(id)}
        pending={this.state.pending.includes(id)}
        onHold={this.showMessageFocus}
        index={index}
        item={{...item, id}}
        first={
          index == this.state.messages.length - 1 &&
          this.state.noMorePrevMessages
        }
        store={this.props.store}
        navigation={this.props.navigation}
        user={this.state.conversation.member_names[item.creator]}
        reduxAppStore={this.props.store.app}
        tagColors={this.state.tagColors}
        toggleLike={this.toggleMessageLike}
        members={this.state.conversation.member_names}
        onLikeContainerPress={this.showMessageFocus}
        navigate={this.props.navigation.navigate}
        onPress={this.handleMessagePress}
        isChannelAdmin={this.isChannelAdmin}
        channelImage={this.state.conversation.image}
      />
    );
  };
  getConversation = (init = false) => {
    MessageFuncs.getBubbleFocusConversation(
      this.id,
      this.type,
      this.props.store.app.campus.key,
    )
      .then(({conversation, validChannelUids}) => {
        // Check if user is member
        const isMember = Campus.Funcs.bubble.isUserMember(
          conversation.member_uids || [],
          this.props.navigation.goBack,
        );
        if (!isMember) throw new Error('not_a_member');

        this.disabled = conversation.disabled;
        this.isChannelAdmin =
          (conversation.admins || []).includes((auth.currentUser || {}).uid) &&
          this.type == 'channel';

        this.setState({conversation, validChannelUids});
        return {conversation, validChannelUids};
      })
      .then(({validChannelUids}) => {
        if (init) this.getConversationMessages({validChannelUids});
      })
      .then(() => {
        Campus.Funcs.bubble.updateOnlineTimestamp(
          this.props.route.params.id,
          this.props.store.user,
          this.props.route.params.type,
          this.props.store.app.campus.key,
        );
      })
      .then(() => {
        if (init) this.getTagColors();
      })
      .then(() => {
        if (this.props.route.params.invitation && init)
          this.claimInvitation(this.props.route.params.invitation.id);
      })
      .then(() => {
        AsyncStorage.updateUnreadBubbles(this.id, true);
      })
      .catch((err) => {
        console.warn('Error getting conversation', err);
        // Only show the alert if there has not been an alert earlier about
        // not being a member
        if (!err.toString().includes('not_a_member'))
          Alert.alert(
            'Error',
            `We could not get your ${
              this.type || 'bubble'
            } right now, please try again later`,
          );
      })
      .finally(() => {
        this.setState({conversationInit: true});
      });
  };
  getConversationMessages = ({validChannelUids = []}) => {
    this.setState({loadingEarlier: true});
    var latestTimestamp = Date.now() + 1000; // Default get the near future
    var limit = 30; // Get a large quantity of messages at first

    // If there are messages and the conversation has been fetched then update the timestamp and limit
    if (this.state.conversationInit && this.state.messages.length > 0) {
      latestTimestamp = this.state.messages.length.slice(-1)[0].timestamp_ms;
      limit = 15;
    }

    MessageFuncs.getBubbleFocusConversationMessages(
      this.id,
      this.type,
      this.props.store.app.campus.key,
      latestTimestamp,
      limit,
    )
      .then((messages) => {
        if (this.type === 'channel')
          messages = messages.filter((m) =>
            validChannelUids.includes(m.creator),
          );

        this.setState({messages: this.state.messages.concat(messages)});
        if (messages.length < 15) this.setState({noMorePrevMessages: true});
      })
      .catch((err) => {
        console.warn('Error getting messages', err);
        Alert.alert(
          'Error',
          'We could not get your messages right now, please try again later',
        );
      })
      .finally(() => {
        this.setState({loadingEarlier: false});
      });
  };
  handleMessagePress = (item) => {
    this.send(item.text, 'user', item, true);
  };
  toggleMessageLike = (message) => {
    console.log('Liking message, pause listening to new messages');
    this.setState({pauseListening: true});

    const likes = message.likes || [];

    // Specify the parameters to the function
    const parameters = {
      conversationId: this.id,
      messageId: message.id,
      alreadyLiked: likes.includes(auth.currentUser.uid),
      campusKey: this.props.store.app.campus.key,
      type: this.type,
    };

    Campus.Funcs.bubble
      .toggleMessageLike(parameters)
      .then(({liked}) => {
        const index = this.state.messages.findIndex((m) => m.id == message.id);
        const msgs = this.state.messages;
        const msg = msgs[index];
        if (liked) msg.likes = [...likes, auth.currentUser.uid];
        else msg.likes = likes.filter((l) => l !== auth.currentUser.uid);

        msgs[index] = msg;
        this.setState({messages: msgs});
      })
      .catch((err) => {
        console.warn('Error liking message', err);
        Alert.alert(
          'Message Like',
          'Something went wrong on our part, please try again later',
        );
      })
      .finally(() => this.setState({pauseListening: false}));
  };
  getTagColors = () => {
    getTagColors()
      .then((colors) => this.setState({tagColors: colors}))
      .catch((err) => analytics.error(err, 'BubbleFocus.js', 'getTagColors()'));
  };
  claimInvitation = (invitationId) => {
    if (
      !this.state.conversation.member_uids.includes(
        (auth.currentUser || {}).uid,
      ) ||
      true
    ) {
      MessageFuncs.toggleSignedInUserIsAMember(
        conversation,
        this.props.store.user,
        'join',
        this.type,
        this.props.store.app.campus.key,
      ).then(this.getConversation);

      Campus.Funcs.invite.claimInvitation(
        this.props.store.app.campus.key,
        invitationId,
        this.props.store.app.invitationIDs,
      );

      analytics.joinedBubble(conversation);
    }
  };
  selectImage = () => {
    const id = `new_image_${auth.currentUser.uid}_${Date.now()}`;
    const timestamp = new Date();

    const upload = async (res) => {
      if (!res.error && !res.cancelled) {
        const messageId = `${auth.currentUser.uid}${Date.now()}`;
        const payload = {
          text: '',
          timestamp, // This field is depreceated and will be removed in later update
          timestamp_ms: timestamp.getTime(),
          creator: auth.currentUser.uid,
          __type: 'user',
          image: res.uri,
          id: messageId,
        };

        this.setState({
          messages: [payload].concat(this.state.messages),
          pending: this.state.pending.concat(messageId),
        });
        // Upload image and get the placed uri to use in message doc

        const uploadRes = await uploadImage(
          ['bubbles', this.bubble, 'bubbles', id],
          res.uri,
        )
          .then((response) => {
            return response;
          })
          .catch((err) => {
            return {error: err};
          });
        if (uploadRes.error) {
          Alert.alert(
            'Image',
            'Something went wrong, the image could not be uploaded',
          );
          analytics.error(upload.err, 'BubbleFocus/index.js', 'upload()');
        } else {
          this.send('', 'user', {
            image: uploadRes.uri,
            id: messageId,
            pending: true,
            __data: {
              value: uploadRes.uri,
              type: 'image',
            },
          });
        }
      }
    };

    Campus.Funcs.images.selectImage(upload);
  };
  getPrevMessages = async (init = false) => {
    this.setState({loadingEarlier: true});
    return MessageFuncs.getMessages(
      this.bubble,
      init ? Date.now() + 1000 : this.state.messages.slice(-1)[0].timestamp_ms,
      init ? 20 : 15,
    )
      .then((messages) => {
        this.setState(
          {messages: this.state.messages.concat(messages)},
          init ? () => this.startListening() : () => {},
        );
        if (messages.length < 10) this.setState({noMorePrevMessages: true});
      })
      .catch(alert)
      .finally(() => this.setState({loadingEarlier: false}));
  };
  startListening = () =>
    (this.listener = setInterval(this.getNewMessages, 5000));
  getNewMessages = async () => {
    if (this.state.screenIndex == 0) {
      const deviceToken = await messaging
        .getToken()
        .then((token) => {
          return token;
        })
        .catch((e) => {
          return 'null';
        });

      const msgs = this.state.messages;
      const latest =
        msgs.length == 0 ? Date.now() : msgs.slice(0)[0].timestamp_ms;

      db.collection('bubbles')
        .doc(this.bubble)
        .collection('messages')
        .where('timestamp_ms', '>', latest)
        .orderBy('timestamp_ms', 'desc')
        .startAfter([latest])
        .get()
        .then((querySnapShot) => {
          const messages = [];
          querySnapShot.forEach(async (doc, index) => {
            if (!this.state.messages.some((e) => e.id == doc.id))
              messages.push(await parseMessage(doc.data(), doc.id));

            if (index == querySnapShot.size - 1) {
              var filtered = messages.filter(
                (m) => m.device_token !== deviceToken,
              );

              this.setState({messages: filtered.concat(this.state.messages)});
            }
          });
        })
        .catch(alert);
    }
  };
  send = async (text, type = 'user', otherParams = {}, resend = false) => {
    // Check membership
    const isMember = Campus.Funcs.bubble.isUserMember(
      this.state.conversation.member_uids,
      this.props.navigation.goBack,
    );
    if (!isMember) return;

    var {messages, pending} = this.state;
    const {__data, custom, image, system, video, id} = {...{}, ...otherParams}; // prevent undefined otherParams
    const creator = (auth.currentUser || {}).uid;
    const user = this.state.conversation.member_names[creator];
    const timeId = `${user.uid}${Date.now()}`;
    const tempId = resend || !!image ? id : timeId;

    if (resend)
      this.setState({
        pending: pending.concat(tempId),
        errors: this.state.errors.filter((e) => e !== tempId),
      });

    const timestamp = new Date();
    const creator_name = `${user.first_name} ${user.last_name}`;

    if (!creator)
      Alert.alert(
        'Error',
        'Something went wrong on our side, please try again later',
      );

    const payload = {
      text,
      timestamp, // This field is depreceated and will be removed in later update
      timestamp_ms: timestamp.getTime(),

      creator,
      creator_name,

      conversationId: this.id,
      campusKey: this.props.store.app.campus.key,
      channelId: this.type === 'channel' && this.id,
      __type: type,

      __data: __data || null,
      custom: custom || false,
      system: system || false,
      video: video || false,
      image: image || false,

      id: tempId,
      device_token: await messaging
        .getToken()
        .then((token) => {
          return token;
        })
        .catch((e) => {
          return 'null';
        }),
    };

    messages = [payload].concat(messages.filter((m) => m.id !== id));
    pending = pending.concat(tempId);

    // Don't update state with image
    // By not doing it we don't send a new key id to
    // the component. Meaning it won't refetch
    if (!image) this.setState({messages, pending});
    else this.setState({pending});

    const response = await Campus.Funcs.bubble
      .sendMessage(payload)
      .then((res) => {
        return res;
      })
      .catch((err) => {
        console.warn(err);
        analytics.error(err, 'BubbleFocus', 'sendMessage');
        return {error: err};
      });
    this.setState({pauseListening: true});

    const chouldNotSend = response.error || !response.data.created;
    if (chouldNotSend) analytics.error(response.error, 'send', 'BubbleFocus');
    var {errors, tempIds} = this.state;
    pending = this.state.pending;

    pending = pending.filter((p) => p !== tempId);

    if (chouldNotSend) errors.push(tempId);
    else tempIds[tempId] = response.data.id;

    this.setState({errors, pending, tempIds, pauseListening: false});
    this.state.touchingFlatList &&
      this.flatlist.current.scrollToOffset({offset: 0, animted: true});
  };
  onSelect = (item) => {
    const id = `${item.id}`; // The event id to fetch the event later
    const type = item.__type;
    this.send('', 'user', {custom: true, __data: {id: id, type: type}});
  };
  getInvitedUsers = (bubble) => {
    Campus.Funcs.bubble
      .getInvitedUsers(bubble, this.props.store.app.campus.key, (users) =>
        this.setState({invitedUsers: users}),
      )
      .catch((err) =>
        analytics.error(err, 'BubbleFocus/index.js', 'getInvitedUsers()'),
      );
  };
  showMessageFocus = (id) => {
    try {
      clearTimeout(this.listener);
    } catch (err) {}

    this.setState({messageFocus: false}, () =>
      this.setState({messageFocus: id}),
    );
  };

  onNavigationCreation = () => {
    this.setState({creatingNewBubble: true});
    Campus.Funcs.bubble
      .handleNavigationCreation(
        this.props.store.app.campus.key,
        this.props.route.params.creation,
      )

      .then(({id, data}) => {
        // Set variables
        this.type = data.__type;
        this.id = id;

        // Get the conversation
        this.getConversation(true);

        // Update online timestamp
        Campus.Funcs.bubble.updateOnlineTimestamp(
          id,
          this.props.store.user,
          data.__type,
          this.props.store.app.campus.key,
        );

        // Update notification active type
        Campus.Funcs.notifications.setActiveType('bubbles', id);

        // Update and remove popup
        this.setState({createdNewBubble: true, errorCreatingNewBubble: false});
        setTimeout(() => this.setState({creatingNewBubble: false}), 1750);
      })
      .catch((err) => {
        analytics.error(err, 'BubbleFocus', 'onNavigationCreation');
        console.warn('Error creating new bubble', err);
        this.setState({errorCreatingNewBubble: true});
      });
  };
}
