import * as THREE from 'three'
import {
  BALL_ENERGY_LOSS,
  BALL_MASS,
  BALL_RADIUS,
  GRAVITY,
  WIND,
} from './config'
import { Drawable } from './types'

const FORCE = new THREE.Vector3(...WIND).add(new THREE.Vector3(...GRAVITY))
const DOUBLE_BALL_RADIUS = 2 * BALL_RADIUS
const ENERGY_LOSS_INDICATOR = 1 - BALL_ENERGY_LOSS

// for performance reasons
const tmp = new THREE.Vector3()
const tmp2 = new THREE.Vector3()
const tmp3 = new THREE.Vector3()

export class Ball implements Drawable {
  readonly position
  readonly velocity = new THREE.Vector3()
  readonly force = new THREE.Vector3()

  // cache
  // readonly _velocity = new THREE.Vector3()
  // readonly _position = new THREE.Vector3()

  isCollision = false

  constructor(mesh: THREE.Mesh<THREE.SphereGeometry, THREE.Material>) {
    this.position = mesh.position
  }

  calculate(
    dt: number,
    box: THREE.Mesh<THREE.BoxGeometry, THREE.Material>,
    balls: Ball[]
  ) {
    this.collisionBox(dt, box)
    for (let i = 0; i < balls.length; i++) {
      this.collisionBall(balls[i], dt)
    }
  }

  draw(dt: number) {
    if (this.isCollision) {
      this.force.set(0, 0, 0)
    }

    /**
     * V = (F / m) * dt + _V
     */
    this.velocity.add(this.force.multiplyScalar(dt / BALL_MASS))
    tmp.copy(this.velocity)

    /**
     * X = v * dt + _X
     */
    this.position.add(tmp.multiplyScalar(dt))

    this.force.copy(FORCE)
    this.isCollision = false
  }

  private lossByCollision() {
    this.velocity.multiplyScalar(ENERGY_LOSS_INDICATOR)
    this.isCollision = true
  }

  private collisionBox(
    dt: number,
    box: THREE.Mesh<THREE.BoxGeometry, THREE.Material>
  ) {
    const { height, width, depth } = box.geometry.parameters

    // position of box (0, 0, 0)
    const X = 0.5 * width + BALL_RADIUS
    const Y = 0.5 * height + BALL_RADIUS
    const Z = 0.5 * depth + BALL_RADIUS

    const vel = tmp
      .copy(this.force)
      .multiplyScalar(dt / BALL_MASS)
      .add(this.velocity)

    const pos = vel.multiplyScalar(dt).add(this.position)

    if (
      X > pos.x &&
      -X < pos.x &&
      Y > pos.y &&
      -Y < pos.y &&
      Z > pos.z &&
      -Z < pos.z
    ) {
      if (X > pos.x || -X < pos.x) {
        this.velocity.setX(-this.velocity.x)
      }
      if (Y > pos.y || -Y < pos.y) {
        this.velocity.setY(-this.velocity.y)
      }
      if (Z > pos.z || -Z < pos.z) {
        this.velocity.setZ(-this.velocity.z)
      }

      this.lossByCollision()
      return
    }

    // this._velocity.copy(vel)
    // this._position.copy(pos)
  }

  private collisionBall(ball: Ball, dt: number) {
    const vel2 = tmp2
      .copy(ball.force)
      .multiplyScalar(dt / BALL_MASS)
      .add(ball.velocity)

    const relativeVel = tmp
      .copy(this.force)
      .multiplyScalar(dt / BALL_MASS)
      .add(this.velocity)
      .sub(vel2)

    const displacement = tmp2.copy(relativeVel).multiplyScalar(dt)
    const relativePos = tmp3.copy(this.position).sub(ball.position)
    const distance = displacement.add(relativePos).length()

    if (distance < DOUBLE_BALL_RADIUS) {
      const direction = relativePos.normalize()
      const dot = relativeVel.dot(direction)
      const vel = tmp3.copy(direction).multiplyScalar(BALL_MASS * dot)

      this.velocity.sub(vel)
      this.lossByCollision()

      ball.velocity.add(vel)
      ball.lossByCollision()
    }
  }
}
