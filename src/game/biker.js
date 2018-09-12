import * as ex from 'excalibur';

import Settings from './settings';
import Resources from './resources';

export default ex.Actor.extend({
  constructor(engine) {
    const centerX = engine.drawWidth / 2;
    const centerY = engine.drawHeight / 2;
    ex.Actor.apply(this, [centerX, centerY, Settings.BIKER_WIDTH, Settings.BIKER_HEIGHT]);
    this.bestHeight = 0;
    this.velocityReducer = 1;
    this.vel = new ex.Vector(0, 0);
    this.anchor = new ex.Vector(0.5, 0.6);
    this.hasBounced = false;
    this.scale.setTo(
      Settings.scale.x * Settings.BIKER_SCALE,
      Settings.scale.y * Settings.BIKER_SCALE,
    );
    this.collisionType = ex.CollisionType.Passive;

    const spriteSheet = new ex.SpriteSheet(Resources.BikerSpriteSheet, 4, 1, 96, 32);
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
      console.log('DEAD');
    });
  },

  update(engine, delta) {
    if (this.dead || !this.hasBounced) {
      return;
    }
    ex.Actor.prototype.update.apply(this, [engine, delta]);
    if (this.vel.y > 0) {
      this.setDrawing('down');
    }
    if (!this.animatingUpwards) {
      this.vel.y += Settings.ACCELERATION / 60;
      const velocityAngle = new ex.Vector(-Settings.LEVEL_SPEED, this.vel.y).normalize().toAngle();
      this.rotation = velocityAngle;
    }
    this.vel.y = ex.Util.clamp(this.vel.y, -Settings.MAX_VELOCITY, Settings.MAX_VELOCITY);
  },

  bounce() {
    this.hasBounced = true;
    this.vel.y = (Settings.BIKER_IMPULSE * Settings.scale.x);
    this.upAnimation.reset();
    this.setDrawing('up');
    // Resource.FlapSound.play();
    const velocityAngle = new ex.Vector(-Settings.LEVEL_SPEED, this.vel.y).normalize().toAngle();
    this.animatingUpwards = true;
    this.actions.rotateBy(velocityAngle, 250).callMethod(() => {
      this.animatingUpwards = false;
    });
  },
});
