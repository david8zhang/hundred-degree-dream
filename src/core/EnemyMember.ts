import { Dream } from '~/scenes/Dream'
import { Move } from './moves/Move'
import { UIValueBar } from './UIValueBar'
import { UINumber } from './UINumber'
import { EnemyConfig } from '~/utils/EnemyConfigs'
import { Constants } from '~/utils/Constants'

export interface EnemyMemberConfig {
  position: {
    x: number
    y: number
  }
  enemyConfig: EnemyConfig
  id: string
  isBoss: boolean
}

export class EnemyMember {
  private scene: Dream
  public currHealth: number
  public maxHealth: number
  public sprite: Phaser.Physics.Arcade.Sprite
  public moveMapping: {
    [key: string]: Move
  }
  public healthbar: UIValueBar
  public healthText: Phaser.GameObjects.Text
  private enemyConfig: EnemyConfig
  public id: string = ''
  private isAlreadyDying: boolean = false
  public isBoss: boolean = false

  constructor(scene: Dream, config: EnemyMemberConfig) {
    this.scene = scene
    this.id = config.id
    this.enemyConfig = config.enemyConfig
    this.currHealth = config.enemyConfig.maxHealth
    this.maxHealth = config.enemyConfig.maxHealth
    this.isBoss = config.isBoss

    this.sprite = this.scene.physics.add
      .sprite(config.position.x, config.position.y, config.enemyConfig.spriteTexture)
      .setOrigin(0.5, 0.5)
      .setData('ref', this)

    this.moveMapping = this.scene.convertMoveNamesToMoves(config.enemyConfig.moveNames, this)

    const healthbarWidth = 75
    const xPos = this.isBoss ? Constants.WINDOW_WIDTH - 250 : this.sprite.x - healthbarWidth / 2

    this.healthbar = new UIValueBar(this.scene, {
      width: healthbarWidth,
      height: 10,
      x: xPos,
      y: this.sprite.y + this.sprite.displayHeight / 2 + 20,
      maxValue: this.maxHealth,
      borderWidth: 0,
      showBorder: false,
      hideBg: false,
      changeColorBasedOnPct: false,
      depth: this.sprite.depth + 1,
    })
    this.healthText = this.scene.add
      .text(xPos + healthbarWidth / 2, this.healthbar.y + 35, `${this.currHealth}`, {
        fontSize: '20px',
        color: this.isBoss ? 'white' : 'black',
      })
      .setOrigin(0.5, 1)

    if (this.isBoss) {
      const scaleX = config.enemyConfig.body ? config.enemyConfig.body.width : 1
      const scaleY = config.enemyConfig.body ? config.enemyConfig.body.height : 1
      this.sprite.body.setSize(
        this.sprite.displayWidth * scaleX,
        this.sprite.displayHeight * scaleY
      )
    }
  }

  setVisible(isVisible: boolean): void {
    this.sprite.setVisible(isVisible)
    this.healthbar.setVisible(isVisible)
    this.healthText.setVisible(isVisible)
  }

  updateHealthBarPosition() {
    const healthbarWidth = 75
    this.healthbar.x = this.sprite.x - healthbarWidth / 2
    this.healthbar.y = this.sprite.y + this.sprite.displayHeight / 2 + 20
    this.healthbar.draw()
    this.healthText.setPosition(this.sprite.x, this.healthbar.y + 35)
  }

  getMoveToExecute() {
    const keys = Object.keys(this.moveMapping)
    const randomKey = Phaser.Utils.Array.GetRandom(keys)
    return this.moveMapping[randomKey]
  }

  takeDamage(damage: number) {
    this.currHealth = Math.max(0, this.currHealth - damage)
    if (this.currHealth == 0 && !this.isAlreadyDying) {
      this.isAlreadyDying = true
      this.scene.enemiesDefeated.push(this.enemyConfig)
      this.scene.tweens.add({
        delay: 750,
        targets: [this.sprite],
        alpha: {
          from: 1,
          to: 0,
        },
        duration: 500,
        onComplete: () => {
          this.healthbar.setVisible(false)
          this.healthText.setVisible(false)
        },
      })
    }

    const xPos = this.isBoss ? Constants.BOSS_HIT_BOX.x : this.sprite.x
    const yPos = this.isBoss
      ? Constants.BOSS_HIT_BOX.y
      : this.sprite.y - this.sprite.displayHeight / 2

    this.healthbar.setCurrValue(this.currHealth)
    this.healthText.setText(`${this.currHealth}`)
    UINumber.createNumber(
      `-${damage}`,
      this.scene,
      xPos,
      yPos,
      this.isBoss ? 'white' : 'black',
      '30px'
    )
  }

  destroy() {
    this.sprite.destroy()
    this.healthText.destroy()
    this.healthbar.destroy()
  }
}
