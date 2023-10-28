import { Dungeon } from '~/scenes/Dungeon'
import { Move, MovePayload, TargetType } from './Move'
import { EnemyMember } from '../EnemyMember'
import { PartyMember } from '../PartyMember'
import { MoveNames } from './MoveNames'
import { Constants } from '~/utils/Constants'
import { UINumber } from '../UINumber'

export class EnemyCharge extends Move {
  constructor(scene: Dungeon, member: PartyMember | EnemyMember) {
    super(scene, {
      name: MoveNames.ENEMY_CHARGE,
      onMoveCompleted: () => scene.onMoveCompleted(),
      targetType: TargetType.SINGLE,
      member,
    })
  }

  public execute(movePayload?: MovePayload | undefined): void {
    // Sort the player party by distance to get the current party member in front
    const playerPartySortedByDistance = this.scene.getPlayerParty().sort((a, b) => {
      const distToA = Phaser.Math.Distance.Between(
        a.sprite.x,
        a.sprite.y,
        this.member.sprite.x,
        this.member.sprite.y
      )
      const distToB = Phaser.Math.Distance.Between(
        b.sprite.x,
        b.sprite.y,
        this.member.sprite.x,
        this.member.sprite.y
      )
      return distToA - distToB
    })
    const partyMemberToTarget = playerPartySortedByDistance[0]
    const distance = Phaser.Math.Distance.Between(
      partyMemberToTarget.sprite.x,
      partyMemberToTarget.sprite.y,
      this.member.sprite.x,
      this.member.sprite.y
    )
    const cachedXPos = this.member.sprite.x

    const tweenToTarget = this.scene.tweens.add({
      targets: [this.member.sprite],
      x: {
        from: this.member.sprite.x,
        to: partyMemberToTarget.sprite.x,
      },
      duration: (distance / Constants.MOVE_SPEED) * 1000,
      onComplete: () => {
        tweenToTarget.remove()
        UINumber.createNumber(
          'Damage!',
          this.scene,
          partyMemberToTarget.sprite.x,
          partyMemberToTarget.sprite.y - partyMemberToTarget.sprite.displayHeight / 2,
          'white',
          '30px',
          () => {
            const tweenBack = this.scene.tweens.add({
              targets: [this.member.sprite],
              x: {
                from: this.member.sprite.x,
                to: cachedXPos,
              },
              duration: 1000,
              onComplete: () => {
                tweenBack.remove()
                this.onMoveCompleted()
              },
            })
          }
        )
      },
    })
  }
}
