import { MoveNames } from '~/core/moves/MoveNames'
import { Constants } from './Constants'

export interface EnemyConfig {
  maxHealth: number
  currHealth?: number
  spriteTexture: string
  moveNames: MoveNames[]
  baseExpReward: number
  body?: {
    width: number
    height: number
  }
  position?: {
    x: number
    y: number
  }
}

export const BASKETBALL = {
  maxHealth: 3,
  spriteTexture: 'basketball-enemy',
  moveNames: [MoveNames.ENEMY_CHARGE],
  baseExpReward: 3,
}

export const HOOP = {
  maxHealth: 4,
  spriteTexture: 'hoop',
  moveNames: [MoveNames.ENEMY_CHARGE],
  baseExpReward: 4,
}

export const FAN = {
  maxHealth: 5,
  spriteTexture: 'fan',
  moveNames: [MoveNames.ENEMY_CHARGE, MoveNames.ENEMY_MULTI],
  baseExpReward: 5,
}

export const CARROT = {
  maxHealth: 3,
  spriteTexture: 'carrot',
  moveNames: [MoveNames.ENEMY_CHARGE],
  baseExpReward: 3,
}

export const CHILI = {
  maxHealth: 3,
  spriteTexture: 'chili',
  moveNames: [MoveNames.ENEMY_CHARGE],
  baseExpReward: 3,
}

export const DRUMSTICK = {
  maxHealth: 3,
  spriteTexture: 'drumstick',
  moveNames: [MoveNames.ENEMY_CHARGE],
  baseExpReward: 3,
}

export const RAT = {
  maxHealth: 5,
  spriteTexture: 'rat',
  moveNames: [MoveNames.ENEMY_CHARGE, MoveNames.ENEMY_MULTI],
  baseExpReward: 5,
}

export const MONKEY = {
  maxHealth: 4,
  spriteTexture: 'monkey',
  moveNames: [MoveNames.ENEMY_CHARGE, MoveNames.ENEMY_MULTI],
  baseExpReward: 4,
}

export const SNAKE = {
  maxHealth: 4,
  spriteTexture: 'snake',
  moveNames: [MoveNames.ENEMY_CHARGE, MoveNames.ENEMY_MULTI],
  baseExpReward: 4,
}

export const NIGHTMARE_KING_ARM = {
  maxHealth: 50,
  spriteTexture: 'boss-arm',
  moveNames: [MoveNames.NIGHTMARE_PUNCH],
  baseExpReward: 100,
  body: {
    width: 0.9,
    height: 0.5,
  },
  position: {
    x: Constants.WINDOW_WIDTH + 300,
    y: 350,
  },
}

export const NIGHTMARE_KING_LEG = {
  maxHealth: 50,
  spriteTexture: 'boss-foot',
  moveNames: [MoveNames.NIGHTMARE_SLAM],
  baseExpReward: 100,
  body: {
    width: 0.9,
    height: 0.9,
  },
  position: {
    x: Constants.WINDOW_WIDTH * 0.75,
    y: -250,
  },
}

export const NIGHTMARE_KING_HEAD = {
  maxHealth: 75,
  spriteTexture: 'boss-head',
  moveNames: [MoveNames.NIGHTMARE_LASER],
  baseExpReward: 150,
  body: {
    width: 0.9,
    height: 0.9,
  },
  position: {
    x: Constants.WINDOW_WIDTH - 75,
    y: 350,
  },
}

export const SPORTS_ENEMY_CONFIGS = [BASKETBALL, HOOP, FAN]
export const COOKING_ENEMY_CONFIGS = [CHILI, CARROT, DRUMSTICK, RAT]
export const NATURE_ENEMY_CONFIGS = [MONKEY, SNAKE]

export const ALL_NIGHTMARE_CONFIGS = [NIGHTMARE_KING_ARM]
