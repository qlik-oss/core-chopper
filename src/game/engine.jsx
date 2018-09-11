import React from 'react';
import * as ex from 'excalibur';

import Biker from './biker';
import Cloud from './cloud';
import Resources from './resources';

import './engine.scss';

let id = 0;

class Engine extends React.Component {
  constructor(props) {
    super(props);
    this.state = { canvasId: `game${id += 1}` };
  }

  init() {
    const { canvasId } = this.state;
    this.isInitialized = true;
    const engine = new ex.Engine({
      width: 800,
      height: 600,
      canvasElementId: canvasId,
      suppressConsoleBootMessage: true,
    });
    const loader = new ex.Loader();
    Object.keys(Resources).forEach(key => loader.addResource(Resources[key]));
    const biker = new Biker(engine);
    engine.add(biker);
    engine.add(new Cloud(800, 0));
    engine.add(new Cloud(400, 300 * 1.5));
    engine.add(new Cloud(700, 700 * 1.5));
    engine.currentScene.camera.strategy.lockToActor(biker);
    engine.input.pointers.primary.on('down', () => {
      biker.bounce();
    });
    engine.start(loader);
    // hook up to ant+ data and trigger bounce method based on values:
    // setInterval(() => biker.bounce(), 2000);
  }

  render() {
    const { canvasId } = this.state;
    if (!this.isInitialized) {
      setTimeout(() => this.init());
    }
    return <div className="game"><canvas id={canvasId} /></div>;
  }
}

export default Engine;
