import { Dungeon } from '~/scenes/Dungeon'
import { Move } from './moves/Move'
import { UIValueBar } from './UIValueBar'
import { UINumber } from './UINumber'
import { EnemyConfig } from '~/utils/EnemyConfigs'

export interface EnemyMemberConfig {
  position: {
    x: number
    y: number
  }
  enemyConfig: EnemyConfig
}

export class EnemyMember {
  private scene: Dungeon
  public currHealth: number
  public maxHealth: number
  public sprite: Phaser.GameObjects.Sprite
  public moveMapping: {
    [key: string]: Move
  }
  private healthbar: UIValueBar
  private healthText: Phaser.GameObjects.Text
  private enemyConfig: EnemyConfig

  constructor(scene: Dungeon, config: EnemyMemberConfig) {
    this.scene = scene
    this.enemyConfig = config.enemyConfig
    this.currHealth = config.enemyConfig.maxHealth
    this.maxHealth = config.enemyConfig.maxHealth
    this.sprite = this.scene.add
      .sprite(config.position.x, config.position.y, config.enemyConfig.spriteTexture)
      .setOrigin(0.5, 0.5)
    this.moveMapping = this.scene.convertMoveNamesToMoves(config.enemyConfig.moveNames, this)

    const healthbarWidth = 75
    this.healthbar = new UIValueBar(this.scene, {
      width: healthbarWidth,
      height: 10,
      x: this.sprite.x - healthbarWidth / 2,
      y: this.sprite.y + this.sprite.displayHeight / 2 + 20,
      maxValue: this.maxHealth,
      borderWidth: 0,
      showBorder: false,
      hideBg: false,
      changeColorBasedOnPct: false,
    })
    this.healthText = this.scene.add
      .text(this.sprite.x, this.healthbar.y + 35, `${this.currHealth}`, {
        fontSize: '20px',
        color: 'white',
      })
      .setOrigin(0.5, 1)
  }

  getMoveToExecute() {
    const keys = Object.keys(this.moveMapping)
    const randomKey = Phaser.Utils.Array.GetRandom(keys)
    return this.moveMapping[randomKey]
  }

  takeDamage(damage: number) {
    this.currHealth = Math.max(0, this.currHealth - damage)
    if (this.currHealth == 0) {
      this.scene.enemiesDefeated.push(this.enemyConfig)
      this.scene.tweens.add({
        delay: 1000,
        targets: [this.sprite],
        alpha: {
          from: 1,
          to: 0,
        },
        duration: 1000,
        onComplete: () => {
          this.healthbar.setVisible(false)
          this.healthText.setVisible(false)
        },
      })
    }
    this.healthbar.setCurrValue(this.currHealth)
    this.healthText.setText(`${this.currHealth}`)
    UINumber.createNumber(
      `-${damage}`,
      this.scene,
      this.sprite.x,
      this.sprite.y - this.sprite.displayHeight / 2,
      'white',
      '30px'
    )
  }

  destroy() {
    this.sprite.destroy()
    this.healthText.destroy()
    this.healthbar.destroy()
  }
}
