import { Constants } from '~/utils/Constants'
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

  public instructionText: Phaser.GameObjects.Text | null = null

  constructor(scene: Dream, config: MoveConfig) {
    this.scene = scene
    this.targetType = config.targetType
    this.onMoveCompleted = config.onMoveCompleted
    this.name = config.name
    this.member = config.member

    if (config.instructions) {
      const partyMember = this.member as PartyMember
      this.instructionText = this.scene.add
        .text(
          Constants.INSTRUCTION_TEXT_LOCATION.x,
          this.scene.isTutorial
            ? Constants.INSTRUCTION_TEXT_LOCATION_TUTORIAL.y
            : Constants.INSTRUCTION_TEXT_LOCATION.y,
          config.instructions,
          {
            fontSize: '25px',
            color: partyMember.darkTheme ? 'white' : 'black',
          }
        )
        .setOrigin(0.5, 0.5)
        .setDepth(2000)
        .setWordWrapWidth(500)
        .setVisible(false)
    }
  }

  public abstract execute(movePayload?: MovePayload): void
}
