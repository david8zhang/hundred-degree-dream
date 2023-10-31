import { Dream } from '~/scenes/Dream'
import { Move } from './moves/Move'
import { MoveNames } from './moves/MoveNames'
import { Player } from './Player'

export interface PartyMemberConfig {
  name: string
  position: {
    x: number
    y: number
  }
  moveNames: MoveNames[]
  maxHealth: number
  spriteTexture: string
  player: Player
  isActive: boolean
}

export class PartyMember {
  public name: string
  private scene: Dream
  private player: Player
  public currHealth: number
  public maxHealth: number
  public sprite: Phaser.Physics.Arcade.Sprite
  public moveMapping: {
    [key: string]: Move
  }
  public isActive: boolean = false
  public defendingText: Phaser.GameObjects.Text

  constructor(scene: Dream, config: PartyMemberConfig) {
    this.scene = scene
    this.currHealth = config.maxHealth
    this.maxHealth = config.maxHealth
    this.player = config.player
    this.name = config.name
    this.sprite = this.scene.physics.add
      .sprite(config.position.x, config.position.y, config.spriteTexture)
      .setData('ref', this)
    this.isActive = config.isActive
    this.moveMapping = this.scene.convertMoveNamesToMoves(config.moveNames, this)
    this.defendingText = this.scene.add
      .text(this.sprite.x, this.sprite.y + this.sprite.displayHeight / 2 + 20, 'Defending', {
        fontSize: '18px',
        color: 'black',
      })
      .setOrigin(0.5, 0.5)
      .setVisible(false)
  }

  heal(amount: number) {
    this.currHealth = Math.min(this.maxHealth, this.currHealth + amount)
    this.player.updateHealth()
  }

  getAllMoveNames() {
    return Object.keys(this.moveMapping)
  }

  setDefending(isDefending: boolean) {
    this.defendingText.setVisible(isDefending)
  }

  get isDefending() {
    return this.defendingText.visible
  }

  get isDead() {
    return this.currHealth == 0
  }

  takeDamage(damage: number) {
    this.currHealth = Math.max(0, this.currHealth - damage)
    if (this.currHealth == 0) {
      this.sprite.setAlpha(0.5)
    }
    this.player.updateHealth()
  }
}
