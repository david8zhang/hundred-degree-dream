import { Scene } from 'phaser'
import { EnemyMember } from '../EnemyMember'
import { PartyMember } from '../PartyMember'
import { Dungeon } from '~/scenes/Dungeon'

export enum TargetType {
  SINGLE = 'SINGLE',
  MULTI = 'MULTI',
  AREA = 'AREA',
}

export interface MoveConfig {
  name: string
  onMoveCompleted: Function
  targetType: TargetType
  member: PartyMember | EnemyMember
}

export interface MovePayload {
  targets: (PartyMember | EnemyMember)[]
}

export abstract class Move {
  protected scene: Dungeon
  protected onMoveCompleted!: Function
  public name!: string
  public targetType: TargetType
  public isExecuting: boolean = false
  public member!: PartyMember | EnemyMember

  constructor(scene: Dungeon, config: MoveConfig) {
    this.scene = scene
    this.targetType = config.targetType
    this.onMoveCompleted = config.onMoveCompleted
    this.name = config.name
    this.member = config.member
  }

  public abstract execute(movePayload?: MovePayload): void
}
