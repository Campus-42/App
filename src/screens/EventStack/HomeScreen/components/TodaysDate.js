import React from 'react';
import {Text} from 'react-native';
import {DateFuncs} from '../../../../assets/Date';
import {GlobalStyle} from '../../../../assets/GlobalStyle';

export function TodaysDate(props) {
  const date = new Date();
  const month = DateFuncs.getMonthName(date.getMonth());
  const weekday = date.toString().substring(0, 3);
  const day = date.getDate();
  const year = date.getFullYear();

  return (
    <Text
      style={[
        GlobalStyle.TextStyle.headingSmall,
        {color: props.textColor},
      ]}>{`${weekday} ${day} ${month} ${year}`}</Text>
  );
}
