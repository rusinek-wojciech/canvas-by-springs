import * as THREE from 'three'
import { Ball } from './ball'
import { BALL_MASS, SPRING_B, SPRING_K, SPRING_L } from './config'

export interface Spring {
  mesh: THREE.Line<THREE.BufferGeometry, THREE.Material>
  ball1: Ball
  ball2: Ball
}

const tmp = new THREE.Vector3()
const tmp2 = new THREE.Vector3()
const tmp3 = new THREE.Vector3()

export class Spring {
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
    const distanceVec = tmp.copy(this.ball1.position).sub(this.ball2.position)
    const distance = distanceVec.length()

    const factor = (-SPRING_K * (distance - SPRING_L)) / distance

    const v2 = tmp3
      .copy(this.ball2.force)
      .multiplyScalar(dt / BALL_MASS)
      .add(this.ball2.velocity)

    const v1 = tmp2
      .copy(this.ball1.force)
      .multiplyScalar(dt / BALL_MASS)
      .add(this.ball1.velocity)

    const bForce = v1.sub(v2).multiplyScalar(SPRING_B)
    const F1 = distanceVec.multiplyScalar(factor).sub(bForce)

    this.ball1.force.add(F1)
    this.ball2.force.add(F1.negate())
  }

  draw() {
    this.mesh.geometry.setFromPoints([this.ball1.position, this.ball2.position])
  }
}
