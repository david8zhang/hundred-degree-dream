import { Tutorial } from '~/scenes/Tutorial'

export abstract class TutorialScene {
  protected tutorial: Tutorial
  constructor(tutorial: Tutorial) {
    this.tutorial = tutorial
  }

  public abstract start(): void
  public abstract onContinuePressed(): void
  public abstract onMoveCompleted(): void
}
