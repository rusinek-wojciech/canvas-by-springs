import * as THREE from 'three'
import { config } from '../../config'
import { position, velocity } from '../../physics/formulas'
import { ballCollideBall } from '../../physics/collisions'
import { Figure } from './figure.abstract.class'

export class Ball extends Figure<THREE.SphereGeometry> {
  readonly m: number

  readonly _X = new THREE.Vector3()
  readonly _V = new THREE.Vector3()
  readonly V = new THREE.Vector3()
  readonly _F = new THREE.Vector3()
  readonly F = new THREE.Vector3()

  constructor(position: THREE.Vector3, color: string, mass: number) {
    const geometry = new THREE.SphereGeometry(config.canvas.ball.radius, 8, 4)
    super(
      geometry,
      position,
      new THREE.MeshStandardMaterial({
        color,
      })
    )
    this.m = mass
  }

  get r() {
    return this.geometry.parameters.radius
  }

  updateState(dt: number) {
    this._F.copy(this.F)
    this._V.copy(this.V)
    this._X.copy(this.X)

    this.F.copy(config.environment.gravity).add(config.environment.wind)
    velocity(this.V, this._F, this.m, this._V, dt)
    position(this.X, this.V, this._X, dt)
  }

  collide(ball: Ball) {
    return this.isEnabled
      ? ballCollideBall(ball, this, config.environment.energyRetain)
      : false
  }
}
