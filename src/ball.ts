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
import { position, velocity } from './physics'

// 1. forces
// 2. velocity
// 3. position
export class Ball implements Drawable {
  private mesh: THREE.Mesh<THREE.SphereGeometry, THREE.Material>

  readonly FORCE = new THREE.Vector3(...WIND).add(new THREE.Vector3(...GRAVITY))
  readonly mass = BALL_MASS
  readonly radius = BALL_RADIUS
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
    this.force.add(this.FORCE)
    this.collisionBox(dt, box)
    balls.forEach((ball) => this.collisionBall(ball, dt))
  }

  draw(dt: number) {
    if (!this.isCollision) {
      const vel = velocity(dt, this.force, this.mass, this.velocity)
      this.velocity.copy(vel)

      const pos = position(dt, vel, this.position)
      this.position.copy(pos)
    }

    this.force.set(0, 0, 0)
    this.isCollision = false
  }

  private collisionBox(
    dt: number,
    box: THREE.Mesh<THREE.BoxGeometry, THREE.Material>
  ) {
    const { height, width, depth } = box.geometry.parameters

    // position (0, 0, 0)
    const X = 0.5 * width + this.radius
    const Y = 0.5 * height + this.radius
    const Z = 0.5 * depth + this.radius

    const vel = velocity(dt, this.force, this.mass, this.velocity)
    const { x, y, z } = position(dt, vel, this.position)

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

    const vel1 = velocity(dt, this.force, this.mass, this.velocity)
    const vel2 = velocity(dt, ball.force, ball.mass, ball.velocity)
    const relativeVel = vel1.sub(vel2)

    const displacement = vec(relativeVel).multiplyScalar(dt)
    const distance = vec(relativePos).add(displacement).length()

    if (distance < this.radius + ball.radius) {
      const m = this.mass + ball.mass
      const m1 = (2 * ball.mass) / m
      const m2 = (2 * this.mass) / m

      const direction = relativePos.normalize()
      const dot = relativeVel.dot(direction)

      this.velocity.sub(vec(direction).multiplyScalar(m1 * dot))
      this.velocity.multiplyScalar(ENERGY_LOSS_INDICATOR)
      this.isCollision = true

      ball.velocity.add(vec(direction).multiplyScalar(m2 * dot))
      ball.velocity.multiplyScalar(ENERGY_LOSS_INDICATOR)
      ball.isCollision = true
    }
  }
}
