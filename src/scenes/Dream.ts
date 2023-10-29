import { CPU } from '~/core/CPU'
import { EnemyMember } from '~/core/EnemyMember'
import { PartyMember } from '~/core/PartyMember'
import { Player } from '~/core/Player'
import { EnemyCharge } from '~/core/moves/EnemyCharge'
import { Move } from '~/core/moves/Move'
import { MoveNames } from '~/core/moves/MoveNames'
import { Punch } from '~/core/moves/Punch'
import { CharacterConfig, Constants, Side } from '~/utils/Constants'
import { DreamEndPayload } from './DreamEnd'
import { EnemyConfig } from '~/utils/EnemyConfigs'
import { Stomp } from '~/core/moves/Stomp'
import { Save, SaveKeys } from '~/utils/Save'

export class Dream extends Phaser.Scene {
  public player!: Player
  public cpu!: CPU
  public currTurn: Side = Side.PLAYER
  public updateCallbacks: Function[] = []
  public waveNumber: number = 1
  public waveCompleteText!: Phaser.GameObjects.Text
  public enemiesDefeated: EnemyConfig[] = []

  constructor() {
    super('dream')
  }

  applyLevelMultipliers(party: CharacterConfig[]) {
    const level = Save.getData(SaveKeys.CURR_LEVEL)
    return party.map((p) => {
      return { ...p, maxHealth: p.maxHealth + (level - 1) * 5 }
    })
  }

  calculateDamageBasedOnLevel(damage: number) {
    const level = Save.getData(SaveKeys.CURR_LEVEL)
    return Math.round(damage + (level - 1) * 0.25)
  }

  create() {
    this.add
      .image(Constants.WINDOW_WIDTH / 2, Constants.WINDOW_HEIGHT / 2, 'background')
      .setOrigin(0.5, 0.5)
    const characterConfigs = this.applyLevelMultipliers(Constants.PARTY_MEMBER_CONFIGS)
    this.player = new Player(this, {
      characterConfigs,
    })
    this.cpu = new CPU(this)
    this.cpu.generateEnemies()
    this.player.startTurn()
    this.waveCompleteText = this.add
      .text(Constants.WINDOW_WIDTH / 2, Constants.WINDOW_HEIGHT * 0.25, 'Wave Complete!', {
        fontSize: '40px',
        color: 'black',
      })
      .setOrigin(0.5, 1)
    this.waveCompleteText.setVisible(false)
  }

  startTurn(side: Side) {
    this.currTurn = side
    if (side == Side.PLAYER) {
      this.player.startTurn()
    } else {
      this.cpu.startTurn()
    }
  }

  public convertMoveNamesToMoves(moveNames: MoveNames[], member: PartyMember | EnemyMember) {
    const moveMapping: {
      [key: string]: Move
    } = {}
    moveNames.forEach((moveName: MoveNames) => {
      switch (moveName) {
        case MoveNames.PUNCH: {
          moveMapping[moveName] = new Punch(this, member)
          break
        }
        case MoveNames.ENEMY_CHARGE: {
          moveMapping[moveName] = new EnemyCharge(this, member)
          break
        }
        case MoveNames.STOMP: {
          moveMapping[moveName] = new Stomp(this, member)
          break
        }
      }
    })
    return moveMapping
  }

  isRoundOver() {
    return this.getPlayerParty().length == 0 || this.getEnemies().length == 0
  }

  handleRoundOver() {
    if (this.getPlayerParty().length == 0) {
      const dreamEndPayload: DreamEndPayload = {
        enemiesDefeated: this.enemiesDefeated,
        wavesCompleted: Math.max(0, this.waveNumber - 1),
      }
      this.scene.start('dream-end', dreamEndPayload)
      this.enemiesDefeated = []
      this.waveNumber = 0
    } else {
      this.handleWaveComplete()
    }
  }

  handleWaveComplete() {
    this.cpu.enemies.forEach((enemy) => {
      enemy.sprite.setVisible(false)
    })
    this.waveCompleteText.setText(`Wave ${this.waveNumber} Complete!`)
    this.waveCompleteText.setAlpha(0)
    this.waveCompleteText.setVisible(true)
    this.tweens.add({
      targets: [this.waveCompleteText],
      alpha: {
        from: 0,
        to: 1,
      },
      ease: Phaser.Math.Easing.Sine.In,
      duration: 500,
      hold: 2000,
      yoyo: true,
      onComplete: () => {
        this.waveNumber++
        this.cpu.generateEnemies()
        this.startTurn(Side.PLAYER)
      },
    })
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

  onMoveCompleted() {
    if (this.currTurn == Side.PLAYER) {
      this.player.onMoveCompleted()
    } else {
      this.cpu.onMoveCompleted()
    }
  }
}
