import React from 'react';
import {View, Text, ScrollView, StyleSheet} from 'react-native';
import {ModalTop} from '../../../assets/ModalTop';
import {styles as externalStyles} from '../../ManageSocietyStack/CreateBlog/style';
import {GlobalStyle} from '../../../assets/GlobalStyle';
import MaterialIcon from 'react-native-vector-icons/MaterialIcons';
import {Campus} from '../../../assets/Campus';
import {RefreshControl} from 'react-native';
import {ChildDecider} from '../../ManageSocietyStack/CreateBlog/components/ChildDecider';
import {AsyncStorage} from '../../../assets/AsyncStorage/functions';
import {Pressable} from 'react-native';
import TouchableShrink from '../../../assets/TouchableShrink/TouchableShrink';
import {Alert} from 'react-native';
import {analytics} from '../../../assets/Analytics';

export class BlogFocus extends React.Component {
  constructor() {
    super();
    this.state = {
      markedAsRead: false,
      blog: {
        blog_content: [],
        su_title: false,
      },
      refreshing: false,
    };
  }

  async componentDidMount() {
    const params = {id: '-', ...this.props.route.params};
    this.setState({blogID: params.id});
    this.setState({refreshing: true});
    setTimeout(() => this.getBlog(params.id), 750);

    const isRead = await AsyncStorage.checkIfBlogRead(params.id);
    this.setState({markedAsRead: isRead});
  }

  render() {
    const editLog = this.state.blog.edit_log;
    const dateString = Array.isArray(editLog)
      ? editLog.slice(-1)[0].date.toLocaleDateString()
      : 'Unknown date';

    const blog = this.state.blog;
    const firstHeading = (
      blog.blog_content.filter((e) => e.type == 'Heading')[0] || {}
    ).value;

    return (
      <View style={{flex: 1}}>
        <ModalTop
          title={
            this.state.refreshing
              ? ''
              : blog.su_title || firstHeading || 'Announcement'
          }
          subTitle={'Announcement'}
          onPress={this.props.navigation.goBack}
          bookmarks={this.props.store.user.bookmarks}
          bookmarkType={'announcement'}
          objId={blog.id}
        />
        <ScrollView
          {...GlobalStyle.Props.focusBackgroundScrollView}
          refreshControl={
            <RefreshControl
              refreshing={this.state.refreshing}
              onRefresh={() => this.getBlog()}
            />
          }>
          {Object.keys(blog).length > 2 && (
            <View style={styles.infoContainer}>
              <View style={styles.iconRow}>
                <View
                  style={[
                    styles.icon,
                    {backgroundColor: this.props.store.app.campus.colors.main},
                  ]}>
                  <MaterialIcon
                    name="people"
                    size={GlobalStyle.Measurements.unit / 1.15}
                    color={'#fff'}
                  />
                </View>
                <Text style={styles.infoText} numberOfLines={1}>
                  {blog.society_name}
                </Text>
              </View>
              <View style={styles.iconRow}>
                <View
                  style={[
                    styles.icon,
                    {backgroundColor: this.props.store.app.campus.colors.main},
                  ]}>
                  <MaterialIcon
                    name="create"
                    size={GlobalStyle.Measurements.unit / 1.2}
                    color={'#fff'}
                  />
                </View>
                <Text style={styles.infoText}>{dateString}</Text>
              </View>
            </View>
          )}
          {blog.scraped && (
            <View style={styles.labelContainer}>
              <Text style={styles.labelText}>Automated Announcement</Text>
            </View>
          )}
          <View
            style={{
              alignItems: 'center',
            }}>
            {blog.blog_content.length > 0 &&
              blog.blog_content.map((item, index) => (
                <ChildDecider
                  key={`child_decider_${index}`}
                  campusKey={this.props.store.app.campus.key}
                  item={item}
                  index={index}
                  colors={this.props.store.app.campus.colors}
                  navigate={this.props.navigation.navigate}
                  onLayout={() => {}}
                  bookmarks={this.props.store.user.bookmarks}
                  navigation={this.props.navigation}
                />
              ))}
            {/* {!this.state.refreshing && (
              <TouchableShrink
                showGradient
                gradientColor={this.props.store.app.campus.colors.main}
                onPress={this.toggleReadStatus}
                style={[
                  GlobalStyle.ButtonStyle.Large,
                  {
                    justifyContent: 'space-between',
                    marginVertical: GlobalStyle.Measurements.margin,
                  },
                ]}
                icon={this.state.markedAsRead ? 'times' : 'check'}
                showIcon>
                <Text style={GlobalStyle.TextStyle.buttonLarge}>
                  Mark as {this.state.markedAsRead ? 'unread' : 'read'}
                </Text>
              </TouchableShrink>
            )} */}

            {blog.scraped && blog.su_link && (
              <Pressable
                hitSlop={5}
                style={{marginVertical: GlobalStyle.Measurements.margin}}
                onPress={() =>
                  this.props.navigation.navigate('Web View', {
                    url: blog.su_link,
                  })
                }>
                <Text style={GlobalStyle.TextStyle.blueText}>
                  Show announcement on website
                </Text>
              </Pressable>
            )}
          </View>
        </ScrollView>
      </View>
    );
  }
  getBlog = (id, refresh = true) => {
    this.setState({refreshing: refresh});
    Campus.Funcs.blog
      .getBlog(id, this.props.store.app.campus.key)
      .then((blog) => this.setState({blog, error: false}))
      .catch((err) => this.setState({error: true}))
      .finally(() => this.setState({refreshing: false}));
  };
  toggleReadStatus = () => {
    AsyncStorage.addReadStatusBlog(this.state.blog.id, this.state.markedAsRead)
      .then(() => this.setState({markedAsRead: !this.state.markedAsRead}))
      .catch((err) => {
        Alert.alert(
          'Read status',
          "Something unexpected happened, we couldn't mark the blog as read",
        );
        analytics.error(err, 'BlogFocus.js', 'toggleReadStatus()');
      });
  };
}

const getDateString = (date = new Date()) =>
  date.toISOString().substring(0, 10);

const styles = StyleSheet.create({
  infoContainer: {
    width: GlobalStyle.Measurements.width,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-around',
    marginVertical: GlobalStyle.Measurements.marginHalf,
  },
  infoText: {
    ...GlobalStyle.TextStyle.bodyMedium,
    maxWidth: GlobalStyle.Measurements.width * 0.35,
  },
  icon: {
    width: GlobalStyle.Measurements.unit * 1.2,
    height: GlobalStyle.Measurements.unit * 1.2,
    borderRadius: GlobalStyle.Measurements.unit * 0.6,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: GlobalStyle.Measurements.marginHalf,
  },
  iconRow: {
    // minWidth: GlobalStyle.Measurements.width * 0.4,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-evenly',
  },
  largeButton: {
    ...GlobalStyle.ButtonStyle.Large,
    justifyContent: 'space-between',
    alignSelf: 'center',
    paddingHorizontal: GlobalStyle.Measurements.margin,
    marginVertical: GlobalStyle.Measurements.margin,
  },
  labelContainer: {
    alignSelf: 'center',
    backgroundColor: '#ccc',

    borderRadius: 30,
    paddingHorizontal: 10,
    paddingVertical: 5,
    marginBottom: GlobalStyle.Measurements.margin,
  },
  labelText: {
    ...GlobalStyle.TextStyle.bodySmall,
    textAlign: 'center',

    color: '#fff',
  },
});
