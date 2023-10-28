import { Scene } from 'phaser'
import { Dungeon } from '~/scenes/Dungeon'
import { Move } from './moves/Move'
import { MoveNames } from './moves/MoveNames'

export interface PartyMemberConfig {
  position: {
    x: number
    y: number
  }
  moveNames: MoveNames[]
  maxHealth: number
  spriteTexture: string
}

export class PartyMember {
  private scene: Dungeon
  public currHealth: number
  public maxHealth: number
  public sprite: Phaser.GameObjects.Sprite
  public moveMapping: {
    [key: string]: Move
  }

  constructor(scene: Dungeon, config: PartyMemberConfig) {
    this.scene = scene
    this.currHealth = config.maxHealth
    this.maxHealth = config.maxHealth

    this.sprite = this.scene.add.sprite(config.position.x, config.position.y, config.spriteTexture)
    this.moveMapping = this.scene.convertMoveNamesToMoves(config.moveNames, this)
  }

  getAllMoveNames() {
    return Object.keys(this.moveMapping)
  }
}
