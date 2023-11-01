import { Dream } from '~/scenes/Dream'
import { Move, TargetType } from './Move'
import { PartyMember } from '../PartyMember'
import { EnemyMember } from '../EnemyMember'
import { Constants } from '~/utils/Constants'
import { UINumber } from '../UINumber'
import { ActionState } from '../Player'

export class NightmarePunch extends Move {
  private static DAMAGE = 5
  constructor(scene: Dream, member: PartyMember | EnemyMember) {
    super(scene, {
      member,
      onMoveCompleted: () => scene.onMoveCompleted(),
      name: '',
      targetType: TargetType.SINGLE,
    })
  }

  dealDamage(partyMemberToTarget: PartyMember, didParry: boolean) {
    let damage = Math.round(
      Constants.getWaveMultiplier(this.scene.waveNumber) * NightmarePunch.DAMAGE
    )
    damage = damage - (didParry || partyMemberToTarget.isDefending ? 1 : 0)
    if (damage > 0) {
      partyMemberToTarget.takeDamage(damage)
      UINumber.createNumber(
        `-${damage}`,
        this.scene,
        partyMemberToTarget.sprite.x,
        partyMemberToTarget.sprite.y - partyMemberToTarget.sprite.displayHeight / 2,
        'white',
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
        'white',
        '30px'
      )
    }
  }

  public execute(): void {
    const playerParty = this.scene.getPlayerParty()
    const randomPartyMember = Phaser.Utils.Array.GetRandom(playerParty)
    const cachedXPos = this.member.sprite.x
    this.scene.player.actionState = ActionState.PARRYING
    this.scene.tweens.add({
      targets: [this.member.sprite],
      x: '+=200',
      duration: 800,
      onStart: () => {
        this.member.sprite.setTexture('boss-fist')
      },
      onComplete: () => {
        this.scene.tweens.add({
          delay: 1000,
          targets: [this.member.sprite],
          onStart: () => {
            this.member.sprite.setTexture('boss-fist')
          },
          x: {
            from: this.member.sprite.x,
            to: randomPartyMember.sprite.x + this.member.sprite.displayWidth / 3,
          },
          duration: 200,
          onComplete: () => {
            this.scene.cameras.main.shake(300, 0.003)
            this.dealDamage(randomPartyMember, this.scene.player.isParrying)

            // Tween back
            this.scene.tweens.add({
              delay: 500,
              targets: [this.member.sprite],
              x: {
                from: this.member.sprite.x,
                to: cachedXPos,
              },
              duration: 500,
              onComplete: () => {
                this.member.sprite.setTexture('boss-arm')
                this.onMoveCompleted()
              },
            })
          },
        })
      },
    })
  }
}
