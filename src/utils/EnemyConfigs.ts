import { MoveNames } from '~/core/moves/MoveNames'

export interface EnemyConfig {
  maxHealth: number
  spriteTexture: string
  moveNames: MoveNames[]
  baseExpReward: number
}

export const BARNACLE = {
  maxHealth: 4,
  spriteTexture: 'barnacle',
  moveNames: [MoveNames.ENEMY_CHARGE],
  baseExpReward: 6,
}

export const GREEN_FISH = {
  maxHealth: 4,
  spriteTexture: 'fishGreen',
  moveNames: [MoveNames.ENEMY_CHARGE],
  baseExpReward: 6,
}

export const SNAIL = {
  maxHealth: 2,
  spriteTexture: 'snail',
  moveNames: [MoveNames.ENEMY_CHARGE],
  baseExpReward: 3,
}

export const SPIDER = {
  maxHealth: 2,
  spriteTexture: 'spider',
  moveNames: [MoveNames.ENEMY_CHARGE],
  baseExpReward: 3,
}

export const BLUE_SLIME = {
  maxHealth: 2,
  spriteTexture: 'slimeBlue',
  moveNames: [MoveNames.ENEMY_CHARGE],
  baseExpReward: 3,
}

export const ALL_ENEMY_CONFIGS = [BARNACLE, GREEN_FISH, SNAIL, SPIDER, BLUE_SLIME]
