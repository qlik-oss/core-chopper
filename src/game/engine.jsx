import React from 'react';
import * as ex from 'excalibur';

import './engine.scss';

let id = 0;

function createPaddle(game) {
  const paddle = new ex.Actor(150, game.drawHeight - 40, 200, 20);
  paddle.color = ex.Color.Chartreuse;
  paddle.collisionType = ex.CollisionType.Fixed;
  game.input.pointers.primary.on('move', (evt) => {
    paddle.pos.x = evt.worldPos.x;
  });
  return paddle;
}

function createBall(game) {
  const ball = new ex.Actor(100, 300, 20, 20);
  ball.color = ex.Color.Red;
  ball.vel.setTo(100, 100);
  ball.collisionType = ex.CollisionType.Passive;
  ball.draw = function bd(ctx) {
    ctx.fillStyle = this.color.toString();
    ctx.beginPath();
    ctx.arc(this.pos.x, this.pos.y, 10, 0, Math.PI * 2);
    ctx.closePath();
    ctx.fill();
  };
  ball.on('precollision', (evt) => {
    const intersection = evt.intersection.normalize();
    if (Math.abs(intersection.x) > Math.abs(intersection.y)) {
      ball.vel.x *= -1;
    } else {
      ball.vel.y *= -1;
    }
  });
  ball.on('postupdate', function pu() {
    if (this.pos.x < (this.getWidth() / 2)) {
      this.vel.x *= -1;
    }

    if (this.pos.x + (this.getWidth() / 2) > game.drawWidth) {
      this.vel.x *= -1;
    }

    if (this.pos.y < (this.getHeight() / 2)) {
      this.vel.y *= -1;
    }
  });
  return ball;
}

class Engine extends React.Component {
  constructor(props) {
    super(props);
    this.state = { canvasId: `game${id += 1}` };
  }

  init() {
    const { canvasId } = this.state;
    this.setState({ init: true });
    const game = new ex.Engine({
      width: 800,
      height: 600,
      canvasElementId: canvasId,
    });
    const paddle = createPaddle(game);
    const ball = createBall(game);
    game.add(paddle);
    game.add(ball);
    game.start();
  }

  render() {
    const { init, canvasId } = this.state;
    if (!init) {
      setTimeout(() => this.init());
    }
    return <div className="game"><canvas id={canvasId} /></div>;
  }
}

export default Engine;
