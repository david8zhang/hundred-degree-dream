import { Dungeon } from '~/scenes/Dungeon'
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
}

export class PartyMember {
  private scene: Dungeon
  private player: Player
  public currHealth: number
  public maxHealth: number
  public sprite: Phaser.Physics.Arcade.Sprite
  public moveMapping: {
    [key: string]: Move
  }

  constructor(scene: Dungeon, config: PartyMemberConfig) {
    this.scene = scene
    this.currHealth = config.maxHealth
    this.maxHealth = config.maxHealth
    this.player = config.player
    this.sprite = this.scene.physics.add.sprite(
      config.position.x,
      config.position.y,
      config.spriteTexture
    )
    this.moveMapping = this.scene.convertMoveNamesToMoves(config.moveNames, this)
  }

  getAllMoveNames() {
    return Object.keys(this.moveMapping)
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
