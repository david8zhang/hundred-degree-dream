import { Tutorial } from '~/scenes/Tutorial'
import { TutorialScene } from './TutorialScene'

export class TutorialOverworld extends TutorialScene {
  public static TEXT_LINES = [
    "Jambo: Huh?!! Oh, I'm awake now.",
    'Jambo: So that really was a dream...ugh... my head feels hot.',
    "<Loud Speaker>: Guys, the patient's awake! <mumble, mumble>. Hello there, how are you feeling?",
    "Jambo: I feel like my head's on fire!",
    "<Loud Speaker>: Hmmm.. Thermal camera's picking up 200 F°",
    'Jambo: 200 DEGREES?!! How am I even alive?!',
    "<Loud Speaker>: Trust me, that's nothing.",
    "<Loud Speaker>: Your fever went to nearly 1000 degrees earlier, which is why we've put you in this state of the art fire-proof hospital room",
    'Jambo: A t-thousand?!',
    "<Loud Speaker>: That's right. Needless to say, you'll need to stay in quarantine until the doctors can figure out how to bring your fever down.",
    "<Loud Speaker>: In the meantime, get some rest. We've brought you a fire-proof TV too in case you get bored.",
    "Jambo: Hmm... Well aside from my head burning up I guess I feel fine. Let's see what's on TV",
  ]

  private tutorialTextIndex = 0

  constructor(scene: Tutorial) {
    super(scene)
  }

  public start(): void {
    this.tutorial.cameras.main.setBackgroundColor(0x000000)
    this.tutorial.player.setVisible(false)
    this.tutorial.cpu.setVisible(false)
    this.tutorial.tutorialText.setStyle({ color: 'white' })
    this.tutorial.continueButtonText.setStyle({ color: 'white' })

    this.tutorial.bgImage.setVisible(false)
    const tutorialTextLine = TutorialOverworld.TEXT_LINES[this.tutorialTextIndex]
    this.tutorial.tutorialText.setText(tutorialTextLine)
    this.tutorial.continueButtonText.setVisible(true)
  }

  onContinuePressed() {
    if (this.tutorialTextIndex === TutorialOverworld.TEXT_LINES.length - 1) {
      this.tutorial.scene.start('overworld')
    } else {
      this.tutorialTextIndex++
      const tutorialTextLine = TutorialOverworld.TEXT_LINES[this.tutorialTextIndex]
      this.tutorial.tutorialText.setText(tutorialTextLine)
      this.tutorial.continueButtonText.setVisible(true)
    }
  }

  public onMoveCompleted(): void {}
}
