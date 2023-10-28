import { Move, MovePayload, TargetType } from './Move'
import { Dungeon } from '~/scenes/Dungeon'
import { MoveNames } from './MoveNames'
import { EnemyMember } from '../EnemyMember'
import { PartyMember } from '../PartyMember'

export class Punch extends Move {
  constructor(scene: Dungeon, member: PartyMember | EnemyMember) {
    super(scene, {
      name: MoveNames.PUNCH,
      onMoveCompleted: () => scene.onMoveCompleted(),
      targetType: TargetType.SINGLE,
      member,
    })
  }

  public execute(movePayload: MovePayload): void {
    const targets = movePayload.targets
    const enemyToTarget = targets[0]

    this.isExecuting = true
    const tweenToTarget = this.scene.tweens.add({
      targets: [this.member.sprite],
      duration: 1000,
      x: {
        from: this.member.sprite.x,
        to: enemyToTarget.sprite.x - enemyToTarget.sprite.displayWidth / 2 - 20,
      },
      onComplete: () => {
        tweenToTarget.remove()
      },
    })
  }
}
