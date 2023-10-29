import { Constants, Side } from '~/utils/Constants'
import { Dream } from '~/scenes/Dream'
import { EnemyMember } from './EnemyMember'
import { ALL_ENEMY_CONFIGS, EnemyConfig } from '~/utils/EnemyConfigs'
import { Save, SaveKeys } from '~/utils/Save'

export class CPU {
  public enemies: EnemyMember[] = []
  private scene: Dream
  private enemyToActIndex: number = 0

  constructor(scene: Dream) {
    this.scene = scene
  }

  generateEnemies() {
    if (this.enemies.length > 0) {
      this.enemies.forEach((e) => e.destroy())
      this.enemies = []
    }
    let xPos = Constants.LEFTMOST_CPU_X_POS
    const yPos = 400
    const numEnemies = Phaser.Math.Between(1, 3)

    for (let i = 0; i < numEnemies; i++) {
      const randomConfig = Phaser.Utils.Array.GetRandom(ALL_ENEMY_CONFIGS)
      const expReward = this.getExpReward(randomConfig)
      const enemy = new EnemyMember(this.scene, {
        position: {
          x: xPos,
          y: yPos,
        },
        enemyConfig: {
          ...randomConfig,
          maxHealth: Math.round(
            Constants.getWaveMultiplier(this.scene.waveNumber) * randomConfig.maxHealth
          ),
          baseExpReward: expReward,
        },
      })
      this.enemies.push(enemy)
      xPos += 125
    }
  }

  getExpReward(randomConfig: EnemyConfig) {
    const expWithWaveMultiplier = Math.round(
      Constants.getWaveMultiplier(this.scene.waveNumber) * randomConfig.baseExpReward
    )
    const currLevel = Save.getData(SaveKeys.CURR_LEVEL)
    return Constants.scaleExpGainedFromLevel(expWithWaveMultiplier, currLevel)
  }

  get livingEnemies() {
    return this.enemies.filter((e) => e.currHealth > 0)
  }

  startTurn() {
    this.enemyToActIndex = 0
    this.processEnemyAction()
  }

  processEnemyAction() {
    const enemyToAct = this.livingEnemies[this.enemyToActIndex]
    const move = enemyToAct.getMoveToExecute()
    move.execute()
  }

  onMoveCompleted() {
    if (!this.scene.isRoundOver()) {
      if (this.enemyToActIndex == this.livingEnemies.length - 1) {
        this.scene.startTurn(Side.PLAYER)
      } else {
        this.enemyToActIndex++
        this.processEnemyAction()
      }
    } else {
      this.scene.handleRoundOver()
    }
  }
}
