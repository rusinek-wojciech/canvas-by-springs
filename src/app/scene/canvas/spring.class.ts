import * as THREE from 'three'
import { Ball } from '../figures'
import { config } from '../../config'
import { springForce } from '../../physics/formulas'

const tmp_1 = new THREE.Vector3()

export class Spring {
  readonly mesh

  readonly ball1
  readonly ball2

  private static readonly material = new THREE.LineBasicMaterial({
    color: 0x000000,
  })

  constructor(scene: THREE.Scene, ball1: Ball, ball2: Ball) {
    this.mesh = new THREE.Line(
      new THREE.BufferGeometry().setFromPoints([ball1.X, ball2.X]),
      Spring.material
    )
    scene.add(this.mesh)

    this.ball1 = ball1
    this.ball2 = ball2
  }

  updateState() {
    const { K, L, B } = config.canvas.spring
    const F = tmp_1

    springForce(
      F,
      this.ball1.X,
      this.ball2.X,
      this.ball1.V,
      this.ball2.V,
      K,
      L,
      B
    )

    this.ball1.F.add(F)
    this.ball2.F.sub(F)
  }

  repaint() {
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
