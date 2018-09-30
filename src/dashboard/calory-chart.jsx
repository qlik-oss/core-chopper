import React from 'react';
import picassoQ from 'picasso-plugin-q';
import picasso from 'picasso.js';

import EnigmaModel from '../enigma/model';

import './calory-chart.css';

picasso.use(picassoQ);

const genericProps = {
  qInfo: {
    qType: 'calories',
  },
  qHyperCubeDef: {
    qDimensions: [
      { qDef: { qFieldDefs: ['[userid]'] } },
      { qDef: { qFieldDefs: ['[name]'] } },
    ],
    qMeasures: [
      // Average watt/hour (power) * hours bicycled * 3.6 = kcal burnt
      {
        qDef: {
          qDef: 'Round(Avg([power]) * (Sum(Aggr(Max([duration]), [gameid])) / 1000 / 60 / 60) * 3.6)',
          qReverseSort: true,
        },
        qSortBy: { qSortByNumeric: 1 },
      },
    ],
    qInitialDataFetch: [{
      qWidth: 3,
      qHeight: 3333,
    }],
    qInterColumnSortOrder: [2, 1, 0],
    qSuppressMissing: true,
    qSuppressZero: true,
  },
};

const settings = {
  scales: {
    x: {
      data: {
        extract: {
          field: 'qDimensionInfo/0',
          value: v => v.qText,
        },
      },
      padding: 0.2,
    },
    labels: {
      data: {
        extract: {
          field: 'qDimensionInfo/1',
        },
      },
      padding: 0,
    },
    y: {
      data: {
        field: 'qMeasureInfo/0',
      },
      expand: 0.25,
      invert: true,
    },
    c: {
      type: 'color',
      data: {
        extract: { field: 'qDimensionInfo/0', value: v => v.qText },
      },
      range: ['#a6cee3', '#1f78b4', '#b2df8a', '#33a02c', '#fb9a99', '#e31a1c', '#fdbf6f', '#ff7f00', '#cab2d6', '#6a3d9a', '#ffff99', '#b15928'].concat(['#8dd3c7', '#ffffb3', '#bebada', '#fb8072', '#80b1d3', '#fdb462', '#b3de69', '#fccde5', '#d9d9d9', '#bc80bd']),
    },
  },
  components: [{
    key: 'y-axis',
    type: 'axis',
    scale: 'y',
    settings: {
      labels: {
        fontFamily: 'VT323',
        fill: '#fff',
        fontSize: '18px',
      },
    },
  }, {
    key: 'x-axis',
    type: 'axis',
    scale: 'labels',
    dock: 'bottom',
    settings: {
      labels: {
        fontFamily: 'VT323',
        fill: '#fff',
        fontSize: '18px',
        mode: 'tilted',
        tiltAngle: 35,
      },
    },
  }, {
    key: 'grid',
    type: 'grid-line',
    y: { scale: 'y' },
  }, {
    key: 'bars',
    type: 'box',
    data: {
      extract: {
        field: 'qDimensionInfo/0',
        value: v => v.qText,
        props: {
          start: 0,
          end: { field: 'qMeasureInfo/0' },
        },
      },
    },
    settings: {
      major: { scale: 'x' },
      minor: { scale: 'y' },
      box: {
        fill: { scale: 'c' },
      },
    },
    brush: {
      consume: [{
        context: 'highlight',
        style: {
          active: {
            opacity: 1,
            stroke: 'rgba(0, 0, 0, 0.7)',
          },
          inactive: {
            opacity: 0.1,
          },
        },
      }],
    },
  }, {
    key: 'bar-labels',
    type: 'labels',
    settings: {
      sources: [{
        component: 'bars',
        selector: 'rect',
        strategy: {
          type: 'bar',
          settings: {
            fontFamily: 'VT323',
            fontSize: 24,
            align: 0.5,
            justify: 0,
            labels: [{
              label({ data }) {
                return data ? data.end.label : '';
              },
              placements: [
                { position: 'outside', fill: '#fff' },
              ],
            }],
          },
        },
      }],
    },
  }],
};

export default class CaloryChart extends EnigmaModel {
  constructor({ user }) {
    super({ genericProps });
    this.state = { user };
  }

  async renderPicasso() {
    const { layout, user } = this.state;
    // const field = await this.getField('name');
    // await field.selectValues([{ qText: 'Andrée' }, { qText: 'Johan B' }]);

    const data = [{
      type: 'q',
      key: 'qHyperCube',
      data: layout.qHyperCube,
    }];
    this.pic = picasso.chart({
      element: this.container,
      data,
      settings,
    });
    this.pic.brush('highlight').addValue('qHyperCube/qDimensionInfo/0', user.userid);
  }

  render() {
    const { layout } = this.state;

    if (layout && this.container && !this.pic) {
      // we need to have the `this.container` reference available when rendering:
      setTimeout(() => this.renderPicasso());
    }
    return (
      <div className="power-wrapper">
        <h2>Most kcal spent</h2>
        <div className="calory-chart" ref={(elem) => { this.container = elem; }}>Loading...</div>
      </div>
    );
  }
}
