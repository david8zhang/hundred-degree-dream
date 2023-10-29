import { CharacterConfig, Constants, Side } from '~/utils/Constants'
import { PartyMember } from './PartyMember'
import { Dungeon } from '~/scenes/Dungeon'
import { TargetCursor } from './TargetCursor'
import { Move, TargetType } from './moves/Move'

export enum ActionState {
  PICK_ACTION = 'PICK_ACTION',
  PICK_MOVE = 'PICK_MOVE',
  SELECT_TARGET = 'SELECT_TARGET',
  EXECUTING_MOVE = 'EXECUTING_MOVE',
}

export interface PlayerConfig {
  characterConfigs: CharacterConfig[]
}

export class Player {
  private scene: Dungeon
  public party: PartyMember[] = []
  private partyMemberToActIndex: number = 0
  private healthGroup: Phaser.GameObjects.Group

  // Actions (Fight, Tactics, Items)
  private fightActionText!: Phaser.GameObjects.Text
  private tacticsActionText!: Phaser.GameObjects.Text
  private actions: Phaser.GameObjects.Text[] = []
  private selectedActionIndex: number = 0
  private actionState: ActionState = ActionState.PICK_ACTION

  // Moves (Attacks)
  private movesMenu!: Phaser.GameObjects.Group
  private selectedMoveIndex: number = 0

  // Targeting cursors
  private targetCursor: TargetCursor

  constructor(scene: Dungeon, config: PlayerConfig) {
    this.scene = scene
    this.movesMenu = this.scene.add.group()
    this.targetCursor = new TargetCursor(this.scene)
    this.healthGroup = this.scene.add.group()
    this.setupPartyMembers(config.characterConfigs)
    this.setupActions()
    this.setupKeyListener()
    this.setupHealth()
  }

  setupHealth() {
    let yPos = 45
    this.party.forEach((partyMember: PartyMember) => {
      const partyMemberIcon = this.scene.add
        .sprite(30, yPos, partyMember.sprite.texture.key)
        .setScale(0.5)
        .setOrigin(0, 0.5)
      const healthText = this.scene.add
        .text(
          partyMemberIcon.x + partyMemberIcon.displayWidth + 15,
          yPos,
          `${partyMember.currHealth}/${partyMember.maxHealth}`,
          {
            fontSize: '25px',
            color: 'white',
          }
        )
        .setOrigin(0, 0.5)
        .setData('ref', partyMember)
      yPos += healthText.displayHeight + 30
      this.healthGroup.add(healthText)
    })
  }

  updateHealth() {
    this.healthGroup.children.entries.forEach((obj) => {
      const text = obj as Phaser.GameObjects.Text
      const partyMember = text.getData('ref') as PartyMember
      text.setText(`${partyMember.currHealth}/${partyMember.maxHealth}`)
    })
  }

  setupActions() {
    this.fightActionText = this.scene.add
      .text(0, 0, 'Fight', {
        fontSize: '25px',
        color: 'white',
      })
      .setVisible(false)
    this.tacticsActionText = this.scene.add
      .text(0, 0, 'Tactics', {
        fontSize: '25px',
        color: 'white',
      })
      .setVisible(false)
    this.actions.push(this.fightActionText)
    this.actions.push(this.tacticsActionText)
  }

  get partyMemberToAct() {
    return this.livingParty[this.partyMemberToActIndex]
  }

  setupPartyMembers(characterConfigs: CharacterConfig[]) {
    let xPos = Constants.RIGHTMOST_PLAYER_X_POS
    const yPos = 400
    characterConfigs.forEach((config) => {
      const partyMember = new PartyMember(this.scene, {
        ...config,
        position: {
          x: xPos,
          y: yPos,
        },
        player: this,
      })
      this.party.push(partyMember)
      xPos -= partyMember.sprite.displayWidth + 100
    })
  }

  get livingParty() {
    return this.party.filter((p) => p.currHealth > 0)
  }

  onMoveCompleted() {
    if (!this.scene.isRoundOver()) {
      if (this.partyMemberToActIndex == this.livingParty.length - 1) {
        this.scene.startTurn(Side.CPU)
      } else {
        this.partyMemberToActIndex++
        this.actionState = ActionState.PICK_ACTION
        this.showActions()
        this.highlightAction()
      }
    } else {
      this.scene.handleRoundOver()
    }
  }

  startTurn() {
    this.partyMemberToActIndex = 0
    this.actionState = ActionState.PICK_ACTION
    this.showActions()
    this.highlightAction()
  }

  highlightAction() {
    const selectedAction = this.actions[this.selectedActionIndex]
    selectedAction.setStroke('yellow', 2)
    selectedAction.setStyle({ color: 'yellow' })
  }

  showActions() {
    const partyMemberSprite = this.partyMemberToAct.sprite
    this.fightActionText
      .setPosition(
        partyMemberSprite.x - this.fightActionText.displayWidth - 15,
        partyMemberSprite.y - partyMemberSprite.displayHeight / 2 - 30
      )
      .setVisible(true)
    this.tacticsActionText
      .setPosition(
        partyMemberSprite.x + 15,
        partyMemberSprite.y - partyMemberSprite.displayHeight / 2 - 30
      )
      .setVisible(true)
  }

  scrollActions(scrollAmt: number) {
    const previousAction = this.actions[this.selectedActionIndex]
    previousAction.setStroke('white', 0)
    previousAction.setStyle({ color: 'white' })

    this.selectedActionIndex += scrollAmt
    if (this.selectedActionIndex == -1) {
      this.selectedActionIndex = this.actions.length - 1
    }
    if (this.selectedActionIndex == this.actions.length) {
      this.selectedActionIndex = 0
    }
    const newAction = this.actions[this.selectedActionIndex]
    newAction.setStroke('yellow', 2)
    newAction.setStyle({ color: 'yellow' })
  }

  displayMovesMenu() {
    this.movesMenu.clear()
    let yPos = this.partyMemberToAct.sprite.y - this.partyMemberToAct.sprite.displayHeight / 2
    const moveNames = this.partyMemberToAct.getAllMoveNames()
    moveNames.forEach((name) => {
      const moveNameText = this.scene.add.text(
        this.partyMemberToAct.sprite.x + this.partyMemberToAct.sprite.displayWidth / 2 + 15,
        yPos,
        name,
        {
          fontSize: '25px',
          color: 'white',
        }
      )
      moveNameText.setData('ref', this.partyMemberToAct.moveMapping[name])
      this.movesMenu.add(moveNameText)
      yPos += moveNameText.displayHeight + 15
    })
  }

  hideActionMenu() {
    this.fightActionText.setVisible(false)
    this.tacticsActionText.setVisible(false)
  }

  highlightSelectedMove() {
    const moveList = this.movesMenu.children.entries
    const selectedMoveText = moveList[this.selectedMoveIndex] as Phaser.GameObjects.Text
    selectedMoveText.setStroke('yellow', 2)
    selectedMoveText.setColor('yellow')
  }

  scrollMove(scrollAmount: number) {
    const moveList = this.movesMenu.children.entries

    // Dehighlight previous move text
    const selectedMoveText = moveList[this.selectedMoveIndex] as Phaser.GameObjects.Text
    selectedMoveText.setStroke('white', 1)
    selectedMoveText.setColor('white')

    this.selectedMoveIndex += scrollAmount
    if (this.selectedMoveIndex == -1) {
      this.selectedMoveIndex = moveList.length - 1
    }
    if (this.selectedMoveIndex == moveList.length) {
      this.selectedMoveIndex = 0
    }
    this.highlightSelectedMove()
  }

  selectHighlightedAction() {
    this.actionState = ActionState.PICK_MOVE
    const selectedAction = this.actions[this.selectedActionIndex]
    switch (selectedAction.text) {
      case 'Fight': {
        this.hideActionMenu()
        this.displayMovesMenu()
        this.highlightSelectedMove()
        break
      }
      case 'Tactics': {
        break
      }
    }
  }

  selectHighlightedMove() {
    this.actionState = ActionState.SELECT_TARGET
    const moveList = this.movesMenu.children.entries
    const selectedMove = moveList[this.selectedMoveIndex].getData('ref') as Move

    // If the target type is an unspecified area, start the move execution immediately
    if (selectedMove.targetType === TargetType.AREA) {
      this.actionState = ActionState.EXECUTING_MOVE
      selectedMove.execute()
    } else {
      this.targetCursor.setupCursorForTargetType(selectedMove.targetType)
    }
  }

  handleKeyPressForPickAction(keyCode: number) {
    switch (keyCode) {
      case Phaser.Input.Keyboard.KeyCodes.LEFT: {
        this.scrollActions(-1)
        break
      }
      case Phaser.Input.Keyboard.KeyCodes.RIGHT: {
        this.scrollActions(1)
        break
      }
      case Phaser.Input.Keyboard.KeyCodes.SPACE: {
        this.selectHighlightedAction()
        break
      }
    }
  }

  handleKeyPressForPickMove(keyCode: number) {
    switch (keyCode) {
      case Phaser.Input.Keyboard.KeyCodes.UP: {
        this.scrollMove(-1)
        break
      }
      case Phaser.Input.Keyboard.KeyCodes.DOWN: {
        this.scrollMove(1)
        break
      }
      case Phaser.Input.Keyboard.KeyCodes.SPACE: {
        this.movesMenu.setVisible(false)
        this.selectHighlightedMove()
        break
      }
    }
  }

  handleKeyPressForSelectTarget(keyCode: number) {
    switch (keyCode) {
      case Phaser.Input.Keyboard.KeyCodes.LEFT: {
        this.targetCursor.scrollSingleTarget(-1)
        break
      }
      case Phaser.Input.Keyboard.KeyCodes.RIGHT: {
        this.targetCursor.scrollSingleTarget(1)
        break
      }
      case Phaser.Input.Keyboard.KeyCodes.SPACE:
      case Phaser.Input.Keyboard.KeyCodes.ENTER: {
        this.actionState = ActionState.EXECUTING_MOVE
        const moveList = this.movesMenu.children.entries
        const selectedMove = moveList[this.selectedMoveIndex].getData('ref') as Move
        selectedMove.execute({ targets: this.targetCursor.getSelectedTargets() })
        this.targetCursor.setVisible(false)
        this.targetCursor.reset()
        break
      }
    }
  }

  setupKeyListener() {
    this.scene.input.keyboard.on('keydown', (e) => {
      switch (this.actionState) {
        case ActionState.PICK_ACTION: {
          this.handleKeyPressForPickAction(e.keyCode)
          break
        }
        case ActionState.PICK_MOVE: {
          this.handleKeyPressForPickMove(e.keyCode)
          break
        }
        case ActionState.SELECT_TARGET: {
          this.handleKeyPressForSelectTarget(e.keyCode)
          break
        }
      }
    })
  }
}
