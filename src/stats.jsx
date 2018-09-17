import React from 'react';

import getDoc from './enigma/doc';

import './stats.css';

export default class Stats extends React.Component {
  constructor() {
    super();
    this.state = { stats: null };
    getDoc().then(async (doc) => {
      const [cntUsers, avgSpeed, avgCadence] = await Promise.all([
        doc.evaluate('COUNT(DISTINCT userid)'),
        doc.evaluate('AVG(speed)'),
        doc.evaluate('AVG(cadence)'),
      ]);
      this.setState({
        stats: {
          cntUsers,
          avgSpeed,
          avgCadence,
        },
      });
    });
  }

  render() {
    const { stats } = this.state;
    if (!stats) {
      return (<p>Loading...</p>);
    }
    return (
      <div className="stats">
        <p>
There has been
          {' '}
          <strong>{stats.cntUsers}</strong>
          {' '}
players in total, averaging a speed of
          {' '}
          <strong>{Math.round((stats.avgSpeed * 18) / 5)}</strong>
          {' '}
km/h with an average cadence of
          {' '}
          <strong>{Math.round(stats.avgCadence)}</strong>
.
        </p>
      </div>
    );
  }
}
