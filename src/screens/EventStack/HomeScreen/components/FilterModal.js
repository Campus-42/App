import React from 'react';
import {
  KeyboardAvoidingView,
  Text,
  TextInput,
  TouchableOpacity,
  View,
  FlatList,
  Platform,
  ScrollView,
} from 'react-native';
import {SwipeUpViewLarge} from '../../../../assets/SwipeUpView';
import PropTypes from 'prop-types';
import {styles} from '../style';
import {GlobalStyle} from '../../../../assets/GlobalStyle';
import DateTimePickerModal from 'react-native-modal-datetime-picker';
import FontAwesome5 from 'react-native-vector-icons/FontAwesome5';
import {FilterButton} from './FilterCarousel';
import {triggerHaptic} from '../../../../assets/Haptic/hapticFeedback';

export class FilterModal extends React.Component {
  constructor() {
    super();
    this._tagInput = React.createRef();
    this.state = {
      minPrice: 0,
      maxPrice: 0,
      minDate: 0,
      maxDate: 0,
      ids: [],
      dateActive: 'min',
      showDateModal: false,
    };
  }

  componentDidUpdate(prevProps) {
    if (this.props.isActive && !prevProps.isActive) {
      // Extract all events
      const {
        popularEvents,
        todaysEvents,
        mostPopularEvents,
        joinedEvents,
      } = this.props.state;

      // Construct overall events
      const events = popularEvents.data.concat(
        todaysEvents.data.concat(
          mostPopularEvents.data.concat(joinedEvents.data),
        ),
      );

      // Construct the date and price array
      const dates = [Date.now()];
      const prices = [0];

      // Extract date and prices
      events.forEach((evt) => {
        dates.push(evt.start_ms);
        dates.push(evt.end_ms);
        evt.pricing.show && prices.push(parseFloat(evt.pricing.price));
      });

      // Min and max for each date and price array
      const minPrice = Math.min(...prices);
      const maxPrice = Math.max(...prices);
      const minDate = Math.min(...dates);
      const maxDate = Math.max(...dates);

      this.props.updateFilter({
        // update parent filter
        // If a field is not null it will be set to it's value instead of the new calculated value
        price: {
          min:
            this.props.state.filter.price.min !== null
              ? this.props.state.filter.price.min
              : minPrice,
          max:
            this.props.state.filter.price.max !== null
              ? this.props.state.filter.price.max
              : maxPrice,
        },
        date: {
          min:
            this.props.state.filter.date.min !== null
              ? this.props.state.filter.date.min
              : minDate,
          max:
            this.props.state.filter.date.max !== null
              ? this.props.state.filter.date.max
              : maxDate,
        },
      });

      this.setState({
        maxDate: new Date(maxDate).getTime(),
        minDate: new Date(minDate).getTime(),
        maxPrice: parseFloat(maxPrice),
        minPrice: parseFloat(minPrice),
      });
    }
  }

  render() {
    // Construct the dates to show
    const showDateMin =
      this.props.state.filter.date.min !== null
        ? this.props.state.filter.date.min
        : this.state.minDate;

    const showPriceMin = this.props.state.filter.price.min !== -1;
    const showPriceMax = this.props.state.filter.price.max !== 1000000;

    const dateActive = this.state.dateActive;

    return (
      <React.Fragment>
        <SwipeUpViewLarge
          height={GlobalStyle.Measurements.safeheight * 0.85}
          isActive={this.props.isActive}
          onClose={this.props.onClose}>
          <KeyboardAvoidingView style={styles.modalContainer}>
            <View
              style={[
                styles.filterRow,
                {
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  width:
                    GlobalStyle.Measurements.width -
                    GlobalStyle.Measurements.margin * 2,
                },
              ]}>
              <Text style={styles.title}>Filter</Text>
              <TouchableOpacity
                onPress={() => {
                  setTimeout(() => {
                    this.props.updateFilter({
                      date: {
                        min: new Date().getTime(),
                        max: 4133977199000, // Date for ahead in time
                      },
                      price: {
                        min: -1,
                        max: 1000000,
                      },
                    });
                    this.props.updateTags('', true);
                  }, 50);
                }}>
                <FontAwesome5
                  name={'redo-alt'}
                  color={GlobalStyle.ColorStyle.blueButtonText}
                  style={{padding: 10}}
                  size={GlobalStyle.Measurements.unit / 1.6}
                />
              </TouchableOpacity>
            </View>
            <Text style={styles.filterHeading}>Price</Text>
            <View style={[styles.filterRow, {justifyContent: 'space-between'}]}>
              <PriceInput
                placeholder={'Min: ' + this.state.minPrice}
                updateFilter={this.props.updateFilter}
                filter={this.props.state.filter}
                type={'min'}
                show={showPriceMin}
              />
              <Text style={GlobalStyle.TextStyle.bodyLargeBold}>—</Text>
              <PriceInput
                placeholder={'Max: ' + this.state.maxPrice}
                updateFilter={this.props.updateFilter}
                filter={this.props.state.filter}
                type={'max'}
                show={showPriceMax}
              />
            </View>
            <Text style={styles.filterHeading}>Dates</Text>
            <View style={[styles.filterRow, {justifyContent: 'space-between'}]}>
              <DateButton
                onPress={() =>
                  this.setState({
                    showDateModal: true,
                    dateActive: 'min',
                  })
                }
                text={new Date(showDateMin).toDateString()}
              />
              <Text style={GlobalStyle.TextStyle.bodyLargeBold}>—</Text>
              <DateButton
                onPress={() =>
                  this.setState({
                    showDateModal: true,
                    dateActive: 'max',
                  })
                }
                text={new Date(
                  new Date(this.props.state.filter.date.max).getFullYear() !=
                  2100
                    ? this.props.state.filter.date.max
                    : this.state.maxDate,
                ).toDateString()}
              />
            </View>
            <Text style={styles.filterHeading}>Tags</Text>
            <FlatList
              keyExtractor={(item) => `filter_modal_${item}`}
              data={this.props.state.rawEventTags
                .filter((i) => !['one', 'two', 'three'].includes(i))
                .sort()}
              style={styles.filterFlatList}
              renderItem={({item, index}) => (
                <FilterButton
                  tag={item}
                  campusColor={this.props.campus.colors.main}
                  chosenEventTags={this.props.state.chosenEventTags}
                  color={this.props.state.tagColors[item]}
                  tagPress={() => this.props.updateTags(item)}
                  marginVertical={GlobalStyle.Measurements.marginQuarter}
                  showBorder
                />
              )}
              contentInset={{
                bottom:
                  Platform.OS == 'ios' ? GlobalStyle.Measurements.margin : 0,
              }}
            />
          </KeyboardAvoidingView>
        </SwipeUpViewLarge>
        <DateTimePickerModal
          onConfirm={(date) => {
            this.setState({
              showDateModal: false,
            });
            this.props.updateFilter({
              ...this.props.state.filter,
              date: {
                ...this.props.state.filter.date,
                [dateActive]: new Date(date).getTime(),
              },
            });
          }}
          date={
            new Date(
              new Date(
                this.props.state.filter.date[dateActive],
              ).getFullYear() != 2100
                ? this.props.state.filter.date[dateActive]
                : this.state[dateActive + 'Date'],
            )
          }
          onCancel={() =>
            this.setState({
              showDateModal: false,
            })
          }
          isVisible={this.state.showDateModal}
          mode="datetime"
          minimumDate={
            dateActive == 'min'
              ? new Date()
              : new Date(this.props.state.filter.date.min)
          }
        />
      </React.Fragment>
    );
  }
}
function PriceInput(props) {
  const [text, setText] = React.useState('');
  return (
    <TextInput
      placeholder={props.placeholder}
      style={styles.filterPriceInput}
      keyboardType={'decimal-pad'}
      value={props.show ? text : null}
      onChangeText={setText}
      onEndEditing={() =>
        props.updateFilter({
          ...props.filter,
          price: {
            ...props.filter.price,
            [props.type]: parseFloat(text),
          },
        })
      }
    />
  );
}
function DateButton(props) {
  return (
    <TouchableOpacity onPress={props.onPress}>
      <Text
        style={[
          styles.filterDateText,
          {color: GlobalStyle.ColorStyle.blueButtonText},
        ]}>
        {props.text}
      </Text>
    </TouchableOpacity>
  );
}

FilterModal.defaultProps = {
  isActive: false,
  onClose: () => {},
};
FilterModal.propTypes = {
  isActive: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired,
};
