import * as ex from 'excalibur';

import chopper from './sprites/chopper.png';
import bss2 from './sprites/brickspritesheet.png';
import cloud from './sprites/cloud.png';

export default {
  Chopper: new ex.Texture(chopper),
  BrickSpriteSheet: new ex.Texture(bss2),
  Cloud: new ex.Texture(cloud),
//  FlapSound: new ex.Sound('snd/flap2.wav'),
//  FailSound: new ex.Sound('snd/fail.wav'),
//  ScoreSound: new ex.Sound('snd/score.wav'),
};
