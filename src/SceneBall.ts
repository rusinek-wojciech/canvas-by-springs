import * as THREE from 'three'
import { from } from './utils'
import { ENERGY_LOSS_INDICATOR } from './config'

export class SceneBall {
  private _mesh: THREE.Mesh<THREE.SphereGeometry, THREE.MeshStandardMaterial>
  private _v: THREE.Vector3
  private _F: THREE.Vector3
  private _m: number

  constructor(
    mesh: THREE.Mesh<THREE.SphereGeometry, THREE.MeshStandardMaterial>,
    v: THREE.Vector3,
    F: THREE.Vector3,
    m: number
  ) {
    this._mesh = mesh
    this._v = v
    this._F = F
    this._m = m
  }

  get position() {
    return this._mesh.position
  }

  get radius() {
    return this._mesh.geometry.parameters.radius
  }

  get mass() {
    return this._m
  }

  velocity(dt: number) {
    return from(this._F).divideScalar(this._m).multiplyScalar(dt).add(this._v)
  }

  next(dt: number) {
    const velocity = this.velocity(dt)
    this._v.copy(velocity)

    const nextPos = velocity.multiplyScalar(dt).add(this.position)
    this.position.copy(nextPos)
  }

  subVelocity(velocity: THREE.Vector3) {
    this._v.sub(velocity)
    this.energyLoss()
  }

  addVelocity(velocity: THREE.Vector3) {
    this._v.add(velocity)
    this.energyLoss()
  }

  energyLoss() {
    this._v.multiplyScalar(ENERGY_LOSS_INDICATOR)
  }

  collisionBox(dt: number) {
    // const X = HALF_A - this.radius
    // const Y = HALF_C - this.radius
    // const Z = HALF_B - this.radius
    // const nextPos = this.velocity(dt).multiplyScalar(dt).add(this.position)
    // if (nextPos.x > X) {
    //   this._v.x = -this._v.x
    //   this.position.set(X, this.position.y, this.position.z)
    //   this.energyLoss()
    // } else if (nextPos.x < -X) {
    //   this._v.x = -this._v.x
    //   this.position.set(-X, this.position.y, this.position.z)
    //   this.energyLoss()
    // }
    // if (nextPos.y > Y) {
    //   this._v.y = -this._v.y
    //   this.position.set(this.position.x, Y, this.position.z)
    //   this.energyLoss()
    // } else if (nextPos.y < -Y) {
    //   this._v.y = -this._v.y
    //   this.position.set(this.position.x, -Y, this.position.z)
    //   this.energyLoss()
    // }
    // if (nextPos.z > Z) {
    //   this._v.z = -this._v.z
    //   this.position.set(this.position.x, this.position.y, Z)
    //   this.energyLoss()
    // } else if (nextPos.z < -Z) {
    //   this._v.z = -this._v.z
    //   this.position.set(this.position.x, this.position.y, -Z)
    //   this.energyLoss()
    // }
  }

  collisionBall(ball: SceneBall, dt: number) {
    const relativePos = from(this.position).sub(ball.position)
    const relativeVel = this.velocity(dt).sub(ball.velocity(dt))
    const displacement = from(relativeVel).multiplyScalar(dt)

    if (
      from(relativePos).add(displacement).length() <
      this.radius + ball.radius
    ) {
      const m = this.mass + ball.mass
      const m1 = (2 * ball.mass) / m
      const m2 = (2 * this.mass) / m

      const direction = relativePos.normalize()
      const dot = relativeVel.dot(direction)

      this.subVelocity(from(direction).multiplyScalar(m1 * dot))
      ball.addVelocity(from(direction).multiplyScalar(m2 * dot))
    }
  }
}
