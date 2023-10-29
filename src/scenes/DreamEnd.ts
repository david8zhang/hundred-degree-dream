import { Button } from '~/core/Button'
import { UIValueBar } from '~/core/UIValueBar'
import { Constants } from '~/utils/Constants'
import { EnemyConfig } from '~/utils/EnemyConfigs'

export interface DreamEndPayload {
  enemiesDefeated: EnemyConfig[]
  wavesCompleted: number
}

export class DreamEnd extends Phaser.Scene {
  private titleText!: Phaser.GameObjects.Text
  private expEarnedText!: Phaser.GameObjects.Text
  private expEarnedValue!: Phaser.GameObjects.Text
  private wavesCompletedText!: Phaser.GameObjects.Text
  private wavesCompletedValue!: Phaser.GameObjects.Text
  private totalExpText!: Phaser.GameObjects.Text
  private expBar!: UIValueBar
  private continueButton!: Button
  private hasInitializedText: boolean = false

  constructor() {
    super('dream-end')
  }

  initializeText() {
    this.titleText = this.add
      .text(Constants.WINDOW_WIDTH / 2, Constants.WINDOW_HEIGHT * 0.25, 'You woke up!', {
        fontSize: '40px',
        color: 'white',
      })
      .setOrigin(0.5, 1)
    this.expEarnedText = this.add
      .text(30, this.titleText.y + this.titleText.displayHeight + 30, 'EXP Earned', {
        fontSize: '25px',
        color: 'white',
      })
      .setOrigin(0, 0.5)
    this.expEarnedValue = this.add
      .text(Constants.WINDOW_WIDTH - 30, this.expEarnedText.y, '', {
        fontSize: '25px',
        color: 'white',
      })
      .setOrigin(1, 0.5)

    this.wavesCompletedText = this.add
      .text(30, this.expEarnedText.y + this.expEarnedText.displayHeight + 30, 'Waves Completed', {
        fontSize: '25px',
        color: 'white',
      })
      .setOrigin(0, 0.5)
    this.wavesCompletedValue = this.add
      .text(Constants.WINDOW_WIDTH - 30, this.wavesCompletedText.y, '', {
        fontSize: '25px',
        color: 'white',
      })
      .setOrigin(1, 0.5)
  }

  init(data: DreamEndPayload) {
    if (!this.hasInitializedText) {
      this.initializeText()
      this.hasInitializedText = true
    }
    const totalEXPEarned = data.enemiesDefeated.reduce((acc, curr) => {
      return acc + curr.baseExpReward
    }, 0)
    this.expEarnedValue.setText(`${totalEXPEarned}`)
    this.wavesCompletedValue.setText(`${data.wavesCompleted}`)
  }

  create() {
    this.continueButton = new Button({
      scene: this,
      width: 175,
      height: 45,
      text: 'Continue',
      onClick: () => {
        this.scene.start('overworld')
      },
      strokeWidth: 0,
      fontSize: '20px',
      backgroundColor: 0xffffff,
      x: Constants.WINDOW_WIDTH / 2,
      y: this.wavesCompletedText.y + this.wavesCompletedText.displayHeight + 40,
    })
  }
}
