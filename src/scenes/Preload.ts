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
    // / Characters
    this.load.image('jambo', 'characters/jambo.png')
    this.load.image('chef', 'characters/chef.png')
    this.load.image('athlete', 'characters/athlete.png')
    this.load.image('tiger', 'characters/tiger.png')
    this.load.image('jambo-defend', 'characters/jambo-defend.png')
    this.load.image('chef-defend', 'characters/chef-defend.png')
    this.load.image('athlete-defend', 'characters/athlete-defend.png')
    this.load.image('tiger-defend', 'characters/tiger-defend.png')

    // UI Stuff
    this.load.image('cursor', 'cursor.png')
    this.load.image('background', 'background.png')
    this.load.image('crosshair', 'crosshair.png')
    this.load.image('basketball', 'basketball.png')
    this.load.image('nightmare-bg', 'nightmare-bg.jpg')
    this.load.image('cooking-channel', 'tv/cooking-channel.png')
    this.load.image('nature-channel', 'tv/nature-channel.png')
    this.load.image('sports-channel', 'tv/sports-channel.png')
    this.load.image('overworld', 'overworld.png')

    // Enemies
    this.load.image('basketball-enemy', 'enemies/basketball-enemy.png')
    this.load.image('carrot', 'enemies/carrot.png')
    this.load.image('chili', 'enemies/chili.png')
    this.load.image('drumstick', 'enemies/drumstick.png')
    this.load.image('fan', 'enemies/fan.png')
    this.load.image('hoop', 'enemies/hoop.png')
    this.load.image('monkey', 'enemies/monkey.png')
    this.load.image('rat', 'enemies/rat.png')
    this.load.image('snake', 'enemies/snake.png')

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
