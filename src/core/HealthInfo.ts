import { Scene } from 'phaser'
import { PartyMember } from './PartyMember'

export interface HealthInfoConfig {
  position: {
    x: number
    y: number
  }
  partyMember: PartyMember
}

export class HealthInfo {
  private scene: Scene
  private text: Phaser.GameObjects.Text
  private icon: Phaser.GameObjects.Sprite
  private partyMember: PartyMember

  constructor(scene: Scene, config: HealthInfoConfig) {
    this.scene = scene
    this.icon = this.scene.add
      .sprite(30, config.position.y, config.partyMember.sprite.texture.key)
      .setScale(0.5)
      .setOrigin(0, 0.5)
    this.text = this.scene.add
      .text(
        this.icon.x + this.icon.displayWidth + 15,
        config.position.y,
        `${config.partyMember.currHealth}/${config.partyMember.maxHealth}`,
        {
          fontSize: '25px',
          color: 'black',
        }
      )
      .setOrigin(0, 0.5)
    this.partyMember = config.partyMember
  }

  get displayHeight() {
    return this.text.displayHeight
  }

  get displayWidth() {
    return this.text.displayWidth
  }

  updateCurrHealth() {
    this.icon.setTexture(this.partyMember.sprite.texture.key)
    this.text.setText(`${this.partyMember.currHealth}/${this.partyMember.maxHealth}`)
  }

  updatePartyMember(partyMember: PartyMember) {
    this.partyMember = partyMember
    this.icon.setTexture(partyMember.sprite.texture.key)
    this.text.setText(`${partyMember.currHealth}/${partyMember.maxHealth}`)
  }
}
