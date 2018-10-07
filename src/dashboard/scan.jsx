import React from 'react';

import './scan.css';

export default class Scan extends React.Component {
  constructor({ user, socket }) {
    super();
    this.state = { user, socket };
  }

  componentWillReceiveProps({ user }) {
    this.setState({ user });
  }

  manualInput(evt) {
    const { user, socket } = this.state;
    user.name = evt.target.value.trim();
    if (user.userid && user.name !== '' && evt.key === 'Enter') {
      // save it:
      socket.send({ type: 'user:save', data: user });
    }
  }

  testUser() {
    const { socket } = this.state;
    socket.send({
      type: 'user:save',
      data: {
        userid: 'test',
        name: 'Test U',
        cardid: 'test',
      },
    });
  }

  testUserScanned() {
    const { socket, user } = this.state;
    socket.receive(JSON.stringify({
      type: 'user:scanned',
      data: user,
    }));
  }

  render() {
    const { user } = this.state;

    let view;

    if (!user || !user.userid) {
      view = (
        <h2 onClick={() => this.testUser()}>Scan ID badge to sign in!</h2>
      );
    } else if (user.userid && !user.name) {
      view = (
        <div className="name">
          <p>
Looks like this is your first time riding the chopper!
Please fill in your name:
          </p>
          <input autoFocus onKeyUp={evt => this.manualInput(evt)} />
        </div>
      );
    } else {
      view = (
        <h2 onClick={() => this.testUserScanned()}>
Welcome,
          {' '}
          <strong>{user.name}</strong>
! Scan your ID badge again to play!
        </h2>
      );
    }
    return (<div className="scan">{view}</div>);
  }
}
