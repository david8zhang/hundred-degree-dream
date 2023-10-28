export class Preload extends Phaser.Scene {
  constructor() {
    super('preload')
  }

  preload() {
    this.load.image('temp-player', 'temp-player.png')
    this.load.image('temp-enemy', 'temp-enemy.png')
    this.load.image('temp-ally', 'temp-ally.png')
    this.load.image('cursor', 'cursor.png')
  }

  create() {
    this.scene.start('dungeon')
  }
}
