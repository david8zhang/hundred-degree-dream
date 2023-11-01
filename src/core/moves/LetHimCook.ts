import { Dream } from '~/scenes/Dream'
import { EnemyMember } from '../EnemyMember'
import { Move, MovePayload, TargetType } from './Move'
import { PartyMember } from '../PartyMember'
import { Constants } from '~/utils/Constants'
import { MoveNames } from './MoveNames'
import { UINumber } from '../UINumber'

export class LetHimCook extends Move {
  private static KEY_CODES_IN_SEQUENCE = [
    Phaser.Input.Keyboard.KeyCodes.UP,
    Phaser.Input.Keyboard.KeyCodes.DOWN,
    Phaser.Input.Keyboard.KeyCodes.LEFT,
    Phaser.Input.Keyboard.KeyCodes.RIGHT,
    Phaser.Input.Keyboard.KeyCodes.F,
    Phaser.Input.Keyboard.KeyCodes.R,
  ]
  private static KEY_CODE_TO_SPRITE = {
    [Phaser.Input.Keyboard.KeyCodes.UP]: 'upKey',
    [Phaser.Input.Keyboard.KeyCodes.DOWN]: 'downKey',
    [Phaser.Input.Keyboard.KeyCodes.LEFT]: 'leftKey',
    [Phaser.Input.Keyboard.KeyCodes.RIGHT]: 'rightKey',
    [Phaser.Input.Keyboard.KeyCodes.F]: 'fKey',
    [Phaser.Input.Keyboard.KeyCodes.R]: 'rKey',
  }

  private sequence: number[] = []
  private sequenceIndex: number = 0
  private keyIcons: Phaser.GameObjects.Group
  private newSequenceGenerated: boolean = false

  constructor(scene: Dream, member: PartyMember | EnemyMember) {
    super(scene, {
      name: MoveNames.LET_HIM_COOK,
      targetType: TargetType.ALLY_TEAM,
      onMoveCompleted: () => scene.onMoveCompleted(),
      member,
      description: 'Cook up a delicious meal to restore some HP for your ally',
      instructions: 'Press the keys in the seqeuence shown!',
    })
    this.setupKeyListener()
    this.keyIcons = this.scene.add.group()
  }

  setupKeyListener() {
    this.scene.input.keyboard.on('keydown', (e) => {
      if (this.newSequenceGenerated && this.sequenceIndex < this.keyIcons.children.entries.length) {
        if (LetHimCook.KEY_CODES_IN_SEQUENCE.includes(e.keyCode)) {
          const seqKeyCode = this.sequence[this.sequenceIndex]
          const keyCodeIcon = this.keyIcons.children.entries[
            this.sequenceIndex
          ] as Phaser.GameObjects.Sprite
          if (e.keyCode === seqKeyCode) {
            keyCodeIcon.setAlpha(0.5).setTint(0x00ff00)
            this.sequenceIndex++
            UINumber.createNumber(
              'Great!',
              this.scene,
              keyCodeIcon.x,
              keyCodeIcon.y - keyCodeIcon.displayHeight / 2,
              'black',
              '20px'
            )
            if (this.sequenceIndex === this.keyIcons.children.entries.length) {
              this.handleSuccessfulSequence()
            }
          } else {
            keyCodeIcon.setAlpha(0.5).setTint(0xff0000)
            this.handleSuccessfulSequence()
          }
        }
      }
    })
  }

  handleSuccessfulSequence() {
    const party = this.scene.getPlayerParty()
    let healAmount = 1
    if (this.sequenceIndex >= 4) {
      healAmount = 3
    } else if (this.sequenceIndex >= 2) {
      healAmount = 2
    }
    const currPartyMember = this.member as PartyMember

    party.forEach((p, index) => {
      p.heal(healAmount)
      UINumber.createNumber(
        `+${healAmount}`,
        this.scene,
        p.sprite.x,
        p.sprite.y - p.sprite.displayHeight / 2,
        currPartyMember.darkTheme ? 'white' : 'black',
        '25px',
        () => {
          if (index == party.length - 1) {
            this.resetMoveState()
            this.onMoveCompleted()
          }
        }
      )
    })
  }

  resetMoveState() {
    this.keyIcons.clear(true, true)
    this.sequenceIndex = 0
    this.isExecuting = false
    this.newSequenceGenerated = false
  }

  generateRandomSequence() {
    this.sequence = []
    let xPos = Constants.WINDOW_WIDTH / 2 - 120
    const yPos = Constants.WINDOW_HEIGHT * 0.75
    for (let i = 1; i <= 5; i++) {
      const randomKeyCode = Phaser.Utils.Array.GetRandom(LetHimCook.KEY_CODES_IN_SEQUENCE)
      this.sequence.push(randomKeyCode)
      const keyIcon = this.scene.add
        .sprite(xPos, yPos, LetHimCook.KEY_CODE_TO_SPRITE[randomKeyCode])
        .setOrigin(0.5, 1)
        .setDisplaySize(64, 64)
      this.keyIcons.add(keyIcon)
      xPos += 60
    }
    this.newSequenceGenerated = true
  }

  public execute(movePayload?: MovePayload | undefined): void {
    this.isExecuting = true
    this.generateRandomSequence()
  }
}
