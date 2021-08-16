import React from 'react';
import {View, Text, Alert, ScrollView, TouchableOpacity} from 'react-native';
import {ModalTop} from '../../../assets/ModalTop';
import {styles} from '../ManageSocietyFocus/style';
import {EventSnap} from '../../EventStack/HomeScreen/components/EventCarousel/EventSnap';
import {getTagColors} from '../../../assets/Airtable/functions';
import {CustomTextInput} from '../CreateEvent/components/CustomTextInput';
import {DatePicker} from '../CreateEvent/components/DatePicker';
import {LocationInput} from '../CreateEvent/components/LocationInput';
import {MultiSelect} from '../CreateEvent/components/MultiSelect';
import {NumberPicker} from '../CreateEvent/components/NumberPicker';
import {SwitchComponent} from '../CreateEvent/components/Switch';
// import SegmentedControl from '@react-native-community/segmented-control';
import {CustomTextInputWithSwitchOrIcon} from '../CreateEvent/components/TextInputWithSwitch';
import {SwipeUpViewLarge, SwipeUpViewSmall} from '../../../assets/SwipeUpView';
import {GlobalStyle} from '../../../assets/GlobalStyle';
import ImagePicker from 'react-native-image-picker';
import {ConfirmationPanel} from '../../../assets/ConfirmationPanel';
import TouchableShrink from '../../../assets/TouchableShrink/TouchableShrink';
import {Funcs} from './functions';
import {EventView} from '../../EventStack/EventFocus/components/EventView';
import {CustomTouchable} from '../CreateEvent/components/CustomTouchable';
import {validateEvent} from '../CreateEvent/functions';
import {SegmentControl} from '../../../assets/SegmentControl';
import {analytics} from '../../../assets/Analytics';
import RNDatePickerModal from 'react-native-modal-datetime-picker';

export class EditEvent extends React.Component {
  constructor() {
    super();
    this.state = {
      initDone: false, //Update state with props we get from the event in focus in redux
      tagColors: [],

      editing: true, // Show Edit view if true and Preview if false
      selectedIndex: 0, // The index that the Segment Control has selected
      repeatSwitch: false, // The value from the repeat switch
      showSwipeUpSmall: false, // Show swipe up small
      showSwipeUpLarge: false, // Show swipe up large
      swipeUpType: '', // What to show in the <SwipeUpViewSmall />
      datePickerType: '', // Which date component to show in <SwipeUpViewSmall />
      tagColors: {}, // The tag colors to show
      uploaded: false, // Update when the event has been created and show confirmation
      uploading: false, // When we have started to create the event
      errorUploading: false, // If creation of event went wrong

      validations: {
        title: false,
        description: false,
        pricing: false,
        tags: false,
        link: false,
        location: false,
        repeat: false,
      }, // The object with validations once user submits the info

      successText: 'We have updated your event', // Text to show in confirmation panel
      errorText: 'We could not update your event', // Text to show in confirmation panel
      loadingText: 'We are updating your event', // Text to show in confirmation panel

      // EVENT DATA BELOW
      title: '',
      id: '',
      images: {
        preview: '',
        background: '',
      },
      pricing: {show: false, price: 0, currency: '£'},
      tags: [],
      date: {start: new Date(), end: new Date()},
      description: '',
      repeat: {
        doesRepeat: false,
        interval: 0, // Days
      },
      link: {show: false, url: ''},
      participants: [],
      location: {
        latitude: 51.9986,
        longitude: -0.989,
        name: 'Room 3',
        show: false,
        address: 'Perfect Location',
      },
      number_of_participants: 74,
    };

    /**
     * This constructors will store layout for text inputs
     * They will be used to focus on each component
     */
    this._scroll = React.createRef();
    this.__price;
    this.__description;
    this.__title;
    this.__website;
  }

  async componentDidMount() {
    

    this.setState({...this.props.store.editEventFocus, initDone: true});
    const tagColors = await getTagColors();
    this.setState({tagColors: tagColors});
  }
  render() {
    return (
      <View style={{flex: 1}}>
        <GlobalStyle.Header
          title={'Edit Event'}
          navigation={this.props.navigation}
          destinationType={'goBack'}
          colors={this.props.store.app.campus.colors}
        />
        <ScrollView
          keyboardShouldPersistTaps={'handled'}
          {...GlobalStyle.Props.focusBackgroundScrollView}
          style={styles.scroll}
          showsVerticalScrollIndicator={false}
          ref={this._scroll}>
          <SegmentControl
            segments={segmentValues}
            index={this.state.selectedIndex}
            onIndexChange={this.onSegmentChange}
          />
          {this.state.editing ? (
            <View>
              <View style={styles.snapContainer}>
                {this.state.initDone && (
                  <EventSnap
                    data={this.state}
                    colors={this.props.store.app.campus.colors}
                    tagColors={this.state.tagColors}
                  />
                )}
              </View>
              <View style={styles.textInputContainer}>
                <CustomTextInput
                  onLayout={(event) =>
                    (this.__title = event.nativeEvent.layout)
                  }
                  focus={() => this.scrollTo(this.__title)}
                  defaultValue={this.state.title}
                  type="Title"
                  placeHolder="What's your title?"
                  onChangeText={(text) =>
                    this.setState({title: text, scrollIntoViewType: 'title'})
                  }
                  error={this.state.validations.title}
                  minLength={5}
                  maxLength={35}
                />
                <GlobalStyle.Line />
                <CustomTextInput
                  onLayout={(event) =>
                    (this.__description = event.nativeEvent.layout)
                  }
                  focus={() => this.scrollTo(this.__description)}
                  multiline
                  minLength={50}
                  defaultValue={this.state.description}
                  type="Description"
                  placeHolder="Describe the event and why people should come to it"
                  onChangeText={(text) => this.setState({description: text})}
                  error={this.state.validations.description}
                />
                <GlobalStyle.Line />
                <CustomTextInputWithSwitchOrIcon
                  type={'Price in £'}
                  keyboardType={'decimal-pad'}
                  onLayout={(event) =>
                    (this.__price = event.nativeEvent.layout)
                  }
                  defaultValue={this.state.pricing.price}
                  focus={() => this.scrollTo(this.__price)}
                  placeHolder={'Flip switch to show price'}
                  onChangeText={(text) =>
                    this.setState({
                      pricing: {
                        ...this.state.pricing,
                        price: text,
                        show: text.length > 0,
                      },
                    })
                  }
                  error={this.state.validations.pricing}
                  onValueChange={(value) =>
                    this.setState({
                      pricing: {...this.state.pricing, show: value},
                    })
                  }
                  isChecked={this.state.pricing.show}
                />
                <GlobalStyle.Line />
                <CustomTextInputWithSwitchOrIcon
                  type="Website"
                  onLayout={(event) =>
                    (this.__website = event.nativeEvent.layout)
                  }
                  keyboardType="url"
                  defaultValue={this.state.link.url}
                  focus={() => this.scrollTo(this.__website)}
                  placeHolder="Write your website. "
                  onChangeText={(text) =>
                    this.setState({link: {...this.state.link, url: text}})
                  }
                  onValueChange={(value) => {
                    this.setState({link: {...this.state.link, show: value}});
                  }}
                  isChecked={this.state.link.show}
                  error={this.state.validations.link}
                />

                <GlobalStyle.Line
                  width={GlobalStyle.Measurements.width * 0.9}
                />
                <CustomTouchable
                  onLayout={(event) =>
                    (this.__preview = event.nativeEvent.layout)
                  }
                  onPress={() => this.selectImage('preview')}
                  text={'Choose preview image'}
                  error={this.state.validations.images_preview}
                />
                <GlobalStyle.Line />
                <CustomTouchable
                  onLayout={(event) =>
                    (this.__background = event.nativeEvent.layout)
                  }
                  onPress={() => this.selectImage('background')}
                  text={'Choose background image'}
                  error={this.state.validations.images_background}
                />
                <GlobalStyle.Line />
                <CustomTouchable
                  style={styles.textInputView}
                  onPress={() =>
                    this.setState({
                      // showSwipeUpSmall: true,
                      // swipeUpType: 'date',
                      datePickerType: 'start',
                      showDatePicker: true,
                    })
                  }
                  text={'Set start time'}
                  subText={this.state.date.start
                    .toLocaleString()
                    .substring(0, 17)}
                />
                <GlobalStyle.Line />
                <CustomTouchable
                  onPress={() =>
                    this.setState({
                      // showSwipeUpSmall: true,
                      // swipeUpType: 'date',
                      datePickerType: 'end',
                      showDatePicker: true,
                    })
                  }
                  text={'Set end time'}
                  subText={this.state.date.end
                    .toLocaleString()
                    .substring(0, 17)}
                />
                <GlobalStyle.Line />
                {/* <SwitchComponent
                  text="Repeat this event"
                  subText={`Every ${this.state.repeat.interval} day(s). `}
                  value={this.state.repeat.doesRepeat}
                  onValueChange={this.onReapetSwitchValueChange}
                  error={this.state.validations.repeat}
                />
                <GlobalStyle.Line /> */}
                <CustomTouchable
                  onPress={() =>
                    this.setState({
                      showSwipeUpLarge: true,
                      swipeUpType: 'tags',
                    })
                  }
                  text={'Choose event tags'}
                  subText={this.state.tags.join(', ')}
                />
                <GlobalStyle.Line />

                <SwitchComponent
                  onPress={() =>
                    this.setState({
                      showSwipeUpLarge: true,
                      swipeUpType: 'location',
                    })
                  }
                  error={this.state.validations.location}
                  text={'Select location'}
                  value={this.state.location.show}
                  onValueChange={(e) =>
                    this.setState({location: {...this.state.location, show: e}})
                  }
                  subText={`${this.state.location.name} ${this.state.location.address}`}
                />
              </View>
              <TouchableShrink
                style={styles.largeButton}
                showGradient
                gradientColor={this.props.store.app.campus.colors.main}
                      showIcon
                onPress={this.updateEvent}>
                <Text style={GlobalStyle.TextStyle.buttonLarge}>
                  Update Event
                </Text>
              </TouchableShrink>
              <TouchableShrink triggerHaptic onPress={this.deleteEvent}>
                <Text style={GlobalStyle.ButtonStyle.DestructiveTextButton}>
                  Delete Event
                </Text>
              </TouchableShrink>
            </View>
          ) : (
            <View style={styles.eventViewContainer}>
              <EventView
                event={{...this.state, _loading: false}}
                colors={this.props.store.app.campus.colors}
                hasFetchedSociety={false}
                editing
                navigation={this.props.navigation}
              />
            </View>
          )}
        </ScrollView>

        <SwipeUpViewSmall
          isActive={this.state.showSwipeUpSmall}
          canScroll={false}
          onClose={this.onSwipeUpViewClose}>
          {this.state.swipeUpType === 'date' ? (
            <DatePicker
              title="Pick the perfect date"
              update={true}
              type={this.state.datePickerType}
              date={this.state.date[this.state.datePickerType]}
              minimumDate={this.state.date.start}
              isUpdating
              colors={this.props.store.app.campus.colors}
              onSwipeUpViewClose={this.onSwipeUpViewClose}
              onDateChange={
                this.state.datePickerType === 'start'
                  ? this.onStartDateChange
                  : this.onEndDateChange
              }
            />
          ) : (
            this.state.swipeUpType === 'repeat' && (
              <NumberPicker
                title="Pick the repeat interval"
                selectedValue={this.state.repeat.interval}
                colors={this.props.store.app.campus.colors}
                onValueChange={this.onNumberPickerChange}
                onSwipeUpViewClose={this.onSwipeUpViewClose}
              />
            )
          )}
        </SwipeUpViewSmall>
        <SwipeUpViewLarge
          isActive={this.state.showSwipeUpLarge}
          canScroll={false}
          onClose={() => this.setState({showSwipeUpLarge: false})}>
          {this.state.swipeUpType === 'location' ? (
            <LocationInput
              onLocationUpdate={this.onLocationUpdate}
              colors={this.props.store.app.campus.colors}
              onSwipeUpViewClose={() =>
                this.setState({showSwipeUpLarge: false})
              }
              title={'Search Location'}
            />
          ) : (
            this.state.swipeUpType === 'tags' && (
              <MultiSelect
                getTagColors={this.getTagColors}
                selectedTags={this.state.tags}
                title="Choose 3 Great Tags"
                colors={this.props.store.app.campus.colors}
                onTagClick={this.onTagClick}
                onSwipeUpViewClose={() =>
                  this.setState({showSwipeUpLarge: false})
                }
              />
            )
          )}
        </SwipeUpViewLarge>
        <RNDatePickerModal
          date={this.state.date[this.state.datePickerType]}
          minimumDate={this.state.date.start}
          onCancel={() => this.setState({showDatePicker: false})}
          isVisible={this.state.showDatePicker}
          mode={'datetime'}
          onConfirm={(date) => {
            this.setState({showDatePicker: false});
            this.state.datePickerType === 'start'
              ? this.onStartDateChange(date)
              : this.onEndDateChange(date);
          }}
        />
        <ConfirmationPanel
          dontGoBack={
            this.state.uploaded === false || this.state.errorUploading
          }
          validationError={Object.values(this.state.validations).some(
            (elem) => elem !== false,
          )}
          isActive={this.state.uploading || this.state.uploaded}
          event={this.state}
          colors={this.props.store.app.campus.colors}
          onClose={this.onConfirmationClose}
          navigation={this.props.navigation}
          loading={this.state.uploading}
          error={this.state.errorUploading}
          successText={this.state.successText}
          errorText={this.state.errorText}
          loadingText={this.state.loadingText}
          subTitle="The president must confirm changes to events"
        
        />
      </View>
    );
  }
  onConfirmationClose = () => {
    this.setState({uploaded: false, uploading: false});
  };
  onSegmentChange = (index) => {
    const editing = index == 0;

    this.setState({
      editing: editing,
      selectedIndex: index,
    });
  };
  onLocationUpdate = (location = Object) => {
    this.setState({location: location});
  };
  getTagColors = async () => {
    const tagColors = await getTagColors();
    this.setState({tagColors: tagColors});
  };
  scrollTo = (ref) => {
    console.log(ref.y);
    this._scroll.current.scrollTo({
      y: GlobalStyle.Measurements.safeheight * 0.2 + ref.y,
      animated: true,
    });
  };
  onReapetSwitchValueChange = (e) => {
    const showSwipeUp = e === true; // Should we prompt the user for a picker to show up?
    this.setState({
      repeat: {...this.state.repeat, doesRepeat: e},
      showSwipeUpSmall: showSwipeUp,
      swipeUpType: 'repeat',
    });
  };
  onStartDateChange = (date = Date) => {
    // Set the state to the selected date by user
    console.log('Updating start date');
    this.setState({date: {...this.state.date, start: date}});
  };
  onEndDateChange = (date = Date) => {
    // Set the state to the selected date by user
    console.log('Updating end date');

    this.setState({date: {...this.state.date, end: date}});
  };
  onSwipeUpViewClose = () => {
    // Close swipe up by setting its visibility prop to false
    this.setState({showSwipeUpSmall: false});
  };
  selectImage = (type = String) => {
    const imageOptions = {
      title: 'Select Image',
      storageOptions: {
        skipBackup: true,
        path: 'images',
      },
    };
    ImagePicker.showImagePicker(imageOptions, (response) => {
      if (response.didCancel) {
        console.log('User cancelled image picker');
      } else if (response.error) {
        console.log('ImagePicker Error: ', response.error);
        Alert.alert(
          'Camera Unavailable',
          "We couldn't access your camera, please check your settings for the app",
          [
            {text: 'Settings', onPress: () => Linking.openSettings()},
            {text: 'Ok'},
          ],
        );
      } else {
        const source = response.uri;
        const stateUpdate = {...this.state.images};
        stateUpdate[type] = source;

        this.setState({
          images: stateUpdate,
        });
      }
    });
  };
  onNumberPickerChange = (itemValue, itemIndex) => {
    this.setState({repeat: {...this.state.repeat, interval: itemValue}});
  };
  onTagClick = (tag, isSelected) => {
    var {tags} = this.state;

    if (isSelected === false) {
      if (tags.length !== 3) {
        tags.push(tag);
        this.setState({tags: tags});
      } else {
        Alert.alert(
          'Event Tags',
          'You can only select three tags for your event',
        );
      }
    } else if (isSelected === true) {
      const index = tags.indexOf(tag);
      if (index > -1) {
        tags.splice(index, 1);
      }
      this.setState({tags: tags});
    }
  };
  updateEvent = async () => {
    this.setState({
      uploading: true,
      successText: 'We have updated your event', // Text to show in confirmation panel
      errorText: 'We could not update your event', // Text to show in confirmation panel
      loadingText: 'We are updating your event',
    });
    validateEvent(this.state).then((vals) => {
      this.setState({validations: vals});
      if (Object.values(vals).every((elem) => elem == false)) {
        console.log('All validations are checked and passed');
        Funcs.updatEvent(
          this.state,
          this.props.store.editEventFocus,
          this.props.store.app.campus.key,
        )
          .then(() =>
            setTimeout(
              () =>
                this.setState({
                  uploading: false,
                  uploaded: true,
                  errorUploading: false,
                }),
              500,
            ),
          )
          .catch((err) => {
            console.log('Could not update event', err);
            setTimeout(
              () => this.setState({uploading: false, errorUploading: true}),
              500,
            );
          });
      } else {
        console.log('There are validation errors', vals);
        this.setState({uploading: false, uploaded: true, errorUploading: true});
      }
    });
  };
  deleteEvent = async () => {
    Alert.alert('Delete Event', 'Are you sure you want to delete this event?', [
      {
        text: 'Delete',
        onPress: () => {
          this.setState({
            uploading: true,
            successText: 'We have deleted your event', // Text to show in confirmation panel
            errorText: 'We could not delete your event', // Text to show in confirmation panel
            loadingText: 'We are deleting your event',
          });
          Funcs.deleteEvent(this.props.store.app.campus.key, this.state)
            .then(() => {
              setTimeout(
                () =>
                  this.setState({
                    uploading: false,
                    uploaded: true,
                    error: false,
                  }),
                500,
              );
            })
            .catch((err) =>
              setTimeout(() =>
                this.setState({uploading: false, uploaded: true, error: true}),
              ),
            );
        },
        style: 'destructive',
      },
      {text: 'Cancel'},
    ]);
  };
}
const segmentValues = ['Edit', 'Preview'];
