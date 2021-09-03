import React from 'react';
import {View, Text, FlatList, RefreshControl, Animated} from 'react-native';
import * as Animatable from 'react-native-animatable';
import FontAwesome5Icon from 'react-native-vector-icons/FontAwesome5';
import {analytics} from '../../../assets/Analytics';
import {Campus} from '../../../assets/Campus';
import {GlobalStyle} from '../../../assets/GlobalStyle';
import {ModalTop} from '../../../assets/ModalTop';
import {ICON_SIZE, styles} from './styles';
import Video from 'react-native-video';
import {FetchError} from '../../../assets/FetchError/FetchError';
import {EmptyBox} from '../../../assets/EmptyAnimation';
import {Pressable} from 'react-native';
import {TextInput} from 'react-native';
import {KeyboardAvoidingScrollView} from 'react-native-keyboard-avoiding-scroll-view';
import {TouchableOpacity} from 'react-native';
import {auth, functions} from '../../../assets/Firebase/Firebase';
import {ActivityIndicator} from 'react-native';
import {Keyboard} from 'react-native';

const AnimatableIcon = Animatable.createAnimatableComponent(FontAwesome5Icon);
const AnimTouchable = Animatable.createAnimatableComponent(TouchableOpacity);

export class FAQ extends React.Component {
  constructor() {
    super();
    this.flatlist = React.createRef();
    this.askTextInput = React.createRef();
    this.state = {
      faq: [],
      error: false,
      selectedQuestion: null,
      layoutsPerKey: {},
      init: false,
    };
  }
  componentDidMount() {
    const params = {question: false, ...this.props.route.params};
    this.setState({refreshing: true});
    setTimeout(() => this.getFaqs(params.question), 1000);
  }
  render() {
    return (
      <View {...GlobalStyle.Props.focusBackgroundScrollView}>
        <ModalTop title={'FAQ'} onPress={this.props.navigation.goBack} />
        <KeyboardAvoidingScrollView
          ref={this.flatlist}
          scrollEventThrottle={16}
          contentContainerStyle={{alignItems: 'center'}}
          refreshControl={
            <RefreshControl
              refreshing={this.state.refreshing}
              onRefresh={this.getFaqs}
            />
          }
          contentInset={{bottom: GlobalStyle.Measurements.height * 0.15}}
          style={styles.container}>
          {(this.state.error ? [] : this.state.faq).map(this.renderFaqSection)}
          {(this.state.error || this.state.faq.length == 0) && (
            <View style={{marginTop: GlobalStyle.Measurements.margin * 2}}>
              {this.state.error ? (
                <FetchError
                  onPress={this.getFaqs}
                  errorText={'We could not connect and get the FAQ right now'}
                  showButton
                />
              ) : (
                this.state.init && (
                  <EmptyBox
                    onPress={this.getFaqs}
                    showButton
                    errorText={'We could not find any FAQ right now'}
                  />
                )
              )}
            </View>
          )}
          {this.state.init && (
            <View style={[styles.sectionContainer, {marginBottom: 50}]}>
              <Text style={styles.sectionTitle}>Ask a question</Text>
              <View style={styles.askQuestionRow}>
                <TextInput
                  ref={this.askTextInput}
                  placeholder={'Ask a question...'}
                  multiline
                  onChangeText={(askQuestionText) =>
                    this.setState({askQuestionText})
                  }
                  style={styles.askQuestionTextInput}
                />
                {!!(this.state.askQuestionText || '').replace(/\s/g, '')
                  .length && (
                  <AnimTouchable
                    onPress={() => this.sendQuestion()}
                    animation={{0: {scale: 0}, 1: {scale: 1}}}
                    duration={500}
                    style={styles.askQuestionIcon}>
                    {this.state.sendingQuestion ? (
                      <ActivityIndicator
                        color={'#fff'}
                        size={styles.iconContainer.height * 0.5}
                      />
                    ) : (
                      <FontAwesome5Icon
                        name={'arrow-up'}
                        size={styles.iconContainer.height * 0.65}
                        color={'#fff'}
                      />
                    )}
                  </AnimTouchable>
                )}
              </View>
            </View>
          )}
        </KeyboardAvoidingScrollView>
      </View>
    );
  }
  getFaqs = (initAnimationTarget = false) => {
    this.setState({refreshing: true});
    setTimeout(
      () =>
        Campus.Funcs.other
          .getFaqs(this.props.store.app.campus.key)
          .then((faq) => {
            this.setState({faq, error: false});

            this.flatlist.current.scrollToOffset({
              y: this.state[`layout_${initAnimationTarget}`],
            });

            initAnimationTarget &&
              setTimeout(
                () => this.setState({selectedQuestion: initAnimationTarget}),
                350,
              );
          })
          .catch((err) => {
            analytics.error(err, 'FAQ/index.js', 'getFaqs()');
            this.setState({error: false});
          })
          .finally(() => this.setState({refreshing: false, init: true})),
      !this.state.init ? 0 : 750,
    );
  };
  renderFaqSection = (item) => (
    <GlobalStyle.UI.View style={styles.sectionContainer}>
      <GlobalStyle.UI.Text style={styles.sectionTitle}>
        {item.name}
      </GlobalStyle.UI.Text>
      {item.questions.map((e) => this.renderFaqQuestion(e, item.key))}
    </GlobalStyle.UI.View>
  );
  renderFaqQuestion = (item, parentKey) => {
    const key = `${parentKey}/${item.key}`;

    return (
      <FaqQuestion
        item={{...item, key: key}}
        onLayout={({nativeEvent}) =>
          this.setState({[`layout_${key}`]: nativeEvent.layout.y})
        }
        navigate={this.props.navigation.navigate}
        isSelected={this.state.selectedQuestion === key}
        onPress={() =>
          this.setState({
            selectedQuestion: this.state.selectedQuestion == key ? null : key,
          })
        }
      />
    );
  };
  sendQuestion = () => {
    analytics.breadcrumb('Sending faq question');
    this.setState({sendingQuestion: true});
    const text = this.state.askQuestionText || '';
    functions
      .httpsCallable('askFAQQuestion')({
        text,
        uid: auth.currentUser.uid,
      })
      .then(() => {
        this.props.route.params.showPopup({
          active: true,
          type: 'toast',
          level: 'info',
          title: 'Successfully sent question',
          text: 'Thank you for asking us a question',
        });
        this.setState({askQuestionText: ''});
        this.askTextInput.current.clear();
      })
      .catch((err) => {
        console.warn('FAQ 112', err);
        analytics.error(err, 'FAQ', 'sendQuestion');
        this.props.route.params.showPopup({
          active: true,
          type: 'toast',
          level: 'error',
          title: "Couldn't send question",
          text: 'Please check your connection and try again later',
        });
      })
      .finally(() => {
        this.setState({sendingQuestion: false});
      });
  };
}

function FaqQuestion(props) {
  const item = props.item;
  const icon = React.useRef();

  const [iconHasAnimated, setIconHasAnimated] = React.useState(false);

  function animate(isSelected = false) {
    const duration = 400;
    icon.current.transitionTo(
      {
        transform: [{rotate: isSelected ? '90deg' : '0deg'}],
      },
      duration,
    );

    setIconHasAnimated(isSelected);
  }

  React.useEffect(() => {
    if (props.isSelected !== iconHasAnimated) animate(props.isSelected);
  });

  return (
    <View
      key={props.item.key}
      style={styles.questionContainer}
      onLayout={props.onLayout}>
      <GlobalStyle.UI.Touchable
        hitSlop={8}
        onPress={props.onPress}
        style={styles.questionTitleContainer}>
        <Text style={styles.questionTitle}>{item.name}</Text>
        <View style={styles.iconContainer}>
          <AnimatableIcon
            ref={icon}
            name={'chevron-right'}
            color={GlobalStyle.Palettes.inverseBackground.palette4}
            size={ICON_SIZE}
            style={{transform: [{rotate: '0deg'}]}}
          />
        </View>
      </GlobalStyle.UI.Touchable>
      {props.isSelected && (
        <Animatable.View duration={700} style={styles.answerContainer}>
          <Text style={styles.questionAnswer}>{item.answer}</Text>
          {item.videos &&
            item.videos.map((vid, index) => (
              <GlobalStyle.UI.Video
                source={{uri: vid}}
                resizeMode={'cover'}
                style={[
                  styles.questionImage,
                  {backgroundColor: GlobalStyle.ColorStyle.greyBackground},
                ]}
              />
            ))}
          {item.images &&
            item.images.map((img, index) => (
              <GlobalStyle.UI.Image
                source={{uri: img}}
                style={styles.questionImage}
                resizeMode={'cover'}
                navigate={props.navigate}
              />
            ))}
        </Animatable.View>
      )}
    </View>
  );
}
