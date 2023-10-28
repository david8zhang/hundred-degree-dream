import { CPU } from '~/core/CPU'
import { EnemyMember } from '~/core/EnemyMember'
import { PartyMember } from '~/core/PartyMember'
import { Player } from '~/core/Player'
import { EnemyCharge } from '~/core/moves/EnemyCharge'
import { Kick } from '~/core/moves/Kick'
import { Move } from '~/core/moves/Move'
import { MoveNames } from '~/core/moves/MoveNames'
import { Punch } from '~/core/moves/Punch'
import { Constants, Side } from '~/utils/Constants'

export class Dungeon extends Phaser.Scene {
  public player!: Player
  public cpu!: CPU
  public currTurn: Side = Side.PLAYER
  public updateCallbacks: Function[] = []

  constructor() {
    super('dungeon')
  }

  create() {
    this.player = new Player(this, {
      characterConfigs: Constants.PARTY_MEMBER_CONFIGS,
    })
    this.cpu = new CPU(this)
    this.cpu.generateEnemies()
    this.player.startTurn()
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
        case MoveNames.KICK: {
          moveMapping[moveName] = new Kick(this, member)
          break
        }
        case MoveNames.PUNCH: {
          moveMapping[moveName] = new Punch(this, member)
          break
        }
        case MoveNames.ENEMY_CHARGE: {
          moveMapping[moveName] = new EnemyCharge(this, member)
          break
        }
      }
    })
    return moveMapping
  }

  getEnemies() {
    return this.cpu.enemies
  }

  getPlayerParty() {
    return this.player.party
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
