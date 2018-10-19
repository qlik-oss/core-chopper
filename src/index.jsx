import '@babel/polyfill';

import React from 'react';
import ReactDOM from 'react-dom';

import Socket from './socket';
import Header from './header';
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
    this.scannedListener = (scannedUser) => {
      const { user } = this.state;
      if (scannedUser.userid === user.userid) {
        this.setState({ isStarted: true });
      } else {
        this.setState({ user: scannedUser });
      }
    };
    socket.on('user:updated', this.updatedListener);
    socket.on('user:scanned', this.scannedListener);
    this.state = { user: {}, socket, mode: '' };
  }

  componentWillUnmount() {
    const { socket } = this.state;
    socket.off('user:updated', this.updatedListener);
    socket.off('user:scanned', this.scannedListener);
  }

  setMode(mode) {
    this.setState({ mode });
  }

  render() {
    const { user, socket, isStarted, mode } = this.state;
    let view;

    function foo () {
      if (mode === 'classic') {
        return <Engine user={user} socket={socket} />
      } else if ( mode === 'challenge' ) {
        return 'cha'
      }
    }

    if (!isStarted) {
      view = (
        <Dashboard user={user} socket={socket} />
      );
    } else {

      if ( !mode) {
        view = (
          // <Engine user={user} socket={socket} />

          <div className='gameModes'>
            <div>Select game mode!</div>
            <div className='modes'>
              <div className='mode' onClick={() => this.setMode('classic')}>classic</div>
              <div className='mode' onClick={() => this.setMode('challenge')}>challenge</div>
            </div>
          </div>
        );
      } else {
        view = (
          <Engine user={user} socket={socket} mode={mode}/>
        )
      }
    }
    return (
      <div className="index">
        <Header user={user} />
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
