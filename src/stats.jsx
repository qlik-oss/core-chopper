import React from 'react';

import getDoc from './enigma/doc';

import './stats.css';

export default class Stats extends React.Component {
  constructor() {
    super();
    this.state = { stats: null };
    getDoc().then(async (doc) => {
      const [cntUsers, cntGames, avgSpeed, avgCadence] = await Promise.all([
        doc.evaluate('COUNT(DISTINCT userid)'),
        doc.evaluate('COUNT(DISTINCT gameid)'),
        doc.evaluate('AVG(speed)'),
        doc.evaluate('AVG(cadence)'),
      ]);
      this.setState({
        stats: {
          cntUsers,
          cntGames,
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
players in total. They have played
          {' '}
          <strong>{stats.cntGames}</strong>
          {' '}
games, averaging a speed of
          {' '}
          <strong>{Math.round((isNaN(stats.avgSpeed) ? 0 : stats.avgSpeed) * 18 / 5)}</strong>
          {' '}
km/h with an average cadence of
          {' '}
          <strong>{Math.round(isNaN(stats.avgCadence) ? 0 : stats.avgCadence)}</strong>
.
        </p>
      </div>
    );
  }
}
