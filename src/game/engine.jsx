import React from 'react';
import * as ex from 'excalibur';

import Chopper from './chopper';
import Cloud from './cloud';
import Floor from './floor';
import Resources from './resources';
import Settings from './settings';
import CountDown from './count-down';
import GameOver from './game-over';
import HUD from './hud';

import './engine.css';
import ClassicGameMode from './game-modes/classic';
import GameModeClassic from './game-modes/classic';

let id = 0;

class Engine extends React.Component {
  constructor({user, socket, mode}) {
    super();
    console.log("user: ", user)
    console.log("socket: ", socket)
    console.log("mode: ", mode)
    // console.log("user: ",user, socket, mode)
    // super();
    // this.eventListener = this.bounceChopper.bind(this);
    // socket.on('ant:power', this.eventListener);
    // this.state = { socket, canvasId: `game${id += 1}` };
    // this.lastRevCount = 0;
    this.state = { user, socket, mode };
  }

  // bounceChopper({ Power }) {
  //   if (this.chopper && Power) {
  //     this.chopper.bounce(Power);
  //   }
  // }

  // init() {
  //   const { canvasId, socket } = this.state;
  //   this.isInitialized = true;

  //   const loader = new ex.Loader();
  //   Object.keys(Resources).forEach(key => loader.addResource(Resources[key]));

  //   const engine = new ex.Engine({
  //     displayMode: ex.DisplayMode.Container,
  //     canvasElementId: canvasId,
  //     suppressConsoleBootMessage: true,
  //     // isDebug: true,
  //     backgroundColor: ex.Color.Transparent,
  //   });
  //   engine.setAntialiasing(false);
  //   engine.start(loader).then(() => {
  //     const scale = (engine.drawHeight / 800) * 0.50 + 1;
  //     Object.assign(Settings.scale, { x: scale, y: scale });
  //     const chopper = new Chopper(engine);
  //     const countDown = new CountDown(engine, chopper);
  //     const hud = new HUD(engine, chopper);
  //     const gameOver = new GameOver(engine, chopper);
  //     countDown.go = () => socket.send({ type: 'game:started', data: {} });
  //     gameOver.go = () => socket.send({ type: 'game:ended', data: { score: hud.maxScore } });
  //     this.chopper = chopper;
  //     engine.add(chopper);
  //     engine.add(countDown);
  //     engine.add(gameOver);
  //     engine.add(new Cloud(800, 0));
  //     engine.add(new Cloud(400, 300 * Settings.scale.y));
  //     engine.add(new Cloud(700, 700 * Settings.scale.y));
  //     for (let i = 0; i < engine.drawWidth; i += 61 * Settings.scale.y) {
  //       engine.add(new Floor(i, 0));
  //     }
  //     engine.add(hud);
  //     engine.input.pointers.primary.on('down', () => {
  //       chopper.bounce(250);
  //     });
  //     engine.currentScene.camera.strategy.lockToActor(chopper);
  //   });
  // }

  // render() {
  //   const { canvasId } = this.state;
  //   if (!this.isInitialized) {
  //     setTimeout(() => this.init());
  //   }
  //   return <div className="engine"><canvas id={canvasId} /></div>;
  // }

  render() {

    const { user, socket, mode } = this.state;
    let gameMode;
    switch(this.mode) {
      case 'classic':
      default:
        gameMode = <GameModeClassic user={user} socket={socket} />
    }
    return gameMode;
  }
}

export default Engine;
