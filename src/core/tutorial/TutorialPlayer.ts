import { Dream } from '~/scenes/Dream'
import { Player } from '../Player'
import { MoveNames } from '../moves/MoveNames'

export interface TutorialPlayerConfig {
  onMoveCompleted: Function
}

export class TutorialPlayer extends Player {
  private moveCompletedCb: Function
  public shouldHideTacticsOption: boolean = false
  public shouldHideFightOption: boolean = false
  public useNormalMoveCompleteBehavior: boolean = false

  constructor(scene: Dream, config: TutorialPlayerConfig) {
    super(scene, {
      characterConfigs: [
        {
          name: 'Jambo',
          maxHealth: 10,
          spriteTexture: 'jambo',
          moveNames: [MoveNames.PUNCH],
        },
      ],
    })
    this.moveCompletedCb = config.onMoveCompleted
  }

  setVisible(isVisible: boolean) {
    this.party.forEach((p) => p.setVisible(isVisible))
    this.hideTactics()
    this.hideActionMenu()
    this.partyMemberHealthInfo.forEach((p) => p.setVisible(false))
  }

  onMoveCompleted(): void {
    if (this.useNormalMoveCompleteBehavior) {
      super.onMoveCompleted()
    } else {
      this.moveCompletedCb()
    }
  }

  scrollActions(scrollAmt: number) {
    if (this.shouldHideTacticsOption) {
      this.selectedActionIndex = 0
    } else if (this.shouldHideFightOption) {
      this.selectedActionIndex = 1
    } else {
      super.scrollActions(scrollAmt)
    }
  }

  showActions() {
    const partyMemberSprite = this.partyMemberToAct.sprite
    if (this.shouldHideTacticsOption) {
      this.fightActionText
        .setPosition(
          partyMemberSprite.x,
          partyMemberSprite.y - partyMemberSprite.displayHeight / 2 - 30
        )
        .setVisible(true)
        .setOrigin(0.5, 0.5)
    } else if (this.shouldHideFightOption) {
      this.tacticsActionText
        .setPosition(
          partyMemberSprite.x,
          partyMemberSprite.y - partyMemberSprite.displayHeight / 2 - 30
        )
        .setVisible(true)
        .setOrigin(0.5, 0.5)
    } else {
      super.showActions()
    }
  }
}
