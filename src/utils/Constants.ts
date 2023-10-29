import { MoveNames } from '~/core/moves/MoveNames'

export enum Side {
  PLAYER = 'PLAYER',
  CPU = 'CPU',
}

export interface CharacterConfig {
  name: string
  maxHealth: number
  spriteTexture: string
  moveNames: MoveNames[]
}

export class Constants {
  public static WINDOW_WIDTH = 1000
  public static WINDOW_HEIGHT = 800
  public static MOVE_SPEED = 300
  public static MULTIPLIER_INC_AMOUNT = 0.25
  public static NUM_WAVES_PER_INC = 4

  public static RIGHTMOST_PLAYER_X_POS = Constants.WINDOW_WIDTH / 3
  public static LEFTMOST_CPU_X_POS = Constants.RIGHTMOST_PLAYER_X_POS * 2

  public static PARTY_MEMBER_CONFIGS = [
    {
      name: 'player',
      maxHealth: 10,
      spriteTexture: 'temp-player',
      moveNames: [MoveNames.PUNCH, MoveNames.STOMP],
    },
  ]

  public static getWaveMultiplier(waveNumber: number) {
    return (
      1 + Math.floor(waveNumber / Constants.NUM_WAVES_PER_INC) * Constants.MULTIPLIER_INC_AMOUNT
    )
  }

  public static scaleExpGainedFromLevel(exp: number, level: number) {
    return Math.round(exp / Math.round(Math.log2(level)))
  }

  public static createArc(
    sprite: Phaser.Physics.Arcade.Sprite,
    landingPosition: { x: number; y: number },
    duration: number
  ) {
    const xVelocity = (landingPosition.x - sprite.x) / duration
    const yVelocity = (landingPosition.y - sprite.y - 490 * Math.pow(duration, 2)) / duration
    sprite.setVelocity(xVelocity, yVelocity)
    sprite.setGravityY(980)
  }
}
