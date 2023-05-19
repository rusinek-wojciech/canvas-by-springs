import * as THREE from 'three'
import { ballCollideCone } from '../../physics/collisions'
import { Ball } from './ball.class'
import { Figure } from './figure.abstract.class'
import { config } from '../../config'

export class Cone extends Figure<THREE.ConeGeometry> {
  constructor(position: THREE.Vector3) {
    const geometry = new THREE.ConeGeometry(
      config.figure.radius,
      config.figure.height
    )
    super(geometry, position)
  }

  get r() {
    return this.geometry.parameters.radius
  }

  collide(ball: Ball, energyRetain: number) {
    return ballCollideCone(ball, this, energyRetain)
  }
}
