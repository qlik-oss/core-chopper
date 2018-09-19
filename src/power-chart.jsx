import React from 'react';
import picasso from 'picasso.js/dist/picasso';
import picassoQ from 'picasso-plugin-q/dist/picasso-q';

import getDoc from './enigma/doc';

import './power-chart.css';

picasso.use(picassoQ);

const settings = {
  scales: {
    x: {
      data: {
        key: 'qHyperCube',
        field: 'qDimensionInfo/0',
      },
      type: 'linear',
      invert: false,
      padding: 0.2,
      min: 0,
    },
    y: {
      data: {
        key: 'qHyperCube',
        fields: ['qMeasureInfo/0'],
      },
      expand: 0.05,
      invert: true,
    },
    color: {
      type: 'color',
      data: { extract: { field: 'qDimensionInfo/1' } },
      // range: ['#8dd3c7', '#ffffb3', '#bebada', '#fb8072', '#80b1d3', '#fdb462', '#b3de69', '#fccde5', '#d9d9d9', '#bc80bd'],
    },
  },
  components: [{
    type: 'axis',
    scale: 'y',
    settings: {
      tight: true,
      labels: {
        fontFamily: 'VT323',
        fill: '#fff',
        fontSize: '18px',
      },
    },
  }, {
    type: 'axis',
    scale: 'x',
    dock: 'bottom',
    settings: {
      tight: true,
      labels: {
        fontFamily: 'VT323',
        fill: '#fff',
        fontSize: '18px',
      },
    },
  }, {
    type: 'line',
    data: {
      extract: {
        field: 'qDimensionInfo/0',
        value: v => v.qNum,
        props: {
          name: { field: 'qDimensionInfo/1' },
          minor: { field: 'qMeasureInfo/0' },
        },
      },
    },
    settings: {
      layers: {
        curve: 'step',
        line: {
          strokeWidth: 5,
          stroke: {
            scale: 'color',
            ref: 'name',
          },
        },
      },
      coordinates: {
        minor: { scale: 'y' },
        major: { scale: 'x' },
        layerId: { ref: 'name' },
      },
    },
  }, {
    type: 'legend-cat',
    scale: 'color',
    dock: 'right',
    settings: {
      layout: { size: 10 },
      title: { show: false },
      item: {
        shape: { size: 24 },
        label: {
          fontFamily: 'VT323',
          fill: '#fff',
          fontSize: '20px',
          text: t => t.datum.label.split('::')[0],
        },
      },
    },
  }],

};

export default class PowerChart extends React.Component {
  constructor() {
    super();
    this.state = {};
    getDoc().then((doc) => {
      doc.getPowerLayout().then((layout) => {
        this.setState({ layout });
      });
    });
  }

  renderPicasso() {
    const { layout } = this.state;
    console.log(layout);
    this.setState({ initialized: true });

    const data = [{
      type: 'q',
      key: 'qHyperCube',
      data: layout.qHyperCube,
    }];

    picasso.chart({
      element: this.container,
      data,
      settings,
    });
  }

  render() {
    const { layout, initialized } = this.state;

    if (layout && !initialized) {
    // we need to have the `this.container` reference available when rendering:
      setTimeout(() => this.renderPicasso());
    }
    return (
      <div className="power-wrapper">
        <h2>Power over time</h2>
        <div className="power-chart" ref={(elem) => { this.container = elem; }}>Loading...</div>
      </div>
    );
  }
}
