import * as ex from 'excalibur';

import Settings from './settings';

export default ex.UIActor.extend({
  constructor(engine, chopper) {
    ex.Actor.apply(this, [0, 0]);
    this.chopper = chopper;
    this.maxScore = 0;
    this.powerLabel = new ex.Label({
      baseAlign: ex.BaseAlign.Top,
      fontFamily: 'VT323',
      fontSize: 34,
      pos: new ex.Vector(20, 20),
      color: ex.Color.White,
    });
    this.scoreLabel = new ex.Label({
      baseAlign: ex.BaseAlign.Top,
      fontFamily: 'VT323',
      fontSize: 34,
      pos: new ex.Vector(20, engine.drawHeight - 44),
      color: ex.Color.White,
    });
    this.heightLabel = new ex.Label({
      fontFamily: 'VT323',
      fontSize: 60,
      textAlign: ex.TextAlign.Center,
      baseAlign: ex.BaseAlign.Top,
      pos: new ex.Vector(engine.drawWidth / 2, engine.drawHeight / 2 - 50),
      color: ex.Color.White,
    });
    this.add(this.powerLabel);
    this.add(this.scoreLabel);
    this.add(this.heightLabel);
  },

  update(engine, delta) {
    ex.Actor.prototype.update.apply(this, [engine, delta]);
    let power = 0;
    if (this.chopper.vel.y < 0) {
      power = Math.round((-this.chopper.vel.y / Settings.MAX_VELOCITY) * 100);
    }
    this.powerLabel.text = `Power: ${power}%`;

    const current = Math.round(-this.chopper.y);
    this.maxScore = this.maxScore < current ? current : this.maxScore;
    this.scoreLabel.text = `Height: ${current} Best: ${this.maxScore}`;

    // this.heightLabel.text = Math.random() > 0.8 ? 'Reach for the sky!!' : '';
  },
});
