import { Dream } from '~/scenes/Dream'
import { CPU } from '../CPU'
import { EnemyMember } from '../EnemyMember'
import { Constants } from '~/utils/Constants'
import { CHILI, EnemyConfig } from '~/utils/EnemyConfigs'

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

  setVisible(isVisible: boolean) {
    this.enemies.forEach((enemy) => enemy.setVisible(isVisible))
  }

  generateNightmareKing(defaultConfig: EnemyConfig) {
    this.clearPreviousEnemies()
    let xPos = Constants.WINDOW_WIDTH
    const yPos = 375
    const nightmareKingEnemy = new EnemyMember(this.scene, {
      position: {
        x: Constants.WINDOW_WIDTH * 2,
        y: yPos,
      },
      enemyConfig: defaultConfig,
      id: `nightmare-king`,
      isBoss: true,
    })
    nightmareKingEnemy.sprite.setAlpha(0)
    nightmareKingEnemy.sprite.setPosition(xPos, yPos)
    this.enemies.push(nightmareKingEnemy)
    this.enemyGroup.add(nightmareKingEnemy.sprite)
    this.scene.tweens.add({
      targets: [nightmareKingEnemy.sprite],
      alpha: {
        from: 0,
        to: 1,
      },
      duration: 1000,
    })
  }

  generateEnemies(numEnemies: number) {
    this.clearPreviousEnemies()
    const yPos = 400
    for (let i = 0; i < numEnemies; i++) {
      const enemyConfig = CHILI
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
        isBoss: false,
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
