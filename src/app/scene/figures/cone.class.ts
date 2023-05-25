import * as THREE from 'three'
import { ballCollideCone } from '../../math/collisions'
import { Ball } from '../canvas/ball.class'
import { Figure } from './figure.abstract.class'
import { config } from '../../config'

export class Cone extends Figure<THREE.ConeGeometry> {
  readonly sin: number
  readonly cos: number

  constructor(scene: THREE.Scene, position: THREE.Vector3) {
    const { radius, height } = config.figure
    const geometry = new THREE.ConeGeometry(radius, height)
    super(scene, geometry, position)

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
    return this.isEnabled
      ? ballCollideCone(ball, this, config.environment.energyRetain.collision)
      : false
  }
}
