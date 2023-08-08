import { SphereGeometry, Vector3, Scene } from 'three'

import { ballCollideSphere } from '../../math/collisions'
import { Ball } from '../canvas/ball.class'
import { Figure } from './figure.abstract.class'
import { config } from '../../config'

export class Sphere extends Figure<SphereGeometry> {
  constructor(scene: Scene, position: Vector3) {
    const geometry = new SphereGeometry(config.figure.radius)
    super(scene, geometry, position)
  }

  get r() {
    return this.geometry.parameters.radius
  }

  collide(ball: Ball) {
    return this.isEnabled
      ? ballCollideSphere(ball, this, config.environment.energyRetain.collision)
      : false
  }
}
