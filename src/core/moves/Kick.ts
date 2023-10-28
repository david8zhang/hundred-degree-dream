import { Move, TargetType } from './Move'
import { Dungeon } from '~/scenes/Dungeon'
import { MoveNames } from './MoveNames'
import { EnemyMember } from '../EnemyMember'
import { PartyMember } from '../PartyMember'

export class Kick extends Move {
  constructor(scene: Dungeon, member: PartyMember | EnemyMember) {
    super(scene, {
      name: MoveNames.KICK,
      onMoveCompleted: () => scene.onMoveCompleted(),
      targetType: TargetType.SINGLE,
      member,
    })
  }

  public execute(data?: any): void {
    console.log('Start kick!')
  }
}
