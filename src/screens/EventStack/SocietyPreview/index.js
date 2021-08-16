import React from 'react';
import {ScrollView, Text, View} from 'react-native';
import {GlobalStyle} from '../../../assets/GlobalStyle';
import {ModalTop} from '../../../assets/ModalTop';
import {Icons} from './components/Icons';
import {styles} from './style';
import {Description} from '../../JoinedSocietyStack/SocietyFocus/components/Description';
import {InviteView} from '../../../assets/InviteView';
import {SocietyFloatingButtons} from './components/SocietyFloatingButtons';
import {EventCarousel} from '../HomeScreen/components/EventCarousel/EventCarousel';
import {ConfirmationPanel} from '../../../assets/ConfirmationPanel';
import {SocietyPreviewFuncs} from './functions';
import {ChatButton} from '../../JoinedSocietyStack/SocietyFocus/components/ChatButton';
import {WebButton} from '../../JoinedSocietyStack/SocietyFocus/components/WebButton';
import {getAllTags, getTagColors} from '../../../assets/Airtable/functions';
import {auth} from '../../../assets/Firebase/Firebase';
import SkeletonContent from 'react-native-skeleton-content-nonexpo';
import {societyPreviewSkeletonLayout} from './components/Skeleton';
import {FetchError} from '../../../assets/FetchError/FetchError';
import {updateReduxSocieties} from '../../../assets/redux/functions';
import {analytics} from '../../../assets/Analytics';
import {SubmittedInfoForSuAdmin} from './components/SubmittedInfoForSuAdmin';
import {Campus} from '../../../assets/Campus';

export class SocietyPreview extends React.Component {
  constructor() {
    super();
    this.state = {
      showInviteView: false,

      showConfirmationView: false,
      showConfirmationLoading: false,
      showConfirmationViewError: false,
      confirmationSuccessText: '',
      confirmationLoadingText: '',
      confirmationErrorText: '',
      confirmationSubTitle: '',

      events: [],
      eventError: false,
      fetchingEvents: true,
      tagColors: [],
      init: false,
      fetchSocietyError: false,
      societyID: '-',

      tagColors: [],
      tags: [],

      society: {images: {background: ''}, members: []},
    };
    this.scroll = React.createRef();
  }
  componentDidMount() {
    const params = {id: '', ...this.props.route.params};
    this.setState({societyID: params.id});

    setTimeout(() => this.getSociety(params.id), 1000);

    getTagColors().then((colors) => this.setState({tagColors: colors}));
    getAllTags().then((tags) => this.setState({tags: tags}));
  }
  render() {
    const society = {
      ...this.props.store.society.societyFocus,
      ...this.state.society,
    };
    const userIsSuAdmin = this.props.store.user.su_admin;
    const isMember = this.state.isMember;

    return (
      <View style={{flex: 1}}>
        <ModalTop
          title={society.name}
          onPress={this.props.navigation.goBack}
          title={this.state.init ? society.name : ''}
          subTitle={this.state.init ? 'Society' : ''}
          bookmarks={this.props.store.user.bookmarks}
          bookmarkType={'society'}
          objId={society.id}
        />
        <ScrollView
          {...GlobalStyle.Props.focusBackgroundScrollView}
          ref={this.scroll}
          showsVerticalScrollIndicator={false}
          style={styles.scroll}
          contentContainerStyle={styles.container}>
          <SkeletonContent
            isLoading={!this.state.init}
            style={{
              alignItems: 'center',
              width: GlobalStyle.Measurements.width,
              flex: 1,
            }}
            layout={societyPreviewSkeletonLayout}>
            {!this.state.fetchSocietyError ? (
              <React.Fragment>
                {userIsSuAdmin && !society.visible && !society.confirmed && (
                  <SubmittedInfoForSuAdmin />
                )}
                <GlobalStyle.UI.Image
                  resize={true}
                  source={{uri: society.images.background}}
                  style={styles.background}
                  navigate={this.props.navigation.navigate}
                />
                <Icons society={society} />
                <Description
                  scrollToTop={(layout) => this.scroll.current.scrollTo(layout)}
                  text={society.description}
                />
                {society.visible && (
                  <EventCarousel
                    dontHide
                    showButton={false}
                    refresh={this.getEvents}
                    tagColors={this.state.tagColors}
                    chosenEventTags={this.state.tags}
                    showSkeleton={false}
                    isLoading={this.state.fetchingEvents}
                    colors={this.props.store.app.campus.colors}
                    data={this.state.events}
                    text={'Society events'}
                    emptyText={"We couldn't find any events 😩"}
                    openEvent={this.openEvent}
                    dontFilter
                    reduxEvents={this.props.store.app.events}
                    bookmarks={this.props.store.user.bookmarks}
                  />
                )}
                <View style={{height: GlobalStyle.Measurements.margin * 2}} />
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
                {society.whatsapp_link != '' && (
                  <ChatButton link={society.whatsapp_link} />
                )}

                <GlobalStyle.UI.GreyBackgroundButton
                  title={'Invite friends'}
                  onPress={() => this.setState({showInviteView: true})}
                />

                {society.society_bubble && isMember && (
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
                {isMember &&
                  !society.exec_members.includes(
                    (auth.currentUser || {}).uid,
                  ) && (
                    <GlobalStyle.UI.GreyBackgroundButton
                      title={'Leave society'}
                      red
                      onPress={this.updateSocietyMemberStatus}
                    />
                  )}
              </React.Fragment>
            ) : (
              <View
                style={{
                  flex: 1,
                  height: GlobalStyle.Measurements.height * 0.6,
                  alignItems: 'center',
                  justifyContent: 'center',
                }}>
                <FetchError
                  errorText={
                    "We couldn't fetch the society\nPlease try again later"
                  }
                />
              </View>
            )}
          </SkeletonContent>
        </ScrollView>
        {this.state.init && (
          <GlobalStyle.UI.FloatingButton
            show={!isMember}
            onPress={this.updateSocietyMemberStatus}
            title={'Join society'}
            colors={this.props.store.app.campus.colors}
          />
        )}
        {/* <SocietyFloatingButtons
          modal
          disabled={!this.state.init || this.state.fetchSocietyError}
          user={this.props.store.user}
          society={society}
          campusKey={this.props.store.app.campus.key}
          colors={this.props.store.app.campus.colors}
          updateTexts={(success, loading, error, subTitle) =>
            this.setState({
              confirmationSuccessText: success,
              confirmationLoadingText: loading,
              confirmationErrorText: error,
              confirmationSubTitle: subTitle,
            })
          }
          openInviteView={() => this.setState({showInviteView: true})}
          showLoading={() =>
            this.setState({
              showConfirmationView: false,
              showConfirmationLoading: true,
              showConfirmationViewError: false,
            })
          }
          openInviteView={() => this.setState({showInviteView: true})}
          showConfirmationLoading={() =>
            this.setState({showConfirmationLoading: true})
          }
          showConfirmation={(error = false, errorText = null) => {
            setTimeout(
              () =>
                this.setState({
                  showConfirmationLoading: false,
                  showConfirmationView: true,
                  showConfirmationViewError: error,
                  confirmationErrorText:
                    error === null
                      ? this.state.confirmationErrorText
                      : errorText,
                }),
              500,
            );
            const society = this.state.society;
            if (society.members.includes(auth.currentUser.uid))
              society.members = society.members.filter(
                (elem) => elem != auth.currentUser.uid,
              );
            else
              society.members = society.members.concat([auth.currentUser.uid]);

            updateReduxSocieties([society], this.props.store.app.societies);
          }}
        /> */}
        <ConfirmationPanel
          dontGoBack
          isModal
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
          navigationTitle={
            society.bubble_id &&
            society.members.includes(auth.currentUser.uid) &&
            'Go to event bubble'
          }
          onNavigationPress={() =>
            this.props.navigation.navigate('Bubble Focus', {
              id: this.state.societyID,
            })
          }
        />
        {this.state.societyID !== '-' && (
          <InviteView
            isActive={this.state.showInviteView}
            campus={this.props.store.app.campus}
            onClose={() => this.setState({showInviteView: false})}
            obj={{...society, id: this.state.societyID}}
            senderType={
              this.props.store.society.societyFocus.exec_members.includes(
                auth.currentUser.uid,
              )
                ? 'society'
                : 'user'
            }
            user={this.props.store.user}
            type={'society'}
            participants={this.state.society.members}
            campusPointSystem={this.props.store.app.campus_point_system}
          />
        )}
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
            this.state.societyID,
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
                  {obj_id: this.state.societyID},
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
  openEvent = (event) => {
    this.props.navigation.push('Event Focus', {id: event.id});
  };
  getEvents = async () => {
    const currentEvents = this.state.events.length > 0 ? this.state.events : [];
    SocietyPreviewFuncs.getEvents(
      this.props.store.app.campus.key,
      this.state.societyID,
      currentEvents.length > 0
        ? currentEvents[currentEvents.length - 1]
        : {end_ms: Date.now()},
    )
      .then((events) =>
        this.setState({
          events: currentEvents.concat(events),
          fetchingEvents: false,
        }),
      )
      .catch((err) => {
        this.setState({events: [], fetchingEvents: false});
        console.warn('Could not get events', err);
      });
  };
  getSociety = (societyID) => {
    SocietyPreviewFuncs.getSociety(this.props.store.app.campus.key, societyID)
      .then((society) => {
        this.setState({societyID: societyID}, () => this.getEvents());

        this.setState({
          society: society,
          isMember: society.members.includes((auth.currentUser || {}).uid),
          fetchSocietyError: false,
        });
      })
      .catch((err) => {
        this.setState({society: {}, fetchSocietyError: true});
        // console.warn('Could not get society at society preview', err);
      })
      .finally(() => this.setState({init: true}));
  };

  updateConfirmationTexts = (success, loading, error, subTitle) => {
    this.setState({
      confirmationSuccessText: success,
      confirmationLoadingText: loading,
      confirmationErrorText: error,
      confirmationSubTitle: subTitle,
    });
  };
  showConfirmationLoading = () => {
    this.setState({
      showConfirmationView: false,
      showConfirmationLoading: true,
      showConfirmationViewError: false,
    });
  };
  openInviteView = () => {
    this.setState({showConfirmationLoading: true});
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
}
