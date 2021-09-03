import React from 'react';
import {} from 'react-native';
import {SignInComponent} from './SignIn';
import {SignInLinkComponent} from './SignInLink';
import {ResetPasswordComponent} from './ResetPassword';
import {CreateAccountComponent} from './CreateAccount';
import {VerifyComponent} from './Verify';
import {Introduction} from "./Introduction"

export const AuthorizationComponents = (props) => {
  if (props.signInState === 'signin') return <SignInComponent {...props} />;
  else if (props.signInState === 'createaccount')
    return <CreateAccountComponent {...props} />;
  else if (props.signInState === 'resetpassword')
    return <ResetPasswordComponent {...props} />;
  else if (props.signInState === 'verify')
    return <VerifyComponent {...props} />;
  else if (props.signInState === 'link')
    return <SignInLinkComponent {...props} />;
  else if (props.signInState === 'intro') return <Introduction {...props} />;
  else return null;
};
