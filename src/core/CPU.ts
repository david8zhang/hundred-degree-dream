import { Constants } from '~/utils/Constants'
import { PartyMember } from './PartyMember'
import { Dungeon } from '~/scenes/Dungeon'
import { EnemyMember } from './EnemyMember'

export class CPU {
  public enemies: EnemyMember[] = []
  private scene: Dungeon

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
        moveNames: [],
      })
      this.enemies.push(enemy)
      xPos += enemy.sprite.displayWidth + 20
    }
  }

  onMoveCompleted() {}
}
