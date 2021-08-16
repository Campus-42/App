import React from 'react';
import {View, ScrollView, Text, Linking, Alert} from 'react-native';
import {styles} from '../ManageSocietyFocus/style';
import {EventSnap} from '../../EventStack/HomeScreen/components/EventCarousel/EventSnap';
import {getTagColors} from '../../../assets/Airtable/functions';
import {CustomTextInput} from './components/CustomTextInput';
import ImagePicker from 'react-native-image-picker';
import {SwipeUpViewLarge, SwipeUpViewSmall} from '../../../assets/SwipeUpView';
import {DatePicker} from './components/DatePicker';
import TouchableShrink from '../../../assets/TouchableShrink/TouchableShrink';
import {GlobalStyle} from '../../../assets/GlobalStyle';
import {SwitchComponent} from './components/Switch';
import {ModalTop} from '../../../assets/ModalTop';
import {NumberPicker} from './components/NumberPicker';
import {MultiSelect} from './components/MultiSelect';
import {createEvent, validateEvent} from './functions';
import {CustomTextInputWithSwitchOrIcon} from './components/TextInputWithSwitch';
import {LocationInput} from './components/LocationInput';
import {EventView} from '../../EventStack/EventFocus/components/EventView';
import {ConfirmationPanel} from '../../../assets/ConfirmationPanel';
import {CustomTouchable} from './components/CustomTouchable';
import {SegmentControl} from '../../../assets/SegmentControl';
import {analytics} from '../../../assets/Analytics';
import RNDatePickerModal from 'react-native-modal-datetime-picker';

// TODO: How many times to repeat, Alert(Weekly, Every Fortnight, Monthly, Quarterly, Custom)

export class CreateEvent extends React.Component {
  constructor() {
    super();
    /**
     * State will be passed down as a whole to EventSnap as data
     */
    this.state = {
      editing: true, // Show Edit view if true and Preview if false
      selectedIndex: 0, // The index that the Segment Control has selected
      repeatSwitch: false, // The value from the repeat switch
      showSwipeUpSmall: false, // Show swipe up small
      showSwipeUpLarge: false, // Show swipe up large
      swipeUpType: '', // What to show in the <SwipeUpViewSmall />
      datePickerType: '', // Which date component to show in <SwipeUpViewSmall />
      tagColors: {}, // The tag colors to show
      created: false, // Update when the event has been created and show confirmation
      creating: false, // When we have started to create the event
      errorCreating: false, // If creation of event went wrong

      validations: {
        title: false,
        description: false,
        pricing: false,
        tags: false,
        link: false,
        location: false,
        repeat: false,
      }, // The object with validations once user submits the info

      // EVENT DATA BELOW
      title: '',
      id: 'Example',
      images: {
        preview: '',
        background: '',
      },
      pricing: {show: false, price: '', currency: '£'},
      tags: [],
      date: {start: new Date(), end: new Date()},
      description: '',
      repeat: {
        doesRepeat: false,
        interval: 0, // Days
      },
      link: {show: false, url: ''},
      location: {
        latitude: 0,
        longitude: 0,
        show: false,
        name: 'Select the location. Flip switch to show',
        address: '',
      },
      participants: [],
      number_of_participants: 0,
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
    this.getTagColors();
  }
  render() {
    return (
      <View style={styles.top}>
        <GlobalStyle.Header
          title={'Create Event'}
          navigation={this.props.navigation}
          destinationType={'goBack'}
          colors={this.props.store.app.campus.colors}
        />
        <ScrollView
          {...GlobalStyle.Props.backgroundScrollView}
          showsVerticalScrollIndicator={false}
          style={styles.scroll}
          ref={this._scroll}>
          <SegmentControl
            segments={segmentValues}
            index={this.state.selectedIndex}
            onIndexChange={this.onSegmentChange}
          />
          {this.state.editing ? (
            <View style={{width: GlobalStyle.Measurements.width}}>
              <View style={styles.snapContainer}>
                <EventSnap
                  data={this.state}
                  shouldOnPress={false}
                  tagColors={this.state.tagColors}
                  colors={this.props.store.app.campus.colors}
                  dontShowBookmark
                />
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
                  maxLength={35}
                  minLength={5}
                  onChangeText={(text) =>
                    this.setState({title: text, scrollIntoViewType: 'title'})
                  }
                  error={this.state.validations.title}
                />
                <GlobalStyle.Line />
                <CustomTextInput
                  onLayout={(event) =>
                    (this.__description = event.nativeEvent.layout)
                  }
                  focus={() => this.scrollTo(this.__description)}
                  multiline
                  defaultValue={this.state.description}
                  type="Description"
                  minLength={50}
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
                  type="Event website"
                  onLayout={(event) =>
                    (this.__website = event.nativeEvent.layout)
                  }
                  keyboardType="url"
                  defaultValue={this.state.link.url}
                  focus={() => this.scrollTo(this.__website)}
                  placeHolder="Flip switch to show website"
                  onChangeText={(text) =>
                    this.setState({
                      link: {
                        ...this.state.link,
                        url: text,
                        show: text.length > 0,
                      },
                    })
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
                  onPress={() =>
                    this.setState({
                      // showSwipeUpSmall: true,
                      // swipeUpType: 'date',
                      showDatePicker: true,
                      datePickerType: 'start',
                    })
                  }
                  text={'Set start time'}
                  subText={this.state.date.start
                    .toLocaleString()
                    .substring(0, 17)}
                />

                <GlobalStyle.Line />
                <CustomTouchable
                  text={'Set end time'}
                  subText={this.state.date.end
                    .toLocaleString()
                    .substring(0, 17)}
                  onPress={() =>
                    this.setState({
                      // showSwipeUpSmall: true,
                      // swipeUpType: 'date',
                      datePickerType: 'end',
                      showDatePicker: true,
                    })
                  }
                />
                <GlobalStyle.Line />
                {/* <SwitchComponent
                  text="Select repeat interval"
                  subText={`Every ${this.state.repeat.interval} day(s). `}
                  value={this.state.repeat.doesRepeat}
                  onValueChange={this.onReapetSwitchValueChange}
                  onPress={() => this.onReapetSwitchValueChange(true)}
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
                  error={this.state.validations.tags}
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
                  onValueChange={(e) => {
                    this.setState({
                      location: {...this.state.location, show: e},
                    });
                    e == true &&
                      this.setState({
                        showSwipeUpLarge: true,
                        swipeUpType: 'location',
                      });
                  }}
                  subText={`${this.state.location.name} ${this.state.location.address}`}
                />
              </View>

              <TouchableShrink
                style={styles.largeButton}
                showGradient
                gradientColor={this.props.store.app.campus.colors.main}
                      showIcon
                onPress={this.createEvent}>
                <Text style={GlobalStyle.TextStyle.buttonLarge}>
                  Create Event
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
              type={this.state.datePickerType}
              date={this.state.date[this.state.datePickerType]}
              colors={this.props.store.app.campus.colors}
              minimumDate={this.state.date.start}
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
          dontGoBack={this.state.created === false || this.state.errorCreating}
          isActive={this.state.creating || this.state.created}
          validationError={Object.values(this.state.validations).some(
            (elem) => elem !== false,
          )}
          event={this.state}
          colors={this.props.store.app.campus.colors}
          onClose={this.onConfirmationClose}
          navigation={this.props.navigation}
          loading={this.state.creating}
          error={this.state.errorCreating}
          successText={'We have created your event'}
          errorText={'We could not create your event'}
          loadingText={"We're creating your event"}
          subTitle="The president must confirm new events"
     
        />
      </View>
    );
  }
  onConfirmationClose = () => {
    this.setState({created: false, creating: false});
  };
  animateTo = (screen = 'edit' || 'preview') => {
    if (screen === 'edit') {
    }
  };
  onSegmentChange = (index) => {
    const editing = index == 0;

    this.setState({
      editing: editing,
      selectedIndex: index,
    });
  };
  onLocationUpdate = (location = Object) => {
    console.log('location', location);
    this.setState({location: location});
  };
  getTagColors = async () => {
    const tagColors = await getTagColors();
    this.setState({tagColors: tagColors});
  };
  scrollTo = (ref) => {
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
    this.setState({date: {...this.state.date, start: date}});
  };
  onEndDateChange = (date = Date) => {
    // Set the state to the selected date by user
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
  createEvent = async () => {
    this.setState({creating: true});
    validateEvent(this.state).then((vals) => {
      this.setState({validations: vals});
      if (Object.values(vals).every((elem) => elem == false)) {
        console.log('All validations are checked and passed');
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
          createEvent(
            this.state,
            this.props.store.app.campus.key,
            this.props.store.society.manageSocietyFocus.id,
            this.props.store.society.manageSocietyFocus.exec_roles.president,
            this.props.store.society.manageSocietyFocus.name,
          )
            .then(() =>
              setTimeout(
                () =>
                  this.setState({
                    created: true,
                    errorCreating: false,
                    creating: false,
                  }),
                500,
              ),
            )
            .catch(() =>
              setTimeout(
                () =>
                  this.setState({
                    created: true,
                    creating: false,
                    errorCreating: true,
                  }),
                500,
              ),
            );
      } else {
        console.log('There are validation errors', vals);
        this.setState({creating: false, created: true, errorCreating: true});
      }
    });
  };
}

const segmentValues = ['Edit', 'Preview'];
