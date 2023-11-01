import { Tutorial } from '~/scenes/Tutorial'
import { TutorialScene } from './TutorialScene'
import { Side } from '~/utils/Constants'

export class TutorialIntro extends TutorialScene {
  public static TUTORIAL_TEXT_LINES = [
    'Jambo: Whoa...Where am I? Is this real?',
    "*DISEMBODIED VOICE*: Yes...and no. This is the Dream Realm, and I'm your subconscious. You can just call me Conch for short",
    "Conch: Long story short, you're trapped in here and you gotta defeat the Nightmare King to escape.",
    'Jambo: Nightmare King? Dream World?',
    "Conch: Yup. The Nightmare King rules this place, with his army of minions. They're creatures that take the form of things you see when you're awake",
    "Conch: Speaking of which, there's one of his minions now. Go and slug him in the face before he has a chance to fight back!",
  ]
  private tutorialIndex: number = 0

  constructor(tutorial: Tutorial) {
    super(tutorial)
  }

  start() {
    const tutorialText = TutorialIntro.TUTORIAL_TEXT_LINES[this.tutorialIndex]
    this.tutorial.player.shouldHideTacticsOption = true
    this.tutorial.tutorialText.setText(tutorialText)
  }

  onMoveCompleted() {
    this.tutorial.goToNextScene()
  }

  onContinuePressed() {
    if (this.tutorialIndex === TutorialIntro.TUTORIAL_TEXT_LINES.length - 2) {
      this.tutorial.cpu.generateEnemies(1)
    }
    if (this.tutorialIndex == TutorialIntro.TUTORIAL_TEXT_LINES.length - 1) {
      this.tutorial.player.startTurn()
      this.tutorial.currTurn = Side.PLAYER
    } else {
      this.tutorialIndex++
      const tutorialText = TutorialIntro.TUTORIAL_TEXT_LINES[this.tutorialIndex]
      this.tutorial.tutorialText.setText(tutorialText)
    }
  }
}
