import React from 'react';
import {RefreshControl, View, ScrollView, SafeAreaView} from 'react-native';
import {GlobalStyle} from '../../../assets/GlobalStyle';
import {getInvitations} from '../../../assets/Firebase/functions';
import {styles} from './style';
import {LoadingCircle} from '../../../assets/LottieAnims/loading';
import {FetchError} from '../../../assets/FetchError/FetchError';
import {EmptyBox} from '../../../assets/EmptyAnimation';
import {Invitation} from './components/Invitation';
import {analytics} from '../../../assets/Analytics';
import {Campus} from '../../../assets/Campus';
import {FlatList} from 'react-native';
import {ModalTop} from '../../../assets/ModalTop';

export function ProfileInvitations(props) {
  const [mounted, setMounted] = React.useState(false);
  const [invites, setInvites] = React.useState([]);
  const [error, setError] = React.useState(false);
  const [refreshing, setRefreshing] = React.useState(false);
  const [init, setInit] = React.useState(false);

  React.useEffect(() => {
    if (!mounted) {
      setMounted(true);
      setTimeout(() => getInvites(true, true), 1000);
      
      setRefreshing(true);
    }
  });

  return (
    <View {...GlobalStyle.Props.focusBackgroundScrollView}>
      <ModalTop title={'Invitations'} onPress={props.navigation.goBack} />
      <FlatList
        refreshControl={
          <RefreshControl
            refreshing={refreshing || !init}
            onRefresh={() => getInvites(true, true)}
          />
        }
        // onEndReached={() => getInvites(false, false)}
        keyExtractor={(e) => `profile_invitatons_${e.invite.id}`}
        data={invites}
        contentInset={{bottom: GlobalStyle.Measurements.height * 0.1}}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContainer}
        style={styles.scrollview}
        ListEmptyComponent={
          error ? (
            <View style={styles.error}>
              <FetchError
                showButton
                onPress={() => getInvites(true)}
                errorText={"We couldn't get your invitations"}
              />
            </View>
          ) : (
            init && (
              <View style={styles.error}>
                <EmptyBox
                  showButton
                  onPress={() => getInvites(true)}
                  errorText={"We couldn't find any invitations"}
                />
              </View>
            )
          )
        }
        renderItem={renderItem}
      />
    </View>
  );
  function renderItem({item, index}) {
    return (
      <Invitation
        animateIn
        index={index}
        invite={item}
        colors={props.store.app.campus.colors}
        campusKey={props.store.app.campus.key}
        navigation={props.navigation}
        claimed={!props.store.app.invitationIDs.includes(item.invite.id)}
      />
    );
  }
  function getInvites(refreshing = true, clear = false) {
    setRefreshing(refreshing);
    const latest =
      invites.length < 1 || clear
        ? false
        : invites.slice(-1)[0].invite || false;

    const get = () =>
      Campus.Funcs.invite
        .getInvitations(
          props.store.app.campus.key,
          (invs) => setInvites(clear ? invs : invites.concat(invs)),
          latest,
          30,
          false,
        )
        .catch((err) => {
          console.warn('Could not get invites', err);
          setError(true);
          setInvites([]);
        })
        .finally(() => {
          setInit(true);
          setRefreshing(false);
        });
    setTimeout(get, 750);
  }
}
