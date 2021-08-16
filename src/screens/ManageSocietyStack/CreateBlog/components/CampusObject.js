import React from 'react';
import SkeletonContent from 'react-native-skeleton-content-nonexpo';
import {SocietySnap} from '../../../../assets/SocietyCarousel/SocietySnap';
import {
  EventSnap,
  styles as evtStyles,
} from '../../../EventStack/HomeScreen/components/EventCarousel/EventSnap';

export class CampusObject extends React.Component {
  render() {
    const type = this.props.item.type;
    const value = this.props.item.value;
    const id = `${type}_${value}`;
    const data = (this.props.campusObjects || {})[id] || {};

    return (
      <SkeletonContent
        isLoading={Object.keys(data).length < 5}
        containerStyle={{}}
        layout={skeleton}>
        {type == 'event' ? (
          <EventSnap
            style={{alignSelf: 'center'}}
            data={data}
            bookmarks={this.props.store.user.bookmarks}
            reduxEvent={this.props.store.app.events[this.props.item.value]}
            tagColors={this.props.tagColors}
            colors={this.props.store.app.campus.colors}
            openEvent={() =>
              this.props.navigate('Event Focus', {
                id: this.props.item.value,
              })
            }
            dontShowBookmark={this.props.creating}
          />
        ) : type == 'society' ? (
          <SocietySnap
            data={data}
            reduxSociety={this.props.store.app.societies[this.props.item.value]}
            bookmarks={this.props.store.user.bookmarks}
            colors={this.props.store.app.campus.colors}
            onPress={() =>
              this.props.navigate('Society Preview', {
                id: this.props.item.value,
              })
            }
            dontShowBookmark={this.props.creating}
          />
        ) : null}
      </SkeletonContent>
    );
  }
}
const skeleton = [
  {
    id: 'skeleton_message_custom_view',
    width: evtStyles.container.width,
    height: evtStyles.container.height,
    borderRadius: evtStyles.container.borderRadius,
  },
];
