import { Dream } from '~/scenes/Dream'
import { Move, MovePayload, TargetType } from './Move'
import { EnemyMember } from '../EnemyMember'
import { PartyMember } from '../PartyMember'
import { MoveNames } from './MoveNames'
import { Constants } from '~/utils/Constants'
import { UINumber } from '../UINumber'
import { Save, SaveKeys } from '~/utils/Save'

export class Stomp extends Move {
  private cachedPosition!: { x: number; y: number }
  private isPressingKey: boolean = false
  private static DAMAGE = 1

  constructor(scene: Dream, member: PartyMember | EnemyMember) {
    super(scene, {
      name: MoveNames.STOMP,
      onMoveCompleted: () => scene.onMoveCompleted(),
      targetType: TargetType.MULTI,
      member,
      description: 'Stomp on all enemies like a video game character',
      instructions: 'Press "F" key just before stomping on an enemy!',
    })
    this.setupKeyListener()
  }

  public setupKeyListener() {
    const fKey = this.scene.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.F)
    fKey.on('down', () => {
      if (!this.isPressingKey && this.isExecuting) {
        this.isPressingKey = true
        this.scene.time.delayedCall(100, () => {
          this.isPressingKey = false
        })
      }
    })
  }

  public execute(movePayload?: MovePayload | undefined): void {
    this.isExecuting = true
    const enemyList = this.scene.getEnemies()
    this.cachedPosition = {
      x: this.member.sprite.x,
      y: this.member.sprite.y,
    }
    this.stompOnEnemy(enemyList, 0)
  }

  completeStompSequence() {
    const partyMember = this.member as PartyMember
    partyMember.sprite.setVelocity(0)
    partyMember.sprite.setGravity(0)
    partyMember.sprite.setPosition(-50, this.cachedPosition.y)
    const tweenBack = this.scene.tweens.add({
      targets: [partyMember.sprite],
      x: {
        from: -50,
        to: this.cachedPosition.x,
      },
      ease: Phaser.Math.Easing.Sine.InOut,
      duration: 1000,
      onComplete: () => {
        this.isExecuting = false
        tweenBack.remove()
        this.onMoveCompleted()
      },
    })
  }

  stumble() {
    this.scene.time.delayedCall(150, () => {
      const partyMember = this.member as PartyMember
      partyMember.sprite.setVelocity(0)
      partyMember.sprite.setGravity(0)
      const tweenBack = this.scene.tweens.add({
        targets: [partyMember.sprite],
        x: {
          from: partyMember.sprite.x,
          to: this.cachedPosition.x,
        },
        y: {
          from: partyMember.sprite.y,
          to: this.cachedPosition.y,
        },
        ease: Phaser.Math.Easing.Sine.InOut,
        duration: 1000,
        onComplete: () => {
          tweenBack.remove()
          this.onMoveCompleted()
        },
      })
    })
  }

  stompOnEnemy(enemyList: EnemyMember[], index: number) {
    if (index > enemyList.length) {
      this.completeStompSequence()
      return
    }
    const partyMember = this.member as PartyMember
    partyMember.sprite.setDepth(1000)
    if (index == enemyList.length) {
      Constants.createArc(
        partyMember.sprite,
        {
          x: Constants.WINDOW_WIDTH + partyMember.sprite.displayWidth,
          y: Constants.WINDOW_HEIGHT / 2,
        },
        1.25
      )
    } else {
      const enemyToStompOn = enemyList[index]
      Constants.createArc(
        partyMember.sprite,
        {
          x: enemyToStompOn.sprite.x + enemyToStompOn.sprite.displayWidth / 2,
          y: enemyToStompOn.sprite.y,
        },
        index == 0 ? 1.4 : 1.25
      )
    }
    this.scene.time.delayedCall(index == 0 ? 1300 : 1100, () => {
      if (index < enemyList.length) {
        const stompedEnemy = enemyList[index]
        const level = Save.getData(SaveKeys.CURR_LEVEL) as number
        const baseDamage = this.isPressingKey ? Stomp.DAMAGE * 2 : Stomp.DAMAGE
        const damage = Constants.calculateDamageBasedOnLevel(baseDamage, level)
        stompedEnemy.takeDamage(damage)

        const partyMember = this.member as PartyMember

        if (this.isPressingKey) {
          UINumber.createNumber(
            'Great!',
            this.scene,
            stompedEnemy.sprite.x,
            stompedEnemy.sprite.y - stompedEnemy.sprite.displayHeight - 30,
            partyMember.darkTheme ? 'white' : 'black',
            '30px'
          )
        }
      }
      this.stompOnEnemy(enemyList, index + 1)
    })
  }
}
