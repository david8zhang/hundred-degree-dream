import { Dream } from '~/scenes/Dream'
import { Move, MovePayload, TargetType } from './Move'
import { PartyMember } from '../PartyMember'
import { EnemyMember } from '../EnemyMember'
import { Constants } from '~/utils/Constants'
import { UINumber } from '../UINumber'
import { ActionState } from '../Player'
import { MoveNames } from './MoveNames'

export class NightmareLaser extends Move {
  private static DAMAGE = 2
  private laserSprite: Phaser.GameObjects.Rectangle
  private laserChargeSprite: Phaser.GameObjects.Arc

  constructor(scene: Dream, member: PartyMember | EnemyMember) {
    super(scene, {
      member,
      targetType: TargetType.MULTI,
      name: MoveNames.NIGHTMARE_LASER,
      onMoveCompleted: () => scene.onMoveCompleted(),
    })
    this.laserSprite = this.scene.add
      .rectangle(0, 0, Constants.WINDOW_WIDTH, 0, 0xa537fd)
      .setAlpha(0.5)
      .setVisible(false)
      .setDepth(5000)

    this.laserChargeSprite = this.scene.add
      .arc(0, 0, 200)
      .setFillStyle(0xa537fd)
      .setAlpha(0)
      .setVisible(false)
  }

  dealDamage(partyMemberToTarget: PartyMember, didParry: boolean) {
    let damage = Math.round(
      Constants.getWaveMultiplier(this.scene.waveNumber) * NightmareLaser.DAMAGE
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
    this.laserChargeSprite
      .setVisible(true)
      .setPosition(Constants.WINDOW_WIDTH - 250, this.member.sprite.y)
    const xPos = Constants.WINDOW_WIDTH - 250
    this.scene.player.actionState = ActionState.PARRYING
    this.scene.tweens.add({
      targets: [this.laserChargeSprite],
      radius: {
        from: 200,
        to: 0,
      },
      alpha: {
        from: 0,
        to: 1,
      },
      ease: Phaser.Math.Easing.Sine.Out,
      duration: 1000,
      onComplete: () => {
        this.laserSprite.setPosition(xPos, this.member.sprite.y).setOrigin(1, 0.5).setVisible(true)
        this.laserChargeSprite.setAlpha(1)

        let didParry = false
        this.scene.tweens.add({
          targets: [this.laserSprite],
          height: {
            from: 0,
            to: 125,
          },
          alpha: {
            from: 0.5,
            to: 0.8,
          },
          duration: 150,
          yoyo: true,
          hold: 1000,
          onStart: () => {
            didParry = this.scene.player.isParrying
          },
          onUpdate: () => {
            this.laserSprite.setPosition(xPos, this.member.sprite.y).setOrigin(1, 0.5)
          },
          onHold: () => {
            this.scene.cameras.main.shake(1000, 0.0025)
            this.scene.time.addEvent({
              repeat: 2,
              callback: () => {
                playerParty.forEach((partyMember) => {
                  if (didParry) {
                    partyMember.sprite.setTexture(`${partyMember.name.toLowerCase()}-defend`)
                  }
                  this.dealDamage(partyMember, didParry || partyMember.isDefending)
                })
              },
              delay: 300,
            })
          },
          onComplete: () => {
            this.isExecuting = false
            playerParty.forEach((partyMember) => {
              partyMember.sprite.setTexture(`${partyMember.name.toLowerCase()}`)
            })
            this.onMoveCompleted()
          },
        })
      },
    })
  }
}
