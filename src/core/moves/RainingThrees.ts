import { Move, MovePayload, TargetType } from './Move'
import { PartyMember } from '../PartyMember'
import { EnemyMember } from '../EnemyMember'
import { Dream } from '~/scenes/Dream'
import { MoveNames } from './MoveNames'
import { UINumber } from '../UINumber'
import { Save, SaveKeys } from '~/utils/Save'
import { Constants } from '~/utils/Constants'

export class RainingThrees extends Move {
  private static MAX_NUM_BALLS = 3
  private static DAMAGE = 1
  private static HIT_FLAVOR_TEXT = ['Swish!', 'BANG!', 'Buckets!', 'Splash!']

  private currNumBalls = RainingThrees.MAX_NUM_BALLS
  private graphics: Phaser.GameObjects.Graphics
  private crosshairPath!: Phaser.Curves.Ellipse
  private crosshair!: Phaser.GameObjects.PathFollower
  private assetsToCleanUp: Phaser.GameObjects.GameObject[] = []
  private collidersToCleanUp: Phaser.Physics.Arcade.Collider[] = []

  constructor(scene: Dream, member: PartyMember | EnemyMember) {
    super(scene, {
      name: MoveNames.RAINING_THREES,
      member,
      onMoveCompleted: () => scene.onMoveCompleted(),
      targetType: TargetType.AREA,
      description: '',
    })
    this.graphics = this.scene.add.graphics()
    this.graphics.setDepth(2000)
    this.crosshairPath = new Phaser.Curves.Ellipse(0, 0, 150)
    this.setupInputListener()
  }

  setupInputListener() {
    this.scene.input.keyboard.on('keydown', (e) => {
      if (this.isExecuting && this.currNumBalls > 0) {
        if (e.keyCode === Phaser.Input.Keyboard.KeyCodes.F) {
          this.shootBasketball()
        }
      }
    })
  }

  resetMoveState() {
    this.collidersToCleanUp.forEach((obj) => {
      if (obj.active) {
        obj.destroy()
      }
    })
    this.assetsToCleanUp.forEach((obj) => {
      if (obj.active) {
        obj.destroy()
      }
    })
    this.collidersToCleanUp = []
    this.assetsToCleanUp = []
    this.isExecuting = false
    this.currNumBalls = RainingThrees.MAX_NUM_BALLS
  }

  shootBasketball() {
    this.currNumBalls--
    const crosshairX = this.crosshair.x
    const crosshairY = this.crosshair.y
    const crosshairAfterImage = this.scene.add
      .sprite(crosshairX, crosshairY, 'crosshair')
      .setAlpha(0.5)

    const newBasketball = this.scene.physics.add
      .sprite(this.member.sprite.x, this.member.sprite.y, 'basketball')
      .setGravityY(980)
    const angle = Phaser.Math.Angle.Between(
      this.member.sprite.x,
      this.member.sprite.y,
      crosshairX,
      crosshairY
    )
    this.scene.physics.velocityFromRotation(angle, 850, newBasketball.body.velocity)
    const enemiesCollided = new Set()

    const partyMember = this.member as PartyMember

    const overlap = this.scene.physics.add.overlap(
      newBasketball,
      this.scene.cpu.enemyGroup,
      (obj1, obj2) => {
        const enemy = obj2.getData('ref') as EnemyMember
        if (!enemiesCollided.has(enemy.id) && enemy.currHealth > 0) {
          enemiesCollided.add(enemy.id)
          const level = Save.getData(SaveKeys.CURR_LEVEL) as number
          enemy.takeDamage(Constants.calculateDamageBasedOnLevel(RainingThrees.DAMAGE, level))
          const randomFlavorText = Phaser.Utils.Array.GetRandom(RainingThrees.HIT_FLAVOR_TEXT)
          UINumber.createNumber(
            randomFlavorText,
            this.scene,
            enemy.sprite.x,
            enemy.sprite.y - enemy.sprite.displayHeight - 30,
            partyMember.darkTheme ? 'white' : 'black',
            '30px'
          )

          this.scene.time.delayedCall(500, () => {
            newBasketball.destroy()
          })
        }
      }
    )
    this.collidersToCleanUp.push(overlap)
    this.assetsToCleanUp.push(newBasketball)
    this.assetsToCleanUp.push(crosshairAfterImage)
    if (this.currNumBalls == 0) {
      this.crosshair.stopFollow()
      this.crosshair.setVisible(false)
      this.scene.time.delayedCall(3000, () => {
        this.resetMoveState()
        this.onMoveCompleted()
      })
    }
  }

  public execute(): void {
    this.isExecuting = true
    // Tween the crosshair
    this.crosshairPath.x = this.member.sprite.x
    this.crosshairPath.y = this.member.sprite.y
    const startPoint = this.crosshairPath.getStartPoint()
    this.crosshair = this.scene.add.follower(
      this.crosshairPath as unknown as Phaser.Curves.Path,
      startPoint.x,
      startPoint.y,
      'crosshair'
    )
    const partyMember = this.member as PartyMember
    this.crosshair.setTintFill(partyMember.darkTheme ? 0xffffff : 0x000000)
    this.crosshair.setDepth(2000)
    this.crosshair.startFollow({
      from: 0,
      to: -0.25,
      duration: 1500,
      yoyo: true,
      repeat: -1,
    })
    this.assetsToCleanUp.push(this.crosshair)
  }
}
