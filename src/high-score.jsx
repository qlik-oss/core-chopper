import React from 'react';

import './high-score.css';

export default class HighScore extends React.Component {
  constructor(props) {
    super();
    this.props = props;
  }

  render() {
    const rows = [
      { user: { id: 1, name: 'Andrée Hansson' }, score: 3928 },
      { user: { id: 1, name: 'Andrée Hansson' }, score: 19284 },
      { user: { id: 1, name: 'Andrée Hansson' }, score: 9382 },
      { user: { id: 1, name: 'Henrik Carlioth' }, score: 5739 },
      { user: { id: 1, name: 'Henrik Carlioth' }, score: 28914 },
    ]
      .sort((a, b) => b.score - a.score)
      .map((r, i) => (
        <tr key={r.user.id + r.score}>
          <td>{i + 1}</td>
          <td>{r.user.name}</td>
          <td>{r.score}</td>
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
