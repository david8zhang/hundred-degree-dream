import { Dream } from '~/scenes/Dream'
import { Move, MovePayload, TargetType } from './Move'
import { EnemyMember } from '../EnemyMember'
import { PartyMember } from '../PartyMember'
import { MoveNames } from './MoveNames'
import { Constants } from '~/utils/Constants'
import { UINumber } from '../UINumber'
import { ActionState } from '../Player'

export class EnemyCharge extends Move {
  public static DAMAGE = 1

  constructor(scene: Dream, member: PartyMember | EnemyMember) {
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
    this.scene.player.actionState = ActionState.PARRYING

    const tweenToTarget = this.scene.tweens.add({
      targets: [this.member.sprite],
      x: {
        from: this.member.sprite.x,
        to: partyMemberToTarget.sprite.x + partyMemberToTarget.sprite.displayWidth / 2 + 30,
      },
      duration: (distance / Constants.MOVE_SPEED) * 1000,
      onComplete: () => {
        tweenToTarget.remove()

        // Wind up enemy attack
        const windUpTween = this.scene.tweens.add({
          targets: [this.member.sprite],
          x: '+=50',
          duration: 500,
          onComplete: () => {
            windUpTween.remove()
            this.scene.tweens.add({
              targets: [this.member.sprite],
              x: '-=75',
              duration: 75,
              onComplete: () => {
                // Successful parry!
                let didParry = false
                if (this.scene.player.isParrying) {
                  didParry = true
                }
                this.dealDamage(partyMemberToTarget, cachedXPos, didParry)
              },
            })
          },
        })
      },
    })
  }

  tweenBack(cachedXPos: number) {
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

  dealDamage(partyMemberToTarget: PartyMember, cachedXPos: number, didParry: boolean) {
    let damage = Math.round(Constants.getWaveMultiplier(this.scene.waveNumber) * EnemyCharge.DAMAGE)
    damage = damage - (didParry || partyMemberToTarget.isDefending ? 1 : 0)
    if (damage > 0) {
      partyMemberToTarget.takeDamage(damage)
      UINumber.createNumber(
        `-${damage}`,
        this.scene,
        partyMemberToTarget.sprite.x,
        partyMemberToTarget.sprite.y - partyMemberToTarget.sprite.displayHeight / 2,
        'black',
        '30px',
        () => {
          this.tweenBack(cachedXPos)
        }
      )
    }

    // Handle successful parries
    if (didParry) {
      let yPos = partyMemberToTarget.sprite.y - partyMemberToTarget.sprite.displayHeight / 2
      if (damage > 0) {
        yPos -= 30
      }
      UINumber.createNumber(
        'Great!',
        this.scene,
        partyMemberToTarget.sprite.x,
        yPos,
        'black',
        '30px',
        () => {
          if (damage === 0) {
            this.tweenBack(cachedXPos)
          }
        }
      )
    }
  }
}
