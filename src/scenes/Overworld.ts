import Phaser from 'phaser'
import { Constants } from '~/utils/Constants'
import { Save, SaveKeys } from '~/utils/Save'

export default class Overworld extends Phaser.Scene {
  private goToSleepText!: Phaser.GameObjects.Text

  constructor() {
    super('overworld')
  }

  initializeSaveState() {
    if (Save.getData(SaveKeys.CURR_EXP) == undefined) {
      Save.setData(SaveKeys.CURR_EXP, 0)
      Save.setData(SaveKeys.CURR_LEVEL, 1)
    }
  }

  create() {
    this.initializeSaveState()
    this.goToSleepText = this.add
      .text(Constants.WINDOW_WIDTH / 2, Constants.WINDOW_HEIGHT / 2, 'Go to sleep!', {
        fontSize: '25px',
        color: 'white',
      })
      .setInteractive()
      .on(Phaser.Input.Events.POINTER_OVER, () => {
        this.goToSleepText.setStroke('yellow', 2)
        this.goToSleepText.setColor('yellow')
      })
      .on(Phaser.Input.Events.POINTER_OUT, () => {
        this.goToSleepText.setStroke('white', 0)
        this.goToSleepText.setColor('white')
      })
      .on(Phaser.Input.Events.POINTER_UP, () => {
        // this.scene.start('dungeon')
        this.scene.start('dream-end', {
          enemiesDefeated: [],
          wavesCompleted: 0,
        })
      })
    this.goToSleepText.setPosition(
      Constants.WINDOW_WIDTH / 2 - this.goToSleepText.displayWidth / 2,
      Constants.WINDOW_HEIGHT / 2
    )
  }
}
