import React from 'react';
import {StyleSheet, View, Text} from 'react-native';
import {UserImage} from '../../../screens/ProfileStack/Profile/components/UserImage';
import PropTypes from 'prop-types';
import {CacheFuncs} from '../../Cache';
import {Measurements} from '../Measurements';
import {TextStyle} from '../TextStyle';

export class PreviewUsers extends React.Component {
  constructor() {
    super();
    this.state = {
      users: {},
      viewWidth: false,
      textWidth: false,
      init: false,
    };
  }
  async componentDidMount() {
    const {users} = await CacheFuncs.getUsers(this.props.users);
    this.setState({users, init: true});
  }
  async componentDidUpdate(prevProps) {
    if (
      !arraysEqual(prevProps.users, this.props.users) &&
      Array.isArray(this.props.users)
    ) {
      const {users} = await CacheFuncs.getUsers(
        ((uids = this.props.users), (removeSignedInUser = true)),
      );

      if (Object.keys(users).length < 0) this.componentDidUpdate();
      else this.setState({users, init: true});
     
    }
  }
  render() {
    const size = getSize(this.props.size);
    const userImageStyle = {...styles.userImage, height: size, width: size};
    const totalWidth = this.state.viewWidth || 0 - this.state.textWidth || 0;

    const numToShow = Math.floor((totalWidth - styles.text.marginLeft) / size);
    const numHidden =
      (this.props.users.length || 1) -
      (Object.keys(this.state.users).length || 0);

    return (
      <View
        style={[
          styles.container,
          this.state.viewWidth && {width: this.state.viewWidth},
          this.props.style,
        ]}
        onLayout={this.onViewLayout}>
        {Object.values(this.state.users)
          .slice(0, numToShow)
          .map((e, i) => (
            <UserImage
              user={e}
              key={'preview_user_' + e.uid}
              style={userImageStyle}
              dontShowLevelBadge
              colors={this.props.colors}
            />
          ))}
        {numHidden > 0 && this.state.init && (
          <Text onLayout={this.onTextLayout} style={styles.text}>
            +{numHidden} more
          </Text>
        )}
      </View>
    );
  }
  onViewLayout = ({nativeEvent}) => {
    if (this.state.viewWidth == 0)
      this.setState({viewWidth: nativeEvent.layout.width});
  };
  onTextLayout = ({nativeEvent}) => {
    if (this.state.viewWidth == 0)
      this.setState({textWidth: nativeEvent.layout.width});
  };
}

function getSize(size) {
  const {unit} = Measurements;
  switch (size) {
    case 'small':
      return unit;
    case 'regular':
      return unit * 1.65;
    case 'large':
      return unit * 4;
    case typeof size == 'number':
      return size;
    default:
      return unit * 2;
  }
}

function arraysEqual(a, b) {
  if (a === b) return true;
  if (a == null || b == null) return false;
  if (a.length !== b.length) return false;

  for (var i = 0; i < a.length; ++i) {
    if (a[i] !== b[i]) return false;
  }
  return true;
}

const PADDING = 7.5;
const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    paddingLeft: PADDING,
    alignItems: 'center',
    justifyContent: 'flex-start',
  },
  userImage: {
    marginLeft: -PADDING,
    borderWidth: 2,
    borderColor: '#fff',
  },
  text: {
    ...TextStyle.bodySmall,
    marginLeft: 10,
  },
});

PreviewUsers.defaultProps = {users: [], colors: {}};
PreviewUsers.propTypes = {
  users: PropTypes.array,
  colors: PropTypes.object,
  style: PropTypes.object,
};
