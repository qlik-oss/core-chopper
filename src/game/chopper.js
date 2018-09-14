import * as ex from 'excalibur';

import Settings from './settings';
import Resources from './resources';

export default ex.Actor.extend({
  constructor(engine) {
    const centerX = engine.drawWidth / 2;
    const centerY = engine.drawHeight / 2;
    ex.Actor.apply(this, [centerX, -centerY * Settings.scale.y, Settings.CHOPPER_WIDTH, Settings.CHOPPER_HEIGHT]);
    this.vel = new ex.Vector(0, 0);
    this.anchor = new ex.Vector(0.5, 0.6);
    this.scale.setTo(
      Settings.scale.x * Settings.CHOPPER_SCALE,
      Settings.scale.y * Settings.CHOPPER_SCALE,
    );
    this.collisionType = ex.CollisionType.Passive;
    this.hasBounced = false;
    this.powerModifier = 1;

    const spriteSheet = new ex.SpriteSheet(Resources.Chopper, 4, 1, 96, 32);
    this.upAnimation = spriteSheet.getAnimationByIndices(engine, [2, 1, 0], 120);
    this.upAnimation.scale = Settings.scale;
    this.upAnimation.freezeFrame = 2;
    this.downAnimation = spriteSheet.getAnimationByIndices(engine, [0, 3, 2], 120);
    this.downAnimation.scale = Settings.scale;
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
      this.kill();
    });
  },

  update(engine, delta) {
    ex.Actor.prototype.update.apply(this, [engine, delta]);
    if (this.dead || !this.hasBounced) {
      return;
    }
    this.powerModifier = this.y / 50;
    if (this.vel.y > 0) {
      this.setDrawing('down');
    }
    if (!this.animatingUpwards) {
      this.vel.y = ex.Util.clamp(this.vel.y + (Settings.ACCELERATION / 60), -Settings.MAX_VELOCITY, Settings.MAX_VELOCITY);
      const velocityAngle = new ex.Vector(-Settings.LEVEL_SPEED, this.vel.y).normalize().toAngle();
      this.rotation = velocityAngle;
    }
    this.vel.y = ex.Util.clamp(this.vel.y, -Settings.MAX_VELOCITY, Settings.MAX_VELOCITY);
  },

  bounce(speed) {
    const adjustedSpeed = -speed * 100;
    this.actions.clearActions();
    this.upAnimation.reset();
    this.hasBounced = true;
    this.setDrawing('up');
    this.vel.y = ex.Util.clamp(this.vel.y + (adjustedSpeed - this.powerModifier), -Settings.MAX_VELOCITY, Settings.MAX_VELOCITY);
    // Resource.FlapSound.play();
    const velocityAngle = new ex.Vector(-Settings.LEVEL_SPEED, this.vel.y).normalize().toAngle();
    this.animatingUpwards = true;
    this.actions.rotateBy(velocityAngle, 100).callMethod(() => {
      this.animatingUpwards = false;
    });
  },
});