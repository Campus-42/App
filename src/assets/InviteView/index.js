import React from "react";
import {
  Text,
  View,
  Dimensions,
  TouchableOpacity,
  ScrollView,
  Platform,
} from "react-native";
import { SwipeUpViewLarge } from "../SwipeUpView";
import PropTypes from "prop-types";
import { styles } from "./style";
import TouchableShrink from "../TouchableShrink/TouchableShrink";
import { GlobalStyle } from "../GlobalStyle";
import { UserComponent } from "./UserComponent";
import { InviteFuncs } from "./functions";
import { InviteAnimation } from "./InviteAnimation";
import { FetchError } from "../FetchError/FetchError";
import { DoneAnimation } from "./DoneAnimation";
import { EmptyBox } from "../EmptyAnimation";
import { LoadingCircle } from "../LottieAnims/loading";
import { Text as AnimatableText } from "react-native-animatable";
import { triggerHaptic } from "../Haptic/hapticFeedback";

export const InviteView = (props) => {
  const [invitees, setInvitees] = React.useState([]);
  const [inviting, setInviting] = React.useState(false);
  const [searchRes, setSearchRes] = React.useState([]);
  const [searchActive, setSearchActive] = React.useState(false);
  const [error, setError] = React.useState(false);
  const [done, setDone] = React.useState(false);
  const [mounted, setMounted] = React.useState(false);
  const [suggestions, setSuggestions] = React.useState([]);
  const [rawSuggestions, setRawSuggestions] = React.useState([]);
  const [searching, setSearching] = React.useState(false);
  const [typing, setTyping] = React.useState(false);
  const [searchIsNotEmpty, setSearchIsNotEmpty] = React.useState(false);
  const [alreadyInvited, setAlreadyInvited] = React.useState([]);

  const textinput = React.useRef();

  React.useEffect(() => {
    if (!mounted) {
      setMounted(true);
      InviteFuncs.getAlreadyInvited(props.campus.key, props.type, props.obj.id)
        .then((uids) => {
          if (props.type == "bubble")
            uids = uids.filter((e) => e.claimed === false);
          setAlreadyInvited(uids);
          setError(false);
        })
        .catch((err) => {
          setError(true);
          setAlreadyInvited([]);
          console.trace("[Error] Could not get already invited users", err);
        })
        .finally(() =>
          InviteFuncs.getSuggestions(props.campus.key).then((suggestions) => {
            setSuggestions(suggestions);
            setRawSuggestions(suggestions);
          })
        );
    }

    return;
  });
  // Depending on the type of object passed they are called different name
  const participants =
    props.obj.participants || props.obj.members || props.obj.member_uids || [];
  const alreadyInvitedUsersWithProps = alreadyInvited.concat(
    props.invitedUsers
  );
  const disabledUids = alreadyInvitedUsersWithProps.concat(participants);

  return (
    <SwipeUpViewLarge
      isModal={props.isModal}
      isActive={props.isActive}
      onClose={props.onClose}
    >
      <View style={styles.container}>
        <Text style={styles.title}>Invite Friends</Text>
        <GlobalStyle.UI.TextInput
          ref={textinput}
          showSearchIcon
          placeholder={"Search for students to invite"}
          onFocus={() => setTyping(true)}
          keyboardType={"email-address"}
          returnKeyType={"search"}
          onChangeText={search}
          onEndEditing={() => {
            setTimeout(() => setTyping(false), 1000);
          }}
        />
        <ScrollView
          keyboardShouldPersistTaps={"handled"}
          scrollEnabled={!done}
          style={[
            styles.flatlist,
            !props.isModal && {
              height:
                Platform.OS == "ios"
                  ? styles.flatlist.height +
                    GlobalStyle.Measurements.safeheight * 0.05
                  : styles.flatlist.height,
            },
          ]}
          contentContainerStyle={{
            alignItems: "center",
          }}
        >
          {error === false && searchActive && !done && (
            <TouchableOpacity
              onPress={() => {
                try {
                  setSearchActive(false);
                  setSearchRes([]);
                  textinput.current.clear();
                } catch (err) {
                  console.warn(err);
                }
              }}
            >
              <Text style={styles.quitSearchButton}>Stop Searching</Text>
            </TouchableOpacity>
          )}
          {done ? (
            <View>
              <DoneAnimation />
            </View>
          ) : error ? (
            <FetchError
              errorText={"Something went wrong fetching suggestions"}
            />
          ) : !searchActive && invitees.length != 0 ? (
            invitees
              .slice(0, 3)
              .map((item, index) => (
                <UserComponent
                  animation={"fadeInUpBig"}
                  key={item.uid}
                  index={index}
                  colors={props.campus.colors}
                  user={item}
                  invited={invitees.some((elem) => elem.uid == item.uid)}
                  onPress={handlePress}
                  subTitle={
                    alreadyInvitedUsersWithProps.includes(item.uid)
                      ? item.first_name + " is already invited"
                      : undefined
                  }
                  disabled={alreadyInvitedUsersWithProps.includes(item.uid)}
                  greyOut={alreadyInvitedUsersWithProps.includes(item.uid)}
                  dontFadeDisabled
                  campusPointSystem={props.campusPointSystem}
                />
              ))
          ) : !searchActive &&
            (invitees.length == 0) &
              (suggestions.filter(
                (item) =>
                  !participants.includes(item.uid) &&
                  !alreadyInvitedUsersWithProps.includes(item.uid)
              ).length ==
                0) ? (
            <InviteAnimation />
          ) : searchActive && searchRes.length != 0 ? (
            searchRes
              .slice(0, 3)
              .map((item, index) => (
                <UserComponent
                  animation={"fadeInUpBig"}
                  key={item.uid}
                  index={index}
                  colors={props.campus.colors}
                  user={item}
                  invited={invitees.some((elem) => elem.uid == item.uid)}
                  onPress={handlePress}
                  subTitle={
                    participants.includes(item.uid)
                      ? item.first_name +
                        (props.type == "event"
                          ? " is already going"
                          : props.type == "society" || props.type == "bubble"
                          ? " is already a member"
                          : " cannot be invited")
                      : alreadyInvitedUsersWithProps.includes(item.uid)
                      ? item.first_name + " is already invited"
                      : undefined
                  }
                  disabled={disabledUids.includes(item.uid)}
                  greyOut={disabledUids.includes(item.uid)}
                  dontFadeDisabled
                  campusPointSystem={props.campusPointSystem}
                />
              ))
          ) : searchActive && searching ? (
            <LoadingCircle />
          ) : (
            searchActive &&
            searchRes.length == 0 &&
            !searching &&
            searchIsNotEmpty &&
            !typing && <EmptyBox delay={500} />
          )}

          {!searchActive &&
            !done &&
            suggestions.filter(
              (item) =>
                !participants.includes(item.uid) &&
                !alreadyInvitedUsersWithProps.includes(item.uid)
            ).length > 0 && (
              <AnimatableText
                duration={450}
                delay={300}
                animation={"fadeInUpBig"}
                style={styles.suggestionsText}
              >
                Suggestions for You
              </AnimatableText>
            )}
          {
            // Show suggestions under
            !searchActive &&
              !done &&
              suggestions
                .filter(
                  (item) =>
                    !participants.includes(item.uid) &&
                    !alreadyInvitedUsersWithProps.includes(item.uid)
                )
                .slice(0, 3)
                .map((item, index) => (
                  <UserComponent
                    animation={"fadeInUpBig"}
                    key={item.uid}
                    delay={400}
                    index={index}
                    colors={props.campus.colors}
                    user={item}
                    invited={invitees.some((elem) => elem.uid == item.uid)}
                    onPress={handlePress}
                    subTitle={
                      alreadyInvitedUsersWithProps.includes(item.uid)
                        ? item.first_name + " is already invited"
                        : undefined
                    }
                    disabled={alreadyInvitedUsersWithProps.includes(item.uid)}
                    greyOut={alreadyInvitedUsersWithProps.includes(item.uid)}
                    dontFadeDisabled
                    campusPointSystem={props.campusPointSystem}
                  />
                ))
          }
        </ScrollView>

        <TouchableShrink
          onPress={invite}
          loading={inviting}
          style={styles.inviteButton}
          gradientColor={props.campus.colors.main}
          showIcon
          icon={done ? "chevron-down" : "user-plus"}
          iconSize={Dimensions.get("screen").fontScale * (done ? 15 : 13)}
          disabled={invitees.length == 0 && done === false}
          showShadow={invitees.length > 0}
          showGradient
          loading={inviting}
        >
          <Text style={styles.inviteButtonText}>
            {done ? "Go Back" : "Invite"}
          </Text>
        </TouchableShrink>
      </View>
    </SwipeUpViewLarge>
  );
  function search(text) {
    setSearchActive(true);
    setSearching(true);
    setSearchIsNotEmpty(text.replace(/\s/g, "").length > 0);
    setTimeout(() => {
      InviteFuncs.search(text, props.campus.key)
        .then((res) => {
          setSearchRes(res);
          setError(false);
        })
        .catch((err) => {
          console.warn("Could not search for invitees", err);
          setError(true);
          setSearchRes([]);
        })
        .finally(() => setSearching(false));
    }, 500);
  }
  async function handlePress(user) {
    const alreadyInvited = invitees.some((elem) => elem.uid === user.uid);
    var invs = invitees;

    if (alreadyInvited) {
      invs = invs.filter((elem) => elem.uid !== user.uid);
    } else {
      invs = invs.concat([user]);
    }
    setInvitees(invs);

    const newSuggestions = await InviteFuncs.getFilteredSuggestions(
      invs,
      rawSuggestions
    );
    setSuggestions(newSuggestions);
  }

  async function invite() {
    if (done) props.onClose();
    else {
      setError(false);
      setInviting(true);
      invitees.map(async (invitee) => {
        InviteFuncs.invite(
          props.user,
          invitee,
          props.type == "event" ? props.obj.title : props.obj.name,
          props.type,
          props.senderType,
          props.campus.key,
          props.type == "event" ? new Date(props.obj.date.start) : new Date(), // We won't use the date if it is society. But we'll pass just in case to avoid errors
          props.type == "event"
            ? props.obj.images.preview
            : props.type == "society"
            ? props.obj.images.logo
            : props.obj.image,
          props.obj.id,
          props.obj
        ).catch(__DEV__ && alert);
      });
      setInviting(false);
      setSearchActive(false);
      setDone(true);
      // setTimeout(() => setDone(false), 2500);
      setTimeout(() => triggerHaptic("notificationSuccess"), 400);
    }
  }
};

InviteView.defaultProps = {
  isActive: false,
  onClose: () => {},
  campus: {
    colors: {},
    key: "",
  },
  obj: { title: "", name: "", date: new Date() },
  senderType: "",
  user: {},
  type: "",
  isModal: true,
  invitedUsers: [],
};
InviteView.propTypes = {
  isActive: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired,
  campus: PropTypes.object.isRequired,
  obj: PropTypes.object.isRequired,
  senderType: PropTypes.string.isRequired,
  user: PropTypes.object.isRequired,
  type: PropTypes.string.isRequired,
  isModal: PropTypes.bool,
  invitedUsers: PropTypes.array,
};
