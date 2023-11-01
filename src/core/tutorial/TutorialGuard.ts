import { Tutorial } from '~/scenes/Tutorial'
import { TutorialScene } from './TutorialScene'
import { Side } from '~/utils/Constants'

export class TutorialGuard extends TutorialScene {
  public static TUTORIAL_TEXT_LINES = [
    'Conch: Nicely done! But watch out, here come somes another one!',
    `Conch: This one looks a bit more aggressive! Press the R key right before it attacks to guard!`,
  ]

  public static TUTORIAL_TEXT_FAILURE = [
    'Conch: Not quite! Try guarding again.',
    'Conch: Remember to press "R" right after the enemy charges forward to attack',
  ]

  public static TUTORIAL_TEXT_SUCCESS = ['Conch: Nicely done! Now give him a good wallop.']

  private guardSuccess: boolean = false
  private currTextLines = TutorialGuard.TUTORIAL_TEXT_LINES
  private tutorialTextIndex: number = 0

  constructor(tutorial: Tutorial) {
    super(tutorial)
  }

  public start(): void {
    this.currTextLines = TutorialGuard.TUTORIAL_TEXT_LINES
    const tutorialTextLine = TutorialGuard.TUTORIAL_TEXT_LINES[0]
    this.tutorial.player.shouldHideTacticsOption = true
    this.tutorial.tutorialText.setText(tutorialTextLine)
    this.tutorial.cpu.generateEnemies(1)
  }

  public onContinuePressed(): void {
    if (this.guardSuccess) {
      this.tutorial.player.startTurn()
      this.tutorial.currTurn = Side.PLAYER
    } else {
      if (this.tutorialTextIndex == this.currTextLines.length - 1) {
        this.tutorial.cpu.startTurn()
        this.tutorial.currTurn = Side.CPU
        this.tutorial.continueButtonText.setVisible(false)
      } else {
        this.tutorialTextIndex++
        const tutorialTextLine = this.currTextLines[this.tutorialTextIndex]
        this.tutorial.tutorialText.setText(tutorialTextLine)
      }
    }
  }

  public onMoveCompleted(): void {
    if (this.tutorial.currTurn === Side.CPU) {
      const jambo = this.tutorial.player.party[0]
      if (jambo.currHealth < jambo.maxHealth) {
        // Failed to guard, try again
        this.currTextLines = TutorialGuard.TUTORIAL_TEXT_FAILURE
        jambo.heal(jambo.maxHealth)
      } else {
        this.guardSuccess = true
        this.currTextLines = TutorialGuard.TUTORIAL_TEXT_SUCCESS
      }
      this.tutorialTextIndex = 0
      const tutorialTextLine = this.currTextLines[this.tutorialTextIndex]
      this.tutorial.tutorialText.setText(tutorialTextLine)
      this.tutorial.continueButtonText.setVisible(true)
    } else {
      this.tutorial.goToNextScene()
    }
  }
}
