import React from 'react';
import {View, FlatList, RefreshControl} from 'react-native';
import {ModalTop} from '../../../assets/ModalTop';
import {GlobalStyle} from '../../../assets/GlobalStyle';
import {styles} from './style';
import {AllBlogsFuncs} from './functions';
import {BlogSnap} from '../../EventStack/HomeScreen/components/BlogCarousel/BlogSnap';
import {EmptyBox} from '../../../assets/EmptyAnimation';
import * as Animatable from 'react-native-animatable';
import {FetchError} from '../../../assets/FetchError/FetchError';
import {analytics} from '../../../assets/Analytics';

export class AllBlogs extends React.Component {
  constructor() {
    super();
    this.state = {
      blogs: [],
      error: false,
      refreshing: false,
      initDone: false,
    };
  }
  componentDidMount() {
    

    this.getBlogs(false);
  }
  render() {
    return (
      <View style={{flex: 1}}>
        <GlobalStyle.Header
          title={'Edit Announcements'}
          navigation={this.props.navigation}
          destinationType={'goBack'}
          colors={this.props.store.app.campus.colors}
        />
        {this.state.error === false ? (
          this.state.blogs.length > 0 ? (
            <FlatList
              {...GlobalStyle.Props.focusBackgroundScrollView}
              key="All_Blogs_Flatlist"
              numColumns={2}
              contentInset={{bottom: GlobalStyle.Measurements.height * 0.15}}
              showsVerticalScrollIndicator={false}
              keyExtractor={(item) => `All_Blogs_Flatlist_${item.id}`}
              style={[
                styles.scroll,
                {paddingVertical: GlobalStyle.Measurements.marginHalf},
              ]}
              renderItem={this.renderItem}
              data={this.state.blogs}
              refreshControl={
                <RefreshControl
                  refreshing={this.state.refreshing}
                  onRefresh={this.getBlogs}
                />
              }
            />
          ) : (
            this.state.initDone &&
            !this.state.refreshing && (
              <View style={styles.fullErrorView}>
                <EmptyBox showButton onPress={this.getBlogs} />
              </View>
            )
          )
        ) : (
          <View style={styles.fullErrorView}>
            <FetchError showButton onPress={this.getBlogs} />
          </View>
        )}
      </View>
    );
  }
  renderItem = ({item, index}) => (
    <Animatable.View
      duration={500}
      delay={50 * Math.floor(index / 2)}
      animation={'fadeInUpBig'}
      style={{
        alignSelf: 'center',
        marginVertical: GlobalStyle.Measurements.marginHalf,
        marginHorizontal: 5,
      }}>
      <BlogSnap
        blog={item}
        navigate={this.props.navigation.navigate}
        showNotification={false}
        target={'Edit Blog'}
        buttonText={'Update Blog'}
      />
    </Animatable.View>
  );
  getBlogs = (refreshing = true) => {
    console.log('Getting blogs');
    this.setState({refreshing: refreshing});
    AllBlogsFuncs.getBlogs(
      this.props.store.app.campus.key,
      this.props.store.society.manageSocietyFocus.id,
    )
      .then((blogs) => this.setState({blogs: blogs, error: false}))
      .catch((err) => {
        console.warn('Could not get blogs for society', err);
        this.setState({error: true});
      })
      .finally(() => this.setState({refreshing: false, initDone: true}));
  };
}
