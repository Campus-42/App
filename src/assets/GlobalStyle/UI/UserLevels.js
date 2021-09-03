import React from 'react';
import {StyleSheet, Easing, Text, View} from 'react-native';
import {ColorStyle, Palettes} from '../ColorStyle';
import {Measurements} from '../Measurements';
import {Animated} from 'react-native';
import {TextStyle} from '../TextStyle';
import {LevelBadge} from '../../../screens/ProfileStack/Profile/components/LevelBadge';
import PropTypes from 'prop-types';
import {Campus} from '../../Campus';
import {TouchableOpacity} from 'react-native';
import FontAwesome5Icon from 'react-native-vector-icons/FontAwesome5';

export function UserLevels(props) {
  return (props.campusPointSystem || {}).level_limits ? (
    <_UserLevels {...props} />
  ) : null;
}

export class _UserLevels extends React.Component {
  constructor() {
    super();
    this.state = {
      width: new Animated.Value(0),
      progress: undefined,
      triggeredUpdate: false,
    };
  }

  componentDidMount() {
    this.componentDidUpdate();
  }

  componentDidUpdate() {
    const {user, campusPointSystem} = this.props;

    const existingProps = user && (campusPointSystem || {}).level_limits;

    if (existingProps) {
      const lvl = Campus.Funcs.points.getLevelInfoForProgression(
        campusPointSystem.level_limits,
        user,
      );

      const animWidth =
        styles.outerLine.width * (lvl.progress >= 1 ? 1 : lvl.progress);
      const closeEnoughToShow =
        (lvl.remainingPoints < 20 && lvl.levelPointsEarned >= 5) ||
        lvl.progress > 0.8;
      const color = Campus.Funcs.points.getLevelColors(user.level);

      if (this.state.progress !== lvl.progress)
        this.setState({
          show: closeEnoughToShow || false,
          color,
          levelPointsEarned: lvl.levelPointsEarned,
          levelPointsNeeded: lvl.levelPointsNeeded,
          progress: lvl.progress || 0,
          nextLevel: lvl.nextLevelPoints || 0,
        });

      if (closeEnoughToShow || this.props.show) {
        Animated.timing(this.state.width, {
          toValue: animWidth,
          duration: 0,
          delay: 0,
          useNativeDriver: false,
        }).start();
      }

      if (lvl.progress >= 1)
        Campus.Funcs.points.triggerPointEvent('_reload', this.props.campus.key);
    }
  }
  // TODO: What do I need to do to level up?
  render() {
    const user = {level: 1, points: 0, ...this.props.user};

    return (this.props.user && this.state.show) || this.props.show ? (
      <View
        style={[
          styles.container,
          {
            backgroundColor: Palettes.background.palette6,
          },
          this.props.showShadow && styles.shadow,
        ]}>
        {this.props.showTitle && (
          <Text style={styles.title}>
            {getText(user.first_name, this.state.progress, this.state.show)}
          </Text>
        )}
        <View style={styles.lineAndBadgeContainer}>
          <LevelBadge
            position={'relative'}
            user={{...user, level: user.level || 1}}
            height={BADGE_SIZE}
            style={styles.levelBadge}
            useMargin={false}
            fill={0}
          />
          <View style={styles.lineContainer}>
            <View style={styles.outerLine}>
              <Animated.View
                style={[
                  styles.innerLine,
                  {
                    width: this.state.width,
                    backgroundColor: this.state.color,
                  },
                ]}
              />
            </View>
            <Text style={styles.pointDifference}>
              {this.state.levelPointsEarned} / {this.state.levelPointsNeeded}
            </Text>
          </View>
          <LevelBadge
            position={'relative'}
            user={{...user, level: (user.level || 1) + 1}}
            height={BADGE_SIZE}
            style={styles.levelBadge}
            useMargin={false}
            fill={0}
          />
        </View>
        {this.props.navigate && (
          <TouchableOpacity
            style={styles.earnMoreButton}
            onPress={() => this.props.navigate('Point Events')}>
            <Text style={styles.earnMoreText}>Earn more points</Text>
            <FontAwesome5Icon
              name={'arrow-right'}
              color={ColorStyle.blueButtonText}
              size={Measurements.unit * 0.5}
            />
          </TouchableOpacity>
        )}
      </View>
    ) : null;
  }
}

function getText(name, progress, show) {
  if (show) return `Almost there ${name}!`;
  else if (progress > 0.5) return `Steady progress ${name}!`;
  else if (progress > 0.1) return 'Nice start, keep going!';
  else return 'Gotta start somewhere';
}

const LINE_HEIGHT = 6;
const WIDTH = Measurements.width * 0.9;
const BADGE_SIZE = Measurements.unit * 3.5;
const LINE_WIDTH = WIDTH - BADGE_SIZE * 1.5;

const styles = StyleSheet.create({
  container: {
    width: WIDTH,
    minHeight: Measurements.unit * 3,
    alignSelf: 'center',
    alignItems: 'center',
    marginVertical: Measurements.marginQuarter,
    borderRadius: Measurements.unit,
    padding: Measurements.marginHalf,
  },
  innerLine: {
    width: 0,
    height: LINE_HEIGHT,
    borderRadius: LINE_HEIGHT / 2,
    backgroundColor: ColorStyle.candyRed,
  },
  outerLine: {
    width: LINE_WIDTH,
    height: LINE_HEIGHT,
    borderRadius: LINE_HEIGHT,
    backgroundColor: Palettes.inverseBackground.palette1,
  },
  title: {
    ...TextStyle.bodyMedium,
    textAlign: 'left',
    alignSelf: 'flex-start',
    marginBottom: Measurements.marginHalf,
    marginLeft: 10,
  },
  lineAndBadgeContainer: {
    width: WIDTH,
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: Measurements.width * 0.025,
    alignItems: 'center',
    marginVertical: Measurements.marginQuarter,
  },
  badgeContainer: {
    width: WIDTH,
    marginVertical: 5,
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: (WIDTH - LINE_WIDTH) / 4,
    alignItems: 'center',
  },
  levelBadge: {marginRight: 0, marginBottom: 0},
  text: {
    ...TextStyle.bodyMedium,
  },
  pointDifference: {
    ...TextStyle.levelText,
    fontSize: TextStyle.bodyRegular.fontSize,
    alignSelf: 'flex-end',
  },
  earnMoreButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'flex-start',
    alignSelf: 'flex-start',

    marginTop: 4,
    marginLeft: 4,
    padding: 3,
  },
  earnMoreText: {
    ...TextStyle.bodySmall,
    color: ColorStyle.blueButtonText,
    marginRight: 10,
  },
  shadow: {
    shadowColor: '#000',
    shadowOffset: {width: 0, height: 2},
    shadowOpacity: 0.1,
    shadowRadius: 5,
    elevation: 2,
  },
});

UserLevels.defaultProps = {
  show: false,
  campusPointSystem: {},
  user: {},
  showTitle: true,
  navigate: false,
};
UserLevels.propTypes = {
  show: PropTypes.bool,
  campusPointSystem: PropTypes.object.isRequired,
  user: PropTypes.object.isRequired,
  showTitle: PropTypes.bool,
  navigate: PropTypes.func.isRequired,
  showShadow: PropTypes.bool,
};
