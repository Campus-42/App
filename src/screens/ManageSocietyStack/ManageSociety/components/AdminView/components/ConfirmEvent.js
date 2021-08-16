import React from 'react';
import {View, Text} from 'react-native';
import {ManageFuncs} from '../../../functions';
import {styles} from '../style';
import {GlobalStyle} from '../../../../../../assets/GlobalStyle';
import {TouchableOpacity} from 'react-native-gesture-handler';
import {functions} from '../../../../../../assets/Firebase/Firebase';
import {Pressable} from 'react-native';

export const ConfirmEvent = (props) => {
  function handlePress(type = 'confirm' || 'deny') {
    ManageFuncs.confirmOrDenyEvent(
      type,
      props.campusKey,
      props.item.confirmation_type,
      props.item.id,
      props.updateConfirms,
      props.item.edit_log,
    ).then(() => {
      const confType =
        props.item.confirmation_type == 'events' ? 'event' : 'blog';

      functions
        .httpsCallable('onConfirmed')({
          obj_id: props.item.id,
          campus_key: props.campusKey,
          obj_type: confType,
          obj: props.item,
          only_change_this: false, // If repeated event is changed, should only this or all be changed accordingly?
        })
        .then((res) => console.log("Successfully called 'onConfirmed':\n", res))
        .catch((err) =>
          console.warn("Could not call 'onConfirmed' function:\n", err),
        );
    });
  }
  ManageFuncs.getEditor(
    props.item.edit_log[props.item.edit_log.length - 1].uid,
  ).catch(console.warm);

  const type = props.item.edit_log[props.item.edit_log.length - 1].action;
  const confType = props.item.confirmation_type == 'events' ? 'event' : 'blog';
  const text =
    type == 'update'
      ? `You as president must confirm updates to an existing ${confType}. Click to confirm or deny ${confType}. The ${confType} is not visible until confirmed`
      : type == 'create'
      ? `You as president must confirm new ${confType}s. Click to confirm or deny ${confType}. The ${confType} is not visible until confirmed`
      : `You as president must confirm deleted ${confType}s. Click to confirm or deny ${confType}. The ${confType} is not visible until confirmed`;

  return (
    <View style={styles.confirmationContainer}>
      <View style={styles.confirmationInnerContainer}>
        <Text style={styles.confirmationTitle}>
          {type == 'update'
            ? `Updated ${confType}`
            : type == 'create'
            ? `New ${confType}`
            : `Deletion of ${confType}`}
        </Text>
        <Text style={styles.confirmationSubTitle}>{text}</Text>
        <View style={{marginVertical: GlobalStyle.Measurements.marginHalf}}>
          {props.item.confirmation_type == 'events' ? (
            <React.Fragment>
              <Text style={styles.confirmationText}>
                Title:{'\t\t'}
                {props.item.title}
              </Text>
            </React.Fragment>
          ) : (
            <React.Fragment>
              <Text style={styles.confirmationText}>
                {`Title:\t\t${props.item.blog_content[0].value}`}
              </Text>
            </React.Fragment>
          )}
          <Text style={styles.confirmationText}>
            {`Society:\t\t${props.item.society_name}`}
          </Text>
        </View>
        <TouchableOpacity onPress={handlePreviewPress}>
          <Text style={GlobalStyle.ButtonStyle.TextButton}>Preview</Text>
        </TouchableOpacity>
        <View style={styles.confirmationButtonContainer}>
          <Pressable onPress={() => handlePress('deny')}>
            <Text
              style={[
                GlobalStyle.ButtonStyle.DestructiveTextButton,
                styles.confirmationButton,
              ]}>
              {type == 'delete' ? 'Delete' : 'Deny'}
            </Text>
          </Pressable>
          <Pressable onPress={() => handlePress('confirm')}>
            <Text
              style={[
                GlobalStyle.ButtonStyle.TextButton,
                styles.confirmationButton,
              ]}>
              {type == 'delete' ? 'Revert' : 'Confirm'}
            </Text>
          </Pressable>
        </View>
      </View>

    </View>
  );

  function handlePreviewPress() {
    if (props.item.confirmation_type === 'blogs') {
      props.navigation.navigate('Blog Focus', {id: props.item.id});
    } else if (props.item.confirmation_type === 'events') {
      props.navigation.navigate('Event Focus', {id: props.item.id});
    }
  }
};

ConfirmEvent.defaultProps = {
  edit_log: [],
};
