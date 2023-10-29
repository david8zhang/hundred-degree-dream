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

  public static PARTY_MEMBER_CONFIGS = [
    {
      name: 'player',
      maxHealth: 10,
      spriteTexture: 'temp-player',
      moveNames: [MoveNames.PUNCH, MoveNames.STOMP],
    },
  ]

  public static SPORTS_CHANNEL_TEXT = [
    `*It's the basketball game* "Lebron James with the monster dunk over Dillon Brooks! Lakers lead by 40!"`,
    `"Welcome back to NBA Basketball, we've got a close one here in South Beach. Down to 5 seconds. Heat inbound, dangerous pass. Butler for 3! BANG! BANG! HEAT WIN THE GAME!"`,
    `"You're watching NBA basketball on TNT. Steph with a deep 3! He got it! Look at Curry man, so inspirational..."`,
    `*Some kind of basketball talk show is on. A wrinkly old man pounds his desk in an over-exaggerated fashion*. "Lebron James will never be Michael Jeffrey Jordan! He just doesn't have the clutch gene! You know it and I know it!"`,
  ]

  public static COOKING_CHANNEL_TEXT = [
    `*A reality cooking show is on. Gordon Ramsay looks like he's about to blow a gasket* "Who cooked this salmon? It's <bleep> RAWW!"`,
    `*Dinner service on a reality cooking show. Gordon looks pissed, as usual* "Come here big boy. Look at this lobster! LOOK AT IT! What is that? It's <bleep> RAW!"`,
    `*It's a reality cooking show* "<bleep> off you useless <bleep>, the lamb is RAW! You donkey!"`,
    `*A reality TV show is on about bad restaurant owners*. "He doesn't do crap at this restaurant. Just like last night he went up to every table and said 'Hello my name's NEENOOO'. - No, let me talk. Mr. Always Talking? You gonna let me talk?"`,
  ]

  public static NATURE_CHANEL_TEXT = [
    `*A nature documentary is on. A majestic tiger strolls through the woods to join a group of other tigers.*. "Although Khan doesn't spend much time with his family, his presence here keeps away young males who might pose a threat to the cubs"`,
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
}
