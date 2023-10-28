import { Dungeon } from '~/scenes/Dungeon'
import { Move } from './moves/Move'
import { MoveNames } from './moves/MoveNames'

export interface EnemyMemberConfig {
  position: {
    x: number
    y: number
  }
  maxHealth: number
  spriteTexture: string
  moveNames: MoveNames[]
}

export class EnemyMember {
  private scene: Dungeon
  public currHealth: number
  public maxHealth: number
  public sprite: Phaser.GameObjects.Sprite
  public moveMapping: {
    [key: string]: Move
  }

  constructor(scene: Dungeon, config: EnemyMemberConfig) {
    this.scene = scene
    this.currHealth = config.maxHealth
    this.maxHealth = config.maxHealth
    this.sprite = this.scene.add
      .sprite(config.position.x, config.position.y, config.spriteTexture)
      .setFlipX(true)
    this.moveMapping = this.scene.convertMoveNamesToMoves(config.moveNames, this)
  }

  getMoveToExecute() {
    const keys = Object.keys(this.moveMapping)
    const randomKey = Phaser.Utils.Array.GetRandom(keys)
    return this.moveMapping[randomKey]
  }
}
