import React from 'react';

import HighScore from './high-score';
import Scan from './scan';
import PowerChart from './power-chart';
import CaloryChart from './calory-chart';

import './layout.css';

export default function ({ player, socket }) {
  return (
    <div className="dashboard">
      <HighScore player={player} />
      <Scan player={player} socket={socket} />
      <HighScore player={player} distinct />
      <CaloryChart player={player} />
      <PowerChart player={player} />
    </div>
  );
}
