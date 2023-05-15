import * as THREE from 'three'
import { vec } from './utils'
import {
  BALL_MASS,
  BALL_RADIUS,
  ENERGY_LOSS_INDICATOR,
  GRAVITY,
  WIND,
} from './config'
import { Drawable } from './types'

const FORCE = new THREE.Vector3(...WIND).add(new THREE.Vector3(...GRAVITY))
const D_BALL_RADIUS = 2 * BALL_RADIUS

export class Ball implements Drawable {
  private mesh: THREE.Mesh<THREE.SphereGeometry, THREE.Material>

  readonly velocity = new THREE.Vector3()
  readonly force = new THREE.Vector3()

  isCollision = false

  get position() {
    return this.mesh.position
  }

  constructor(mesh: THREE.Mesh<THREE.SphereGeometry, THREE.Material>) {
    this.mesh = mesh
  }

  calculate(
    dt: number,
    box: THREE.Mesh<THREE.BoxGeometry, THREE.Material>,
    balls: Ball[]
  ) {
    this.force.add(FORCE)
    this.collisionBox(dt, box)
    balls.forEach((ball) => this.collisionBall(ball, dt))
  }

  draw(dt: number) {
    if (!this.isCollision) {
      const vel = this.velocityStep(dt)
      this.velocity.copy(vel)

      const pos = this.positionStep(dt, vel)
      this.position.copy(pos)
    }

    this.force.set(0, 0, 0)
    this.isCollision = false
  }

  /**
   * X = v * dt + _X
   */
  positionStep(dt: number, velocity: THREE.Vector3) {
    return vec(velocity).multiplyScalar(dt).add(this.position)
  }

  /**
   * V = (F / m) * dt + _V
   */
  velocityStep(dt: number) {
    return vec(this.force)
      .multiplyScalar(dt / BALL_MASS)
      .add(this.velocity)
  }

  private collisionBox(
    dt: number,
    box: THREE.Mesh<THREE.BoxGeometry, THREE.Material>
  ) {
    const { height, width, depth } = box.geometry.parameters

    // position (0, 0, 0)
    const X = 0.5 * width + BALL_RADIUS
    const Y = 0.5 * height + BALL_RADIUS
    const Z = 0.5 * depth + BALL_RADIUS

    const vel = this.velocityStep(dt)
    const { x, y, z } = vel.multiplyScalar(dt).add(this.position)

    if (X > x && -X < x && Y > y && -Y < y && Z > z && -Z < z) {
      if (X > x || -X < x) {
        this.velocity.setX(-this.velocity.x)
      }
      if (Y > y || -Y < y) {
        this.velocity.setY(-this.velocity.y)
      }
      if (Z > z || -Z < z) {
        this.velocity.setZ(-this.velocity.z)
      }

      this.velocity.multiplyScalar(ENERGY_LOSS_INDICATOR)
      this.isCollision = true
    }
  }

  private collisionBall(ball: Ball, dt: number) {
    const relativePos = vec(this.position).sub(ball.position)

    const vel1 = this.velocityStep(dt)
    const vel2 = ball.velocityStep(dt)
    const relativeVel = vel1.sub(vel2)

    const displacement = vec(relativeVel).multiplyScalar(dt)
    const distance = vec(relativePos).add(displacement).length()

    if (distance < D_BALL_RADIUS) {
      const direction = relativePos.normalize()
      const dot = relativeVel.dot(direction)

      this.velocity.sub(vec(direction).multiplyScalar(BALL_MASS * dot))
      this.velocity.multiplyScalar(ENERGY_LOSS_INDICATOR)
      this.isCollision = true

      ball.velocity.add(vec(direction).multiplyScalar(BALL_MASS * dot))
      ball.velocity.multiplyScalar(ENERGY_LOSS_INDICATOR)
      ball.isCollision = true
    }
  }
}
