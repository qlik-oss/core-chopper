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
        <div className="top">
          <HighScore user={user} />
          <HighScore user={user} distinct />
        </div>
        <CaloryChart user={user} />
        <PowerChart user={user} />
      </div>
    );
  }
}
