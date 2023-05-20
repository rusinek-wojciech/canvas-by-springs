import * as THREE from 'three'
import { ballCollideSphere } from '../../physics/collisions'
import { Ball } from './ball.class'
import { Figure } from './figure.abstract.class'
import { config } from '../../config'

export class Sphere extends Figure<THREE.SphereGeometry> {
  constructor(position: THREE.Vector3) {
    const geometry = new THREE.SphereGeometry(config.figure.radius)
    super(geometry, position)
  }

  get r() {
    return this.geometry.parameters.radius
  }

  collide(ball: Ball) {
    return ballCollideSphere(ball, this, config.environment.energyRetain)
  }
}
