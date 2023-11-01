import { Tutorial } from '~/scenes/Tutorial'
import { TutorialScene } from './TutorialScene'
import { Side } from '~/utils/Constants'

export class TutorialDefend extends TutorialScene {
  public static TUTORIAL_TEXT_LINES = [
    'Conch: Great! But here comes a few more of them!',
    `Conch: This might be a good time to hunker down and defend! Select the "Defend" tactic in the menu.`,
  ]
  public static TUTORIAL_DEFENSE_SUCCESS = ['Conch: OK, here they come!']
  private tutorialTextIndex = 0
  private currTextLines: string[] = []

  constructor(tutorial: Tutorial) {
    super(tutorial)
  }
  public start(): void {
    this.currTextLines = TutorialDefend.TUTORIAL_TEXT_LINES
    const tutorialTextLine = this.currTextLines[this.tutorialTextIndex]
    this.tutorial.tutorialText.setText(tutorialTextLine)
    this.tutorialTextIndex++
    this.tutorial.player.selectedActionIndex = 1

    this.tutorial.cpu.generateEnemies(3)
    this.tutorial.player.shouldHideFightOption = true
    this.tutorial.player.shouldHideTacticsOption = false
  }
  public onContinuePressed(): void {
    if (this.tutorialTextIndex == this.currTextLines.length) {
      this.tutorial.player.startTurn()
      this.tutorial.currTurn = Side.PLAYER
      this.tutorial.continueButtonText.setVisible(false)
    } else {
      const tutorialTextLine = this.currTextLines[this.tutorialTextIndex]
      this.tutorial.tutorialText.setText(tutorialTextLine)
      this.tutorialTextIndex++
    }
  }
  public onMoveCompleted(): void {
    if (this.tutorial.currTurn === Side.PLAYER) {
      const jambo = this.tutorial.player.party[0]
      if (jambo.isDefending) {
        this.currTextLines = TutorialDefend.TUTORIAL_DEFENSE_SUCCESS
        this.tutorialTextIndex = 0
        const tutorialTextLine = this.currTextLines[this.tutorialTextIndex]
        this.tutorial.tutorialText.setText(tutorialTextLine)
        this.tutorial.cpu.startTurn()
        this.tutorial.currTurn = Side.CPU
      }
    } else {
      const cpu = this.tutorial.cpu
      if (cpu.enemyToActIndex == cpu.livingEnemies.length - 1) {
        this.tutorial.goToNextScene()
      } else {
        cpu.enemyToActIndex++
        cpu.processEnemyAction()
      }
    }
  }
}
