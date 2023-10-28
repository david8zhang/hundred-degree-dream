import { Dungeon } from '~/scenes/Dungeon'
import { TargetType } from './moves/Move'

export class TargetCursor {
  private scene: Dungeon
  public cursorGroup!: Phaser.GameObjects.Group
  private targetType!: TargetType

  // Single target only
  public enemyToTargetIndex = 0

  constructor(scene: Dungeon) {
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
        newEnemyToTarget.sprite.y + newEnemyToTarget.sprite.displayHeight / 2 + 30
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
        const newCursor = this.scene.add
          .sprite(
            enemyToTarget.sprite.x,
            enemyToTarget.sprite.y + enemyToTarget.sprite.displayHeight / 2 + 30,
            'cursor'
          )
          .setDisplaySize(32, 32)
        this.cursorGroup.add(newCursor)
        break
      }
      case TargetType.MULTI: {
        enemies.forEach((enemyToTarget) => {
          const newCursor = this.scene.add
            .sprite(
              enemyToTarget.sprite.x,
              enemyToTarget.sprite.y + enemyToTarget.sprite.displayHeight / 2 + 30,
              'cursor'
            )
            .setDisplaySize(32, 32)
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

  setVisible(isVisible: boolean) {
    this.cursorGroup.setVisible(isVisible)
  }
}
