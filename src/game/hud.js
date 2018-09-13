import * as ex from 'excalibur';

import Settings from './settings';
import Resources from './resources';

export default ex.UIActor.extend({
  constructor(engine, chopper) {
    ex.Actor.apply(this, [0, 0]);
    this.chopper = chopper;
    this.maxScore = 0;
    this.powerLabel = new ex.Label({
      baseAlign: ex.BaseAlign.Top,
      fontSize: 18,
    });
    this.scoreLabel = new ex.Label({
      baseAlign: ex.BaseAlign.Top,
      fontSize: 18,
      pos: new ex.Vector(0, engine.drawHeight - 24),
    });
    this.add(this.powerLabel);
    this.add(this.scoreLabel);
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
  },
});
