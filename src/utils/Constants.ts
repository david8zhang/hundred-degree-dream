import { MoveNames } from '~/core/moves/MoveNames'

export enum Side {
  PLAYER = 'PLAYER',
  CPU = 'CPU',
}

export enum TVChannels {
  SPORTS = 'SPORTS',
  COOKING = 'COOKING',
  NATURE = 'NATURE',
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

  public static BOSS_HIT_BOX = {
    x: Constants.WINDOW_WIDTH - 100,
    y: Constants.WINDOW_HEIGHT / 2 - 100,
  }

  public static INSTRUCTION_TEXT_LOCATION = {
    x: Constants.WINDOW_WIDTH / 2,
    y: Constants.WINDOW_HEIGHT * 0.9,
  }

  public static INSTRUCTION_TEXT_LOCATION_TUTORIAL = {
    y: Constants.WINDOW_HEIGHT * 0.25,
  }

  public static CHARACTER_CONFIGS = {
    Jambo: {
      name: 'Jambo',
      maxHealth: 10,
      spriteTexture: 'jambo',
      moveNames: [MoveNames.PUNCH, MoveNames.STOMP],
    },
    Chef: {
      name: 'Chef',
      maxHealth: 10,
      spriteTexture: 'chef',
      moveNames: [MoveNames.PUNCH, MoveNames.LET_HIM_COOK],
    },
    Athlete: {
      name: 'Athlete',
      maxHealth: 10,
      spriteTexture: 'athlete',
      moveNames: [MoveNames.PUNCH, MoveNames.RAINING_THREES],
    },
    Tiger: {
      name: 'Tiger',
      maxHealth: 10,
      spriteTexture: 'tiger',
      moveNames: [MoveNames.PUNCH, MoveNames.MAUL],
    },
  }

  public static SPORTS_CHANNEL_TEXT = [
    `*It's the basketball game. The LA superstar throws down a huge dunk, eliciting loud cheers from the crowd*"`,
    `"Welcome back to the game, we've got a close one here in South Beach. Down to 5 seconds. Miami to inbound. A 3 pointer! BANG! BANG! MIAMI WIN THE GAME!"`,
    `"You're watching basketball on TNT. A deep 3! He got it! Look at him man, so inspirational..."`,
    `*Some kind of basketball talk show is on. A wrinkly old man pounds his desk in an over-exaggerated fashion*. "He will never be that guy! He just doesn't have the clutch gene! You know it and I know it!"`,
  ]

  public static COOKING_CHANNEL_TEXT = [
    `*A reality cooking show is on. An angry celebrity chef slams his hand down* "Who cooked this salmon? It's <bleep> RAWW!"`,
    `*Dinner service on a reality cooking show. An angry looking celebrity chef holds up a plate* "Come here big boy. Look at this! What is that? It's <bleep> RAW!"`,
    `*It's a reality cooking show. An angry celebrity chef berates a contestant.* "<bleep> off you useless <bleep>, the lamb is RAW! You donkey!"`,
  ]

  public static NATURE_CHANEL_TEXT = [
    `*A nature documentary is on. A majestic tiger strolls through the woods to join a group of other tigers.*. The male's presence here keeps away others who might pose a threat to the cubs"`,
    `*It's a nature documentary. A tiger stalks a deer in the woods*. "A spotted deer appears. His stalking technique has improved. Now his success will depend on his timing."`,
    `*It's a nature documentary. A tiger cub approaches his father*. "Tiger fathers rarely meet their offspring. And he doesn't seem keen to get acquainted."`,
  ]

  public static FALLING_ASLEEP_TEXT = `The sound from the TV begins to grow faint and distorted. Your eyelids feel heavy... `

  public static getWaveMultiplier(waveNumber: number) {
    return (
      1 + Math.floor(waveNumber / Constants.NUM_WAVES_PER_INC) * Constants.MULTIPLIER_INC_AMOUNT
    )
  }

  public static scaleExpGainedFromLevel(exp: number, level: number) {
    if (level == 1) {
      return exp
    }
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

  public static calculateDamageBasedOnLevel(damage: number, level: number) {
    return Math.round(damage + (level - 1) * 0.25)
  }
}
