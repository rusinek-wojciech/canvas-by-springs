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

  // optimization
  readonly velocityCache = new THREE.Vector3()
  readonly positionCache = new THREE.Vector3()
  isCache = false
  isCollision = false

  constructor(mesh: THREE.Mesh<THREE.SphereGeometry, THREE.Material>) {
    this.position = mesh.position
  }

  /**
   * V = (F / m) * dt + _V
   */
  calculateVelocity(vec: THREE.Vector3, dt: number) {
    return vec
      .copy(this.force)
      .multiplyScalar(dt / BALL_MASS)
      .add(this.velocity)
  }

  /**
   * X = v * dt + _X
   */
  calculatePosition(velocity: THREE.Vector3, dt: number) {
    return velocity.multiplyScalar(dt).add(this.position)
  }

  calculate(
    dt: number,
    box: THREE.Mesh<THREE.BoxGeometry, THREE.Material>,
    balls: Ball[]
  ) {
    this.velocityCache.copy(this.calculateVelocity(tmp, dt))
    this.positionCache.copy(this.calculatePosition(tmp, dt))
    this.isCache = true

    this.collisionBox(box)
    for (let i = 0; i < balls.length; i++) {
      if (!this.isCollision) {
        this.collisionBall(balls[i], dt)
      }
    }
  }

  draw(dt: number) {
    if (this.isCollision) {
      this.force.set(0, 0, 0)
    }

    if (this.isCache) {
      this.velocity.copy(tmp.copy(this.velocityCache))
      this.position.copy(this.positionCache)
    } else {
      this.velocity.copy(this.calculateVelocity(tmp, dt))
      this.position.copy(this.calculatePosition(tmp, dt))
    }

    this.force.copy(FORCE)
    this.isCollision = false
    this.isCache = false
  }

  private lossByCollision() {
    this.velocity.multiplyScalar(ENERGY_LOSS_INDICATOR)
    this.isCollision = true
    this.isCache = false
  }

  private collisionBox(box: THREE.Mesh<THREE.BoxGeometry, THREE.Material>) {
    const { height, width, depth } = box.geometry.parameters

    // position of box (0, 0, 0)
    const X = 0.5 * width + BALL_RADIUS
    const Y = 0.5 * height + BALL_RADIUS
    const Z = 0.5 * depth + BALL_RADIUS

    const pos = this.positionCache

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
    }
  }

  private collisionBall(ball: Ball, dt: number) {
    const vel2 = ball.calculateVelocity(tmp2, dt)
    const vel1 = tmp.copy(this.velocityCache)

    const relativeVel = vel1.sub(vel2)

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
