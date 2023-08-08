import { Vector3 } from 'three'

const tmp_1 = new Vector3()
const tmp_2 = new Vector3()
const tmp_3 = new Vector3()
const tmp_4 = new Vector3()
const tmp_5 = new Vector3()
const tmp_6 = new Vector3()

function rungeKutta(vec: Vector3, dt: number) {
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
  V: Vector3,
  F: Vector3,
  m: number,
  _V: Vector3,
  A: Vector3,
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
export function position(X: Vector3, V: Vector3, _X: Vector3, dt: number) {
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
  F: Vector3,
  X1: Vector3,
  X2: Vector3,
  V1: Vector3,
  V2: Vector3,
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
