import * as THREE from 'three'
import { Ball } from './ball'
import { Drawable } from '../types'
import { config } from '../config'
import { springForce } from './physics'

// changeable dynamically
const SPRING_CONFIG = config.canvas.spring

export interface Spring {
  mesh: THREE.Line<THREE.BufferGeometry, THREE.Material>
  ball1: Ball
  ball2: Ball
}

// for performance
const tmp = new THREE.Vector3()
const tmp2 = new THREE.Vector3()
const tmp3 = new THREE.Vector3()

export class Spring implements Drawable {
  constructor(ball1: Ball, ball2: Ball) {
    this.mesh = new THREE.Line(
      new THREE.BufferGeometry().setFromPoints([
        ball1.position,
        ball2.position,
      ]),
      new THREE.LineBasicMaterial({ color: 0x000000 })
    )
    this.ball1 = ball1
    this.ball2 = ball2
  }

  get geometry() {
    return this.mesh.geometry
  }

  calculate(dt: number) {
    const F1 = springForce(
      SPRING_CONFIG.K,
      SPRING_CONFIG.L,
      SPRING_CONFIG.B,
      tmp.copy(this.ball1.position),
      this.ball2.position,
      this.ball1.calculateVelocity(tmp2, dt),
      this.ball2.calculateVelocity(tmp3, dt)
    )
    this.ball1.force.add(F1)
    this.ball2.force.add(F1.negate())
  }

  draw(_dt: number) {
    // for petter perfomance - updated reference
    const positions = this.geometry.getAttribute('position').array as number[]

    positions[0] = this.ball1.position.x
    positions[1] = this.ball1.position.y
    positions[2] = this.ball1.position.z
    positions[3] = this.ball2.position.x
    positions[4] = this.ball2.position.y
    positions[5] = this.ball2.position.z

    this.geometry.attributes.position.needsUpdate = true
    this.geometry.computeBoundingSphere()
  }
}
