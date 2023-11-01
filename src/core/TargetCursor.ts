import { Dream } from '~/scenes/Dream'
import { TargetType } from './moves/Move'
import { Constants } from '~/utils/Constants'

export class TargetCursor {
  private scene: Dream
  public cursorGroup!: Phaser.GameObjects.Group
  private targetType!: TargetType

  // Single target only
  public enemyToTargetIndex = 0

  constructor(scene: Dream) {
    this.scene = scene
    this.cursorGroup = this.scene.add.group()
  }

  scrollSingleTarget(scrollAmount: number) {
    if (this.targetType === TargetType.SINGLE) {
      const enemyList = this.scene.getEnemies()
      this.enemyToTargetIndex += scrollAmount
      if (this.enemyToTargetIndex == -1) {
        this.enemyToTargetIndex = enemyList.length - 1
      }
      if (this.enemyToTargetIndex == enemyList.length) {
        this.enemyToTargetIndex = 0
      }
      const newEnemyToTarget = enemyList[this.enemyToTargetIndex]
      const singleTargetCursor = this.cursorGroup.getFirst(true)
      singleTargetCursor.setPosition(
        newEnemyToTarget.sprite.x,
        newEnemyToTarget.sprite.y - newEnemyToTarget.sprite.displayHeight / 2 - 30
      )
    }
  }

  setupCursorForTargetType(targetType: TargetType) {
    const enemies = this.scene.getEnemies()
    this.cursorGroup.clear()
    this.targetType = targetType
    switch (targetType) {
      case TargetType.SINGLE: {
        const enemyToTarget = enemies[this.enemyToTargetIndex]
        const xPos = enemyToTarget.isBoss ? Constants.BOSS_HIT_BOX.x : enemyToTarget.sprite.x
        const yPos = enemyToTarget.isBoss
          ? Constants.BOSS_HIT_BOX.y - 30
          : enemyToTarget.sprite.y - enemyToTarget.sprite.displayHeight / 2 - 30

        const newCursor = this.scene.add.sprite(xPos, yPos, 'cursor').setDisplaySize(32, 32)
        this.cursorGroup.add(newCursor)
        break
      }
      case TargetType.MULTI: {
        enemies.forEach((enemyToTarget) => {
          const xPos = enemyToTarget.isBoss ? Constants.BOSS_HIT_BOX.x : enemyToTarget.sprite.x
          const yPos = enemyToTarget.isBoss
            ? Constants.BOSS_HIT_BOX.y - 30
            : enemyToTarget.sprite.y - enemyToTarget.sprite.displayHeight / 2 - 30

          const newCursor = this.scene.add.sprite(xPos, yPos, 'cursor').setDisplaySize(32, 32)
          this.cursorGroup.add(newCursor)
        })
        break
      }
    }
  }

  getSelectedTargets() {
    const enemyList = this.scene.getEnemies()
    switch (this.targetType) {
      case TargetType.SINGLE: {
        return [enemyList[this.enemyToTargetIndex]]
      }
      default:
        return enemyList
    }
  }

  reset() {
    this.enemyToTargetIndex = 0
  }

  setVisible(isVisible: boolean) {
    this.cursorGroup.setVisible(isVisible)
  }
}
