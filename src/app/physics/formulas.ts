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
 *  X = X1 - X2
 *  V = V1 - V2
 *  F = (-K * (||X|| - L) * X / ||X||) - b * V
 *
 * @param F has result!
 */
export function springForce(
  F: THREE.Vector3,
  X1: THREE.Vector3,
  X2: THREE.Vector3,
  V1: THREE.Vector3,
  V2: THREE.Vector3,
  K: number,
  L: number,
  B: number
) {
  const X = tmp_1
  const V = tmp_2

  X.copy(X1).sub(X2)
  V.copy(V1).sub(V2)

  const xLength = X.length()
  const factor = (-K * (xLength - L)) / xLength

  F.copy(X).multiplyScalar(factor).sub(V.multiplyScalar(B))
}
