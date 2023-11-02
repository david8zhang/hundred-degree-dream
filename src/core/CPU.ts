import { Constants, Side, TVChannels } from '~/utils/Constants'
import { Dream } from '~/scenes/Dream'
import { EnemyMember } from './EnemyMember'
import {
  COOKING_ENEMY_CONFIGS,
  EnemyConfig,
  NATURE_ENEMY_CONFIGS,
  NIGHTMARE_KING_ARM,
  NIGHTMARE_KING_HEAD,
  NIGHTMARE_KING_LEG,
  SPORTS_ENEMY_CONFIGS,
} from '~/utils/EnemyConfigs'
import { Save, SaveKeys } from '~/utils/Save'

export class CPU {
  public enemies: EnemyMember[] = []
  public enemyGroup: Phaser.Physics.Arcade.Group
  protected scene: Dream
  public enemyToActIndex: number = 0

  constructor(scene: Dream) {
    this.scene = scene
    this.enemyGroup = this.scene.physics.add.group()
  }

  generateNightmareKing(defaultConfig?: EnemyConfig) {
    this.clearPreviousEnemies()

    // Generate Nightmare King limbs before nightmare king head
    const armHP = Save.getData(SaveKeys.BOSS_HP_ARM)
    const legHP = Save.getData(SaveKeys.BOSS_HP_LEG)
    const headHP = Save.getData(SaveKeys.BOSS_HP_HEAD)
    let nightmareKingConfig = defaultConfig!
    if (armHP == 0 && legHP == 0) {
      nightmareKingConfig = NIGHTMARE_KING_HEAD
    } else {
      const limbConfigs: EnemyConfig[] = []
      if (armHP > 0 || armHP == -1) {
        limbConfigs.push(NIGHTMARE_KING_ARM)
      }
      if (legHP > 0 || legHP == -1) {
        limbConfigs.push(NIGHTMARE_KING_LEG)
      }
      nightmareKingConfig = Phaser.Utils.Array.GetRandom(limbConfigs)
    }

    let currHealth = nightmareKingConfig.maxHealth
    switch (nightmareKingConfig.spriteTexture) {
      case 'boss-head': {
        currHealth = headHP == -1 ? nightmareKingConfig.maxHealth : headHP
        break
      }
      case 'boss-arm': {
        currHealth = armHP == -1 ? nightmareKingConfig.maxHealth : armHP
        break
      }
      case 'boss-foot': {
        currHealth = legHP == -1 ? nightmareKingConfig.maxHealth : legHP
        break
      }
    }

    const nightmareKingEnemy = new EnemyMember(this.scene, {
      position: {
        x: nightmareKingConfig!.position!.x,
        y: nightmareKingConfig!.position!.y,
      },
      enemyConfig: { ...nightmareKingConfig!, currHealth },
      id: `nightmare-king`,
      isBoss: true,
    })
    this.enemies.push(nightmareKingEnemy)
    this.enemyGroup.add(nightmareKingEnemy.sprite)
  }

  clearPreviousEnemies() {
    if (this.enemies.length > 0) {
      this.enemies.forEach((e) => e.destroy())
      this.enemies = []
    }
    this.enemyGroup.clear(true, true)
  }

  generateEnemies(numEnemiesOverride: number = 1) {
    this.clearPreviousEnemies()
    let xPos = Constants.LEFTMOST_CPU_X_POS
    const yPos = 375
    let numEnemies = numEnemiesOverride
    if (this.scene.waveNumber >= 0 && this.scene.waveNumber < 3) {
      numEnemies = Phaser.Math.Between(1, 3)
    }
    if (this.scene.waveNumber >= 3 && this.scene.waveNumber < 5) {
      numEnemies = Phaser.Math.Between(2, 3)
    }
    if (this.scene.waveNumber >= 5) {
      numEnemies = 3
    }
    const recentlyWatchedTVChannel = Save.getData(SaveKeys.RECENTLY_WATCHED_CHANNEL) as string
    let enemyConfigs = COOKING_ENEMY_CONFIGS
    switch (recentlyWatchedTVChannel) {
      case TVChannels.SPORTS: {
        enemyConfigs = SPORTS_ENEMY_CONFIGS
        break
      }
      case TVChannels.NATURE: {
        enemyConfigs = NATURE_ENEMY_CONFIGS
        break
      }
      case TVChannels.COOKING: {
        enemyConfigs = COOKING_ENEMY_CONFIGS
        break
      }
    }

    for (let i = 0; i < numEnemies; i++) {
      const randomConfig = Phaser.Utils.Array.GetRandom(enemyConfigs)
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
        id: `enemy-${i}`,
        isBoss: false,
      })
      this.enemies.push(enemy)
      this.enemyGroup.add(enemy.sprite)
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
