import * as THREE from 'three'

const tmp_1 = new THREE.Vector3()
const tmp_2 = new THREE.Vector3()
const tmp_3 = new THREE.Vector3()
const tmp_4 = new THREE.Vector3()
const tmp_5 = new THREE.Vector3()
const tmp_6 = new THREE.Vector3()

function rungeKutta(vec: THREE.Vector3, dt: number) {
  const k1 = tmp_1.copy(vec).multiplyScalar(dt)
  const k2 = tmp_2
    .copy(vec)
    .add(tmp_5.copy(k1).multiplyScalar(0.5))
    .multiplyScalar(dt)
  const k3 = tmp_3
    .copy(vec)
    .add(tmp_5.copy(k2).multiplyScalar(0.5))
    .multiplyScalar(dt)
  const k4 = tmp_4.copy(vec).add(tmp_5.copy(k3)).multiplyScalar(dt)

  const delta = k1
    .add(k2.multiplyScalar(2))
    .add(k3.multiplyScalar(2))
    .add(k4)
    .multiplyScalar(1 / 6)

  return delta
}

/**
 * V = (F / m) * dt + A * dt + _V
 *
 * @param V has result!
 */
export function velocity(
  V: THREE.Vector3,
  F: THREE.Vector3,
  m: number,
  _V: THREE.Vector3,
  A: THREE.Vector3,
  dt: number
) {
  V.copy(_V)
    .add(rungeKutta(A, dt))
    .add(rungeKutta(tmp_6.copy(F).divideScalar(m), dt))
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
  X.copy(_X).add(rungeKutta(V, dt))
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
