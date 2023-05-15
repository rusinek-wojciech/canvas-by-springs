import * as THREE from 'three'
import { Ball } from './ball'
import { BALLS_PER_ROW, SPRING_B, SPRING_K, SPRING_L } from './config'
import { vec } from './utils'

export function createSquareSprings(scene: THREE.Scene, balls: Ball[][]) {
  const springs: Spring[] = []

  for (let i = 0; i < BALLS_PER_ROW; i++) {
    for (let j = 1; j < BALLS_PER_ROW; j++) {
      const spring1 = new Spring(balls[i][j], balls[i][j - 1])
      const spring2 = new Spring(balls[j][i], balls[j - 1][i])

      scene.add(spring1.mesh, spring2.mesh)
      springs.push(spring1, spring2)
    }
  }
  return springs
}

export function createDiagonalSprings(scene: THREE.Scene, balls: Ball[][]) {
  const springs: Spring[] = []

  for (let i = 1; i < BALLS_PER_ROW; i++) {
    for (let j = 1; j < BALLS_PER_ROW; j++) {
      const spring1 = new Spring(balls[i][j], balls[i - 1][j - 1])
      const spring2 = new Spring(balls[i][j - 1], balls[i - 1][j])

      scene.add(spring1.mesh, spring2.mesh)
      springs.push(spring1, spring2)
    }
  }
  return springs
}

export function createJoinedSprings(scene: THREE.Scene, balls: Ball[][]) {
  return [
    ...createSquareSprings(scene, balls),
    ...createDiagonalSprings(scene, balls),
  ]
}

interface Spring {
  mesh: THREE.Line<THREE.BufferGeometry, THREE.Material>
  ball1: Ball
  ball2: Ball
}

class Spring {
  constructor(ball1: Ball, ball2: Ball) {
    this.mesh = new THREE.Line(
      new THREE.BufferGeometry(),
      new THREE.LineBasicMaterial({ color: 0x000000 })
    )
    this.ball1 = ball1
    this.ball2 = ball2
  }

  /**
   *  F1 = -F2 = -k * (||X1 - X2|| - L) * ((X1 - X2) / (||X1 - X2||)) - b * (V1 - V2)
   */
  calculate(dt: number) {
    const v1 = this.ball1.velocityStep(dt)
    const v2 = this.ball2.velocityStep(dt)

    const distanceVec = vec(this.ball1.position).sub(this.ball2.position)
    const distance = distanceVec.length()

    const factor = (-SPRING_K * (distance - SPRING_L)) / distance

    const F1 = distanceVec
      .multiplyScalar(factor)
      .sub(v1.sub(v2).multiplyScalar(SPRING_B))
    const F2 = vec(distanceVec).negate()

    this.ball1.force.add(F1)
    this.ball2.force.add(F2)
  }

  draw() {
    this.mesh.geometry.setFromPoints([this.ball1.position, this.ball2.position])
    this.mesh.geometry.computeBoundingSphere()
  }
}
