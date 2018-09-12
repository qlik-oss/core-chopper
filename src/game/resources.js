import * as ex from 'excalibur';

import bss from './sprites/helicopter.png';
import bss2 from './sprites/brickspritesheet.png';
import biker from './sprites/excalibird.png';
import cloud from './sprites/cloud.png';

export default {
  BikerSpriteSheet: new ex.Texture(bss),
  BrickSpriteSheet: new ex.Texture(bss2),
  Excalibird: new ex.Texture(biker),
  Cloud: new ex.Texture(cloud),

//  FlapSound: new ex.Sound('snd/flap2.wav'),
//  FailSound: new ex.Sound('snd/fail.wav'),
//  ScoreSound: new ex.Sound('snd/score.wav'),
};
