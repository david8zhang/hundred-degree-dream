import { MoveNames } from '~/core/moves/MoveNames'

export enum Side {
  PLAYER = 'PLAYER',
  CPU = 'CPU',
}

export interface CharacterConfig {
  maxHealth: number
  spriteTexture: string
  moveNames: MoveNames[]
}

export class Constants {
  public static WINDOW_WIDTH = 1000
  public static WINDOW_HEIGHT = 800

  public static RIGHTMOST_PLAYER_X_POS = Constants.WINDOW_WIDTH / 3
  public static LEFTMOST_CPU_X_POS = Constants.RIGHTMOST_PLAYER_X_POS * 2

  public static PARTY_MEMBER_CONFIGS = [
    {
      maxHealth: 10,
      spriteTexture: 'temp-player',
      moveNames: [MoveNames.PUNCH, MoveNames.KICK],
    },
    {
      maxHealth: 10,
      spriteTexture: 'temp-ally',
      moveNames: [],
    },
  ]
}
