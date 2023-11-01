import { Dream } from '~/scenes/Dream'
import { Move, MovePayload, TargetType } from './Move'
import { PartyMember } from '../PartyMember'
import { EnemyMember } from '../EnemyMember'
import { UINumber } from '../UINumber'
import { Constants } from '~/utils/Constants'
import { ActionState } from '../Player'
import { MoveNames } from './MoveNames'

export class NightmareSlam extends Move {
  private static DAMAGE = 2

  constructor(scene: Dream, member: PartyMember | EnemyMember) {
    super(scene, {
      member,
      onMoveCompleted: () => scene.onMoveCompleted(),
      name: MoveNames.NIGHTMARE_SLAM,
      targetType: TargetType.MULTI,
    })
  }

  dealDamage(partyMemberToTarget: PartyMember, didParry: boolean) {
    let damage = Math.round(
      Constants.getWaveMultiplier(this.scene.waveNumber) * NightmareSlam.DAMAGE
    )
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

  public execute(): void {
    this.isExecuting = true
    const cachedXPos = this.member.sprite.x
    const cachedYPos = this.member.sprite.y
    this.scene.player.actionState = ActionState.PARRYING

    this.scene.tweens.add({
      targets: [this.member.sprite],
      y: {
        from: this.member.sprite.y,
        to: -50,
      },
      duration: 800,
      onComplete: () => {
        const playerParty = this.scene.getPlayerParty()
        const xPos =
          playerParty.reduce((acc, curr) => {
            return acc + curr.sprite.x
          }, 0) / playerParty.length
        this.member.sprite.setPosition(xPos, this.member.sprite.y)

        // Slam down on player party
        this.scene.tweens.add({
          targets: [this.member.sprite],
          y: {
            from: this.member.sprite.y,
            to: playerParty[0].sprite.y,
          },
          duration: 250,
          onComplete: () => {
            const didParryOrDefend = this.scene.player.isParrying || playerParty[0].isDefending
            playerParty.forEach((partyMember: PartyMember) => {
              this.dealDamage(partyMember, didParryOrDefend)
            })

            // Wind up and slam again
            this.scene.time.delayedCall(500, () => {
              this.scene.tweens.add({
                targets: [this.member.sprite],
                y: '-=200',
                hold: 200,
                yoyo: true,
                duration: 250,
                repeat: 1,
                onRepeat: () => {
                  const didParryOrDefend =
                    this.scene.player.isParrying || playerParty[0].isDefending
                  playerParty.forEach((partyMember: PartyMember) => {
                    this.dealDamage(partyMember, didParryOrDefend)
                  })
                },
                onComplete: () => {
                  const didParryOrDefend =
                    this.scene.player.isParrying || playerParty[0].isDefending
                  playerParty.forEach((partyMember: PartyMember) => {
                    this.dealDamage(partyMember, didParryOrDefend)
                  })

                  // Tween back
                  this.scene.tweens.add({
                    delay: 500,
                    targets: [this.member.sprite],
                    x: {
                      from: this.member.sprite.x,
                      to: cachedXPos,
                    },
                    y: {
                      from: this.member.sprite.y,
                      to: cachedYPos,
                    },
                    duration: 2000,
                    onComplete: () => {
                      this.isExecuting = false
                      this.scene.player.actionState = ActionState.WAITING_FOR_TURN
                      this.onMoveCompleted()
                    },
                  })
                },
              })
            })
          },
        })
      },
    })
  }
}
