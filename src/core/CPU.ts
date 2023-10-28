import { Constants, Side } from '~/utils/Constants'
import { PartyMember } from './PartyMember'
import { Dungeon } from '~/scenes/Dungeon'
import { EnemyMember } from './EnemyMember'
import { MoveNames } from './moves/MoveNames'

export class CPU {
  public enemies: EnemyMember[] = []
  private scene: Dungeon
  private enemyToActIndex: number = 0

  constructor(scene: Dungeon) {
    this.scene = scene
  }

  generateEnemies() {
    let xPos = Constants.LEFTMOST_CPU_X_POS
    const yPos = 400
    const numEnemies = 3

    for (let i = 0; i < numEnemies; i++) {
      const enemy = new EnemyMember(this.scene, {
        position: {
          x: xPos,
          y: yPos,
        },
        maxHealth: 10, // Should be based on enemy type config
        spriteTexture: 'temp-enemy',
        moveNames: [MoveNames.ENEMY_CHARGE],
      })
      this.enemies.push(enemy)
      xPos += enemy.sprite.displayWidth + 20
    }
  }

  get livingEnemies() {
    return this.enemies.filter((e) => e.currHealth > 0)
  }

  startTurn() {
    this.processEnemyAction()
  }

  processEnemyAction() {
    if (!this.scene.isRoundOver()) {
      const enemyToAct = this.enemies[this.enemyToActIndex]
      const move = enemyToAct.getMoveToExecute()
      move.execute()
    } else {
      this.scene.handleRoundOver()
    }
  }

  onMoveCompleted() {
    if (this.enemyToActIndex == this.enemies.length - 1) {
      this.enemyToActIndex = 0
      this.scene.startTurn(Side.PLAYER)
    } else {
      this.enemyToActIndex++
      this.processEnemyAction()
    }
  }
}
