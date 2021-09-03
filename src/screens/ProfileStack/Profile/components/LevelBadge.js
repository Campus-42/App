import React from 'react';
import {View, Text} from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import PropTypes from 'prop-types';
import {AnimatedCircularProgress} from 'react-native-circular-progress';
import {Campus} from '../../../../assets/Campus';
import Color from 'color';
import {TextStyle} from '../../../../assets/GlobalStyle/TextStyle';

export class LevelBadge extends React.Component {
  constructor() {
    super();
    this.state = {
      fill: 0,
      baseSize: 0,
      init: false,
    };
  }
  componentDidMount() {
    const baseSize =
      this.props.height / (this.props.smallLevelBadge ? 3.5 : 5.75);

    this.setState({baseSize, init: true});
  }

  render() {
    const iconSize = this.state.baseSize * 2.4;
    const borderWidth = this.state.baseSize / 4;

    const {user, campusPointSystem} = this.props;
    const show = user && (campusPointSystem || {}).level_limits;
    var fill = 0;

    if (show) {
      const {progress} = Campus.Funcs.points.getLevelInfoForProgression(
        campusPointSystem.level_limits,
        user,
      );
      fill = progress * 100;
    }

    const color = Campus.Funcs.points.getLevelColors(this.props.user.level);
    const colors = [
      Color(color).lighten(0.15).hsl().string(),
      Color(color).darken(0.15).hsl().string(),
    ];

    return this.props.user.level && this.props.dontShowLevelBadge === false ? (
      <View
        style={{
          position: this.props.position || 'absolute',
          alignItems: 'center',
          justifyContent: 'center',
          elevation: 4,
          shadowColor: Color(color).darken(0.3).hsl().string(),
          shadowOffset: {width: 0, height: 3},
          shadowOpacity:
            this.props.position == 'absolute' || this.props.position == false
              ? 0.6
              : 0,
          shadowRadius: 2,
        }}>
        {this.props.smallLevelBadge ? (
          <View
            style={{
              marginRight: this.props.useMargin
                ? this.props.height - this.state.baseSize + 2
                : 0,
              marginBottom: this.props.useMargin
                ? this.props.height - this.state.baseSize + 2
                : 0,

              backgroundColor: Color(color).lighten(0.1).hsl().string(),
              height: this.state.baseSize,
              width: this.state.baseSize,
              borderRadius: this.state.baseSize / 2,
            }}
          />
        ) : (
          <LinearGradient
            colors={colors}
            style={{
              marginRight: this.props.useMargin
                ? this.props.height - this.state.baseSize
                : 0,
              marginBottom: this.props.useMargin
                ? this.props.height - this.state.baseSize - 15
                : 0,
              borderRadius: 100,
              alignItems: 'center',
              justifyContent: 'center',
              padding: borderWidth / 2,
            }}>
            <AnimatedCircularProgress
              padding={1}
              animated={this.props.fill !== false}
              lineCap={'round'}
              size={iconSize}
              duration={!this.props.fill ? 650 : 0}
              style={{alignSelf: 'center', opacity: 0.95}}
              width={borderWidth}
              fill={this.props.fill || fill}
              tintColor={'#ffffff'}>
              {(fill) => (
                <Text
                  style={[
                    TextStyle.levelText,
                    {
                      fontSize: this.state.baseSize * 1.1,
                      color: '#ffffff',
                    },
                  ]}>
                  {this.props.user.level || 0}
                </Text>
              )}
            </AnimatedCircularProgress>
          </LinearGradient>
        )}
      </View>
    ) : null;
  }
}

LevelBadge.defaultProps = {
  height: 50,
  position: false,
  user: {level: 1},
  style: {},
  useMargin: true,
  fill: false,
  dontShowLevelBadge: false,
};
LevelBadge.propTypes = {
  height: PropTypes.number.isRequired,
  position: PropTypes.oneOfType([PropTypes.bool, PropTypes.string]),
  user: PropTypes.object.isRequired,
  style: PropTypes.oneOfType([PropTypes.bool, PropTypes.object]),
  useMargin: PropTypes.bool,
  fill: PropTypes.oneOfType([PropTypes.number, PropTypes.bool]),
  dontShowLevelBadge: PropTypes.bool,
};
