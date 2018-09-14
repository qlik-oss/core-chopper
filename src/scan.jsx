import React from 'react';

import './scan.scss';

export default class Scan extends React.Component {
  constructor(props) {
    super();
    this.state = { user: props.user };
    this.done = props.onDone;
  }

  manualInput(evt) {
    const { user } = this.state;
    if (!user.id) {
      user.id = +new Date();
    }
    user.name = evt.target.value;
    if (user.name.trim() !== '' && evt.key === 'Enter') {
      // close view
      this.done(user);
    }
  }

  render() {
    const { user } = this.state;
    if (!user.id) {
      return (
        <div className="scan">
          <div className="badge">
            <p>Please scan your ID badge to begin</p>
          </div>
          <p>
Manual input:
            {' '}
            <input onKeyUp={evt => this.manualInput(evt)} />
          </p>
        </div>
      );
    } if (!user.name) {
      return (
        <div className="name">
          <p>
Looks like this is your first time riding the chopper!
Let's get you sorted, please fill in your name:
          </p>
          <input onChange={evt => this.updateName(evt)} />
        </div>
      );
    }
  }
}
