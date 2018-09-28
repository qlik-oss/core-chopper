import React from 'react';

import EnigmaModel from '../enigma/model';
import Stats from './stats';

import './high-score.css';

const genericProps = {
  qInfo: {
    qType: 'highscore',
  },
  qHyperCubeDef: {
    qDimensions: [
      { qDef: { qFieldDefs: ['=[name]&\'::\'&[userid]'] } },
      {
        qDef: {
          qFieldDefs: ['score'],
          qReverseSort: true,
          qSortCriterias: [{ qSortByNumeric: true }],
        },
      }],
    qInitialDataFetch: [{
      qWidth: 2,
      qHeight: 10,
    }],
    qInterColumnSortOrder: [1, 0],
  },
};

const genericPropsDistinct = {
  qInfo: {
    qType: 'highscore-distinct',
  },
  qHyperCubeDef: {
    qDimensions: [
      { qDef: { qFieldDefs: ['=[name]&\'::\'&[userid]'] } },
    ],
    qMeasures: [{
      qDef: {
        qDef: 'Max([score])',
        qReverseSort: true,
      },
      qSortBy: { qSortByNumeric: 1 },
    }],
    qInitialDataFetch: [{
      qWidth: 2,
      qHeight: 15,
    }],
    qInterColumnSortOrder: [1, 0],
  },
};

export default class HighScore extends EnigmaModel {
  constructor({ distinct }) {
    super({ genericProps: distinct ? genericPropsDistinct : genericProps });
    this.state = { distinct };
  }

  render() {
    const { layout, distinct } = this.state;
    if (!layout) {
      return (<p>Loading...</p>);
    }
    const title = distinct ? 'Personal bests' : 'High scores';
    const matrix = layout.qHyperCube.qDataPages[0].qMatrix;
    if (!matrix.length) {
      return (<p>No highscores yet!</p>);
    }
    const rows = matrix
      .map((r, i) => (
        <tr key={r[0].qText + r[1].qNum}>
          <td>{i + 1}</td>
          <td>{r[0].qText.split('::')[0]}</td>
          <td>{r[1].qText}</td>
        </tr>
      ));
    return (
      <div className="high-score">
        <h2>{title}</h2>
        <table>
          <thead>
            <tr>
              <th>#</th>
              <th>Name</th>
              <th>Score</th>
            </tr>
          </thead>
          <tbody>
            {rows}
          </tbody>
        </table>
        {distinct ? '' : <Stats />}
      </div>
    );
  }
}
