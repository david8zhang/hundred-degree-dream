import { MoveNames } from '~/core/moves/MoveNames'

export interface EnemyConfig {
  maxHealth: number
  spriteTexture: string
  moveNames: MoveNames[]
  baseExpReward: number
  body?: {
    width: number
    height: number
  }
}

export const BARNACLE = {
  maxHealth: 5,
  spriteTexture: 'barnacle',
  moveNames: [MoveNames.ENEMY_CHARGE, MoveNames.ENEMY_MULTI],
  baseExpReward: 6,
}

export const GREEN_FISH = {
  maxHealth: 5,
  spriteTexture: 'fishGreen',
  moveNames: [MoveNames.ENEMY_CHARGE, MoveNames.ENEMY_MULTI],
  baseExpReward: 6,
}

export const SNAIL = {
  maxHealth: 3,
  spriteTexture: 'snail',
  moveNames: [MoveNames.ENEMY_CHARGE],
  baseExpReward: 3,
}

export const SPIDER = {
  maxHealth: 3,
  spriteTexture: 'spider',
  moveNames: [MoveNames.ENEMY_CHARGE],
  baseExpReward: 3,
}

export const BLUE_SLIME = {
  maxHealth: 3,
  spriteTexture: 'slimeBlue',
  moveNames: [MoveNames.ENEMY_CHARGE],
  baseExpReward: 3,
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
}

export const ALL_ENEMY_CONFIGS = [BARNACLE, GREEN_FISH, SNAIL, SPIDER, BLUE_SLIME]
export const ALL_NIGHTMARE_CONFIGS = [NIGHTMARE_KING_LEG]
// export const ALL_NIGHTMARE_CONFIGS = [NIGHTMARE_KING_HEAD, NIGHTMARE_KING_ARM, NIGHTMARE_KING_LEG]
