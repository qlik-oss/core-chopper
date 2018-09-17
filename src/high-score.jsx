import React from 'react';

import getDoc from './enigma/doc';

import './high-score.css';

export default class HighScore extends React.Component {
  constructor(props) {
    super();
    this.props = props;
    this.state = { scores: null };
    getDoc().then(doc => doc.getHighScore()).then((layout) => {
      this.setState({
        scores: layout.qHyperCube.qDataPages[0].qMatrix,
      });
    });
  }

  render() {
    const { scores } = this.state;
    if (!scores) {
      return (<p>Loading...</p>);
    }
    if (!scores.length) {
      return (<p>No highscores yet!</p>);
    }
    const rows = scores
      .sort((a, b) => b[1].qNum - a[1].qNum)
      .map((r, i) => (
        <tr key={r[0].qText + r[1].qNum}>
          <td>{i + 1}</td>
          <td>{r[0].qText}</td>
          <td>{r[1].qNum}</td>
        </tr>
      ));
    return (
      <div className="high-score">
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
      </div>
    );
  }
}
