import * as THREE from 'three'
import { ballCollideCone } from '../../physics/collisions'
import { Ball } from './ball.class'
import { Figure } from './figure.abstract.class'
import { config } from '../../config'

export class Cone extends Figure<THREE.ConeGeometry> {
  readonly sin: number
  readonly cos: number

  constructor(position: THREE.Vector3) {
    const { radius, height } = config.figure
    const geometry = new THREE.ConeGeometry(radius, height)
    super(geometry, position)

    const wall = new THREE.Vector2(radius, height).length()
    this.sin = radius / wall
    this.cos = height / wall
  }

  get r() {
    return this.geometry.parameters.radius
  }

  get h() {
    return this.geometry.parameters.height
  }

  collide(ball: Ball) {
    return ballCollideCone(ball, this, config.environment.energyRetain)
  }
}
