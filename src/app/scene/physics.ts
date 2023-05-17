import * as THREE from 'three'

/**
 * V = (F / m) * dt + _V
 *
 * @param force is modified!
 */
export function velocity(
  force: THREE.Vector3,
  mass: number,
  velocity: THREE.Vector3,
  dt: number
) {
  return force.multiplyScalar(dt / mass).add(velocity)
}

/**
 * X = V * dt + _X
 *
 * @param velocity is modified!
 */
export function position(
  velocity: THREE.Vector3,
  position: THREE.Vector3,
  dt: number
) {
  return velocity.multiplyScalar(dt).add(position)
}

/**
 *  F1 = -F2 = -k * (||X1 - X2|| - L) * ((X1 - X2) / (||X1 - X2||)) - b * (V1 - V2)
 *
 * @param position1 is modified!
 * @param velocity1 is modified!
 */
export function springForce(
  K: number,
  L: number,
  B: number,
  position1: THREE.Vector3,
  position2: THREE.Vector3,
  velocity1: THREE.Vector3,
  velocity2: THREE.Vector3
) {
  const distanceVec = position1.sub(position2)
  const distance = distanceVec.length()
  const factor = (-K * (distance - L)) / distance
  const bForce = velocity1.sub(velocity2).multiplyScalar(B)
  return distanceVec.multiplyScalar(factor).sub(bForce)
}
