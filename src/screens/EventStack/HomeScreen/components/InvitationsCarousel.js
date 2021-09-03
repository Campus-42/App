import React from 'react';
import {Text} from 'react-native';
import Carousel from 'react-native-snap-carousel';
import {localCarouselStyles} from './EventCarousel/EventCarousel';
import {Invitation} from '../../../ProfileStack/ProfileInvitations/components/Invitation';
import {styles as invStyles} from '../../../ProfileStack/ProfileInvitations/style';
import {GlobalStyle} from '../../../../assets/GlobalStyle';
import * as Animatable from 'react-native-animatable';
import {getAllTags, getTagColors} from '../../../../assets/Airtable/functions';

const SLIDER_WIDTH = GlobalStyle.Measurements.width;
export const ITEM_WIDTH = invStyles.buttonContainer.width;
export const ITEM_HEIGHT = invStyles.buttonContainer.height;

export function InvitationCarousel(props) {
  const [tags, setTags] = React.useState([]);
  const [tagColors, setTagColors] = React.useState([]);
  const [mounted, setMounted] = React.useState(false);

  React.useEffect(() => {
    if (!mounted) {
      setMounted(true);
      getTagColors().then((colors) => setTagColors(colors));
      getAllTags().then((tags) => setTags(tags));
    }
    return;
  });

  function renderItem({item, index}) {
    return (
      <Invitation
        invite={item}
        campusKey={props.campusKey}
        index={index}
        navigation={props.navigation}
        tagColors={tagColors}
        tags={tags}
        colors={props.colors}
      />
    );
  }

  const unusedInvitations = props.invitations.filter((e) =>
    props.invitationIDs.includes(e.invite.id),
  );
  return (
    unusedInvitations.length > 0 && (
      <Animatable.View
        animation={{0: {scale: 0.5, opacity: 0}, 1: {scale: 1, opacity: 1}}}
        duration={500}>
        <Text style={localCarouselStyles.text}>Invitations</Text>
        <Carousel
          data={unusedInvitations}
          itemHeight={ITEM_HEIGHT}
          style={{backgroundColor: 'red'}}
          layout="stack"
          itemWidth={ITEM_WIDTH}
          sliderWidth={SLIDER_WIDTH}
          key="InvitationCarousel"
          renderItem={renderItem}
        />
      </Animatable.View>
    )
  );
}
