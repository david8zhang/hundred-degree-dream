import { Dream } from '~/scenes/Dream'
import { Move, MovePayload, TargetType } from './Move'
import { PartyMember } from '../PartyMember'
import { EnemyMember } from '../EnemyMember'
import { Constants } from '~/utils/Constants'
import { UINumber } from '../UINumber'
import { ActionState } from '../Player'

export class EnemyMulti extends Move {
  private static DAMAGE = 1
  private successfullyParried: boolean = false

  constructor(scene: Dream, member: PartyMember | EnemyMember) {
    super(scene, {
      name: '',
      onMoveCompleted: () => scene.onMoveCompleted(),
      targetType: TargetType.MULTI,
      member,
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

  dealDamage(partyMemberToTarget: PartyMember, didParry: boolean) {
    let damage = Math.round(Constants.getWaveMultiplier(this.scene.waveNumber) * EnemyMulti.DAMAGE)
    damage = damage - (didParry || partyMemberToTarget.isDefending ? 1 : 0)
    if (damage > 0) {
      partyMemberToTarget.takeDamage(damage)
      UINumber.createNumber(
        `-${damage}`,
        this.scene,
        partyMemberToTarget.sprite.x,
        partyMemberToTarget.sprite.y - partyMemberToTarget.sprite.displayHeight / 2,
        'black',
        '30px'
      )
    }

    // Handle successful parries or defense
    if (didParry || partyMemberToTarget.isDefending) {
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
        '30px'
      )
    }
  }

  resetMoveState() {
    this.successfullyParried = false
    this.isExecuting = false
  }

  public execute(movePayload: MovePayload): void {
    const cachedXPos = this.member.sprite.x
    const playerParty = this.scene.getPlayerParty()
    playerParty.forEach((partyMember, index: number) => {
      const overlap = this.scene.physics.add.overlap(
        partyMember.sprite,
        this.member.sprite,
        (obj1, obj2) => {
          const playerMember = obj1.getData('ref') as PartyMember
          if (index == 0 && (this.scene.player.isParrying || playerMember.isDefending)) {
            this.successfullyParried = true
          }
          this.dealDamage(playerMember, this.successfullyParried)
          overlap.destroy()
        }
      )
    })

    this.isExecuting = true
    this.scene.tweens.add({
      targets: [this.member.sprite],
      x: {
        from: this.member.sprite.x,
        to: Constants.WINDOW_WIDTH / 2,
      },
      duration: 1000,
      onComplete: () => {
        this.scene.player.actionState = ActionState.PARRYING
        this.scene.tweens.add({
          targets: [this.member.sprite],
          x: '+=50',
          duration: 450,
          onComplete: () => {
            this.scene.tweens.add({
              targets: [this.member.sprite],
              x: {
                from: this.member.sprite.x,
                to: -50,
              },
              duration: 500,
              onComplete: () => {
                this.member.sprite.setPosition(Constants.WINDOW_WIDTH + 50, this.member.sprite.y)
                this.scene.tweens.add({
                  delay: 1000,
                  targets: [this.member.sprite],
                  x: {
                    from: this.member.sprite.x,
                    to: cachedXPos,
                  },
                  duration: 500,
                  onComplete: () => {
                    this.resetMoveState()
                    this.onMoveCompleted()
                  },
                })
              },
            })
          },
        })
      },
    })
  }
}
