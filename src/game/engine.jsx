import React from 'react';
import * as ex from 'excalibur';

import Chopper from './chopper';
import Cloud from './cloud';
import Floor from './floor';
import Resources from './resources';
import Settings from './settings';
import HUD from './hud';

import './engine.scss';

let id = 0;

class Engine extends React.Component {
  constructor(props) {
    super(props);
    this.state = { canvasId: `game${id += 1}` };
    /*
    figure out how to do this properly with socket:
    if (this.chopper) {
      this.chopper.bounce(result.data.CalculatedSpeed);
    } */
  }

  init() {
    const { canvasId } = this.state;
    this.isInitialized = true;

    const loader = new ex.Loader();
    Object.keys(Resources).forEach(key => loader.addResource(Resources[key]));

    const engine = new ex.Engine({
      displayMode: ex.DisplayMode.Container,
      canvasElementId: canvasId,
      suppressConsoleBootMessage: true,
      isDebug: true,
    });
    engine.setAntialiasing(false);
    engine.start(loader).then(() => {
      const scale = (engine.drawHeight / 800) * 0.50 + 1;
      Object.assign(Settings.scale, { x: scale, y: scale });
      const chopper = new Chopper(engine);
      this.chopper = chopper;
      engine.add(chopper);
      engine.add(new Cloud(800, 0));
      engine.add(new Cloud(400, 300 * Settings.scale.y));
      engine.add(new Cloud(700, 700 * Settings.scale.y));
      for (let i = 0; i < engine.drawWidth; i += 61 * Settings.scale.y) {
        engine.add(new Floor(i, 0));
      }
      engine.add(new HUD(engine, chopper));
      // hook up to ant+ data and trigger bounce method based on values:
      // setInterval(() => chopper.bounce(), 2000);
      engine.input.pointers.primary.on('down', () => {
        chopper.bounce(5);
      });
      engine.currentScene.camera.strategy.lockToActor(chopper);
    });
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
