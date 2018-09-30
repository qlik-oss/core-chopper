import '@babel/polyfill';

import React from 'react';
import ReactDOM from 'react-dom';

import Socket from './socket';
import Header from './header';
import Scan from './login/scan';
import Dashboard from './dashboard/layout';
import Engine from './game/engine';

import './index.css';

// expose React globally, we need this to avoid
// it being removed by the experimental treeshaking
// algorithm in parcel:
window.React = React;

class Index extends React.Component {
  constructor() {
    super();
    const socket = new Socket();
    this.updatedListener = user => this.setState({ user });
    this.scannedListener = () => this.setState({ isStarted: true });
    socket.on('user:updated', this.updatedListener);
    socket.on('user:scanned', this.scannedListener);
    this.state = { user: {}, socket };
  }

  componentWillUnmount() {
    const { socket } = this.state;
    socket.off('user:updated', this.updatedListener);
    socket.off('user:scanned', this.scannedListener);
  }

  render() {
    const { user, socket, isStarted } = this.state;
    let view;
    if (!user.userid || !user.name) {
      view = (<Scan user={user} socket={socket} />);
    } else if (!isStarted) {
      view = (
        <Dashboard user={user} />
      );
    } else {
      view = (
        <Engine user={user} socket={socket} />
      );
    }
    // todo: fix this.setState({ user: { userid: null, name: null } })
    // need to tear down the game engine instance somehow
    /* eslint no-restricted-globals:0 */
    //
    return (
      <div className="index">
        <Header
          showBack={user}
          showPlay={user && !isStarted}
          onStart={() => this.setState({ isStarted: true })}
          onClose={() => location.reload()}
        />
        {view}
      </div>
    );
  }
}

ReactDOM.render(
  <Index />,
  document.getElementById('app'),
);

if (module.hot) {
  // used for hot module replacement during development:
  module.hot.accept();
}
