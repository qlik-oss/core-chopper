import React from 'react';
import ReactDOM from 'react-dom';

import Engine from './game/engine';

import './index.scss';

// expose React globally, we need this to avoid
// it being removed by the experimental treeshaking
// algorithm in parcel:
window.React = React;

ReactDOM.render(
  <div className="index">
    <Engine />
  </div>,
  document.getElementById('app'),
);

if (module.hot) {
  // used for hot module replacement during development:
  module.hot.accept();
}
