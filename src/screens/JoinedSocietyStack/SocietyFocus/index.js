import React from 'react';
import {View, ScrollView, RefreshControl} from 'react-native';
import {GlobalStyle} from '../../../assets/GlobalStyle';
import {styles} from './style';
import {Description} from './components/Description';
import {EventCarousel} from '../../EventStack/HomeScreen/components/EventCarousel/EventCarousel';
import {JoinedSocietyFuncs} from './functions';
import {getTagColors, getAllTags} from '../../../assets/Airtable/functions';
import {Store} from '../../../assets/redux/store';
import {BlogSkeleton} from './components/BlogSkeleton';
import {auth} from '../../../assets/Firebase/Firebase';
import {Icons} from '../../EventStack/SocietyPreview/components/Icons';
import {InviteView} from '../../../assets/InviteView';
import {ConfirmationPanel} from '../../../assets/ConfirmationPanel';
import {SocietyPreviewFuncs} from '../../EventStack/SocietyPreview/functions';
import {updateReduxSocieties} from '../../../assets/redux/functions';
import {parseSocietyData} from '../../../assets/Firebase/functions';
import {Campus} from '../../../assets/Campus';

export class JoinedSocietyFocus extends React.Component {
  constructor() {
    super();
    this.scroll = React.createRef();
    this.state = {
      eventInit: false,
      blogInit: false,
      events: [],
      blogs: [],
      refreshing: false,
      tagColors: [],
      tags: [],
      society: {},
    };
  }
  componentDidMount() {
    getTagColors().then((colors) => this.setState({tagColors: colors}));
    getAllTags().then((tags) => this.setState({tags: tags}));
    this.refresh(false);
  }
  render() {
    const society = {
      ...this.props.store.society.societyFocus,
      ...this.state.society,
    };
    const loading = !this.state.blogInit || !this.state.eventInit;
    const isExecutive = society.exec_members.includes(auth.currentUser.uid);

    return (
      <View style={[GlobalStyle.ViewStyle.backgroundView, {flex: 1}]}>
        <GlobalStyle.Header
          destinationType={'goBack'}
          navigation={this.props.navigation}
          title={!loading ? society.name : ''}
          subTitle={!loading ? 'Society' : null}
        />
        <ScrollView
          {...GlobalStyle.Props.backgroundScrollView}
          ref={this.scroll}
          refreshControl={
            <RefreshControl
              refreshing={this.state.refreshing}
              onRefresh={this.refresh}
            />
          }
          showsVerticalScrollIndicator={false}
          contentContainerStyle={styles.scrollContainer}>
          <GlobalStyle.UI.Image
            resize
            style={styles.backgroundImage}
            source={{uri: society.images.background}}
            navigate={this.props.navigation.navigate}
          />
          <Icons society={society} />
          <Description
            text={society.description}
            scrollToTop={(layout) => this.scroll.current.scrollTo(layout)}
          />
          <View style={styles.carousel}>
            <EventCarousel
              dontHide
              dontFilter
              showSkeleton={false}
              data={this.state.events}
              isLoading={loading}
              text={'Upcoming Events'}
              emptyText={"We couldn't find any events 😩"}
              showButton={false}
              tagColors={this.state.tagColors}
              chosenEventTags={this.state.tags}
              colors={this.props.store.app.campus.colors}
              openEvent={this.openEvent}
              refresh={this.getMoreEvents}
              reduxEvents={this.props.store.app.events}
              bookmarks={this.props.store.user.bookmarks}
              // onAddMorePress={isExecutive && this.createEvent}
            />
          </View>
          <View style={styles.carousel}>
            <BlogSkeleton
              showSkeleton={false}
              title={'Announcements'}
              isLoading={loading}
              blogs={this.state.blogs}
              campusKey={this.props.store.app.campus.key}
              navigate={this.props.navigation.navigate}
              showNotification={false}
              showButton={false}
              emptyText={"We couldn't find any blogs 😭"}
              // onAddMorePress={isExecutive && this.createAnnouncement}
            />
          </View>
          <View
            /** Just to create margin to buttons below. We don't know if web or chat will even show so we need universal margin*/
            style={{
              height: GlobalStyle.Measurements.margin * 2,
            }}
          />
          {society.link.show && (
            <GlobalStyle.UI.GreyBackgroundButton
              title={'Go to website'}
              onPress={() =>
                this.props.navigation.navigate('Web View', {
                  url: society.link.url,
                })
              }
            />
          )}
          {society.society_bubble && this.state.isMember && (
            <GlobalStyle.UI.GreyBackgroundButton
              icon={'comments'}
              title={'Go to bubble'}
              onPress={() =>
                this.props.navigation.push('Bubble Focus', {
                  id: society.society_bubble,
                  type: 'bubble',
                })
              }
            />
          )}

          {/* {society.whatsapp_link != '' && (
            <ChatButton
              colors={this.props.store.app.campus.colors}
              link={society.whatsapp_link}
            />
          )} */}
          {isExecutive && (
            <GlobalStyle.UI.GreyBackgroundButton
              onPress={async () => {
                Store.dispatch({
                  type: 'UPDATE_SOCIETY_FOCUS_MANAGE',
                  payload: await parseSocietyData(society, society.id),
                });
                this.props.navigation.navigate('Manage Society Focus');
              }}
              title={'Manage society'}
            />
          )}
          {/* {isExecutive && (
            <GlobalStyle.UI.GreyBackgroundButton
              onPress={async () => {
                Store.dispatch({
                  type: 'UPDATE_SOCIETY_FOCUS_MANAGE',
                  payload: await parseSocietyData(society, society.id),
                });
                this.props.navigation.navigate('Edit Society', {
                  id: society.id,
                });
              }}
              title={'Edit society info'}
            />
          )} */}

          <GlobalStyle.UI.GreyBackgroundButton
            title={'Invite friends'}
            onPress={() => this.setState({showInviteView: true})}
          />

          {this.state.isMember &&
            !society.exec_members.includes((auth.currentUser || {}).uid) && (
              <GlobalStyle.UI.GreyBackgroundButton
                title={'Leave society'}
                red
                onPress={this.updateSocietyMemberStatus}
              />
            )}
        </ScrollView>
        {this.state.init && (
          <GlobalStyle.UI.FloatingButton
            show={!this.state.isMember}
            onPress={this.updateSocietyMemberStatus}
            title={'Join society'}
            colors={this.props.store.app.campus.colors}
          />
        )}
        <ConfirmationPanel
          dontGoBack
          isActive={
            this.state.showConfirmationLoading ||
            this.state.showConfirmationView
          }
          error={this.state.showConfirmationViewError}
          loading={this.state.showConfirmationLoading}
          subTitle={this.state.confirmationSubTitle}
          onClose={() =>
            this.setState({
              showConfirmationView: false,
              showConfirmationLoading: false,
              showConfirmationViewError: false,
            })
          }
          navigation={this.props.navigation}
          colors={this.props.store.app.campus.colors}
          errorText={this.state.confirmationErrorText}
          loadingText={this.state.confirmationLoadingText}
          successText={this.state.confirmationSuccessText}
        />
        <InviteView
          isActive={this.state.showInviteView}
          campus={this.props.store.app.campus}
          onClose={() => this.setState({showInviteView: false})}
          obj={society}
          senderType={isExecutive ? 'society' : 'user'}
          user={this.props.store.user}
          type={'society'}
          isModal={false}
          participants={society.members}
          campusPointSystem={this.props.store.app.campus_point_system}
        />
      </View>
    );
  }
  updateSocietyMemberStatus = () => {
    this.showConfirmationLoading();
    const isMember = this.state.isMember;
    console.log('Is member?', isMember);

    if (isMember)
      this.updateConfirmationTexts(
        'Successfully left',
        'Updating society',
        'Could not leave',
      );
    else
      this.updateConfirmationTexts(
        'Successfully joined',
        'Updating society',
        'Could not join',
      );

    setTimeout(
      () =>
        Campus.Funcs.society
          .updateMembershipStatus(
            this.props.store.app.campus.key,
            this.state.society.id,
            this.state.society.society_bubble,
            !isMember,
            this.props.store.user,
          )
          .then(({isMember}) => {
            if (isMember)
              Campus.Funcs.points
                .triggerPointEvent(
                  'confirmedSociety',
                  this.props.store.app.campus.key,
                  this.props.route.params.showPopup,
                  {obj_id: this.state.society.id},
                )
                .catch(console.warn);
            this.showConfirmation(false);
            this.setState({isMember});
          })
          .catch(() => {
            this.showConfirmation(
              true,
              isMember ? 'Could not leave' : 'Could not join',
            );
          }),
      750,
    );
  };
  showConfirmationLoading = () => {
    this.setState({
      showConfirmationView: false,
      showConfirmationLoading: true,
      showConfirmationViewError: false,
    });
  };
  updateConfirmationTexts = (success, loading, error, subTitle) => {
    this.setState({
      confirmationSuccessText: success,
      confirmationLoadingText: loading,
      confirmationErrorText: error,
      confirmationSubTitle: subTitle,
    });
  };

  openInviteView = async () => {
    SocietyPreviewFuncs.getSociety(
      this.props.store.app.campus.key,
      this.props.store.society.societyFocus.id,
    )
      .then((society) => {
        console.log('Fetched society: ' + society.id);
        this.setState({society: society});
      })
      .catch((err) => {
        console.trace(
          '[Error] Could not get society for opening invite view',
          err,
        );
      });
    this.setState({showInviteView: true});
  };
  refresh = (refreshing = true) => {
    this.setState({refreshing: refreshing});
    JoinedSocietyFuncs.getSociety(
      this.props.store.app.campus.key,
      this.props.store.society.societyFocus.id,
    )
      .then((society) => {
        const isMember = society.members.includes((auth.currentUser || {}).uid);
        this.setState({society: society, isMember});
        updateReduxSocieties([society], this.props.store.app.societies);
      })
      .catch((err) => console.warn('Could not get society for focus', err))
      .finally(() => this.setState({init: true}));

    JoinedSocietyFuncs.getEvents(
      this.props.store.app.campus.key,
      this.props.store.society.societyFocus.id,
    )
      .then((events) => {
        this.setState({
          events: events,
          eventError: true,
          refreshing: false,
          eventInit: true,
        });
      })
      .catch((err) => {
        // console.warn('Could not get society events', err);
        this.setState({
          eventError: true,
          events: [],
          refreshing: false,
          eventInit: true,
        });
      });
    JoinedSocietyFuncs.getBlogs(
      this.props.store.app.campus.key,
      this.props.store.society.societyFocus.id,
    )
      .then((blogs) =>
        this.setState({blogs: blogs, blogInit: true, blogError: false}),
      )
      .catch((err) =>
        this.setState({blogs: [], blogInit: true, blogError: true}),
      );
  };
  getMoreEvents = () => {
    const lastDoc =
      this.state.events.length != 0
        ? this.state.events[this.state.events.length - 1]
        : {end_ms: Date.now()};

    JoinedSocietyFuncs.getEvents(
      this.props.store.app.campus.key,
      this.props.store.society.societyFocus.id,
      lastDoc,
    )
      .then((events) => {
        const arr = this.state.events.concat(events);
        this.setState({events: arr});
      })
      .catch((err) => {
        console.warn('Could not get more society events', err);
        this.setState({events: []});
      });
  };
  openEvent = (item) => {
    this.props.navigation.navigate('Event Focus', {
      id: item.id,
    });
  };
  showConfirmation = (error = false, errorText = null) => {
    setTimeout(
      () =>
        this.setState({
          showConfirmationLoading: false,
          showConfirmationView: true,
          showConfirmationViewError: error,
          confirmationErrorText:
            error === null ? this.state.confirmationErrorText : errorText,
        }),
      500,
    );
    const society = this.state.society;
    if (this.state.isMember)
      society.members = society.members.filter(
        (elem) => elem != auth.currentUser.uid,
      );
    else society.members = society.members.concat([auth.currentUser.uid]);

    updateReduxSocieties([society], this.props.store.app.societies);
  };

  createEvent = () => {
    console.log('Create event');
  };
  createAnnouncement = () => {
    console.log('Create announcement');
  };
}
