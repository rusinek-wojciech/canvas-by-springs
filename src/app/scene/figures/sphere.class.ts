import * as THREE from 'three'
import { ballCollideSphere } from '../../physics/collisions'
import { Ball } from './ball.class'
import { Figure } from './figure.abstract.class'

export class Sphere extends Figure<THREE.SphereGeometry> {
  constructor(position: THREE.Vector3) {
    const geometry = new THREE.SphereGeometry(5)
    super(geometry, position)
  }

  get r() {
    return this.geometry.parameters.radius
  }

  collide(ball: Ball, energyRetain: number) {
    return ballCollideSphere(ball, this, energyRetain)
  }
}
