import { Dream } from '~/scenes/Dream'
import { CPU } from '../CPU'
import { EnemyMember } from '../EnemyMember'
import { Constants } from '~/utils/Constants'
import { BLUE_SLIME } from '~/utils/EnemyConfigs'

export interface TutorialCPUConfig {
  onMoveCompleted: Function
}

export class TutorialCPU extends CPU {
  private moveCompletedCb: Function
  public useNormalMoveCompleteBehavior: boolean = false

  constructor(scene: Dream, config: TutorialCPUConfig) {
    super(scene)
    this.moveCompletedCb = config.onMoveCompleted
  }

  generateEnemies(numEnemies: number) {
    this.clearPreviousEnemies()
    const yPos = 400
    for (let i = 0; i < numEnemies; i++) {
      const enemyConfig = BLUE_SLIME
      const enemy = new EnemyMember(this.scene, {
        position: {
          x: Constants.WINDOW_WIDTH + 50,
          y: yPos,
        },
        enemyConfig: {
          ...enemyConfig,
          maxHealth: enemyConfig.maxHealth,
          baseExpReward: 0,
        },
        id: `enemy-${i}`,
      })
      this.enemies.push(enemy)
      this.enemyGroup.add(enemy.sprite)
    }

    // Tween in
    let xPos = Constants.LEFTMOST_CPU_X_POS
    for (let i = 0; i < numEnemies; i++) {
      const enemy = this.enemies[i]
      this.scene.tweens.add({
        targets: [enemy.sprite],
        x: {
          from: enemy.sprite.x,
          to: xPos,
        },
        delay: i * 250,
        onComplete: () => {
          enemy.updateHealthBarPosition()
        },
      })
      xPos += 125
    }
  }

  onMoveCompleted() {
    if (this.useNormalMoveCompleteBehavior) {
      super.onMoveCompleted()
    } else {
      this.moveCompletedCb()
    }
  }
}
