import { Move, MovePayload, TargetType } from './Move'
import { Dream } from '~/scenes/Dream'
import { MoveNames } from './MoveNames'
import { EnemyMember } from '../EnemyMember'
import { PartyMember } from '../PartyMember'
import { Constants } from '~/utils/Constants'
import { UINumber } from '../UINumber'
import { Save, SaveKeys } from '~/utils/Save'

export enum TimingType {
  OK = 'Ok',
  GREAT = 'Great',
}

export class Punch extends Move {
  private circleGroup: Phaser.GameObjects.Group
  private highlightedCircleIndex: number = 0
  private timingType: TimingType = TimingType.OK
  private canStartMinigame: boolean = false
  private canEndMinigame: boolean = false
  private isReleased: boolean = false
  private cachedInitialXPos: number = -1
  private enemyToTarget: EnemyMember | null = null
  private windUpTween: Phaser.Tweens.Tween | null = null

  private static TIMING_TO_DAMAGE_MAP = {
    [TimingType.OK]: 2,
    [TimingType.GREAT]: 3,
  }

  constructor(scene: Dream, member: PartyMember | EnemyMember) {
    super(scene, {
      name: MoveNames.PUNCH,
      onMoveCompleted: () => scene.onMoveCompleted(),
      targetType: TargetType.SINGLE,
      member,
      description: 'Slug a single enemy in the face',
      instructions: 'Hold the "F" key and release once the green circle appears!',
    })
    this.circleGroup = this.scene.add.group()
    this.circleGroup.setDepth(2000)
    this.setupCircles()
    this.setupKeyListener()
  }

  setupKeyListener() {
    const fKey = this.scene.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.F)
    fKey
      .on('down', () => {
        if (this.canStartMinigame && !this.isReleased) {
          this.canEndMinigame = true
          this.startCircleSequence()
        }
      })
      .on('up', () => {
        if (this.canEndMinigame && !this.isReleased) {
          this.isReleased = true
          this.handleRelease()
        }
      })
  }

  startCircleSequence() {
    const allCircles = this.circleGroup.children.entries
    this.windUpTween = this.scene.add.tween({
      targets: [this.member.sprite],
      x: '-=75',
      duration: 1000,
      onComplete: () => {
        this.windUpTween!.remove()
        this.windUpTween = null
      },
    })

    this.scene.time.addEvent({
      repeat: 2,
      delay: 500,
      startAt: 500,
      callback: () => {
        const circle = allCircles[this.highlightedCircleIndex] as Phaser.GameObjects.Arc
        if (this.highlightedCircleIndex < allCircles.length - 1) {
          circle.setFillStyle(0xff0000)
        } else {
          circle.setFillStyle(0x00ff00)
          this.timingType = TimingType.GREAT
        }
        this.highlightedCircleIndex++
      },
    })
  }

  handleRelease() {
    this.isReleased = true
    this.circleGroup.setVisible(false)
    const timingType = this.timingType
    const level = Save.getData(SaveKeys.CURR_LEVEL)
    const damage = Constants.calculateDamageBasedOnLevel(
      Punch.TIMING_TO_DAMAGE_MAP[timingType],
      level
    )
    if (this.windUpTween) {
      this.windUpTween.stop()
      this.windUpTween.remove()
      this.windUpTween = null
    }
    const attackTween = this.scene.add.tween({
      targets: [this.member.sprite],
      x: {
        from: this.member.sprite.x,
        to: this.enemyToTarget!.sprite.x - this.enemyToTarget!.sprite.displayWidth / 2 - 20,
      },
      duration: 100,
      onComplete: () => {
        attackTween.remove()
        this.enemyToTarget!.takeDamage(damage)

        // Change where the damage number appears since boss is larger than regular enemy
        const xPos = this.enemyToTarget!.isBoss
          ? Constants.BOSS_HIT_BOX.x
          : this.enemyToTarget!.sprite.x

        const yPos = this.enemyToTarget!.isBoss
          ? Constants.BOSS_HIT_BOX.y - 30
          : this.enemyToTarget!.sprite.y - this.enemyToTarget!.sprite.displayHeight / 2 - 30

        UINumber.createNumber(
          `${timingType}`,
          this.scene,
          xPos,
          yPos,
          this.enemyToTarget!.isBoss ? 'white' : 'black',
          '30px',
          () => {
            // Have player return to original position
            const tweenBack = this.scene.tweens.add({
              targets: [this.member.sprite],
              x: {
                from: this.member.sprite.x,
                to: this.cachedInitialXPos,
              },
              duration: 1000,
              onComplete: () => {
                tweenBack.remove()
                this.resetMoveState()
                this.onMoveCompleted()
              },
            })
          }
        )
      },
    })
  }

  resetMoveState() {
    this.isReleased = false
    this.instructionText!.setVisible(false)
    this.isExecuting = false
    this.highlightedCircleIndex = 0
    this.timingType = TimingType.OK
    this.canStartMinigame = false
    this.canEndMinigame = false
    this.cachedInitialXPos = -1
    this.enemyToTarget = null
  }

  showCircles() {
    let xPos = Constants.WINDOW_WIDTH / 2 - 50
    const yPos = Constants.WINDOW_HEIGHT * 0.75
    this.circleGroup.children.entries.forEach((obj: Phaser.GameObjects.GameObject) => {
      const circle = obj as Phaser.GameObjects.Arc
      circle.setPosition(xPos, yPos).setFillStyle(0x444444)
      xPos += 50
    })
    this.circleGroup.setVisible(true)
  }

  setupCircles() {
    for (let i = 1; i <= 3; i++) {
      const circle = this.scene.add.circle(0, 0, 15, 0xffffff)
      this.circleGroup.add(circle)
    }
    this.circleGroup.setVisible(false).setDepth(2000)
  }

  public execute(movePayload: MovePayload): void {
    const partyMember = this.member as PartyMember
    this.instructionText!.setVisible(true).setColor(partyMember.darkTheme ? 'white' : 'black')
    const targets = movePayload.targets
    this.enemyToTarget = targets[0] as EnemyMember
    this.cachedInitialXPos = this.member.sprite.x
    this.isExecuting = true

    const tweenToTarget = this.scene.tweens.add({
      targets: [this.member.sprite],
      duration: 1000,
      x: {
        from: this.member.sprite.x,
        to: this.enemyToTarget.sprite.x - this.enemyToTarget.sprite.displayWidth / 2 - 20,
      },
      onComplete: () => {
        tweenToTarget.remove()
        this.showCircles()
        this.canStartMinigame = true
      },
    })
  }
}
