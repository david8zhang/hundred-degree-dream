import { EnemyMember } from '../EnemyMember'
import { PartyMember } from '../PartyMember'
import { Dream } from '~/scenes/Dream'

export enum TargetType {
  SINGLE = 'SINGLE',
  MULTI = 'MULTI',
  AREA = 'AREA',
  ALLY_TEAM = 'ALLY_TEAM',
}

export interface MoveConfig {
  name: string
  onMoveCompleted: Function
  targetType: TargetType
  member: PartyMember | EnemyMember
  description?: string
  instructions?: string
}

export interface MovePayload {
  targets: (PartyMember | EnemyMember)[]
}

export abstract class Move {
  protected scene: Dream
  protected onMoveCompleted!: Function
  public name!: string
  public targetType: TargetType
  public isExecuting: boolean = false
  public member!: PartyMember | EnemyMember

  constructor(scene: Dream, config: MoveConfig) {
    this.scene = scene
    this.targetType = config.targetType
    this.onMoveCompleted = config.onMoveCompleted
    this.name = config.name
    this.member = config.member
  }

  public abstract execute(movePayload?: MovePayload): void
}
