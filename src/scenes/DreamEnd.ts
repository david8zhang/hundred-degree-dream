import { Button } from '~/core/Button'
import { UIValueBar } from '~/core/UIValueBar'
import { Constants } from '~/utils/Constants'
import { EnemyConfig } from '~/utils/EnemyConfigs'
import { Save, SaveKeys } from '~/utils/Save'

export interface DreamEndPayload {
  enemiesDefeated: EnemyConfig[]
  wavesCompleted: number
}

export enum DreamEndState {
  STATS = 'STATS',
  EXP_GAIN = 'EXP_GAIN',
  SHOW_FEVER_DEGREES = 'SHOW_FEVER_DEGREES',
}

export class DreamEnd extends Phaser.Scene {
  private titleText!: Phaser.GameObjects.Text
  private expEarnedText!: Phaser.GameObjects.Text
  private expEarnedValue!: Phaser.GameObjects.Text
  private wavesCompletedText!: Phaser.GameObjects.Text
  private wavesCompletedValue!: Phaser.GameObjects.Text

  // EXP stats
  private expBar!: UIValueBar
  private currLevelText!: Phaser.GameObjects.Text
  private nextLevelText!: Phaser.GameObjects.Text

  private continueButton!: Button
  private currState = DreamEndState.STATS
  private totalExpGained: number = 0

  // Countdown until nightmare king
  private feverDegreeText!: Phaser.GameObjects.Text
  private feverDegreeValue!: Phaser.GameObjects.Text

  constructor() {
    super('dream-end')
  }

  initializeText() {
    this.titleText = this.add
      .text(Constants.WINDOW_WIDTH / 2, Constants.WINDOW_HEIGHT * 0.25, 'You woke up!', {
        fontSize: '40px',
        color: 'white',
      })
      .setOrigin(0.5, 1)
    this.expEarnedText = this.add
      .text(30, this.titleText.y + this.titleText.displayHeight + 30, 'EXP Earned', {
        fontSize: '25px',
        color: 'white',
      })
      .setOrigin(0, 0.5)
    this.expEarnedValue = this.add
      .text(Constants.WINDOW_WIDTH - 30, this.expEarnedText.y, '', {
        fontSize: '25px',
        color: 'white',
      })
      .setOrigin(1, 0.5)

    this.wavesCompletedText = this.add
      .text(30, this.expEarnedText.y + this.expEarnedText.displayHeight + 30, 'Waves Completed', {
        fontSize: '25px',
        color: 'white',
      })
      .setOrigin(0, 0.5)
    this.wavesCompletedValue = this.add
      .text(Constants.WINDOW_WIDTH - 30, this.wavesCompletedText.y, '', {
        fontSize: '25px',
        color: 'white',
      })
      .setOrigin(1, 0.5)
    this.expBar = new UIValueBar(this, {
      width: 400,
      height: 30,
      x: Constants.WINDOW_WIDTH / 2 - 200,
      y: Constants.WINDOW_HEIGHT / 2 - 15,
      maxValue: 100,
      showBorder: true,
      borderWidth: 1,
      bgColor: 0x666666,
      changeColorBasedOnPct: false,
      hideBg: false,
    })
    this.expBar.setVisible(false)
    this.currLevelText = this.add
      .text(Constants.WINDOW_WIDTH / 2 - this.expBar.width / 2 - 30, this.expBar.y + 15, '', {
        fontSize: '25px',
        color: 'white',
      })
      .setOrigin(1, 0.5)
    this.nextLevelText = this.add
      .text(Constants.WINDOW_WIDTH / 2 + this.expBar.width / 2 + 30, this.expBar.y + 15, '', {
        fontSize: '25px',
        color: 'white',
      })
      .setOrigin(0, 0.5)
    this.feverDegreeText = this.add
      .text(Constants.WINDOW_WIDTH / 2, Constants.WINDOW_HEIGHT / 3, 'Fever Temp.', {
        fontSize: '30px',
        color: 'white',
      })
      .setOrigin(0.5, 1)
      .setVisible(false)
    this.feverDegreeValue = this.add
      .text(Constants.WINDOW_WIDTH / 2, Constants.WINDOW_HEIGHT / 2, '', {
        fontSize: '75px',
        color: 'white',
      })
      .setOrigin(0.5, 0.5)
      .setVisible(false)
  }

  init(data: DreamEndPayload) {
    this.initializeText()
    this.totalExpGained = data.enemiesDefeated.reduce((acc, curr) => {
      return acc + curr.baseExpReward
    }, 0)
    this.expEarnedValue.setText(`${this.totalExpGained}`)
    this.wavesCompletedValue.setText(`${data.wavesCompleted}`)
  }

  hideEndOfRoundStats() {
    this.wavesCompletedText.setVisible(false)
    this.wavesCompletedValue.setVisible(false)
    this.titleText.setVisible(false)
    this.expEarnedText.setVisible(false)
    this.expEarnedValue.setVisible(false)
  }

  displayExpGainStats() {
    this.currState = DreamEndState.EXP_GAIN
    const currExpLevel = Save.getData(SaveKeys.CURR_EXP)
    let currLevel = Save.getData(SaveKeys.CURR_LEVEL)
    this.continueButton.setVisible(false)

    this.expBar.setCurrValue(currExpLevel)
    this.expBar.setVisible(true)
    this.currLevelText.setText(`Lv. ${currLevel}`).setVisible(true)
    this.nextLevelText.setText(`Lv. ${currLevel + 1}`).setVisible(true)
    const didLevelUp = currExpLevel + this.totalExpGained > 100
    const newLevel = currLevel + Math.floor((currExpLevel + this.totalExpGained) / 100)

    const expGainPerInc = 1
    const numRepeats = this.totalExpGained / expGainPerInc
    this.time.addEvent({
      delay: 25,
      repeat: numRepeats - 1,
      callback: () => {
        this.expBar.setCurrValue(this.expBar.currValue + expGainPerInc)
        if (this.expBar.currValue >= 100) {
          currLevel++
          this.expBar.currValue = this.expBar.currValue - 100
          this.currLevelText.setText(`Lv. ${currLevel}`)
          this.nextLevelText.setText(`Lv. ${currLevel + 1}`)
        }
      },
    })
    if (didLevelUp) {
      this.time.addEvent({
        delay: numRepeats * 25 + 1000,
        callback: () => {
          this.expBar.setVisible(false)
          this.currLevelText.setVisible(false)
          this.nextLevelText.setVisible(false)
          const levelUpText = this.add
            .text(Constants.WINDOW_WIDTH / 2, Constants.WINDOW_HEIGHT / 2, 'Level Up!', {
              fontSize: '40px',
              color: 'white',
            })
            .setOrigin(0.5, 1)
            .setAlpha(0)
          const newLevelText = this.add
            .text(
              Constants.WINDOW_WIDTH / 2,
              levelUpText.y + levelUpText.displayHeight + 30,
              `Lv. ${newLevel}`,
              {
                fontSize: '50px',
                color: 'white',
              }
            )
            .setOrigin(0.5, 1)
            .setAlpha(0)
          this.tweens.add({
            targets: [levelUpText, newLevelText],
            alpha: {
              from: 0,
              to: 1,
            },
            duration: 500,
            onComplete: () => {
              this.tweens.add({
                targets: [levelUpText, newLevelText],
                delay: 1000,
                duration: 500,
                y: '-=150',
                ease: Phaser.Math.Easing.Sine.InOut,
                onComplete: () => {
                  const healthBonusText = this.add
                    .text(
                      Constants.WINDOW_WIDTH / 3,
                      newLevelText.y + newLevelText.displayHeight + 20,
                      'Health',
                      {
                        fontSize: '30px',
                        color: 'white',
                      }
                    )
                    .setOrigin(0, 0.5)
                  this.add
                    .text(Constants.WINDOW_WIDTH * (2 / 3), healthBonusText.y, '+5', {
                      fontSize: '30px',
                      color: 'white',
                    })
                    .setOrigin(1, 0.5)

                  const damageBonusText = this.add
                    .text(
                      Constants.WINDOW_WIDTH / 3,
                      healthBonusText.y + healthBonusText.displayHeight + 20,
                      'Damage',
                      {
                        fontSize: '30px',
                        color: 'white',
                      }
                    )
                    .setOrigin(0, 0.5)
                  this.add
                    .text(Constants.WINDOW_WIDTH * (2 / 3), damageBonusText.y, '+25%', {
                      fontSize: '30px',
                      color: 'white',
                    })
                    .setOrigin(1, 0.5)
                  this.applyExpGain(newLevel)
                  this.continueButton.setVisible(true)
                },
              })
            },
          })
        },
      })
    } else {
      this.time.delayedCall(25 * numRepeats, () => {
        this.applyExpGain(currLevel)
        this.continueButton.setVisible(true)
      })
    }
  }

  displayFeverDegreeProgression() {
    this.feverDegreeValue.setVisible(true)
    this.feverDegreeText.setVisible(true)
    this.continueButton.setVisible(false)
    let currFeverDegrees = Save.getData(SaveKeys.FEVER_DEGREES) as number
    this.feverDegreeValue.setText(`${currFeverDegrees}°`)
    this.time.addEvent({
      repeat: 99,
      delay: 20,
      callback: () => {
        currFeverDegrees++
        this.feverDegreeValue.setText(`${currFeverDegrees}°`)
      },
    })

    this.time.delayedCall(2000, () => {
      Save.setData(SaveKeys.FEVER_DEGREES, currFeverDegrees)

      if (currFeverDegrees === 1000) {
        this.add.tween({
          targets: [this.feverDegreeValue],
          scale: {
            from: 1,
            to: 1.5,
          },
          duration: 500,
          repeat: 2,
          yoyo: true,
          ease: Phaser.Math.Easing.Sine.InOut,
          onUpdate: () => {
            this.feverDegreeValue
              .setPosition(Constants.WINDOW_WIDTH / 2, Constants.WINDOW_HEIGHT / 2)
              .setOrigin(0.5, 0.5)
          },
          onComplete: () => {
            this.continueButton.setVisible(true)
          },
        })
      } else {
        this.continueButton.setVisible(true)
      }
    })
  }

  hideExpGainStats() {
    this.expBar.setVisible(false)
    this.currLevelText.setVisible(false)
    this.nextLevelText.setVisible(false)
  }

  applyExpGain(newLevel: number) {
    const currExpLevel = Save.getData(SaveKeys.CURR_EXP) as number
    Save.setData(SaveKeys.CURR_LEVEL, newLevel)
    Save.setData(SaveKeys.CURR_EXP, (currExpLevel + this.totalExpGained) % 100)
  }

  create() {
    this.continueButton = new Button({
      scene: this,
      width: 175,
      height: 45,
      text: 'Continue',
      onClick: () => {
        switch (this.currState) {
          case DreamEndState.STATS: {
            this.hideEndOfRoundStats()
            this.displayExpGainStats()
            break
          }
          case DreamEndState.EXP_GAIN: {
            this.currState = DreamEndState.SHOW_FEVER_DEGREES
            this.hideExpGainStats()
            this.displayFeverDegreeProgression()
            break
          }
          case DreamEndState.SHOW_FEVER_DEGREES: {
            this.currState = DreamEndState.STATS
            this.scene.start('overworld')
          }
        }
      },
      strokeWidth: 0,
      fontSize: '20px',
      backgroundColor: 0xffffff,
      x: Constants.WINDOW_WIDTH / 2,
      y: Constants.WINDOW_HEIGHT * 0.75,
    })
  }
}
