import { CharacterConfig, Constants, Side } from '~/utils/Constants'
import { PartyMember } from './PartyMember'
import { Dream } from '~/scenes/Dream'
import { TargetCursor } from './TargetCursor'
import { Move, TargetType } from './moves/Move'
import { Save, SaveKeys } from '~/utils/Save'
import { OptionsList } from './OptionsList'
import { HealthInfo } from './HealthInfo'

export enum ActionState {
  PICK_ACTION = 'PICK_ACTION',
  PICK_MOVE = 'PICK_MOVE',
  PICK_TACTIC = 'PICK_TACTIC',
  PICK_ALLY_TO_SWITCH = 'PICK_ALLY_TO_SWITCH',
  SELECT_TARGET = 'SELECT_TARGET',
  EXECUTING_MOVE = 'EXECUTING_MOVE',
  PARRYING = 'PARRYING',
  WAITING_FOR_TURN = 'WAITING_FOR_TURN',
}

export interface PlayerConfig {
  characterConfigs: CharacterConfig[]
}

export class Player {
  private scene: Dream
  public party: PartyMember[] = []
  private partyMemberToActIndex: number = 0
  protected partyMemberHealthInfo: HealthInfo[] = []

  // Actions (Fight, Tactics, Items)
  public fightActionText!: Phaser.GameObjects.Text
  public tacticsActionText!: Phaser.GameObjects.Text
  private actions: Phaser.GameObjects.Text[] = []
  public selectedActionIndex: number = 0
  public actionState: ActionState = ActionState.PICK_ACTION

  // Moves (Attacks)
  private movesMenu!: Phaser.GameObjects.Group
  private selectedMoveIndex: number = 0

  // Tactics
  private defendText!: Phaser.GameObjects.Text
  private switchAllyText!: Phaser.GameObjects.Text
  private selectedTacticIndex: number = 0
  private tactics: Phaser.GameObjects.Text[] = []

  // List of allies
  private allyList: OptionsList
  private subbedPartyMembers: PartyMember[] = []

  // Targeting cursors
  private targetCursor: TargetCursor

  // Parries
  public isParrying: boolean = false
  private parryCooldown: boolean = false
  private parryCooldownTimerEvent: Phaser.Time.TimerEvent | null = null

  // Random boolean flags
  private darkTheme: boolean = false

  constructor(scene: Dream, config: PlayerConfig) {
    this.scene = scene
    this.movesMenu = this.scene.add.group()
    this.targetCursor = new TargetCursor(this.scene)
    this.allyList = new OptionsList(this.scene)
    this.setupPartyMembers(config.characterConfigs)
    this.setupActions()
    this.setupTactics()
    this.setupKeyListener()
    this.setupHealth()
  }

  toggleDarkTheme(darkTheme: boolean) {
    this.darkTheme = darkTheme
    this.party.forEach((partyMember) => {
      partyMember.toggleDarkTheme(darkTheme)
    })
    this.actions.forEach((action, index) => {
      if (index !== this.selectedActionIndex) {
        action.setStyle({ color: darkTheme ? 'white' : 'black ' })
      }
    })
    this.tactics.forEach((tactic, index) => {
      if (index !== this.selectedTacticIndex) {
        tactic.setStyle({ color: darkTheme ? 'white' : 'black' })
      }
    })
    this.movesMenu.children.entries.forEach((move, index) => {
      const moveText = move as Phaser.GameObjects.Text
      if (index !== this.selectedMoveIndex) {
        moveText.setStyle({ color: darkTheme ? 'white' : 'black' })
      }
    })

    this.defendText.setStyle({ color: darkTheme ? 'white' : 'black ' })
    if (this.switchAllyText) {
      this.switchAllyText.setStyle({ color: darkTheme ? 'white' : 'black ' })
    }
    this.fightActionText.setStyle({ color: darkTheme ? 'white' : 'black ' })
    this.tacticsActionText.setStyle({ color: darkTheme ? 'white' : 'black' })

    this.partyMemberHealthInfo.forEach((healthInfo) => {
      healthInfo.toggleDarkTheme(darkTheme)
    })
  }

  setupHealth() {
    let yPos = 45
    this.party.forEach((partyMember: PartyMember) => {
      const newHealthInfo = new HealthInfo(this.scene, {
        position: { x: 30, y: yPos },
        partyMember,
      })
      this.partyMemberHealthInfo.push(newHealthInfo)
      yPos += newHealthInfo.displayHeight + 45
    })
  }

  updateHealth() {
    this.partyMemberHealthInfo.forEach((h) => h.updateCurrHealth())
  }

  setupActions() {
    this.fightActionText = this.scene.add
      .text(0, 0, 'Fight', {
        fontSize: '25px',
        color: 'black',
      })
      .setVisible(false)
      .setOrigin(0.5, 0.5)
    this.tacticsActionText = this.scene.add
      .text(0, 0, 'Tactics', {
        fontSize: '25px',
        color: 'black',
      })
      .setVisible(false)
      .setOrigin(0.5, 0.5)
    this.actions.push(this.fightActionText)
    this.actions.push(this.tacticsActionText)
  }

  setupTactics() {
    const currParty = Save.getData(SaveKeys.CURR_PARTY) as string[]
    this.defendText = this.scene.add
      .text(0, 0, 'Defend', {
        fontSize: '25px',
        color: 'black',
      })
      .setVisible(false)
    if (currParty.length > 2) {
      this.switchAllyText = this.scene.add
        .text(0, 0, 'Switch', {
          fontSize: '25px',
          color: 'black',
        })
        .setVisible(false)
      this.tactics.push(this.switchAllyText)
    }
    this.tactics.push(this.defendText)
  }

  get partyMemberToAct() {
    return this.livingParty[this.partyMemberToActIndex]
  }

  setupPartyMembers(characterConfigs: CharacterConfig[]) {
    const allyName = Save.getData(SaveKeys.ACTIVE_ALLY) as string
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
        isActive: config.name == allyName || config.name == 'Jambo',
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
        this.actionState = ActionState.WAITING_FOR_TURN
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
    this.party.forEach((p) => {
      p.setDefending(false)
    })
    this.partyMemberToActIndex = 0
    this.actionState = ActionState.PICK_ACTION
    this.showActions()
    this.highlightAction()
  }

  highlightAction() {
    const selectedAction = this.actions[this.selectedActionIndex]
    selectedAction.setStroke('green', 2)
    selectedAction.setStyle({ color: 'green' })
  }

  displayTacticsMenu() {
    this.defendText
      .setPosition(Constants.WINDOW_WIDTH / 2 - 50, Constants.WINDOW_HEIGHT / 3)
      .setVisible(true)
      .setOrigin(0, 0.5)
    if (this.switchAllyText) {
      this.switchAllyText
        .setPosition(
          Constants.WINDOW_WIDTH / 2 - 50,
          this.defendText.y + this.defendText.displayHeight + 15
        )
        .setVisible(true)
        .setOrigin(0, 0.5)
    }
  }

  showActions() {
    const partyMemberSprite = this.partyMemberToAct.sprite
    this.fightActionText
      .setPosition(
        partyMemberSprite.x - 60,
        partyMemberSprite.y - partyMemberSprite.displayHeight / 2 - 30
      )
      .setVisible(true)
      .setOrigin(0.5, 0.5)
    this.tacticsActionText
      .setPosition(
        partyMemberSprite.x + 60,
        partyMemberSprite.y - partyMemberSprite.displayHeight / 2 - 30
      )
      .setVisible(true)
      .setOrigin(0.5, 0.5)
  }

  scrollActions(scrollAmt: number) {
    const previousAction = this.actions[this.selectedActionIndex]
    previousAction.setStroke('black', 0)
    previousAction.setStyle({ color: this.darkTheme ? 'white' : 'black' })

    this.selectedActionIndex += scrollAmt
    if (this.selectedActionIndex == -1) {
      this.selectedActionIndex = this.actions.length - 1
    }
    if (this.selectedActionIndex == this.actions.length) {
      this.selectedActionIndex = 0
    }
    const newAction = this.actions[this.selectedActionIndex]
    newAction.setStroke('green', 2)
    newAction.setStyle({ color: 'green' })
  }

  displayMovesMenu() {
    this.movesMenu.clear(true, true)
    let yPos = Constants.WINDOW_HEIGHT / 3
    const moveNames = this.partyMemberToAct.getAllMoveNames()
    moveNames.forEach((name) => {
      const moveNameText = this.scene.add
        .text(Constants.WINDOW_WIDTH / 2 - 50, yPos, name, {
          fontSize: '25px',
          color: this.darkTheme ? 'white' : 'black',
        })
        .setDepth(1000)
        .setOrigin(0, 0.5)
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
    selectedMoveText.setStroke('green', 2)
    selectedMoveText.setColor('green')
  }

  scrollMove(scrollAmount: number) {
    const moveList = this.movesMenu.children.entries

    // Dehighlight previous move text
    const selectedMoveText = moveList[this.selectedMoveIndex] as Phaser.GameObjects.Text
    selectedMoveText.setStroke('black', 0)
    selectedMoveText.setColor(this.darkTheme ? 'white' : 'black')

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
    const selectedAction = this.actions[this.selectedActionIndex]
    switch (selectedAction.text) {
      case 'Fight': {
        this.actionState = ActionState.PICK_MOVE
        this.hideActionMenu()
        this.displayMovesMenu()
        this.highlightSelectedMove()
        break
      }
      case 'Tactics': {
        this.actionState = ActionState.PICK_TACTIC
        this.hideActionMenu()
        this.displayTacticsMenu()
        this.highlightSelectedTactic()
        break
      }
    }
  }

  selectHighlightedMove() {
    this.actionState = ActionState.SELECT_TARGET
    const moveList = this.movesMenu.children.entries
    const selectedMove = moveList[this.selectedMoveIndex].getData('ref') as Move

    // If the target type is an unspecified area, start the move execution immediately
    if (
      selectedMove.targetType === TargetType.ALLY_TEAM ||
      selectedMove.targetType === TargetType.AREA
    ) {
      this.actionState = ActionState.EXECUTING_MOVE
      selectedMove.execute()
    } else {
      this.targetCursor.setupCursorForTargetType(selectedMove.targetType)
    }
  }

  selectHighlightedTactic() {
    const selectedTactic = this.tactics[this.selectedTacticIndex]
    switch (selectedTactic.text) {
      case 'Defend': {
        this.hideTactics()
        this.partyMemberToAct.setDefending(true)
        this.onMoveCompleted()
        break
      }
      case 'Switch': {
        this.actionState = ActionState.PICK_ALLY_TO_SWITCH
        this.hideTactics()
        this.showAllyList()
        break
      }
    }
  }

  showAllyList() {
    const partyMembers = Save.getData(SaveKeys.CURR_PARTY) as string[]
    const currParty = this.party.map((p) => p.name)
    const allies = partyMembers.filter((p) => !currParty.includes(p))
    this.allyList.displayOptions({
      position: {
        x: Constants.WINDOW_WIDTH / 2 - 50,
        y: Constants.WINDOW_HEIGHT / 3,
      },
      options: allies,
    })
  }

  handleKeyPressForPickAction(keyCode: number) {
    if (this.scene.currTurn === Side.PLAYER) {
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

  hideTactics() {
    this.defendText.setVisible(false)
    if (this.switchAllyText) {
      this.switchAllyText.setVisible(false)
    }
  }

  scrollTactic(scrollAmount: number) {
    const previouslySelectedTactic = this.tactics[this.selectedTacticIndex]
    previouslySelectedTactic.setStroke('black', 0).setColor(this.darkTheme ? 'white' : 'black')
    this.selectedTacticIndex += scrollAmount
    if (this.selectedTacticIndex == -1) {
      this.selectedTacticIndex = this.tactics.length - 1
    }
    if (this.selectedTacticIndex == this.tactics.length) {
      this.selectedTacticIndex = 0
    }
    this.highlightSelectedTactic()
  }

  highlightSelectedTactic() {
    const currentlySelectedTactic = this.tactics[this.selectedTacticIndex]
    currentlySelectedTactic.setStroke('green', 2).setColor('green')
  }

  handleKeyPressForPickTactic(keyCode: number) {
    switch (keyCode) {
      case Phaser.Input.Keyboard.KeyCodes.UP: {
        this.scrollTactic(-1)
        break
      }
      case Phaser.Input.Keyboard.KeyCodes.DOWN: {
        this.scrollTactic(1)
        break
      }
      case Phaser.Input.Keyboard.KeyCodes.SPACE: {
        this.hideTactics()
        this.selectHighlightedTactic()
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
        this.selectedMoveIndex = 0
        this.targetCursor.setVisible(false)
        this.targetCursor.reset()
        break
      }
    }
  }

  handleKeyPressForParry(keyCode: number) {
    switch (keyCode) {
      case Phaser.Input.Keyboard.KeyCodes.R: {
        if (!this.parryCooldown) {
          this.parryCooldown = true
          this.isParrying = true
          this.scene.time.delayedCall(150, () => {
            this.isParrying = false
          })
          this.parryCooldownTimerEvent = this.scene.time.delayedCall(500, () => {
            this.parryCooldown = false
          })
        }
      }
    }
  }

  handleKeyPressForPickAllyToSwitch(keyCode: number) {
    switch (keyCode) {
      case Phaser.Input.Keyboard.KeyCodes.UP: {
        this.allyList.scrollOption(-1)
        break
      }
      case Phaser.Input.Keyboard.KeyCodes.DOWN: {
        this.allyList.scrollOption(1)
        break
      }
      case Phaser.Input.Keyboard.KeyCodes.SPACE: {
        const selectedOption = this.allyList.selectedOption as Phaser.GameObjects.Text
        this.handleSwitchPartyMember(selectedOption.text)
        this.allyList.hide()
        break
      }
    }
  }

  handleSwitchPartyMember(allyToSwitchInName: string) {
    const currAlly = this.party.find((p) => p.name !== 'Jambo')!
    let allyToSwitchIn = this.subbedPartyMembers.find((p) => p.name === allyToSwitchInName)
    if (allyToSwitchIn) {
      this.subbedPartyMembers = this.subbedPartyMembers.filter((p) => p.name != allyToSwitchInName)
      allyToSwitchIn.sprite.setVisible(true)
    } else {
      allyToSwitchIn = new PartyMember(this.scene, {
        name: allyToSwitchInName,
        ...Constants.CHARACTER_CONFIGS[allyToSwitchInName],
        position: {
          x: -50,
          y: currAlly.sprite.y,
        },
        isActive: false,
        player: this,
      })
      allyToSwitchIn.toggleDarkTheme(this.darkTheme)
    }
    this.subbedPartyMembers.push(currAlly)
    this.scene.tweens.add({
      targets: [allyToSwitchIn.sprite],
      x: {
        from: -50,
        to: currAlly.sprite.x,
      },
      duration: 500,
    })
    this.scene.tweens.add({
      targets: [currAlly.sprite],
      x: {
        from: currAlly.sprite.x,
        to: -50,
      },
      duration: 500,
      onComplete: () => {
        currAlly.sprite.setVisible(false)
        this.party[1] = allyToSwitchIn!
        this.actionState = ActionState.PICK_ACTION
        this.partyMemberHealthInfo.forEach((h, index) => {
          h.updatePartyMember(this.party[index])
        })
        this.showActions()
      },
    })
  }

  resetParryState() {
    this.parryCooldown = false
    if (this.parryCooldownTimerEvent) {
      this.parryCooldownTimerEvent.destroy()
    }
  }

  goBack() {
    switch (this.actionState) {
      case ActionState.PICK_MOVE: {
        this.actionState = ActionState.PICK_ACTION
        this.movesMenu.setVisible(false)
        this.showActions()
        break
      }
      case ActionState.SELECT_TARGET: {
        this.actionState = ActionState.PICK_MOVE
        this.movesMenu.setVisible(true)
        this.targetCursor.setVisible(false)
        break
      }
      case ActionState.PICK_TACTIC: {
        this.actionState = ActionState.PICK_ACTION
        this.hideTactics()
        this.showActions()
        break
      }
      case ActionState.PICK_ALLY_TO_SWITCH: {
        this.actionState = ActionState.PICK_TACTIC
        this.allyList.hide()
        this.displayTacticsMenu()
        break
      }
    }
  }

  setupKeyListener() {
    this.scene.input.keyboard.on('keydown', (e) => {
      if (e.keyCode === Phaser.Input.Keyboard.KeyCodes.ESC && this.scene.currTurn === Side.PLAYER) {
        this.goBack()
      }
      switch (this.actionState) {
        case ActionState.PICK_ACTION: {
          this.handleKeyPressForPickAction(e.keyCode)
          break
        }
        case ActionState.PICK_MOVE: {
          this.handleKeyPressForPickMove(e.keyCode)
          break
        }
        case ActionState.PICK_TACTIC: {
          this.handleKeyPressForPickTactic(e.keyCode)
          break
        }
        case ActionState.SELECT_TARGET: {
          this.handleKeyPressForSelectTarget(e.keyCode)
          break
        }
        case ActionState.PARRYING: {
          this.handleKeyPressForParry(e.keyCode)
          break
        }
        case ActionState.PICK_ALLY_TO_SWITCH: {
          this.handleKeyPressForPickAllyToSwitch(e.keyCode)
          break
        }
      }
    })
  }
}
