import React from 'react';
import {View} from 'react-native';
import {SocietySnap} from '../../../../assets/SocietyCarousel/SocietySnap';
import * as Animatable from 'react-native-animatable';
import {GlobalStyle} from '../../../../assets/GlobalStyle';
import {EmptyBox} from '../../../../assets/EmptyAnimation';
import {LoadingCircle} from '../../../../assets/LottieAnims/loading';

export function SearchView(props) {
  function renderItem(item, index) {
    return (
      <Animatable.View
        animation="fadeInUpBig"
        duration={500}
        delay={50 * index}
        style={{
          alignSelf: 'center',
          marginVertical: GlobalStyle.Measurements.marginHalf,
        }}>
        <SocietySnap
          data={item}
          colors={props.colors}
          onPress={() => props.openSociety(item)}
        />
      </Animatable.View>
    );
  }
  return props.data.length > 0
    ? props.data.map((item, index) => renderItem(item, index))
    : props.userIsTyping == false &&
        (props.searching ? (
          <View>
            <LoadingCircle />
          </View>
        ) : (
          <View style={{marginTop: GlobalStyle.Measurements.margin * 2}}>
            <EmptyBox />
          </View>
        ));
}
