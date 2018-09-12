import * as ex from 'excalibur';

import Settings from './settings';

export default function (biker) {
  const stats = new ex.Label('', 20, 30, "20px 'Press Start 2P', cursive");
  stats.score = 0;
  stats.scale.setTo(Settings.scale.x * 2, Settings.scale.y * 2);
  stats.baseAlign = ex.BaseAlign.Top;
  let maxHeight = 0;
  stats.on('preupdate', () => {
    const current = Math.round(-biker.y + 384);
    stats.text = `Current: ${current} Best: ${Math.max(maxHeight, current)}`;
    maxHeight = maxHeight < current ? current : maxHeight;
  });
  return stats;
}
