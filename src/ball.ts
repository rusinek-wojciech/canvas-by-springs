import * as THREE from 'three'
import {
  BALL_ENERGY_LOSS,
  BALL_MASS,
  BALL_RADIUS,
  GRAVITY,
  WIND,
} from './config'

const FORCE = new THREE.Vector3(...WIND).add(new THREE.Vector3(...GRAVITY))
const D_BALL_RADIUS = 2 * BALL_RADIUS
const ENERGY_LOSS_INDICATOR = 1 - BALL_ENERGY_LOSS

// for performance reasons
const tmp = new THREE.Vector3()
const tmp2 = new THREE.Vector3()
const tmp3 = new THREE.Vector3()

export class Ball {
  readonly position
  readonly velocity = new THREE.Vector3()
  readonly force = new THREE.Vector3()

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

  private collisionBox(
    dt: number,
    box: THREE.Mesh<THREE.BoxGeometry, THREE.Material>
  ) {
    const { height, width, depth } = box.geometry.parameters

    // position of box (0, 0, 0)
    const X = 0.5 * width + BALL_RADIUS
    const Y = 0.5 * height + BALL_RADIUS
    const Z = 0.5 * depth + BALL_RADIUS

    const { x, y, z } = tmp
      .copy(this.force)
      .multiplyScalar(dt / BALL_MASS)
      .add(this.velocity)
      .multiplyScalar(dt)
      .add(this.position)

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
    const relativePos = tmp3.copy(this.position).sub(ball.position)

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
    const distance = displacement.add(relativePos).length()

    if (distance < D_BALL_RADIUS) {
      const direction = relativePos.normalize()
      const dot = relativeVel.dot(direction)
      const vel = tmp3.copy(direction).multiplyScalar(BALL_MASS * dot)

      this.velocity.sub(vel)
      this.velocity.multiplyScalar(ENERGY_LOSS_INDICATOR)
      this.isCollision = true

      ball.velocity.add(vel)
      ball.velocity.multiplyScalar(ENERGY_LOSS_INDICATOR)
      ball.isCollision = true
    }
  }
}
