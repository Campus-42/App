import React from 'react';
import {View} from 'react-native';
import {WebView as RNWebView} from 'react-native-webview';
import {styles} from './style';
import {Footer, Header} from './components/HeaderAndFooter';
import {analytics} from '../Analytics';
import FontAwesome5Icon from 'react-native-vector-icons/FontAwesome5';
import {GlobalStyle} from '../GlobalStyle';
import {LoadingCircle} from '../LottieAnims/loading';

const ICON_SIZE = GlobalStyle.Measurements.unit;

export class WebView extends React.Component {
  constructor() {
    super();
    this.web = React.createRef({
      stopLoading: () => {},
      reload: () => {},
      goBack: () => {},
      goForward: () => {},
    });
    this.state = {
      url: '',
      stack: [],
      loading: true,
      error: true,
      init: false,
      canGoForward: false,
      canGoBack: false,
    };
  }
  componentDidMount() {
    this.setState({url: this.props.route.params.url});
  }

  render() {
    return (
      <View style={styles.container}>
        <Header
          goBack={this.props.navigation.goBack}
          loading={this.state.loading}
          stopLoading={
            this.state.init ? this.web.current.stopLoading : () => {}
          }
          reload={this.state.init ? this.web.current.reload : () => {}}
          loading={this.state.loading}
        />
        <RNWebView
          ref={this.web}
          style={styles.web}
          onLoad={() => this.setState({loading: true, error: false})}
          onLoadEnd={({nativeEvent}) =>
            this.setState({
              loading: false,
              init: true,
              canGoBack: nativeEvent.canGoBack,
              canGoForward: nativeEvent.canGoForward,
            })
          }
          onError={(err) => {
            this.setState({error: true, loading: false});
            analytics.error(err, 'WebView', 'onError');
          }}
          startInLoadingState
          source={{uri: this.state.url}}
          onNavigationStateChange={this.handleNavigationChange}
        />

        <Footer
          goBack={this.state.init && this.web.current.goBack}
          goForward={this.state.init && this.web.current.goForward}
          url={this.state.stack.slice(-1)[0]}
          canGoBack={this.state.canGoBack}
          canGoForward={this.state.canGoForward}
        />
      </View>
    );
  }
  handleNavigationChange = (nav) => {
    this.setState({stack: this.state.stack.concat(nav.url)});
  };
}
