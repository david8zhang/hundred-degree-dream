import { Tutorial } from '~/scenes/Tutorial'
import { TutorialScene } from './TutorialScene'
import { MoveNames } from '../moves/MoveNames'
import { Side } from '~/utils/Constants'

export class TutorialStomp extends TutorialScene {
  public static TUTORIAL_TEXT_LINES = [
    "Conch: Great! You managed to survive their attacks. Let's give them a taste of their own medicine now.",
    'Conch: There sure are a lot of them though. Good thing this is a dream where you can do anything!',
    'Conch: Try using the Stomp attack to hit all of them at once!',
    'Conch: Press "F" at just the right timing to do some extra damage!',
  ]

  public static STOMP_COMPLETE_LINES = [
    'Conch: Nice job! You can use the Arrow Keys to navigate menu options, and Escape to go back. Finish these guys off!',
  ]

  private currTextLines: string[] = []
  private tutorialTextIndex: number = 0
  private stompComplete: boolean = false

  constructor(scene: Tutorial) {
    super(scene)
  }

  public start(): void {
    this.tutorial.continueButtonText.setVisible(true)
    this.currTextLines = TutorialStomp.TUTORIAL_TEXT_LINES
    const tutorialText = this.currTextLines[this.tutorialTextIndex]
    this.tutorial.tutorialText.setText(tutorialText)

    this.tutorial.player.shouldHideTacticsOption = true
    this.tutorial.cpu.useNormalMoveCompleteBehavior = true

    const jambo = this.tutorial.player.party[0]
    jambo.moveMapping = this.tutorial.convertMoveNamesToMoves([MoveNames.STOMP], jambo)
  }

  public onContinuePressed(): void {
    if (this.tutorialTextIndex === this.currTextLines.length - 1) {
      if (this.stompComplete) {
        this.tutorial.player.startTurn()
        this.tutorial.currTurn = Side.PLAYER
      } else {
        this.tutorial.player.selectedActionIndex = 0
        this.tutorial.player.startTurn()
        this.tutorial.currTurn = Side.PLAYER
        this.tutorial.continueButtonText.setVisible(false)
      }
    } else {
      this.tutorialTextIndex++
      const tutorialText = this.currTextLines[this.tutorialTextIndex]
      this.tutorial.tutorialText.setText(tutorialText)
    }
  }

  public onMoveCompleted(): void {
    if (this.tutorial.currTurn === Side.PLAYER) {
      if (!this.stompComplete) {
        this.currTextLines = TutorialStomp.STOMP_COMPLETE_LINES
        this.tutorialTextIndex = 0
        const tutorialTextLine = this.currTextLines[this.tutorialTextIndex]
        this.tutorial.tutorialText.setText(tutorialTextLine)
        this.stompComplete = true

        this.tutorial.continueButtonText.setVisible(true)
        this.tutorial.player.dehighlightAction(1)
        this.tutorial.player.selectedActionIndex = 0
        this.tutorial.player.shouldHideFightOption = false
        this.tutorial.player.shouldHideTacticsOption = false
        this.tutorial.player.useNormalMoveCompleteBehavior = true
      } else {
        this.tutorial.player.onMoveCompleted()
      }
    } else {
      this.tutorial.cpu.onMoveCompleted()
    }
  }
}
