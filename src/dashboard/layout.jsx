import React from 'react';

import HighScore from './high-score';
import PowerChart from './power-chart';
import CaloryChart from './calory-chart';

import './layout.css';

export default class Dashboard extends React.Component {
  constructor(props) {
    super();
    this.state = { user: props.user };
    this.done = props.onDone;
  }

  componentWillReceiveProps(nextProps) {
    this.setState({ user: nextProps.user });
  }

  render() {
    const { user } = this.state;
    return (
      <div className="dashboard">
        <HighScore user={user} />
        <div className="go">Scan ID badge to play!</div>
        <HighScore user={user} distinct />
        <CaloryChart user={user} />
        <PowerChart user={user} />
      </div>
    );
  }
}
