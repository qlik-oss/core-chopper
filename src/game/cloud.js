import * as ex from 'excalibur';

import Resources from './resources';

const SCALE = new ex.Vector(1.0, 1.0);

export default ex.Actor.extend({
  constructor(x, y) {
    ex.Actor.apply(this, [x, y]);
    this.width = 500;
    this.height = 500;
    this.dy = ex.Util.randomInRange(-30, -100);
    const cloud = Resources.Cloud.asSprite();
    cloud.scale = new ex.Vector(3 * SCALE.x, 3 * SCALE.y);
    this.addDrawing('default', cloud);
    // this.setCenterDrawing(true);
    this.scale.setTo(SCALE.x, SCALE.y);
  },

  update(engine, delta) {
    ex.Actor.prototype.update.apply(this, [engine, delta]);
    const screenCoords = engine.worldToScreenCoordinates(new ex.Vector(this.x, this.y));

    if (screenCoords.y + this.getHeight() < 0) {
      this.y = engine.height + this.getHeight();
    }
  },

});
