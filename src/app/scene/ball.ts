import * as THREE from 'three'
import { Drawable } from '../types'
import { config } from '../config'
import { position, velocity } from '../physics/formulas'
import { ballStaticBoxCollision, ballsCollision } from '../physics/collisions'

// changeable dynamically
const WIND_CONFIG = config.environment.wind
const GRAVITY_CONFIG = config.environment.gravity
const BALL_CONFIG = config.canvas.ball

// for performance reasons
const tmp = new THREE.Vector3()
const tmp2 = new THREE.Vector3()

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
    velocity(temp, this.force, this.mass, this.velocity, dt)
    return temp
  }

  calculatePosition(velocity: THREE.Vector3, dt: number) {
    position(velocity, velocity, this.position, dt)
    return velocity
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
    const col = ballStaticBoxCollision(
      this.velocity,
      this.calculatePosition(this.calculateVelocity(tmp, dt), dt),
      this.radius,
      box.position,
      tmp2.set(width, height, depth)
    )
    if (col) {
      this.lossByCollision()
    }
  }

  private collisionBall(ball: Ball, dt: number) {
    const col = ballsCollision(
      this.position,
      ball.position,
      this.calculateVelocity(tmp, dt),
      ball.calculateVelocity(tmp2, dt),
      this.velocity,
      ball.velocity,
      this.mass,
      ball.mass,
      this.radius,
      ball.radius,
      dt
    )
    if (col) {
      this.lossByCollision()
      ball.lossByCollision()
    }
  }
}
