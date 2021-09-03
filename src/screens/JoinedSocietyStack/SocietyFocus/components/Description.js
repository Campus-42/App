import React from 'react';
import {View, Text, Animated, TouchableOpacity} from 'react-native';
import {styles} from '../style';
import {GlobalStyle} from '../../../../assets/GlobalStyle';
import LinearGradient from 'react-native-linear-gradient';

export function Description(props) {
  const [focused, setFocus] = React.useState(false); // If text is focused
  const [layout, setLayout] = React.useState(null);
  function focusButton() {
    setFocus(true);
  }
  function unFocusButton() {
    setFocus(false);
    props.scrollToTop(layout);
  }

  return (
    <View
      onLayout={({nativeEvent}) =>
        setLayout({
          ...nativeEvent.layout,
          y: nativeEvent.layout.y - GlobalStyle.Measurements.marginHalf,
        })
      }
      style={styles.descriptionContainer}>
      <GlobalStyle.UI.Text
        text={props.text}
        numberOfLines={focused ? null : 5}
        style={[GlobalStyle.TextStyle.bodyRegular, {textAlign: 'left'}]}
      />
      {props.text.length > 150 &&
        (!focused ? (
          <LinearGradient
            style={styles.focusDescriptionGradient}
            colors={['#ffffff', '#ffffff00']}
            start={{x: 0.5, y: 0.5}}
            end={{x: 0.5, y: 0}}>
            <TouchableOpacity
              style={styles.focusDescriptionButton}
              onPress={focusButton}>
              <Text style={GlobalStyle.TextStyle.blueText}>Read more</Text>
            </TouchableOpacity>
          </LinearGradient>
        ) : (
          <TouchableOpacity
            style={styles.focusDescriptionButton}
            onPress={unFocusButton}>
            <Text style={GlobalStyle.TextStyle.blueText}>Collapse</Text>
          </TouchableOpacity>
        ))}
    </View>
  );
}
