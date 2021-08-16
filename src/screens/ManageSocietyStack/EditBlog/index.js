import React from 'react';
import {View, Animated, Text} from 'react-native';
import {ModalTop} from '../../../assets/ModalTop';
import {GlobalStyle} from '../../../assets/GlobalStyle';
import {styles as mStyles} from '../ManageSocietyFocus/style';
import {styles as bStyles} from '../CreateBlog/style';
import {ChildDecider} from '../CreateBlog/components/ChildDecider';
import TouchableShrink from '../../../assets/TouchableShrink/TouchableShrink';
import {ConfirmationPanel} from '../../../assets/ConfirmationPanel';
import {EditBlogFuncs} from './functions';
import {Funcs} from '../CreateBlog/functions';
import {analytics} from '../../../assets/Analytics';
import DraggableFlatList from 'react-native-draggable-flatlist';
import {KeyboardAccessoryAnnouncement} from '../CreateBlog/components/KeyboardAccessoryAnnouncement';
import {getTagColors} from '../../../assets/Airtable/functions';
import {Alert} from 'react-native';
import {RefreshControl} from 'react-native';
import {EventSocietySearch} from '../../../assets/EventSocietySearch';
import {objFetches} from '../CreateBlog/index';
import {Campus} from '../../../assets/Campus';
import {ActivityIndicator} from 'react-native';
import {Keyboard} from 'react-native';

export class EditBlog extends React.Component {
  constructor() {
    super();
    this.state = {
      paddingBottom: new Animated.Value(0),
      blog_content: [{type: '', value: ''}],
      searchEvent: false,
      uploading: false,
      uploaded: false,
      uploadError: false,
      loadingText: 'We are updating your blog',
      errorText: 'We could not update your blog',
      successText: 'We have updated your blog',
      blogContentLayouts: {},
      validations: [],
      campusObjects: {},
      loading: false,
    };
  }
  componentDidMount() {
    const params = {id: '', ...this.props.route.params};
    this.fetchBlog(params.id);
    this.setState({...this.props.store.blog}, () => console.log(this.state));

    getTagColors().then((tagColors) => this.setState({tagColors}));
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
            title={'Edit Announcement'}
            navigation={this.props.navigation}
            destinationType={'goBack'}
            colors={this.props.store.app.campus.colors}
          />
          <DraggableFlatList
            {...GlobalStyle.Props.focusBackgroundScrollView}
            refreshControl={
              <RefreshControl
                refreshing={this.state.loading}
                onRefresh={this.fetchBlog}
              />
            }
            keyExtractor={(e, index) => `draggable_flatlist_edit_blog_${index}`}
            style={[
              GlobalStyle.Props.focusBackgroundScrollView.style,
              mStyles.scroll,
              bStyles.scroll,
              bStyles.blogContentContainer,
            ]}
            contentContainerStyle={[
              GlobalStyle.Props.focusBackgroundScrollView.contentContainerStyle,
              {alignItems: 'center'},
            ]}
            onDragBegin={() => this.setState({dragging: true})}
            onDragEnd={this.onDragEnd}
            data={this.state.blog_content}
            extraData={this.state}
            renderItem={this.renderItem}
            ListFooterComponent={
              <React.Fragment>
                <TouchableShrink
                  style={bStyles.largeButton}
                  showGradient
                  gradientColor={this.props.store.app.campus.colors.main}
                          showIcon
                  onPress={this.updateBlog}>
                  <Text style={GlobalStyle.TextStyle.buttonLarge}>
                    Update Announcement
                  </Text>
                </TouchableShrink>
                <TouchableShrink onPress={this.deleteBlog} triggerHaptic>
                  <Text style={GlobalStyle.ButtonStyle.DestructiveTextButton}>
                    Delete Announcement
                  </Text>
                </TouchableShrink>
              </React.Fragment>
            }
            ListEmptyComponent={
              !this.state.loading ? (
                <Text style={bStyles.emptyText}>
                  Add something to your blog by clicking the + button below
                </Text>
              ) : (
                this.state.error && (
                  <Text style={[bStyles.emptyText, {color: '#ff0000'}]}>
                    Could not get blog
                  </Text>
                )
              )
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
          dontGoBack={this.state.uploaded === false || this.state.uploadError}
          loading={this.state.uploading}
          isActive={this.state.uploaded || this.state.uploading}
          error={this.state.uploadError}
          loadingText={this.state.loadingText}
          errorText={this.state.errorText}
          successText={this.state.successText}
          colors={this.props.store.app.campus.colors}
          subTitle="The president must confirm changes to blogs"
          navigation={this.props.navigation}
          onClose={() =>
            this.setState({
              uploaded: false,
              uploading: false,
              uploadError: false,
            })
          }
        />
      </React.Fragment>
    );
  }
  fetchBlog = (id) => {
    setTimeout(() => this.setState({loading: true}), 150);
    setTimeout(
      () =>
        Funcs.fetchBlog(id, this.props.store.app.campus.key)
          .then((blog) => this.setState({...blog, error: false}))
          .catch((err) => {
            this.setState({error: true});
            analytics.error(err, 'EditBlog/index.js', 'fetchBlog()');
          })
          .finally(() => this.setState({loading: false, init: true})),
      1500,
    );
  };
  onDragEnd = () => {};
  renderItem = ({item, index}) => {
    return (
      <ChildDecider
        item={item}
        index={index}
        creating
        error={this.state.validations[index]}
        colors={this.props.store.app.campus.colors}
        campusKey={this.props.store.app.campus.key}
        onLayout={this.onContentLayout}
        onValueChange={this.onValueChange}
        navigate={this.props.navigation.navigate}
        searchEvent={() => this.setState({searchEvent: true})}
        deleteContent={this.deleteContent}
        bookmarks={this.props.store.user.bookmarks}
        dragging={this.state.dragging}
        tagColors={this.state.tagColors}
        campusObjects={this.state.campusObjects}
        store={this.props.store}
      />
    );
  };
  onContentLayout = (event, index) => {
    const {blogContentLayouts} = this.state;
    blogContentLayouts[index] = event.nativeEvent.layout.y;
    console.log(blogContentLayouts);
    this.setState({blogContentLayouts: blogContentLayouts});
  };
  addContent = (type, value = '') => {
    const blogContent = this.state.blog_content;

    if (type == 'Image')
      Campus.Funcs.images.selectImage((res) => {
        if (res.error) Alert.alert('Image', 'We could not get your image');
        else {
          blogContent[blogContent.length] = {type: type, value: res.uri};
        }
      });
    else blogContent[blogContent.length] = {type: type, value: value};

    this.setState(() => ({blog_content: Funcs.placeHeadingFirst(blogContent)}));
  };
  onValueChange = (index, value) => {
    // Get index from child component and update state for that index
    const blog_content = this.state.blog_content;
    blog_content[index].value = value;
    this.setState({blog_content: blog_content});
  };
  deleteContent = (index) => {
    // Remove element by index and update state
    const blog_content = this.state.blog_content;
    if (index > -1) {
      blog_content.splice(index, 1);
    }
    this.setState({blog_content: blog_content});
  };
  updateBlog = () => {
    Keyboard.dismiss();
    this.setState({
      uploading: true,
      loadingText: 'We are updating your blog',
      errorText: 'We could not update your blog',
      successText: 'We have updated your blog',
    });
    Funcs.validateBlog(this.state.blog_content).then((vals) => {
      this.setState({validations: vals});
      if (Object.values(vals).every((elem) => elem == false)) {
        console.log('All validations are checked and passed');
        EditBlogFuncs.updateBlog(this.props.store.app.campus.key, this.state)
          .then(() =>
            setTimeout(
              () =>
                this.setState({
                  uploading: false,
                  uploaded: true,
                  uploadError: false,
                }),
              500,
            ),
          )
          .catch((err) => {
            console.warn('Could not update blog', err);
            setTimeout(
              () =>
                this.setState({
                  uploading: false,
                  uploaded: true,
                  uploadError: true,
                }),
              500,
            );
          });
      } else {
        console.log('There are validation errors', vals);
        this.setState({creating: false, created: true, error: true});
      }
    });
  };
  deleteBlog = async () => {
    this.setState({
      uploading: true,
      loadingText: 'We are deleting your blog',
      errorText: 'We could not delete your blog',
      successText: 'We have deleted your blog',
    });
    EditBlogFuncs.deleteBlog(this.props.store.app.campus.key, this.state)
      .then(() =>
        setTimeout(
          () =>
            this.setState({
              uploading: false,
              uploaded: true,
              uploadError: false,
            }),
          500,
        ),
      )
      .catch((err) => {
        console.warn('Could not delete blog', err);
        setTimeout(
          () =>
            this.setState({
              uploading: false,
              uploaded: true,
              uploadError: true,
            }),
          500,
        );
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
          blogContent: Funcs.placeHeadingFirst(this.state.blog_content),
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
