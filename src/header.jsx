import React from 'react';

import logo from './resources/qlik-core.svg';

import './header.css';

export default class Header extends React.Component {
  constructor({ user }) {
    super();
    this.state = { user };
  }

  componentWillReceiveProps({ user }) {
    this.setState({ user });
  }

  // todo: fix this.setState({ user: { userid: null, name: null } })
  // need to tear down the game engine instance somehow
  /* eslint no-restricted-globals:0 */
  render() {
    const { user } = this.state;
    const right = (
      <div className="right">
        {user.userid ? <span onClick={() => location.reload()}>Sign out</span> : ''}
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
