import * as THREE from 'three'
import { Ball } from './ball'
import { SPRING_B, SPRING_K, SPRING_L } from './config'
import { vec } from './utils'

export interface Spring {
  mesh: THREE.Line<THREE.BufferGeometry, THREE.Material>
  ball1: Ball
  ball2: Ball
}

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
    const distanceVec = vec(this.ball1.position).sub(this.ball2.position)
    const distance = distanceVec.length()

    const factor = (-SPRING_K * (distance - SPRING_L)) / distance

    const F1 = distanceVec
      .multiplyScalar(factor)
      .sub(
        this.ball1
          .velocityStep(dt)
          .sub(this.ball2.velocityStep(dt))
          .multiplyScalar(SPRING_B)
      )
    const F2 = vec(distanceVec).negate()

    this.ball1.force.add(F1)
    this.ball2.force.add(F2)
  }

  draw() {
    this.mesh.geometry.setFromPoints([this.ball1.position, this.ball2.position])
    this.mesh.geometry.computeBoundingSphere()
  }
}
