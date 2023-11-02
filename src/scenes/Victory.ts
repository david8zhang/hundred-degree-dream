import { Constants } from '~/utils/Constants'
import { Save, SaveKeys } from '~/utils/Save'

export class Victory extends Phaser.Scene {
  private static VICTORY_LINES = [
    'With one final push, Jambo and his companions defeated the Nightmare King!',
    "Now freed from the Nightmare's grasp, Jambo rapidly recovered from his fever and was discharged later that day",
  ]

  private victoryText!: Phaser.GameObjects.Text
  private victoryRect!: Phaser.GameObjects.Rectangle
  private thanksForPlayingText!: Phaser.GameObjects.Text

  private victoryLineIndex: number = 0
  private continueButtonText!: Phaser.GameObjects.Text
  private showingThanksMessage: boolean = false

  constructor() {
    super('victory')
  }

  create() {
    this.cameras.main.setBackgroundColor(0xffffff)

    this.thanksForPlayingText = this.add
      .text(Constants.WINDOW_WIDTH / 2, Constants.WINDOW_HEIGHT / 3, 'Thanks for playing!', {
        fontSize: '40px',
        color: 'white',
      })
      .setOrigin(0.5, 0.5)
      .setVisible(false)

    this.victoryText = this.add
      .text(30, Constants.WINDOW_HEIGHT - 125, Victory.VICTORY_LINES[this.victoryLineIndex], {
        fontSize: '25px',
        color: 'white',
      })
      .setOrigin(0, 0)
      .setWordWrapWidth(Constants.WINDOW_WIDTH - 30)
      .setDepth(1000)

    this.victoryRect = this.add
      .rectangle(
        Constants.WINDOW_WIDTH / 2,
        this.victoryText.y - 30,
        Constants.WINDOW_WIDTH,
        300,
        0x000000
      )
      .setAlpha(0.5)
      .setOrigin(0.5, 0)
      .setDepth(900)

    this.continueButtonText = this.add
      .text(Constants.WINDOW_WIDTH - 30, Constants.WINDOW_HEIGHT - 15, 'Continue', {
        fontSize: '25px',
        color: 'white',
      })
      .setOrigin(1, 1)
      .setStroke('white', 1)
      .setInteractive({ cursor: 'pointer' })
      .on(Phaser.Input.Events.POINTER_UP, () => {
        if (this.showingThanksMessage) {
          this.showingThanksMessage = false
          Save.clearSave()
          this.scene.start('start')
        } else {
          if (this.victoryLineIndex === Victory.VICTORY_LINES.length - 1) {
            this.showingThanksMessage = true
            this.victoryLineIndex = 0
            this.cameras.main.setBackgroundColor(0x000000)
            this.victoryText.setVisible(false)
            this.victoryRect.setVisible(false)
            this.thanksForPlayingText.setVisible(true)
            this.continueButtonText.setText('Play Again')
          } else {
            this.victoryLineIndex++
            this.victoryText.setText(Victory.VICTORY_LINES[this.victoryLineIndex])
          }
        }
      })
      .setDepth(1000)
  }
}
