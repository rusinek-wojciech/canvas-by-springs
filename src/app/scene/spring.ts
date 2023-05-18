import * as THREE from 'three'
import { Ball } from './ball'
import { config } from '../config'
import { springForce } from '../physics/formulas'

// changeable dynamically
const SPRING_CONFIG = config.canvas.spring

// for performance
const tmp_1 = new THREE.Vector3()
const tmp_2 = new THREE.Vector3()

export class Spring {
  readonly mesh
  readonly ball1
  readonly ball2

  constructor(ball1: Ball, ball2: Ball) {
    this.mesh = new THREE.Line(
      new THREE.BufferGeometry().setFromPoints([ball1.X, ball2.X]),
      new THREE.LineBasicMaterial({ color: 0x000000 })
    )
    this.ball1 = ball1
    this.ball2 = ball2
  }

  updateState() {
    const F1 = tmp_1
    const F2 = tmp_2

    springForce(
      F1,
      F2,
      SPRING_CONFIG.K,
      SPRING_CONFIG.L,
      SPRING_CONFIG.B,
      this.ball1._X,
      this.ball2._X,
      this.ball1._V,
      this.ball2._V
    )
    this.ball1.F.add(F1)
    this.ball2.F.add(F2)
  }

  draw() {
    // for petter perfomance - updated reference
    const positions = this.mesh.geometry.getAttribute('position')
      .array as number[]

    positions[0] = this.ball1.X.x
    positions[1] = this.ball1.X.y
    positions[2] = this.ball1.X.z
    positions[3] = this.ball2.X.x
    positions[4] = this.ball2.X.y
    positions[5] = this.ball2.X.z

    this.mesh.geometry.attributes.position.needsUpdate = true
    this.mesh.geometry.computeBoundingSphere()
  }
}
