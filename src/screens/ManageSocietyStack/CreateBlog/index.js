import React from 'react';
import {Text, View, Keyboard, Animated, Alert} from 'react-native';
import {ModalTop} from '../../../assets/ModalTop';
import {styles as manageStyles} from '../ManageSocietyFocus/style';
import {styles} from './style';
import {ChildDecider} from './components/ChildDecider';
import {triggerHaptic} from '../../../assets/Haptic/hapticFeedback';
import {GlobalStyle} from '../../../assets/GlobalStyle';
import TouchableShrink from '../../../assets/TouchableShrink/TouchableShrink';
import {ConfirmationPanel} from '../../../assets/ConfirmationPanel';
import {Funcs} from './functions';
import {analytics} from '../../../assets/Analytics';
import {KeyboardAccessoryAnnouncement} from './components/KeyboardAccessoryAnnouncement';
import {EventSocietySearch} from '../../../assets/EventSocietySearch';
import DraggableFlatList from 'react-native-draggable-flatlist';
import {
  parseEventData,
  parseSocietyData,
} from '../../../assets/Firebase/functions';
import {db} from '../../../assets/Firebase/Firebase';
import {getTagColors} from '../../../assets/Airtable/functions';
import {Campus} from '../../../assets/Campus';
import {KeyboardAvoidingView} from 'react-native';

// THe size for actionbutton icons
export const ICON_SIZE = GlobalStyle.Measurements.unit;

export class CreateBlog extends React.Component {
  constructor() {
    super();
    this.state = {
      searchCampus: false,
      paddingBottom: new Animated.Value(0),
      blogContent: [
        {type: 'Heading', start: true, value: ''},
        {type: 'Text', value: ''},
      ],
      blogContentLayouts: {},
      validations: [],
      dragging: false,
      // For when creating
      creating: false,
      created: false,
      error: false,
      campusObjects: {},
      tagColors: {},
    };
    this._scroll = React.createRef();
  }
  componentDidMount() {
    getTagColors().then((tagColors) => this.setState({tagColors}));
    // Reference for Draggable Flatlist
    this._flatlist = React.createRef();
    this.setKeyboardListeners();
  }
  setKeyboardListeners = () => {
    this.onShow = Keyboard.addListener('keyboardWillShow', (e) =>
      Animated.timing(this.state.paddingBottom, {
        toValue: e.endCoordinates.height - 50,
        duration: 550,
        useNativeDriver: false,
      }).start(),
    );
    this.onHide = Keyboard.addListener('keyboardWillHide', () =>
      Animated.timing(this.state.paddingBottom, {
        toValue: 0,
        duration: 550,
        useNativeDriver: false,
      }).start(),
    );
  };
  componentWillUnmount() {
    try {
      this.onShow.remove();
      this.onHide.remove();
    } catch (err) {
      console.warn(err);
    }
  }
  render() {
    return (
      <React.Fragment>
        <Animated.View
          {...GlobalStyle.Props.focusBackgroundScrollView}
          style={[
            GlobalStyle.Props.focusBackgroundView.style,
            {paddingBottom: this.state.paddingBottom},
          ]}>
          <GlobalStyle.Header
          title={'Create Announcement'}
          navigation={this.props.navigation}
          destinationType={'goBack'}
          colors={this.props.store.app.campus.colors}
        />

          <DraggableFlatList
            {...GlobalStyle.Props.focusBackgroundScrollView}
            ref={this._scroll}
            extraData={this.state}
            keyExtractor={(e, i) => `draggable_flatlist_blog_${i}`}
            data={this.state.blogContent}
            renderItem={this._renderItem}
            ListEmptyComponent={
              <Text style={styles.emptyText}>
                Add something to your blog by clicking the + button below
              </Text>
            }
            style={[
              GlobalStyle.Props.focusBackgroundScrollView.style,
              manageStyles.scroll,
              styles.scroll,
              styles.blogContentContainer,
            ]}
            contentContainerStyle={[
              GlobalStyle.Props.focusBackgroundScrollView.contentContainerStyle,
              {alignItems: 'center'},
            ]}
            onDragBegin={() => this.setState({dragging: true})}
            onDragEnd={this.onDragEnd}
            ListFooterComponent={
              <TouchableShrink
                style={styles.largeButton}
                showGradient
                gradientColor={this.props.store.app.campus.colors.main}
                      showIcon
                onPress={this.createBlog}>
                <Text style={GlobalStyle.TextStyle.buttonLarge}>
                  Create Announcement
                </Text>
              </TouchableShrink>
            }
          />
        </Animated.View>
        <KeyboardAccessoryAnnouncement
          colors={this.props.store.app.campus.colors}
          addContent={this.addContent}
          searchCampus={() => this.setState({searchCampus: true})}
        />
        <EventSocietySearch
          store={this.props.store}
          isActive={this.state.searchCampus}
          onClose={() => this.setState({searchCampus: false})}
          onSelect={(item) => this.getCampusObject(item)}
        />
        <ConfirmationPanel
          dontGoBack={this.state.created === false || this.state.error}
          loading={this.state.creating}
          isActive={this.state.creating || this.state.created}
          error={this.state.error}
          loadingText={'We are creating your blog'}
          errorText={'We could not create your blog'}
          successText={'We have created your blog'}
          colors={this.props.store.app.campus.colors}
          subTitle="The president must confirm changes to blogs"
          navigation={this.props.navigation}
          onClose={() =>
            this.setState({created: false, creating: false, error: false})
          }
        />
      </React.Fragment>
    );
  }
  _renderItem = ({item, index, drag}) => {
    // Item is {item, index, drag, isActive}
    return (
      <ChildDecider
        item={item}
        index={index}
        drag={drag}
        creating
        error={this.state.validations[index]}
        colors={this.props.store.app.campus.colors}
        campusKey={this.props.store.app.campus.key}
        onLayout={this.onContentLayout}
        onValueChange={this.onValueChange}
        navigate={this.props.navigation.navigate}
        searchEvent={() => this.setState({searchEvent: true})}
        deleteContent={this.deleteContent}
        store={this.props.store}
        dragging={this.state.dragging}
        campusObjects={this.state.campusObjects}
        tagColors={this.state.tagColors}
      />
    );
  };
  onContentLayout = (event, index) => {
    const {blogContentLayouts} = this.state;
    blogContentLayouts[index] = event.nativeEvent.layout.y;
    this.setState({blogContentLayouts: blogContentLayouts});
  };
  onDragEnd = ({data}) => {
    this.setState(() => ({
      blogContent: Funcs.placeHeadingFirst(data),
      dragging: false,
    }));
    triggerHaptic('notificationSuccess');
  };
  addContent = (type, value = '') => {
    const blogContent = this.state.blogContent;

    if (type == 'Image')
      Campus.Funcs.images.selectImage((res) => {
        if (res.error) Alert.alert('Image', 'We could not get your image');
        else {
          blogContent[blogContent.length] = {type: type, value: res.uri};
        }
      });
    else blogContent[blogContent.length] = {type: type, value: value};

    this.setState(() => ({blogContent: Funcs.placeHeadingFirst(blogContent)}));
  };
  onValueChange = (index, value) => {
    // Get index from child component and update state for that index
    const blogContent = this.state.blogContent;
    blogContent[index].value = value;
    this.setState(() => ({
      blogContent: Funcs.placeHeadingFirst(blogContent),
    }));
  };
  deleteContent = (index) => {
    // Remove element by index and update state
    const blogContent = this.state.blogContent;
    if (index > -1) {
      blogContent.splice(index, 1);
    }
    this.setState({blogContent: Funcs.placeHeadingFirst(blogContent)});
  };
  createBlog = async () => {
    //Create event and wait for response
    Keyboard.dismiss();
    this.setState({creating: true});
    if (!this.props.store.society.manageSocietyFocus.confirmed) {
      this.setState({
        created: false,
        creating: false,
        errorCreating: false,
      });
      Alert.alert(
        'Society confirmation',
        'Your society is not confirmed yet, until it is confirmed you cannot create any events',
      );
    } else
      Funcs.validateBlog(this.state.blogContent).then((vals) => {
        this.setState({validations: vals});
        if (
          Object.values(vals).every(
            (elem) => elem == false || elem == undefined,
          )
        ) {
          console.log('All validations are checked and passed');
          Funcs.createBlog(
            this.props.store.app.campus.key,
            this.props.store.society.manageSocietyFocus.id,
            this.props.store.society.manageSocietyFocus.name,
            this.props.store.society.manageSocietyFocus.exec_roles.president,
            this.state.blogContent,
          )
            .then((res) => {
              console.log('Successfully created blog', res);
              setTimeout(
                () =>
                  this.setState({created: true, error: false, creating: false}),
                500,
              );
            })
            .catch((err) => {
              console.warn('ERROR, Could not create blog', err);
              setTimeout(
                () =>
                  this.setState({creating: false, created: true, error: true}),
                500,
              );
            });
        } else {
          console.log('There are validation errors', vals);
          this.setState({creating: false, created: true, error: true});
        }
      });
  };
  getCampusObject = (item) => {
    const id = `${item.__type}_${item.id}`;
    objFetches[item.__type](this.props.store.app.campus.key, item.id)
      .then((data) => {
        const {campusObjects} = this.state;
        campusObjects[id] = data;

        this.setState(() => ({
          campusObjects,
          blogContent: Funcs.placeHeadingFirst(this.state.blogContent),
        }));
        this.addContent(item.__type, item.id);
      })
      .catch((err) => {
        console.warn(err);
        analytics.error(err, 'CreateBlog/index.js', 'getCampusObject()');
        Alert.alert(
          'Error',
          `We're sorry something went wrong with reading this ${item.__type}`,
        );
      });
  };
}

export const objFetches = {
  event: async function (campusKey, id) {
    return db
      .collection('campuses')
      .doc(campusKey)
      .collection('events')
      .doc(id)
      .get()
      .then(async (doc) => {
        return parseEventData(doc.data(), doc.id);
      })
      .catch((err) => {
        throw err;
      });
  },
  society: async function (campusKey, id) {
    return db
      .collection('campuses')
      .doc(campusKey)
      .collection('societies')
      .doc(id)
      .get()
      .then(async (doc) => {
        return parseSocietyData(doc.data(), doc.id);
      })
      .catch((err) => {
        throw err;
      });
  },
};
