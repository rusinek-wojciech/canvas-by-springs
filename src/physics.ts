import { Ball } from './ball'
import { vec } from './utils'

/**
 *  F1 = -F2 = -k * (||X1 - X2|| - L) * ((X1 - X2) / (||X1 - X2||)) - b * (V1 - V2)
 */
export function springForce(
  dt: number,
  ball1: Ball,
  ball2: Ball,
  k: number,
  L: number,
  b: number
) {
  const distanceVec = vec(ball1.position).sub(ball2.position)
  const velocityVec = velocity(dt, ball1.force, ball1.mass, ball1.velocity).sub(
    velocity(dt, ball2.force, ball2.mass, ball2.velocity)
  )

  const distance = distanceVec.length()

  const F1 = distanceVec
    .normalize()
    .multiplyScalar(-k * (distance - L))
    .sub(velocityVec.multiplyScalar(b))
  const F2 = vec(distanceVec).negate()

  return [F1, F2] as const
}

/**
 * V = (F / m) * dt + _V
 */
export function velocity(
  dt: number,
  force: THREE.Vector3,
  mass: number,
  velocity: THREE.Vector3
) {
  const tmp = dt / mass
  return vec(force).multiplyScalar(tmp).add(velocity)
}

/**
 * X = v * dt + _X
 */
export function position(
  dt: number,
  velocity: THREE.Vector3,
  position: THREE.Vector3
) {
  return vec(velocity).multiplyScalar(dt).add(position)
}
