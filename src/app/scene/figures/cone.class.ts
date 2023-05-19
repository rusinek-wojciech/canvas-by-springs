import * as THREE from 'three'
import { ballCollideCone } from '../../physics/collisions'
import { Ball } from './ball.class'
import { Figure } from './figure.abstract.class'

export class Cone extends Figure<THREE.ConeGeometry> {
  constructor(position: THREE.Vector3) {
    const geometry = new THREE.ConeGeometry(5, 10)
    super(geometry, position)
  }

  get r() {
    return this.geometry.parameters.radius
  }

  collide(ball: Ball, energyRetain: number) {
    return ballCollideCone(ball, this, energyRetain)
  }
}
