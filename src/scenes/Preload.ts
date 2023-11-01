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
    this.load.image('jambo', 'jambo.png')
    this.load.image('chef', 'chef.png')
    this.load.image('athlete', 'athlete.png')
    this.load.image('tiger', 'tiger.png')
    this.load.image('cursor', 'cursor.png')
    this.load.image('background', 'background.png')
    this.load.image('crosshair', 'crosshair.png')
    this.load.image('basketball', 'basketball.png')
    this.load.image('nightmare-bg', 'nightmare-bg.jpg')

    // Enemies
    this.load.image('barnacle', 'enemies/barnacle.png')
    this.load.image('fishGreen', 'enemies/fishGreen.png')
    this.load.image('slimeBlue', 'enemies/slimeBlue.png')
    this.load.image('spider', 'enemies/spider.png')
    this.load.image('snail', 'enemies/snail.png')

    // Boss
    this.load.image('boss-head', 'boss/boss-head.png')
    this.load.image('boss-arm', 'boss/boss-arm.png')
    this.load.image('boss-fist', 'boss/boss-fist.png')
    this.load.image('boss-foot', 'boss/boss-foot.png')

    // Key prompts
    this.load.image('downKey', 'key-prompts/downKey.png')
    this.load.image('leftKey', 'key-prompts/leftKey.png')
    this.load.image('rightKey', 'key-prompts/rightKey.png')
    this.load.image('upKey', 'key-prompts/upKey.png')
    this.load.image('fKey', 'key-prompts/fKey.png')
    this.load.image('rKey', 'key-prompts/rKey.png')
  }

  create() {
    this.scene.start('start')
  }
}
