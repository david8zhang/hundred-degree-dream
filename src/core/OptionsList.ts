import { Scene } from 'phaser'

export interface ListConfig {
  options: string[]
  position: {
    x: number
    y: number
  }
}

export class OptionsList {
  private scene: Scene
  private optionsGroup: Phaser.GameObjects.Group
  private selectedOptionIndex: number = 0
  private darkTheme: boolean = false

  constructor(scene: Scene) {
    this.scene = scene
    this.optionsGroup = this.scene.add.group()
  }

  displayOptions(listConfig: ListConfig) {
    let yPos = listConfig.position.y
    const xPos = listConfig.position.x
    this.optionsGroup.clear(true, true)
    listConfig.options.map((option) => {
      const optionText = this.scene.add
        .text(xPos, yPos, option, {
          fontSize: '25px',
          color: 'black',
        })
        .setDepth(1000)
        .setOrigin(0, 0.5)
      yPos += optionText.displayHeight + 15
      this.optionsGroup.add(optionText)
    })
    const allOptions = this.optionsGroup.children.entries
    const newSelectedOption = allOptions[this.selectedOptionIndex] as Phaser.GameObjects.Text
    newSelectedOption.setColor('green').setStroke('green', 2)
  }

  scrollOption(scrollAmount: number) {
    const allOptions = this.optionsGroup.children.entries
    const previouslySelectedOption = allOptions[this.selectedOptionIndex] as Phaser.GameObjects.Text
    previouslySelectedOption.setColor(this.darkTheme ? 'white' : 'black').setStroke('black', 0)
    this.selectedOptionIndex += scrollAmount
    if (this.selectedOptionIndex == -1) {
      this.selectedOptionIndex = allOptions.length - 1
    }
    if (this.selectedOptionIndex == allOptions.length) {
      this.selectedOptionIndex = 0
    }
    const newSelectedOption = allOptions[this.selectedOptionIndex] as Phaser.GameObjects.Text
    newSelectedOption.setColor('green').setStroke('green', 2)
  }

  toggleDarkTheme(darkTheme: boolean) {
    this.darkTheme = darkTheme
  }

  get selectedOption() {
    const allOptions = this.optionsGroup.children.entries
    return allOptions[this.selectedOptionIndex]
  }

  hide() {
    this.optionsGroup.setVisible(false)
  }
}
