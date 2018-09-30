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
        userid: '21f25745-d611-477a-8c31-654feca511e5',
        name: 'Tom',
        cardid: 'f23eb809',
      },
    });
  }

  render() {
    const { user } = this.state;

    let view = (
      <div className="badge" onClick={() => this.testUser()}>
        <h2>Scan ID badge to play!</h2>
      </div>
    );
    if (user.userid && !user.name) {
      view = (
        <div className="name">
          <p>
Looks like this is your first time riding the chopper!
Please fill in your name:
          </p>
          <input autoFocus onKeyUp={evt => this.manualInput(evt)} />
        </div>
      );
    }
    return (<div className="scan">{view}</div>);
  }
}
