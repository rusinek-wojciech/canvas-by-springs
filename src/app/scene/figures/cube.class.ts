import * as THREE from 'three'
import { ballCollideCube } from '../../physics/collisions'
import { Ball } from './ball.class'
import { Figure } from './figure.abstract.class'

export class Cube extends Figure<THREE.BoxGeometry> {
  readonly D: THREE.Vector3

  constructor(position: THREE.Vector3) {
    const geometry = new THREE.BoxGeometry(10, 10, 10)
    super(geometry, position)

    const { width, height, depth } = this.geometry.parameters
    this.D = new THREE.Vector3(width, height, depth)
  }

  collide(ball: Ball, energyRetain: number) {
    return ballCollideCube(ball, this, energyRetain)
  }
}
