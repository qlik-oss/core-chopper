import React from 'react';

import logo from './images/qlik-core.svg';
import './header.css';

export default class Header extends React.Component {
  constructor(props) {
    super();
    this.onClose = props.onClose;
  }

  render() {
    return (
      <section className="header">
        <div className="left">
          <img alt="Qlik Core logo" src={logo} />
          <span>/ Chopper</span>
        </div>
        <div className="right">
          <span onClick={() => this.onClose()}>Back to main screen</span>
        </div>
      </section>
    );
  }
}
