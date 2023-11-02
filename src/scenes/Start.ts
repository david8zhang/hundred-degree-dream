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
    this.cameras.main.setBackgroundColor(0xffffff)
    this.add
      .image(Constants.WINDOW_WIDTH / 2, Constants.WINDOW_HEIGHT / 2, 'background')
      .setAlpha(0.8)
    this.title = this.add
      .text(Constants.WINDOW_WIDTH / 2, Constants.WINDOW_HEIGHT / 3, 'Super Jambo', {
        fontSize: '30px',
        color: 'white',
        fontFamily: 'starborn',
      })
      .setOrigin(0.5, 0.5)
      .setStroke('black', 10)
    this.subtitle = this.add
      .text(Constants.WINDOW_WIDTH / 2, Constants.WINDOW_HEIGHT / 2, 'The Thousand-Degree Dream', {
        fontSize: '65px',
        color: 'white',
        fontFamily: Constants.FONT_TITLE,
      })
      .setOrigin(0.5, 0.5)
      .setStroke('black', 12)
      .setWordWrapWidth(950)
      .setAlign('center')

    this.newGameButton = new Button({
      scene: this,
      x: Constants.WINDOW_WIDTH / 2,
      y: Constants.WINDOW_HEIGHT / 2 + 200,
      width: 200,
      height: 40,
      text: 'New Game',
      backgroundColor: 0xffffff,
      fontFamily: 'starborn',
      textColor: 'black',
      fontSize: '20px',
      onClick: () => {
        this.createNewSave()
        this.scene.start('tutorial')
      },
    })
    if (Save.getData(SaveKeys.CURR_EXP) !== undefined) {
      this.continueButton = new Button({
        scene: this,
        x: Constants.WINDOW_WIDTH / 2,
        y: this.newGameButton.y + this.newGameButton.displayHeight + 15,
        width: 200,
        height: 40,
        text: 'Continue',
        backgroundColor: 0xffffff,
        fontFamily: 'starborn',
        textColor: 'black',
        fontSize: '20px',
        onClick: () => {
          this.scene.start('overworld')
        },
      })
    }
  }
}
