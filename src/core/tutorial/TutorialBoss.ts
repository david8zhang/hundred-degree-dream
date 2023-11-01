import { Tutorial } from '~/scenes/Tutorial'
import { TutorialScene } from './TutorialScene'
import { NIGHTMARE_KING_HEAD } from '~/utils/EnemyConfigs'
import { Constants, Side } from '~/utils/Constants'

export class TutorialBoss extends TutorialScene {
  private static TUTORIAL_TEXT = [
    "Conch: What the...What's happening?",
    "Conch: Wait...it's him! The Nightmare King is here!",
    'Nightmare King: Bahahaha! You will never escape this nightmare realm!',
  ]

  private static POST_FEVER_INCREASE_TEXT = ['Nightmare King: Now...Feel my power!']

  private tutorialTextIndex = 0
  private currTextLines: string[] = []

  private didFeverIncrease: boolean = false
  private feverBg!: Phaser.GameObjects.Rectangle
  private feverText!: Phaser.GameObjects.Text
  private feverValue!: Phaser.GameObjects.Text

  constructor(tutorial: Tutorial) {
    super(tutorial)
  }

  public start(): void {
    this.tutorial.player.toggleDarkTheme(true)
    this.feverBg = this.tutorial.add
      .rectangle(
        Constants.WINDOW_WIDTH / 2,
        Constants.WINDOW_HEIGHT / 2,
        Constants.WINDOW_WIDTH,
        Constants.WINDOW_HEIGHT,
        0x000000
      )
      .setAlpha(0)
      .setOrigin(0.5, 0.5)
      .setVisible(false)
      .setDepth(this.tutorial.bgImage.depth + 1)
    this.feverText = this.tutorial.add
      .text(Constants.WINDOW_WIDTH / 2, Constants.WINDOW_HEIGHT / 3, 'Fever Temp.', {
        fontSize: '30px',
        color: 'white',
      })
      .setOrigin(0.5, 0.5)
      .setVisible(false)
      .setDepth(this.feverBg.depth + 1)
    this.feverValue = this.tutorial.add
      .text(Constants.WINDOW_WIDTH / 2, Constants.WINDOW_HEIGHT / 2, '', {
        fontSize: '75px',
        color: 'white',
      })
      .setOrigin(0.5, 0.5)
      .setVisible(false)
      .setDepth(this.feverBg.depth + 1)

    this.tutorial.bgImage.setTexture('nightmare-bg')
    this.currTextLines = TutorialBoss.TUTORIAL_TEXT
    const tutorialText = this.currTextLines[this.tutorialTextIndex]
    this.tutorial.tutorialText.setText(tutorialText)
    this.tutorial.tutorialText.setStyle({ color: 'white' })
    this.tutorial.continueButtonText.setStyle({ color: 'white' })
  }

  displayFeverDegreeProgression() {
    let currFeverDegrees = 100
    this.feverText.setVisible(true)
    this.feverValue.setText(`${currFeverDegrees}°`).setVisible(true)
    this.tutorial.time.addEvent({
      repeat: 89,
      delay: 10,
      callback: () => {
        currFeverDegrees += 10
        this.feverValue.setText(`${currFeverDegrees}°`)
      },
    })
    this.tutorial.time.delayedCall(1600, () => {
      if (currFeverDegrees === 1000) {
        this.tutorial.add.tween({
          targets: [this.feverValue],
          scale: {
            from: 1,
            to: 1.5,
          },
          duration: 500,
          repeat: 2,
          yoyo: true,
          ease: Phaser.Math.Easing.Sine.InOut,
          onUpdate: () => {
            this.feverValue
              .setPosition(Constants.WINDOW_WIDTH / 2, Constants.WINDOW_HEIGHT / 2)
              .setOrigin(0.5, 0.5)
          },
          onComplete: () => {
            this.tutorial.tweens.add({
              targets: [this.feverBg, this.feverText, this.feverValue],
              alpha: {
                from: 0.5,
                to: 0,
              },
              duration: 500,
              onComplete: () => {
                this.feverText.setVisible(false)
                this.feverValue.setVisible(false)
                this.feverBg.setVisible(false)
                this.didFeverIncrease = true
                this.currTextLines = TutorialBoss.POST_FEVER_INCREASE_TEXT
                this.tutorialTextIndex = 0
                const tutorialText = this.currTextLines[this.tutorialTextIndex]
                this.tutorial.tutorialText.setText(tutorialText)
                this.tutorial.continueButtonText.setVisible(true)
              },
            })
          },
        })
      }
    })
  }

  public increaseFeverDegrees() {
    let currFeverValue = 100
    this.feverValue.setText(`${currFeverValue}°`)
    this.tutorial.tweens.add({
      targets: [this.feverBg],
      alpha: {
        from: 0,
        to: 0.5,
      },
      onStart: () => {
        this.feverBg.setVisible(true)
      },
      onComplete: () => {
        this.displayFeverDegreeProgression()
      },
    })
  }

  public onMoveCompleted(): void {
    if (this.tutorial.currTurn === Side.PLAYER) {
      this.tutorial.player.onMoveCompleted()
    } else {
      this.tutorial.cpu.onMoveCompleted()
    }
  }

  public onContinuePressed(): void {
    if (this.didFeverIncrease) {
      this.tutorial.continueButtonText.setVisible(false)
      this.tutorial.startTurn(Side.CPU)
      this.tutorial.cpu.useNormalMoveCompleteBehavior = true
      this.tutorial.player.useNormalMoveCompleteBehavior = true
    } else {
      if (this.tutorialTextIndex == this.currTextLines.length - 1) {
        this.tutorial.continueButtonText.setVisible(false)
        this.increaseFeverDegrees()
      } else {
        this.tutorialTextIndex++
        if (this.tutorialTextIndex == 1) {
          this.tutorial.cpu.generateNightmareKing(NIGHTMARE_KING_HEAD)
        }
        const tutorialTextLine = this.currTextLines[this.tutorialTextIndex]
        this.tutorial.tutorialText.setText(tutorialTextLine)
      }
    }
  }
}
