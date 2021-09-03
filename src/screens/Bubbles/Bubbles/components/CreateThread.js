import React from "react";
import { View, Text, FlatList } from "react-native";
import { Campus } from "../../../../assets/Campus";
import { searchForUser } from "../../../../assets/Firebase/functions";
import { GlobalStyle } from "../../../../assets/GlobalStyle";
import { SwipeUpViewLarge } from "../../../../assets/SwipeUpView";
import { styles } from "../style";
import { HorizontalSelectedUsers } from "./HorizontalSelectedUsers";
import { UserComponent } from "../../../../assets/InviteView/UserComponent";
import { SWIPEUP_LARGE_HEIGHT } from "../../../../assets/SwipeUpView/SwipeUpViewLarge";
import TouchableShrink from "../../../../assets/TouchableShrink/TouchableShrink";
import { Platform } from "react-native";
import { Keyboard } from "react-native";

export class CreateThread extends React.Component {
  constructor() {
    super();
    this.searchbar = React.createRef();
    this.state = {
      members: {}, // save in obbject to avoid double adding someone such as the author
      searching: false,
      searchRes: [],
      error: "",

      searchbarHeight: null,
      titleHeight: null,
    };
  }
  render() {
    return (
      <SwipeUpViewLarge
        isActive={this.props.isActive}
        onClose={this.props.onClose}
      >
        <View style={styles.swipeupContainer}>
          <Text
            style={styles.swipeupTitle}
            onLayout={({ nativeEvent }) =>
              this.onLayouts(nativeEvent.layout.height, "title")
            }
          >
            Create a Bubble
          </Text>
          <GlobalStyle.UI.TextInput
            ref={this.searchbar}
            clearButtonMode={"while-editing"}
            showSearchIcon
            placeholder={"Search for people on campus"}
            onLayout={({ nativeEvent }) =>
              this.onLayouts(nativeEvent.layout.height, "searchbbar")
            }
            onChangeText={this.onChangeText}
            onEndEditing={this.onEndEditing}
            onFocus={() => this.setState({ searching: true })}
            clearOnFocus
          />
          <HorizontalSelectedUsers
            colors={this.props.campus.colors}
            users={Object.values(this.state.members)}
            removeMember={this.removeMember}
          />
          <FlatList
            keyboardShouldPersistTaps={"handled"}
            data={this.state.searchRes}
            renderItem={this.renderItem}
            keyExtractor={(e) => `searched_users_thread_${e.uid}`}
            style={[
              styles.flatlistVertical,
              {
                height:
                  SWIPEUP_LARGE_HEIGHT -
                  this.state.searchbarHeight -
                  this.state.titleHeight -
                  styles.flatlistVertical.marginTop -
                  GlobalStyle.Measurements.height *
                    (Platform.OS == "android" ? 0.45 : 0.35),
              },
            ]}
          />
          {Object.keys(this.state.members).length > 0 && (
            <TouchableShrink
              onPress={() => this.props.createThread({ ...this.state.members })}
              showIcon
              showGradient
              style={[
                GlobalStyle.ButtonStyle.Large,
                { justifyContent: "space-between" },
              ]}
              gradientColor={this.props.campus.colors.main}
            >
              <Text style={GlobalStyle.TextStyle.buttonLarge}>Create</Text>
            </TouchableShrink>
          )}
        </View>
      </SwipeUpViewLarge>
    );
  }

  renderItem = ({ item, index }) => {
    return (
      <UserComponent
        style={{ alignSelf: "center" }}
        user={item}
        colors={this.props.campus.colors}
        onPress={this.handleSearchPress}
        invited={this.state.members[item.uid] !== undefined}
      />
    );
  };
  handleSearchPress = (user) => {
    Keyboard.dismiss();
    const { members } = this.state;
    if (Object.keys(members).includes(user.uid)) delete members[user.uid];
    else members[user.uid] = user;
    this.setState({ members: members });
  };
  removeMember = (user) => {
    const { members } = this.state;
    delete members[user.uid];
    this.setState({ members: members });
  };
  onEndEditing = () => {
    this.setState({ searching: false });
    this.searchbar.current.toggleLoading(false);
  };
  onChangeText = async (text) => {
    const clear = !text.replace(/\s/g, "").length;

    if (!clear) {
      const search = await Campus.Funcs.server.cleanString(text.toLowerCase());
      searchForUser(search.split(" "), this.props.campus.key)
        .then((users) => this.setState({ searchRes: users, error: "" }))
        .catch((err) =>
          this.setState({ searchRes: [], error: err.toString() })
        );
    }
  };
  onLayouts = (height, object) => {
    this.state[`${object}Heigth`] === null &&
      this.setState({ [`${object}Heigth`]: height }, () =>
        console.log(this.state)
      );
  };
}
