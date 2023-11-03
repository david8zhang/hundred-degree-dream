import { Constants } from '~/utils/Constants'

export class Intro extends Phaser.Scene {
  private static INTRO_TEXT_LINES = [
    'Jambo was just an average guy doing average things, like walking around downtown looking at airplanes',
    "But one day he came down with a strange illness which doctors couldn't explain",
    'The sickness seemed to have no symptoms other than unusually high fever, which brought on bizarre, lucid dreams',
  ]

  private introText!: Phaser.GameObjects.Text
  private introRect!: Phaser.GameObjects.Rectangle
  private bgImage!: Phaser.GameObjects.Image
  private introTextIndex: number = 0
  private continueButtonText!: Phaser.GameObjects.Text

  constructor() {
    super('intro')
  }

  create() {
    this.bgImage = this.add
      .image(Constants.WINDOW_WIDTH / 2, Constants.WINDOW_HEIGHT / 2, 'intro-1')
      .setOrigin(0.5, 0.5)

    this.introText = this.add
      .text(30, Constants.WINDOW_HEIGHT - 125, Intro.INTRO_TEXT_LINES[this.introTextIndex], {
        fontSize: '25px',
        color: 'white',
      })
      .setOrigin(0, 0)
      .setWordWrapWidth(Constants.WINDOW_WIDTH - 30)
      .setDepth(1000)

    this.introRect = this.add
      .rectangle(
        Constants.WINDOW_WIDTH / 2,
        this.introText.y - 30,
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
        if (this.introTextIndex == 0) {
          this.bgImage.setTexture('intro-2')
        }
        if (this.introTextIndex === Intro.INTRO_TEXT_LINES.length - 1) {
          this.scene.start('tutorial')
        } else {
          this.introTextIndex++
          this.introText.setText(Intro.INTRO_TEXT_LINES[this.introTextIndex])
        }
      })
      .setDepth(1000)
  }
}
