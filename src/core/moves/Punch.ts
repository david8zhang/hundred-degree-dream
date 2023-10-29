import { Move, MovePayload, TargetType } from './Move'
import { Dungeon } from '~/scenes/Dungeon'
import { MoveNames } from './MoveNames'
import { EnemyMember } from '../EnemyMember'
import { PartyMember } from '../PartyMember'
import { Constants } from '~/utils/Constants'
import { UINumber } from '../UINumber'

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
  private cachedInitialXPos: number = -1
  private enemyToTarget: EnemyMember | null = null

  private static TIMING_TO_DAMAGE_MAP = {
    [TimingType.OK]: 1,
    [TimingType.GREAT]: 2,
  }

  constructor(scene: Dungeon, member: PartyMember | EnemyMember) {
    super(scene, {
      name: MoveNames.PUNCH,
      onMoveCompleted: () => scene.onMoveCompleted(),
      targetType: TargetType.SINGLE,
      member,
    })
    this.circleGroup = this.scene.add.group()
    this.setupCircles()
    this.setupKeyListener()
  }

  setupKeyListener() {
    const fKey = this.scene.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.F)
    fKey
      .on('down', () => {
        if (this.canStartMinigame) {
          this.canEndMinigame = true
          this.startCircleSequence()
        }
      })
      .on('up', () => {
        if (this.canEndMinigame) {
          this.handleRelease()
        }
      })
  }

  startCircleSequence() {
    const allCircles = this.circleGroup.children.entries
    this.scene.time.addEvent({
      repeat: 2,
      delay: 500,
      startAt: 500,
      callback: () => {
        const circle = allCircles[this.highlightedCircleIndex] as Phaser.GameObjects.Arc
        if (this.highlightedCircleIndex < allCircles.length - 1) {
          circle.setFillStyle(0xff0000)
        } else {
          this.timingType = TimingType.GREAT
          circle.setFillStyle(0x00ff00)
        }
        this.highlightedCircleIndex++
      },
    })
  }

  handleRelease() {
    this.circleGroup.setVisible(false)
    const damage = Punch.TIMING_TO_DAMAGE_MAP[this.timingType]
    this.enemyToTarget!.takeDamage(damage)
    UINumber.createNumber(
      `${this.timingType}`,
      this.scene,
      this.enemyToTarget!.sprite.x,
      this.enemyToTarget!.sprite.y - this.enemyToTarget!.sprite.displayHeight / 2 - 30,
      'white',
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
  }

  resetMoveState() {
    this.highlightedCircleIndex = 0
    this.timingType = TimingType.OK
    this.canStartMinigame = false
    this.canEndMinigame = false
    this.cachedInitialXPos = -1
    this.enemyToTarget = null
  }

  showCircles() {
    let xPos = Constants.WINDOW_WIDTH / 2 - 50
    const yPos = Constants.WINDOW_HEIGHT - 100
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
    this.circleGroup.setVisible(false)
  }

  public execute(movePayload: MovePayload): void {
    const targets = movePayload.targets
    this.enemyToTarget = targets[0] as EnemyMember
    this.cachedInitialXPos = this.member.sprite.x
    this.isExecuting = true
    const distance = Phaser.Math.Distance.Between(
      this.member.sprite.x,
      this.member.sprite.y,
      this.enemyToTarget.sprite.x,
      this.enemyToTarget.sprite.y
    )

    const tweenToTarget = this.scene.tweens.add({
      targets: [this.member.sprite],
      duration: (distance / Constants.MOVE_SPEED) * 1000,
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
