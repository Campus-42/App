import React from "react";
import { View } from "react-native";
import { styles } from "../style";
import { GlobalStyle } from "../../../../assets/GlobalStyle";
import { auth, db } from "../../../../assets/Firebase/Firebase";
import { analytics } from "../../../../assets/Analytics";
import { Linking } from "react-native";
import { Alert } from "react-native";

export function ProfileButtons(props) {
  function handlePress(target) {
    props.navigation.navigate(target);
  }
  return (
    <View style={styles.profileButtonContainer}>
      <GlobalStyle.UI.Sections.Container>
        <GlobalStyle.UI.Sections.Button
          title={"Favourites"}
          onPress={() => handlePress("Bookmarks")}
          icon={"heart"}
          iconColor={GlobalStyle.ColorStyle.candyRed}
        />
        <GlobalStyle.UI.Sections.Button
          title={"Invitations"}
          onPress={() => handlePress("Profile Invitations")}
          icon={"add-user"}
          iconScale={1.4}
          iconColor={GlobalStyle.ColorStyle.referralColour}
        />
        <GlobalStyle.UI.Sections.Button
          title={"FAQ"}
          onPress={() => handlePress("FAQ")}
          icon={"help"}
          iconScale={1.4}
          iconColor={"#0394fc"}
        />
        <GlobalStyle.UI.Sections.Button
          title={"Leave app feedback"}
          onPress={() =>
            props.navigation.navigate("Web View", {
              url:
                "https://docs.google.com/forms/d/e/1FAIpQLSfefqkVrBLYYOMfKFCWNVQyr-Zu_zZINDr6bNhI4SPbM7zd8g/viewform?usp=sf_link",
            })
          }
          icon={"share"}
          iconColor={"#04b833"}
        />
        {props.isCampus42Admin && (
          <GlobalStyle.UI.Sections.Button
            title={"Bug report"}
            onPress={() =>
              props.navigation.navigate("Web View", {
                url:
                  "https://docs.google.com/forms/d/e/1FAIpQLSfXw3MZKswIVXk5NXqdAJ1jTXglQkQFG7d4nLf-AH67leELWQ/viewform?usp=sf_link",
              })
            }
            icon={"bug"}
            iconColor={"#038896"}
          />
        )}

        <GlobalStyle.UI.Sections.Button
          title={"Contact Campus42"}
          onPress={async () => {
            // Get a potential bubble if it existed
            const alreadyExists = await getIfCampus42BubbleExists();
            console.log("Already exists", alreadyExists);

            // Set the navigation arguments
            var navArgs = {};
            if (alreadyExists.noBubble)
              navArgs.creation = {
                uids: ["mcQwMUybx7cXP4Fhlxs4ngPAo4E3", auth.currentUser.uid],
                bubbleParams: C42_BUBBLE,
              };
            else
              navArgs = {
                id: alreadyExists.bubbleId,
                type: "bubble",
              };
            // Navigate to the bubble
            props.navigation.navigate("Bubble Focus", navArgs);
          }}
          icon={"message"}
          iconColor={"#08c9c3"}
        />
        <GlobalStyle.UI.Sections.Button
          title={"Reset password"}
          last
          icon={"mail"}
          onPress={() => {
            auth
              .sendPasswordResetEmail(auth.currentUser.email)
              .then(() =>
                props.showPopup({
                  active: true,
                  level: "password-reset",
                  type: "toast",
                })
              )
              .catch((err) => {
                analytics.error(err, "ProfileButtons", "Reset password");
                props.showPopup({
                  active: true,
                  level: "error",
                  type: "toast",
                  title: "Couldn't reset password",
                  text:
                    "Please check your connection and try again later to reset your password",
                });
              });
          }}
        />
      </GlobalStyle.UI.Sections.Container>
    </View>
  );
}

const C42_BUBBLE = {
  __type: "customer_service",
  image:
    "https://firebasestorage.googleapis.com/v0/b/campus42.appspot.com/o/logos%2FSmaller%2042.png?alt=media&token=108a8a6b-9815-4fef-be6a-d589c79cbc94",
  name: "Campus42",
  admins: ["mcQwMUybx7cXP4Fhlxs4ngPAo4E3"],
  description:
    "A chat so that you can chat to us directly about any problems or thoughts you have about the app.\n\nMany thanks for reaching out!",
};
async function getIfCampus42BubbleExists() {
  return db
    .collection("bubbles")
    .where("__type", "==", "customer_service")
    .where("member_uids", "array-contains", (auth.currentUser || {}).uid)
    .get()
    .then((querySnapShot) => {
      if (querySnapShot.size == 0) return { noBubble: true };
      else return { bubbleId: querySnapShot.docs[0].id };
    })
    .catch((err) => {
      analytics.error(err, "ProfileButtons", "getIfCampus42BubbleExists");
      return { noBubble: true };
    });
}
