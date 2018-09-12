import * as ex from 'excalibur';

import Settings from './settings';
import Resources from './resources';

export default ex.Actor.extend({
  constructor(x, y) {
    ex.Actor.apply(this, [x, y]);
    this.vel.y = ex.Util.randomInRange(-130, -1000);
    const cloud = Resources.Cloud.asSprite();
    cloud.scale = new ex.Vector(Settings.scale.x, Settings.scale.y);
    this.addDrawing('default', cloud);
    // this.setCenterDrawing(true);
    this.scale.setTo(Settings.scale.x, Settings.scale.y);
  },

  update(engine, delta) {
    ex.Actor.prototype.update.apply(this, [engine, delta]);
    const screenCoords = engine.worldToScreenCoordinates(new ex.Vector(this.x, this.y));
    console.log(engine.currentScene.camera.y, this.y);
    if (this.isOffScreen && this.y < engine.currentScene.camera.y) {
      this.y += engine.drawHeight;
    }
  },

});
