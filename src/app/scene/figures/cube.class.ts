import * as THREE from 'three'
import { ballCollideCube } from '../../physics/collisions'
import { Ball } from './ball.class'
import { Figure } from './figure.abstract.class'
import { config } from '../../config'

export class Cube extends Figure<THREE.BoxGeometry> {
  readonly D: THREE.Vector3

  constructor(position: THREE.Vector3) {
    const { width, height, depth } = config.figure

    const geometry = new THREE.BoxGeometry(width, height, depth)
    super(geometry, position)
    this.D = new THREE.Vector3(width, height, depth)
  }

  collide(ball: Ball, energyRetain: number) {
    return ballCollideCube(ball, this, energyRetain)
  }
}
