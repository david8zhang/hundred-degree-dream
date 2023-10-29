import Phaser from 'phaser'

import Overworld from './scenes/Overworld'
import { Dream } from './scenes/Dream'
import { Preload } from './scenes/Preload'
import { DreamEnd } from './scenes/DreamEnd'

const config: Phaser.Types.Core.GameConfig = {
  type: Phaser.AUTO,
  width: 1000,
  height: 800,
  parent: 'phaser',
  physics: {
    default: 'arcade',
    arcade: {
      gravity: { x: 0, y: 0 },
      // debug: true,
    },
  },
  dom: {
    createContainer: true,
  },
  pixelArt: true,
  scale: {
    autoCenter: Phaser.Scale.CENTER_BOTH,
  },
  scene: [Preload, Overworld, Dream, DreamEnd],
}

export default new Phaser.Game(config)
