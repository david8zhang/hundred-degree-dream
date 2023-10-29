import { Save } from '~/utils/Save'

export class Preload extends Phaser.Scene {
  constructor() {
    super('preload')
    new Save()
    window.addEventListener('keydown', (e) => {
      if (['Space', 'ArrowUp', 'ArrowDown', 'ArrowLeft', 'ArrowRight'].indexOf(e.code) > -1) {
        e.preventDefault()
      }
    })
  }

  preload() {
    this.load.image('temp-player', 'temp-player.png')
    this.load.image('temp-ally', 'temp-ally.png')
    this.load.image('cursor', 'cursor.png')
    this.load.image('background', 'background.png')

    // Enemies
    this.load.image('barnacle', 'enemies/barnacle.png')
    this.load.image('fishGreen', 'enemies/fishGreen.png')
    this.load.image('slimeBlue', 'enemies/slimeBlue.png')
    this.load.image('spider', 'enemies/spider.png')
    this.load.image('snail', 'enemies/snail.png')
  }

  create() {
    this.scene.start('overworld')
  }
}
