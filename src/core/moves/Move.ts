import { Scene } from 'phaser'
import { EnemyMember } from '../EnemyMember'
import { PartyMember } from '../PartyMember'

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
  protected scene: Scene
  protected onMoveCompleted!: Function
  public name!: string
  public targetType: TargetType
  public isExecuting: boolean = false
  public member!: PartyMember | EnemyMember

  constructor(scene: Scene, config: MoveConfig) {
    this.scene = scene
    this.targetType = config.targetType
    this.onMoveCompleted = config.onMoveCompleted
    this.name = config.name
    this.member = config.member
  }

  public abstract execute(movePayload?: MovePayload): void
}
