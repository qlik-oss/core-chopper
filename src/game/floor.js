import * as ex from 'excalibur';

import Resources from './resources';

const SCALE = new ex.Vector(1.0, 1.0);

export default ex.Actor.extend({
  constructor(x, y) {
    const brickSpriteSheet = new ex.SpriteSheet(Resources.BrickSpriteSheet, 2, 1, 61, 40);
    const floor = brickSpriteSheet.getSprite(0);
    floor.scale.y = 2 * SCALE.y;
    floor.scale.x = 2 * SCALE.x;
    ex.Actor.apply(this, [x, y, 61, 40]);
    this.scale.setTo(SCALE.x, SCALE.y);
    this.collisionType = ex.CollisionType.Fixed;
    this.anchor = new ex.Vector(0, 0);
    this.addDrawing('default', floor);
  },
});
