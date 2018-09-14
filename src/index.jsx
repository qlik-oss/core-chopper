import React from 'react';
import ReactDOM from 'react-dom';

import Scan from './scan';
import Engine from './game/engine';

import './index.scss';

// expose React globally, we need this to avoid
// it being removed by the experimental treeshaking
// algorithm in parcel:
window.React = React;

class Index extends React.Component {
  constructor() {
    super();
    this.state = {
      user: { id: null, name: '' },
    };
    this.socket = new WebSocket('ws://localhost:8080');
    this.socket.onmessage = (...args) => this.socketData(...args);
  }

  socketData(evt) {
    const result = JSON.parse(evt.data);
    // console.log(data);
    if (result.type === 'scan') {
      this.setState({ user: result.data });
    } else if (result.type === 'ant-speed') {
      // how to stream this data to <Engine>?
    }
  }

  done(user) {
    this.setState({ user });
  }

  render() {
    const { user } = this.state;
    if (!user.id || !user.name) {
      return <Scan user={user} onDone={user => this.done(user)} />;
    }
    return <Engine user={user} />;
  }
}

ReactDOM.render(
  <div className="index">
    <Index />
  </div>,
  document.getElementById('app'),
);

if (module.hot) {
  // used for hot module replacement during development:
  module.hot.accept();
}
