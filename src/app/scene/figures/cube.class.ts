import * as THREE from 'three'
import { ballCollideCube } from '../../physics/collisions'
import { Ball } from '../canvas/ball.class'
import { Figure } from './figure.abstract.class'
import { config } from '../../config'

export class Cube extends Figure<THREE.BoxGeometry> {
  constructor(scene: THREE.Scene, position: THREE.Vector3) {
    const { width, height, depth } = config.figure
    const geometry = new THREE.BoxGeometry(width, height, depth)
    super(scene, geometry, position)
  }

  get h() {
    return this.geometry.parameters.height
  }

  get w() {
    return this.geometry.parameters.width
  }

  get d() {
    return this.geometry.parameters.depth
  }

  collide(ball: Ball) {
    return this.isEnabled
      ? ballCollideCube(ball, this, config.environment.energyRetain.collision)
      : false
  }
}
