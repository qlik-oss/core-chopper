import React from 'react';

import HighScore from './high-score';
import Scan from './scan';
import PowerChart from './power-chart';
import CaloryChart from './calory-chart';

import './layout.css';

export default class Dashboard extends React.Component {
  constructor({ user, socket }) {
    super();
    this.state = { user, socket };
  }

  componentWillReceiveProps({ user }) {
    this.setState({ user });
  }

  render() {
    const { user, socket } = this.state;
    return (
      <div className="dashboard">
        <HighScore user={user} />
        <Scan user={user} socket={socket} />
        <HighScore user={user} distinct />
        <CaloryChart user={user} />
        <PowerChart user={user} />
      </div>
    );
  }
}
