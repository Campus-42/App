import React from 'react';
import {} from 'react-native';
import * as Animatable from 'react-native-animatable';
import {CreateAccount} from './CreateAccount';
import {Initial} from './Initial';
import {ResetPassword} from './ResetPassword';
import {Signin} from './Signin';
import {Verify} from './Verify';

export class AuthParent extends React.Component {
  constructor() {
    super();
    this.parent = React.createRef();
    this.state = {
      target: false,
      user: false,
    };
  }

  componentDidMount() {
    const animDuration = 450;
    setTimeout(() => {
      this.setState({target: this.props.target});
      this.parent.current.fadeInUp(animDuration);
    }, animDuration);
  }
  componentDidUpdate() {
    if (
      this.props.target !== this.state.target &&
      this.state.target !== false
    ) {
      const animDuration = 450;
      if (this.state.target) this.parent.current.fadeOutDown(animDuration / 2);

      console.log('New target', this.props.target);

      setTimeout(() => {
        this.setState({target: this.props.target});
        this.parent.current.fadeInUp(animDuration);
      }, animDuration / 2);
    }
  }
  render() {
    const target = this.state.target;
    const user = this.state.user || this.props.user;

    return (
      <Animatable.View ref={this.parent} style={{opacity: 0, marginTop: 0}}>
        {target === 'initial' ? (
          <Initial updateTarget={this.props.updateTarget} />
        ) : target === 'signin' ? (
          <Signin
            updateTarget={this.props.updateTarget}
            updateSignedIn={this.props.updateSignedIn}
            updateUser={(user) => this.setState({user})}
          />
        ) : target === 'createaccount' ? (
          <CreateAccount
            setScrollIsEnabled={this.props.setScrollIsEnabled}
            updateTarget={this.props.updateTarget}
            showPopup={this.props.showPopup}
            updateSignedIn={this.props.updateSignedIn}
          />
        ) : target === 'resetpassword' ? (
          <ResetPassword
            updateTarget={this.props.updateTarget}
            showPopup={this.props.showPopup}
          />
        ) : target === 'verify' ? (
          <Verify
            showPopup={this.props.showPopup}
            updateTarget={this.props.updateTarget}
            updateSignedIn={this.props.updateSignedIn}
            user={user}
          />
        ) : (
          <Initial updateTarget={this.props.updateTarget} />
        )}
      </Animatable.View>
    );
  }
}
