import * as ex from 'excalibur';

import Resources from './resources';

const BIKER_SIZE = 32;
const BIKER_SCALE = 1.5;
const BIKER_IMPULSE = -250;
const ACCELERATION = 570;
const MAX_VELOCITY = 450;
const LEVEL_SPEED = -250;
const SCALE = new ex.Vector(1.0, 1.0);

export default ex.Actor.extend({
  constructor(engine) {
    const centerX = engine.drawWidth / 2;
    const centerY = engine.drawHeight / 2;
    ex.Actor.apply(this, [centerX, centerY, BIKER_SIZE, BIKER_SIZE]);
    this.vel = new ex.Vector(0, 0);
    this.anchor = new ex.Vector(0.5, 0.6);
    this.scale.setTo(SCALE.x * BIKER_SCALE, SCALE.y * BIKER_SCALE);
    this.collisionType = ex.CollisionType.Passive;

    const spriteSheet = new ex.SpriteSheet(Resources.BirdSpriteSheet, 4, 1, 32, 32);
    this.upAnimation = spriteSheet.getAnimationByIndices(engine, [2, 1, 0], 120);
    this.upAnimation.scale = SCALE;
    this.upAnimation.freezeFrame = 2;
    this.downAnimation = spriteSheet.getAnimationByIndices(engine, [0, 3, 2], 120);
    this.downAnimation.scale = SCALE;
    this.downAnimation.freezeFrame = 2;
    this.addDrawing('up', this.upAnimation);
    this.addDrawing('down', this.downAnimation);

    this.on('precollision', () => {
      if (this.dead) {
        return;
      }
      // dispatcher.stop();
      // this.actionQueue.clearActions();
      this.dead = true;
      this.rx = 10;
      // engine.input.pointers.primary.off('down');
      // gameOver();
      engine.currentScene.camera.shake(10, 10, 500);
      this.vel.y = 0;
      this.y += 20;
      console.log('DEAD');
    });
  },

  update(engine, delta) {
    if (this.dead) {
      return;
    }
    ex.Actor.prototype.update.apply(this, [engine, delta]);
    if (this.vel.y > 0) {
      this.setDrawing('down');
    }
    if (!this.animatingUpwards) {
      this.vel.y += ACCELERATION / 60;
      const velocityAngle = new ex.Vector(-LEVEL_SPEED, this.vel.y).normalize().toAngle();
      this.rotation = velocityAngle;
    }
    this.vel.y = ex.Util.clamp(this.vel.y, -MAX_VELOCITY, MAX_VELOCITY);
  },

  bounce() {
    this.vel.y = BIKER_IMPULSE * SCALE.x;
    this.upAnimation.reset();
    this.setDrawing('up');
    // Resource.FlapSound.play();
    const velocityAngle = new ex.Vector(-LEVEL_SPEED, this.vel.y).normalize().toAngle();
    this.animatingUpwards = true;
    this.actions.rotateBy(velocityAngle, 350).callMethod(() => {
      this.animatingUpwards = false;
    });
  },
});
