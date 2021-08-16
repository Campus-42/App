import React from 'react';
import PropTypes from 'prop-types';
import {Popup} from './Popup';
import {Toast} from './Toast';

export class Popups extends React.Component {
  constructor() {
    super();

    this.popup = React.createRef();
    this.toast = React.createRef();
  }

  animateIn = (type = false) => {
    if (type) this[type].current.animateIn();
  };
  animateOut = (type = false) => {
    if (type) this[type].current.animateOut();
  };

  render() {
    return (
      <React.Fragment>
        <Toast ref={this.toast} {...this.props} />
        <Popup ref={this.popup} {...this.props} />
      </React.Fragment>
    );
  }
}

// TODO: Background blur view
PropTypes.defaultProps = {
  title: false,
  level: false,
  text: false,
  type: false,
};
