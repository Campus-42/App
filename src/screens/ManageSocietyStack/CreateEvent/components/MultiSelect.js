import React from 'react';
import {
  View,
  Text,
  TextInput,
  ScrollView,
  Alert,
  TouchableOpacity,
  FlatList,
} from 'react-native';
import {styles} from '../../ManageSocietyFocus/style';
import {GlobalStyle} from '../../../../assets/GlobalStyle';
import TouchableShrink from '../../../../assets/TouchableShrink/TouchableShrink';
import {getAllTags, createTag} from '../../../../assets/Airtable/functions';
import {SearchElementInScroll} from './SearchElementInScroll';
import {LoadingCircle} from '../../../../assets/LottieAnims/loading';

export class MultiSelect extends React.Component {
  constructor() {
    super();
    this.state = {
      allTags: [],
      search: '',
      loading: false,
    };
  }
  async componentDidMount() {
    this.getAllTags();
  }
  render() {
    // Reusable const for all the tags after filter
    // First sort by alphabetical order then place chosen at top
    const tags = (this.state.allTags || [])
      .filter((tag) => tag.includes(this.state.search))
      .sort()
      .sort((a, b) => {
        return (
          this.props.selectedTags.includes(b) -
          this.props.selectedTags.includes(a)
        );
      });

    return (
      <View style={styles.largePickerContainer}>
        <Text style={styles.heading}>{this.props.title}</Text>
        <TextInput
          style={[styles.textInput, styles.searchTextInput]}
          placeholder="Search Tag"
          clearButtonMode="unless-editing"
          autoCapitalize="words"
          maxLength={14}
          onChangeText={(text) => this.setState({search: text})}
        />
        <FlatList
          style={styles.largeSwipeUpContainer}
          data={tags}
          contentInset={{bottom: GlobalStyle.Measurements.height * 0.05}}
          keyExtractor={(item) => `tagSelector_${item}`}
          renderItem={({item, index}) => (
            <this.SelectItem value={item} index={index} />
          )}
          ListEmptyComponent={
            this.state.loading ? (
              <View
                style={{
                  alignItems: 'center',
                  marginTop: GlobalStyle.Measurements.margin,
                }}>
                <LoadingCircle size={'small'} />
              </View>
            ) : (
              <this.CreateTag />
            )
          }
        />

        <TouchableShrink
          style={[
            GlobalStyle.ButtonStyle.Large,
            {
              justifyContent: 'space-between',
              alignSelf: 'center',
              paddingHorizontal: GlobalStyle.Measurements.margin,
            },
          ]}
          showGradient
          gradientColor={this.props.colors.main}
          showIcon
          icon="chevron-down"
          onPress={this.props.onSwipeUpViewClose}>
          <Text style={GlobalStyle.TextStyle.buttonLarge}>Continue</Text>
        </TouchableShrink>
      </View>
    );
  }
  getAllTags = async () => {
    this.setState({loading: true});
    setTimeout(
      () =>
        getAllTags().then((tags) =>
          this.setState({allTags: tags, loading: false}),
        ),
      500,
    );
  };
  SelectItem = (props) => {
    return (
      props.value !== '' && (
        <SearchElementInScroll
          key={`tagSelector2_${props.value}`}
          index={props.index}
          showCheckBox
          isSelected={this.props.selectedTags.includes(props.value)}
          colors={this.props.colors}
          value={props.value}
          onPress={() =>
            this.props.onTagClick(
              props.value,
              this.props.selectedTags.includes(props.value),
            )
          }
        />
      )
    );
  };
  CreateTag = () => {
    return (
      <View style={styles.scrollViewElementError}>
        <Text style={GlobalStyle.TextStyle.bodyLarge}>
          Oops, we don't have that tag yet
        </Text>
        <TouchableOpacity
          disabled={this.state.createTagButtonDisabled}
          onPress={this.createTagOnAirtable}>
          <Text style={GlobalStyle.ButtonStyle.TextButton}>Create tag</Text>
        </TouchableOpacity>
      </View>
    );
  };
  createTagOnAirtable = () => {
    // This function will create the tag on Airtable and then get the tag info to show the tag as chosen
    if (this.state.search.split(' ').length <= 2) {
      this.setState({loading: true, allTags: []});
      this.setState({createTagButtonDisabled: true}); // Prevent user from creating tag twice. Disable button
      createTag(this.state.search)
        .then(() => this.getAllTags())
        .then(() => this.props.getTagColors())
        .then(() => this.setState({createTagButtonDisabled: false}))
        .catch((err) => {
          console.log('Could not create a new tag', err);
        });
    } else {
      Alert.alert('Tag Not Created', 'A tag can only exist of two words');
    }
  };
}
