import React from 'react';
import {View, Text, TouchableOpacity, Animated} from 'react-native';
import {styles} from './style';
import * as Animatable from 'react-native-animatable';
import {GlobalStyle} from '../GlobalStyle';
import FontAwesome5Icon from 'react-native-vector-icons/FontAwesome5';
import {Store} from '../../assets/redux/store';
import {parseSocietyData} from '../Firebase/functions';

export function InReviewSocieties(props) {
  const opacity = React.useRef(new Animated.Value(1)).current;
  const [mounted, setMounted] = React.useState(false);

  function animate(toValue) {
    Animated.timing(opacity, {
      toValue: toValue,
      duration: 650,
      delay: 800,
      useNativeDriver: true,
    }).start(() => animate(toValue == 1 ? 0.65 : 1));
  }

  return (
    <View
      style={styles.container}
      onLayout={() => {
        if (!mounted) {
          setMounted(true);
          animate(0.5);
        }
      }}>
      <Text style={styles.heading}>Submitted Societies</Text>
      {props.societies.map((item, index) => (
        <SocietyReviewSnap
          key={`inreview_${item.id}`}
          item={item}
          index={index}
          first={index == 0}
          last={index == props.societies.length - 1}
          opacity={opacity}
          navigate={props.navigate}
        />
      ))}
    </View>
  );
}

function SocietyReviewSnap(props) {
  const messageView = React.useRef();
  const [open, setOpen] = React.useState(false); // Open Message

  const status = props.item.review_logs.slice(-1)[0].action;
  const message = props.item.review_logs.slice(-1)[0].message;

  function handlePress(toStatus = !open) {
    messageView.current.transitionTo(
      {
        minHeight: GlobalStyle.Measurements.height * (toStatus ? 0.065 : 0),
        marginVertical:
          GlobalStyle.Measurements.marginHalf * (toStatus ? 1 : 0),
        opacity: toStatus ? 1 : 0,
      },
      300,
    );
    setOpen(toStatus);
  }

  return (
    <React.Fragment>
      <TouchableOpacity
        activeOpacity={0.8}
        onPress={() => handlePress()}
        style={[
          styles.snapContainer,
          props.first && {
            borderTopRightRadius: GlobalStyle.Measurements.margin,
            borderTopLeftRadius: GlobalStyle.Measurements.margin,
          },
          props.last && {
            borderBottomRightRadius: GlobalStyle.Measurements.margin,
            borderBottomLeftRadius: GlobalStyle.Measurements.margin,
          },
        ]}>
        <View
          style={{
            flexDirection: 'row',
            alignItems: 'center',
            justifyContent: 'flex-start',
            width: styles.snapContainer.width,
          }}>
          <Animated.View
            style={[
              styles.dot,
              {
                backgroundColor: colors[status],
                opacity: props.opacity,
              },
            ]}
          />

          <View style={{width: '70%'}}>
            <Text numberOfLines={1} style={styles.snapTitle}>
              {props.item.name}
            </Text>
            <Text numberOfLines={1} style={styles.snapSubTitle}>
              {status == 'awaiting'
                ? 'Awaiting Review'
                : status == 'denied'
                ? 'Denied'
                : status == 'accepted' && 'Accepted'}
            </Text>
          </View>
          <TouchableOpacity
            onPress={async () => {
              Store.dispatch({
                type: 'UPDATE_SOCIETY_FOCUS_MANAGE',
                payload: await parseSocietyData(props.item, props.item.id),
              });
              setTimeout(
                () => props.navigate('Edit Society', {type: 'update_review'}),
                50,
              );
            }}>
            <FontAwesome5Icon
              name={'pen'}
              style={{padding: 10}}
              color={GlobalStyle.ColorStyle.blueButtonText}
            />
          </TouchableOpacity>
        </View>
        <Animatable.View ref={messageView} style={styles.messageContainer}>
          <Text style={styles.snapMessage}>{open && message}</Text>
        </Animatable.View>
      </TouchableOpacity>
      {!props.last && (
        <GlobalStyle.Line
          style={{
            backgroundColor: styles.snapContainer.backgroundColor,
            marginVertical: 0,
          }}
        />
      )}
    </React.Fragment>
  );
}

const colors = {
  awaiting: '#FFA500',
  denied: '#FF3333',
  accepted: '#00FF00',
};
