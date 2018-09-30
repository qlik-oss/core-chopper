import React from 'react';

import logo from './resources/qlik-core.svg';

import './header.css';

export default class Header extends React.Component {
  constructor(props) {
    super();
    this.onClose = props.onClose;
    this.onStart = props.onStart;
    this.state = {};
  }

  componentWillReceiveProps({ showBack, showPlay }) {
    this.setState({ showBack, showPlay });
  }

  render() {
    const { showBack, showPlay } = this.state;
    const right = (
      <div className="right">
        {showBack && (<span onClick={() => this.onClose()}>Back to main screen</span>)}
        {showPlay && (<span onClick={() => this.onStart()}>Start game</span>)}
      </div>
    );
    return (
      <section className="header">
        <div className="left">
          <img alt="Qlik Core logo" src={logo} />
          <span>/ Chopper</span>
        </div>
        {right}
      </section>
    );
  }
}
