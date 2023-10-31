import { Dream } from '~/scenes/Dream'
import { Move, MovePayload, TargetType } from './Move'
import { PartyMember } from '../PartyMember'
import { EnemyMember } from '../EnemyMember'
import { UIValueBar } from '../UIValueBar'
import { Constants } from '~/utils/Constants'

export class Maul extends Move {
  private static MAUL_DAMAGE = 1
  private static MAX_BAR_VALUE = 100
  private lastKeyPressed: number = -1
  private bar: UIValueBar
  private barValue: number = 0
  private isAttacking: boolean = false
  private cachedXPos = -1

  constructor(scene: Dream, member: PartyMember | EnemyMember) {
    super(scene, {
      name: '',
      member,
      targetType: TargetType.SINGLE,
      onMoveCompleted: () => scene.onMoveCompleted(),
      description: 'Tear apart a single enemy with a barrage of claws and teeth!',
      instructions: 'Alternate pressing "A" and "D" and fill up the bar!',
    })
    this.setupKeyListener()
    this.bar = new UIValueBar(this.scene, {
      maxValue: Maul.MAX_BAR_VALUE,
      x: Constants.WINDOW_WIDTH / 2 - 125,
      y: Constants.WINDOW_HEIGHT - 65,
      width: 250,
      height: 20,
      borderWidth: 0,
      changeColorBasedOnPct: true,
    })
    this.bar.setCurrValue(0)
    this.bar.setVisible(false)
  }

  setupKeyListener() {
    this.scene.input.keyboard.on('keydown', (e) => {
      if (this.isExecuting && !this.isAttacking) {
        switch (e.keyCode) {
          case Phaser.Input.Keyboard.KeyCodes.A: {
            if (
              this.lastKeyPressed == -1 ||
              this.lastKeyPressed == Phaser.Input.Keyboard.KeyCodes.D
            ) {
              this.barValue = Math.min(Maul.MAX_BAR_VALUE, this.barValue + 2)
              this.bar.setCurrValue(this.barValue)
            }
            break
          }
          case Phaser.Input.Keyboard.KeyCodes.D: {
            if (
              this.lastKeyPressed == -1 ||
              this.lastKeyPressed == Phaser.Input.Keyboard.KeyCodes.A
            ) {
              this.barValue = Math.min(Maul.MAX_BAR_VALUE, this.barValue + 2)
              this.bar.setCurrValue(this.barValue)
            }
          }
        }
        this.lastKeyPressed = e.keyCode
      }
    })
  }

  resetMoveState() {
    this.isAttacking = false
    this.isExecuting = false
    this.bar.setCurrValue(0)
    this.bar.setVisible(false)
    this.barValue = 0
    this.lastKeyPressed = -1
  }

  dealDamage(enemyToTarget: EnemyMember) {
    const pct = Math.round((this.bar.currValue / this.bar.maxValue) * 100)
    let numRepeats = 0
    if (pct >= 90) {
      numRepeats = 3
    } else if (pct >= 50 && pct < 90) {
      numRepeats = 2
    } else if (pct >= 25) {
      numRepeats = 1
    }

    this.scene.tweens.add({
      targets: [this.member.sprite],
      x: '+=75',
      duration: 200,
      yoyo: true,
      repeat: numRepeats,
      onYoyo: () => {
        const damage = this.scene.calculateDamageBasedOnLevel(Maul.MAUL_DAMAGE)
        enemyToTarget.takeDamage(damage)
      },
      onComplete: () => {
        this.scene.tweens.add({
          targets: [this.member.sprite],
          x: {
            from: this.member.sprite.x,
            to: this.cachedXPos,
          },
          duration: 1000,
          onComplete: () => {
            this.resetMoveState()
            this.onMoveCompleted()
          },
        })
      },
    })
  }

  public execute(movePayload: MovePayload): void {
    this.isExecuting = true
    this.cachedXPos = this.member.sprite.x
    const enemyToTarget = movePayload.targets[0] as EnemyMember
    this.bar.setVisible(true)
    this.scene.tweens.add({
      targets: [this.member.sprite],
      duration: 4500,
      x: {
        from: this.member.sprite.x,
        to: enemyToTarget.sprite.x - enemyToTarget.sprite.displayWidth / 2 - 75,
      },
      onComplete: () => {
        this.scene.time.delayedCall(500, () => {
          this.isAttacking = true
          this.dealDamage(enemyToTarget)
        })
      },
    })
  }
}
