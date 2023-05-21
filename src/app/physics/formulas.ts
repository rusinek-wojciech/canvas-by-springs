import * as THREE from 'three'

const tmp_1 = new THREE.Vector3()
const tmp_2 = new THREE.Vector3()

/**
 * V = (F / m) * dt + _V
 *
 * @param V has result!
 */
export function velocity(
  V: THREE.Vector3,
  F: THREE.Vector3,
  m: number,
  _V: THREE.Vector3,
  dt: number
) {
  V.copy(F)
    .multiplyScalar(dt / m)
    .add(_V)
}

/**
 * X = V * dt + _X
 *
 * @param X has result!
 */
export function position(
  X: THREE.Vector3,
  V: THREE.Vector3,
  _X: THREE.Vector3,
  dt: number
) {
  X.copy(V).multiplyScalar(dt).add(_X)
}

/**
 *  F1 = -F2 = -k * (||_X1 - _X2|| - L) * ((_X1 - _X2) / (||_X1 - _X2||)) - b * (_V1 - _V2)
 *
 * @param F1 has result!
 * @param F2 has result!
 */
export function springForce(
  F1: THREE.Vector3,
  F2: THREE.Vector3,
  K: number,
  L: number,
  B: number,
  _X1: THREE.Vector3,
  _X2: THREE.Vector3,
  _V1: THREE.Vector3,
  _V2: THREE.Vector3
) {
  const X = tmp_1.copy(_X1).sub(_X2)
  const xLength = X.length()
  const factor = (-K * (xLength - L)) / xLength

  const R = tmp_2.copy(_V1).sub(_V2).multiplyScalar(B)

  F1.copy(X).multiplyScalar(factor).sub(R)
  F2.copy(F1).negate()
}
