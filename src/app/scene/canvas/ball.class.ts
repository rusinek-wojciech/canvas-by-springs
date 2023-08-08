import { Vector3, Mesh, SphereGeometry, MeshStandardMaterial } from 'three'

import { config } from '../../config'
import { position, velocity } from '../../math/formulas'
import { ballCollideBall } from '../../math/collisions'

export class Ball {
  readonly mesh
  readonly m: number

  readonly X: Vector3
  readonly _X = new Vector3()
  readonly _V = new Vector3()
  readonly V = new Vector3()
  readonly _F = new Vector3()
  readonly F = new Vector3()

  constructor(position: Vector3, color: string, mass: number) {
    this.mesh = new Mesh(
      new SphereGeometry(config.canvas.ball.radius, 8, 4),
      new MeshStandardMaterial({
        color,
      })
    )

    this.X = this.mesh.position
    this.X.copy(position)
    this._X.copy(position)

    this.m = mass
  }

  get r() {
    return this.mesh.geometry.parameters.radius
  }

  updateState(dt: number) {
    this._F.copy(this.F)
    this._V.copy(this.V)
    this._X.copy(this.X)

    this.F.copy(config.environment.windForce)
    const A = config.environment.gravityAcceleration
    velocity(this.V, this._F, this.m, this._V, A, dt)
    this.V.multiplyScalar(config.environment.energyRetain.airDrag)
    position(this.X, this.V, this._X, dt)
  }

  collide(ball: Ball) {
    return ballCollideBall(
      ball,
      this,
      config.environment.energyRetain.collision
    )
  }
}
