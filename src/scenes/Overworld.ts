import Phaser from 'phaser'
import { Constants, TVChannels } from '~/utils/Constants'
import { Save, SaveKeys } from '~/utils/Save'

export enum OverworldState {
  CHOOSING_ACTIVITY = 'CHOOSING_ACTIVITY',
  WATCHING_TV = 'WATCHING_TV',
  FALLING_ASLEEP = 'FALLING_ASLEEP',
  RECRUIT_ALLY = 'RECRUIT_ALLY',
}

export default class Overworld extends Phaser.Scene {
  private overworldState!: OverworldState
  private goToSleepText!: Phaser.GameObjects.Text
  private watchTVText!: Phaser.GameObjects.Text
  private tvChannelText!: Phaser.GameObjects.Text
  private tvChannelRect!: Phaser.GameObjects.Rectangle
  private continueText!: Phaser.GameObjects.Text
  private tvChannelSelected!: TVChannels

  private recruitAllyText!: Phaser.GameObjects.Text
  private allySprite!: Phaser.GameObjects.Sprite
  private bgImage!: Phaser.GameObjects.Image

  constructor() {
    super('overworld')
  }

  handleRecruitAlly() {
    const currParty = Save.getData(SaveKeys.CURR_PARTY) as string[]
    if (this.tvChannelSelected == TVChannels.SPORTS && !currParty.includes('Athlete')) {
      this.saveAllyRecruitment('Athlete', currParty)
      this.displayNewAllyRecruitAnimation('Athlete')
    } else if (this.tvChannelSelected == TVChannels.COOKING && !currParty.includes('Chef')) {
      this.saveAllyRecruitment('Chef', currParty)
      this.displayNewAllyRecruitAnimation('Chef')
    } else if (this.tvChannelSelected == TVChannels.NATURE && !currParty.includes('Tiger')) {
      this.saveAllyRecruitment('Tiger', currParty)
      this.displayNewAllyRecruitAnimation('Tiger')
    } else {
      this.overworldState = OverworldState.CHOOSING_ACTIVITY
      this.scene.start('dream')
    }
  }

  saveAllyRecruitment(allyName: string, prevParty: string[]) {
    Save.setData(SaveKeys.ACTIVE_ALLY, allyName)
    const newParty = prevParty.concat(allyName)
    Save.setData(SaveKeys.CURR_PARTY, newParty)
  }

  displayNewAllyRecruitAnimation(allyName: string) {
    this.bgImage.setVisible(false)
    this.continueText.setVisible(false)
    this.recruitAllyText.setText(`${allyName} has joined your party!`).setVisible(true).setAlpha(1)
    this.tweens.add({
      targets: [this.recruitAllyText],
      alpha: {
        from: 0,
        to: 1,
      },
      duration: 500,
    })
    this.allySprite
      .setTexture(allyName.toLowerCase())
      .setPosition(-50, Constants.WINDOW_HEIGHT * (2 / 3))
      .setVisible(true)
    this.add.tween({
      targets: [this.allySprite],
      x: {
        from: -50,
        to: Constants.WINDOW_WIDTH / 2,
      },
      duration: 1000,
      onComplete: () => {
        this.add.tween({
          targets: [this.allySprite],
          delay: 2000,
          x: {
            from: Constants.WINDOW_WIDTH / 2,
            to: Constants.WINDOW_WIDTH + 50,
          },
          duration: 1000,
          onComplete: () => {
            this.continueText.setVisible(true)
          },
        })
      },
    })
  }

  displayTVChannelInfo() {
    this.overworldState = OverworldState.WATCHING_TV
    this.tvChannelSelected = Phaser.Utils.Array.GetRandom(Object.keys(TVChannels))
    Save.setData(SaveKeys.RECENTLY_WATCHED_CHANNEL, this.tvChannelSelected)
    let channelText = ''
    switch (this.tvChannelSelected) {
      case TVChannels.SPORTS: {
        channelText = Phaser.Utils.Array.GetRandom(Constants.SPORTS_CHANNEL_TEXT)
        this.bgImage.setTexture('sports-channel')
        break
      }
      case TVChannels.COOKING: {
        channelText = Phaser.Utils.Array.GetRandom(Constants.COOKING_CHANNEL_TEXT)
        this.bgImage.setTexture('cooking-channel')
        break
      }
      case TVChannels.NATURE: {
        channelText = Phaser.Utils.Array.GetRandom(Constants.NATURE_CHANEL_TEXT)
        this.bgImage.setTexture('nature-channel')
        break
      }
    }
    this.goToSleepText.setVisible(false)
    this.watchTVText.setVisible(false)
    this.tvChannelText.setText(channelText).setVisible(true)
    this.tvChannelRect
      .setDisplaySize(Constants.WINDOW_WIDTH, Constants.WINDOW_HEIGHT * 0.28)
      .setPosition(Constants.WINDOW_WIDTH / 2, Constants.WINDOW_HEIGHT - 110)
      .setVisible(true)
    this.continueText.setVisible(true)
  }

  displayFallingAsleepText() {
    this.overworldState = OverworldState.FALLING_ASLEEP
    this.tvChannelText.setText(Constants.FALLING_ASLEEP_TEXT)
  }

  create() {
    this.bgImage = this.add
      .image(Constants.WINDOW_WIDTH / 2, Constants.WINDOW_HEIGHT / 2, 'overworld')
      .setOrigin(0.5, 0.5)
    this.cameras.main.setBackgroundColor(0x000000)
    this.overworldState = OverworldState.CHOOSING_ACTIVITY
    this.goToSleepText = this.add
      .text(Constants.WINDOW_WIDTH / 2, Constants.WINDOW_HEIGHT / 3, 'Go to sleep', {
        fontSize: '25px',
        color: 'black',
      })
      .setInteractive({ cursor: 'pointer ' })
      .on(Phaser.Input.Events.POINTER_OVER, () => {
        this.goToSleepText.setStroke('green', 2)
        this.goToSleepText.setColor('green')
      })
      .on(Phaser.Input.Events.POINTER_OUT, () => {
        this.goToSleepText.setStroke('black', 0)
        this.goToSleepText.setColor('black')
      })
      .on(Phaser.Input.Events.POINTER_UP, () => {
        this.scene.start('dream')
      })
      .setOrigin(0.5, 1)

    this.watchTVText = this.add
      .text(
        Constants.WINDOW_WIDTH / 2,
        this.goToSleepText.y + this.goToSleepText.displayHeight + 15,
        'Watch TV',
        {
          fontSize: '25px',
          color: 'black',
        }
      )
      .setInteractive({ cursor: 'pointer ' })
      .on(Phaser.Input.Events.POINTER_OVER, () => {
        this.watchTVText.setStroke('green', 2)
        this.watchTVText.setColor('green')
      })
      .on(Phaser.Input.Events.POINTER_OUT, () => {
        this.watchTVText.setStroke('black', 0)
        this.watchTVText.setColor('black')
      })
      .on(Phaser.Input.Events.POINTER_UP, () => {
        this.displayTVChannelInfo()
      })
      .setOrigin(0.5, 1)

    // TV Channel text
    this.tvChannelText = this.add
      .text(30, Constants.WINDOW_HEIGHT - 200, '', {
        fontSize: '30px',
        color: 'white',
      })
      .setOrigin(0, 0)
      .setWordWrapWidth(Constants.WINDOW_WIDTH - 30)
      .setVisible(false)
      .setDepth(1000)

    this.tvChannelRect = this.add
      .rectangle(
        Constants.WINDOW_WIDTH / 2,
        this.tvChannelText.y,
        Constants.WINDOW_WIDTH,
        300,
        0x000000
      )
      .setAlpha(0.5)
      .setOrigin(0.5, 0.5)
      .setVisible(false)
      .setDepth(900)

    this.continueText = this.add
      .text(Constants.WINDOW_WIDTH - 30, Constants.WINDOW_HEIGHT - 15, 'Continue', {
        fontSize: '25px',
        color: 'white',
      })
      .setOrigin(1, 1)
      .setStroke('white', 1)
      .setInteractive({ cursor: 'pointer' })
      .on(Phaser.Input.Events.POINTER_OVER, () => {
        this.watchTVText.setStroke('yellow', 2)
        this.watchTVText.setColor('yellow')
      })
      .on(Phaser.Input.Events.POINTER_OUT, () => {
        this.watchTVText.setStroke('black', 0)
        this.watchTVText.setColor('black')
      })
      .on(Phaser.Input.Events.POINTER_UP, () => {
        if (this.overworldState == OverworldState.WATCHING_TV) {
          this.displayFallingAsleepText()
        } else if (this.overworldState === OverworldState.FALLING_ASLEEP) {
          this.tvChannelText.setVisible(false)
          this.overworldState = OverworldState.RECRUIT_ALLY
          this.handleRecruitAlly()
        } else if (this.overworldState === OverworldState.RECRUIT_ALLY) {
          this.overworldState = OverworldState.CHOOSING_ACTIVITY
          this.scene.start('dream')
        }
      })
      .setDepth(1000)
      .setVisible(false)

    // Recruit new ally text
    this.recruitAllyText = this.add
      .text(Constants.WINDOW_WIDTH / 2, Constants.WINDOW_HEIGHT / 3, '', {
        fontSize: '30px',
        color: 'white',
      })
      .setVisible(false)
      .setOrigin(0.5, 1)
    this.allySprite = this.add.sprite(0, 0, '').setVisible(false)
  }
}
