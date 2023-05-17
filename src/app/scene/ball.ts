import * as THREE from 'three'
import { Drawable } from '../types'
import { config } from '../config'
import { position, velocity } from './physics'

// changeable dynamically
const WIND_CONFIG = config.environment.wind
const GRAVITY_CONFIG = config.environment.gravity
const BALL_CONFIG = config.canvas.ball

// for performance reasons
const tmp = new THREE.Vector3()
const tmp2 = new THREE.Vector3()
const tmp3 = new THREE.Vector3()

export class Ball implements Drawable {
  readonly radius: number
  readonly mass: number
  readonly position: THREE.Vector3
  readonly velocity: THREE.Vector3
  readonly force: THREE.Vector3

  constructor(
    mesh: THREE.Mesh<THREE.SphereGeometry, THREE.Material>,
    mass: number
  ) {
    this.position = mesh.position
    this.velocity = new THREE.Vector3()
    this.force = new THREE.Vector3()
    this.mass = mass
    this.radius = mesh.geometry.parameters.radius
  }

  calculateVelocity(temp: THREE.Vector3, dt: number) {
    return velocity(temp.copy(this.force), this.mass, this.velocity, dt)
  }

  calculatePosition(velocity: THREE.Vector3, dt: number) {
    return position(velocity, this.position, dt)
  }

  calculate(
    dt: number,
    box: THREE.Mesh<THREE.BoxGeometry, THREE.Material>,
    balls: Ball[]
  ) {
    this.collisionBox(box, dt)
    for (let i = 0; i < balls.length; i++) {
      this.collisionBall(balls[i], dt)
    }
  }

  draw(dt: number) {
    this.velocity.copy(this.calculateVelocity(tmp, dt))
    this.position.copy(this.calculatePosition(tmp, dt))
    this.force.copy(GRAVITY_CONFIG).add(WIND_CONFIG)
  }

  private lossByCollision() {
    this.velocity.multiplyScalar(1 - BALL_CONFIG.energyLoss)
    this.force.set(0, 0, 0)
  }

  private collisionBox(
    box: THREE.Mesh<THREE.BoxGeometry, THREE.Material>,
    dt: number
  ) {
    const { height, width, depth } = box.geometry.parameters

    // position of box (0, 0, 0)
    const X = 0.5 * width + this.radius
    const Y = 0.5 * height + this.radius
    const Z = 0.5 * depth + this.radius

    const vel = this.calculateVelocity(tmp, dt)
    const pos = this.calculatePosition(vel, dt)

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
    const vel1 = this.calculateVelocity(tmp, dt)

    const relativeVel = vel1.sub(vel2)

    const displacement = tmp2.copy(relativeVel).multiplyScalar(dt)
    const relativePos = tmp3.copy(this.position).sub(ball.position)
    const distance = displacement.add(relativePos).length()

    if (distance < this.radius + ball.radius) {
      const m = this.mass + ball.mass
      const m1 = (2 * ball.mass) / m
      const m2 = (2 * this.mass) / m

      const direction = relativePos.normalize()
      const dot = relativeVel.dot(direction)

      this.velocity.sub(tmp.copy(direction).multiplyScalar(m1 * dot))
      this.lossByCollision()

      ball.velocity.add(tmp.copy(direction).multiplyScalar(m2 * dot))
      ball.lossByCollision()
    }
  }
}
