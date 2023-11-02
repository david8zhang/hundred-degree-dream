import { Player } from '~/core/Player'
import { Dream } from './Dream'
import { Constants, Side } from '~/utils/Constants'
import { CPU } from '~/core/CPU'
import { MoveNames } from '~/core/moves/MoveNames'
import { EnemyMember } from '~/core/EnemyMember'
import { PartyMember } from '~/core/PartyMember'
import { EnemyCharge } from '~/core/moves/EnemyCharge'
import { Move } from '~/core/moves/Move'
import { Punch } from '~/core/moves/Punch'
import { Stomp } from '~/core/moves/Stomp'
import { TutorialPlayer } from '~/core/tutorial/TutorialPlayer'
import { TutorialCPU } from '~/core/tutorial/TutorialCPU'
import { TutorialScene } from '~/core/tutorial/TutorialScene'
import { TutorialIntro } from '~/core/tutorial/TutorialIntro'
import { EnemyConfig } from '~/utils/EnemyConfigs'
import { TutorialGuard } from '~/core/tutorial/TutorialGuard'
import { TutorialDefend } from '~/core/tutorial/TutorialDefend'
import { TutorialStomp } from '~/core/tutorial/TutorialStomp'
import { TutorialOverworld } from '~/core/tutorial/TutorialOverworld'
import { TutorialBoss } from '~/core/tutorial/TutorialBoss'
import { NightmareLaser } from '~/core/moves/NightmareLaser'

export enum TutorialState {
  INTRO = 'INTRO',
  GUARD = 'GUARD',
  MULTI = 'MULTI',
}

export class Tutorial extends Phaser.Scene {
  public player!: TutorialPlayer
  public cpu!: TutorialCPU
  public currTurn: Side = Side.PLAYER
  public updateCallbacks: Function[] = []
  public tutorialText!: Phaser.GameObjects.Text
  public continueButtonText!: Phaser.GameObjects.Text
  public tutorialSceneIndex: number = 0
  public tutorialScenes: TutorialScene[] = []
  public enemiesDefeated: EnemyConfig[] = []
  public waveNumber: number = 1
  public bgImage!: Phaser.GameObjects.Image
  public isTutorial: boolean = true
  public pressArrowKeys!: Phaser.GameObjects.Text

  constructor() {
    super('tutorial')
    this.tutorialScenes = [
      new TutorialIntro(this),
      new TutorialGuard(this),
      new TutorialDefend(this),
      new TutorialStomp(this),
      new TutorialBoss(this),
      new TutorialOverworld(this),
    ]
  }

  create() {
    this.cameras.main.setBackgroundColor(0xffffff)
    this.bgImage = this.add
      .image(Constants.WINDOW_WIDTH / 2, Constants.WINDOW_HEIGHT / 2, 'background')
      .setOrigin(0.5, 0.5)
    this.player = new TutorialPlayer(this as unknown as Dream, {
      onMoveCompleted: () => this.onMoveCompleted(),
    })
    this.cpu = new TutorialCPU(this as unknown as Dream, {
      onMoveCompleted: () => this.onMoveCompleted(),
    })

    const jambo = this.player.party[0]
    this.pressArrowKeys = this.add
      .text(
        jambo.sprite.x,
        jambo.sprite.y + jambo.sprite.displayHeight / 2 + 30,
        'Tip #2. Use Arrow Keys to navigate menus, and escape to go back',
        {
          fontSize: '20px',
          color: 'black',
        }
      )
      .setVisible(false)
      .setWordWrapWidth(250)
      .setOrigin(0.5, 0.5)

    this.tutorialText = this.add
      .text(30, Constants.WINDOW_HEIGHT - 60, '', {
        fontSize: '25px',
        color: 'black',
      })
      .setOrigin(0, 1)
      .setWordWrapWidth(Constants.WINDOW_WIDTH - 30)
    this.continueButtonText = this.add
      .text(Constants.WINDOW_WIDTH - 30, Constants.WINDOW_HEIGHT - 15, 'Continue', {
        fontSize: '20px',
        color: 'black',
      })
      .setInteractive({ cursor: 'pointer' })
      .on(Phaser.Input.Events.POINTER_UP, () => {
        this.tutorialScenes[this.tutorialSceneIndex].onContinuePressed()
      })
      .setOrigin(1, 1)
      .setStroke('black', 1)

    this.tutorialScenes[this.tutorialSceneIndex].start()
  }

  public convertMoveNamesToMoves(moveNames: MoveNames[], member: PartyMember | EnemyMember) {
    const moveMapping: {
      [key: string]: Move
    } = {}
    moveNames.forEach((moveName: MoveNames) => {
      switch (moveName) {
        case MoveNames.PUNCH: {
          moveMapping[moveName] = new Punch(this as unknown as Dream, member)
          break
        }
        case MoveNames.ENEMY_CHARGE: {
          moveMapping[moveName] = new EnemyCharge(this as unknown as Dream, member)
          break
        }
        case MoveNames.STOMP: {
          moveMapping[moveName] = new Stomp(this as unknown as Dream, member)
          break
        }
        case MoveNames.NIGHTMARE_LASER: {
          moveMapping[moveName] = new NightmareLaser(this as unknown as Dream, member)
          break
        }
      }
    })
    return moveMapping
  }

  startTurn(side: Side) {
    this.currTurn = side
    if (side == Side.PLAYER) {
      this.player.startTurn()
    } else {
      this.cpu.startTurn()
    }
  }

  goToNextScene() {
    this.tutorialSceneIndex++
    if (this.tutorialSceneIndex < this.tutorialScenes.length) {
      const tutorialScene = this.tutorialScenes[this.tutorialSceneIndex]
      tutorialScene.start()
    }
  }

  onMoveCompleted() {
    const tutorialScene = this.tutorialScenes[this.tutorialSceneIndex]
    tutorialScene.onMoveCompleted()
  }

  getEnemies() {
    return this.cpu.livingEnemies
  }

  getPlayerParty() {
    return this.player.livingParty
  }

  update(): void {
    this.updateCallbacks.forEach((updateFn) => {
      updateFn()
    })
  }

  isRoundOver() {
    return this.getPlayerParty().length == 0 || this.getEnemies().length == 0
  }

  handleRoundOver() {
    this.pressArrowKeys.setVisible(false)
    this.goToNextScene()
  }
}
