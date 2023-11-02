import { Button } from '~/core/Button'
import { Constants } from '~/utils/Constants'
import { Save, SaveKeys } from '~/utils/Save'

export class Start extends Phaser.Scene {
  private title!: Phaser.GameObjects.Text
  private subtitle!: Phaser.GameObjects.Text
  private newGameButton!: Button
  private continueButton: Button | null = null

  constructor() {
    super('start')
  }

  createNewSave() {
    Save.setData(SaveKeys.ACTIVE_ALLY, '')
    Save.setData(SaveKeys.CURR_PARTY, ['Jambo'])
    Save.setData(SaveKeys.CURR_EXP, 0)
    Save.setData(SaveKeys.CURR_LEVEL, 1)
    Save.setData(SaveKeys.FEVER_DEGREES, 100)
    Save.setData(SaveKeys.RECENTLY_WATCHED_CHANNEL, '')
  }

  create() {
    this.title = this.add
      .text(Constants.WINDOW_WIDTH / 2, Constants.WINDOW_HEIGHT / 3, 'Super Jambo', {
        fontSize: '40px',
        color: 'white',
      })
      .setOrigin(0.5, 0.5)
    this.subtitle = this.add
      .text(
        Constants.WINDOW_WIDTH / 2,
        this.title.y + this.title.displayHeight + 15,
        'The Thousand Degree Dream',
        {
          fontSize: '50px',
          color: 'white',
        }
      )
      .setOrigin(0.5, 0.5)

    this.newGameButton = new Button({
      scene: this,
      x: Constants.WINDOW_WIDTH / 2,
      y: Constants.WINDOW_HEIGHT / 2 + 100,
      width: 200,
      height: 40,
      text: 'New Game',
      backgroundColor: 0xffffff,
      textColor: 'black',
      fontSize: '25px',
      onClick: () => {
        this.createNewSave()
        this.scene.start('tutorial')
      },
    })
    if (Save.doesSaveExist()) {
      this.continueButton = new Button({
        scene: this,
        x: Constants.WINDOW_WIDTH / 2,
        y: this.newGameButton.y + this.newGameButton.displayHeight + 15,
        width: 200,
        height: 40,
        text: 'Continue',
        backgroundColor: 0xffffff,
        textColor: 'black',
        fontSize: '25px',
        onClick: () => {
          this.scene.start('overworld')
        },
      })
    }
  }
}
