import * as ex from 'excalibur';

import Settings from './settings';

const WIDTH = 400;
const HEIGHT = 40;

export default ex.UIActor.extend({
  constructor(engine, chopper) {
    ex.Actor.apply(this, [20, 20]);
    this.scale = new ex.Vector(Settings.scale.x, Settings.scale.y);
    this.chopper = chopper;
    this.x = 20;
    this.y = engine.drawHeight - HEIGHT - 20;
    this.width = WIDTH;
    this.height = HEIGHT;
  },

  draw(ctx, delta) {
    ex.UIActor.prototype.draw.call(this, ctx, delta);
    ctx.fillStyle = ex.Color.Green;
    ctx.strokeStyle = ex.Color.Black;
    let power = 0;
    let modifiedPower = 0;
    if (this.chopper.vel.y < 0) {
      power = Math.round((-this.chopper.vel.y / Settings.MAX_VELOCITY) * 100);
      modifiedPower = Math.round((-this.chopper.unclampedVelocity / Settings.MAX_VELOCITY) * 100) - 100;
      if (modifiedPower > 0) {
        modifiedPower = `+${modifiedPower}`;
      }
    }
    const calculatedWidth = ex.Util.clamp(power, 0, 100) * WIDTH / 100;
    ctx.fillRect(this.x, this.y - this.height, calculatedWidth, this.height);
    ctx.strokeRect(this.x, this.y - this.height, WIDTH, this.height);
  },
});
