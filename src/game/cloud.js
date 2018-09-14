import * as ex from 'excalibur';

import Settings from './settings';
import Resources from './resources';

export default ex.Actor.extend({
  constructor(x, y) {
    ex.Actor.apply(this, [x, y]);
    this.vel.y = ex.Util.randomInRange(30, 100);
    const cloud = Resources.Cloud.asSprite();
    this.scale = new ex.Vector(Settings.scale.x, Settings.scale.y);
    this.addDrawing('default', cloud);
    // this.setCenterDrawing(true);
    this.randomizeScale();
  },

  randomizeScale() {
    const rand = Math.random() + 1;
    this.scale.setTo(Settings.scale.x * rand, Settings.scale.y * rand);
  },

  update(engine, delta) {
    ex.Actor.prototype.update.apply(this, [engine, delta]);
    if (this.isOffScreen && this.y > engine.currentScene.camera.y) {
      this.y -= engine.drawHeight * Settings.scale.y;
      this.x = ex.Util.randomInRange(0, engine.drawWidth * Settings.scale.x);
      this.randomizeScale();
    }
  },

});