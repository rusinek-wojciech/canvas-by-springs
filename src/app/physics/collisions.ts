import * as THREE from 'three'
import { Cone, Ball, Sphere, Cube } from '../scene/figures'

const tmp_1 = new THREE.Vector3()
const tmp_2 = new THREE.Vector3()
const tmp_3 = new THREE.Vector3()

/**
 * @returns true if collision
 */
export function ballCollideCone(ball: Ball, cone: Cone, energyRetain: number) {
  const X = tmp_1

  X.copy(ball.X).sub(cone.X)
  const length = X.length()

  if (length <= cone.r + ball.r) {
    ball.V.multiplyScalar(energyRetain)
    return true
  }

  return false
}

/**
 * X = X1 - X2
 *
 * collision condition:
 * ||X|| <= r1 + r2
 *
 * V1' = V1 - (2 * m2) / (m1 + m2) * dot(V1, X) * X / (||X|| * ||X||)
 *
 * lim m-> inf (2 * m2) / (m1 + m2) = 2
 * V1' = V1 - 2 * dot(V1, X) * X / (||X|| * ||X||)
 *
 * @returns true if collision
 */
export function ballCollideSphere(
  ball: Ball,
  sphere: Sphere,
  energyRetain: number
) {
  const X = tmp_1

  X.copy(ball.X).sub(sphere.X)
  const length = X.length()

  if (length <= sphere.r + ball.r) {
    const length2 = length * length

    const vProjection = ball.V.dot(X) / length2

    ball.V.sub(tmp_2.copy(X).multiplyScalar(2 * vProjection))
    ball.V.multiplyScalar(energyRetain)

    // reaction force
    const fProjection = ball.F.dot(X) / length2
    ball.F.sub(tmp_2.copy(X).multiplyScalar(fProjection))

    // workaround for sticky issues
    ball.X.copy(X.normalize().multiplyScalar(sphere.r + ball.r))

    return true
  }

  return false
}

/**
 * @returns true if collision
 */
export function ballCollideCube(ball: Ball, cube: Cube, energyRetain: number) {
  const X = tmp_1
  const _X = tmp_2
  const D = tmp_3

  X.copy(ball.X).sub(cube.X)
  _X.copy(ball._X).sub(cube.X)
  D.copy(cube.D).multiplyScalar(0.5).addScalar(ball.r)

  if (
    D.x >= X.x &&
    -D.x <= X.x &&
    D.y >= X.y &&
    -D.y <= X.y &&
    D.z >= X.z &&
    -D.z <= X.z
  ) {
    const tmp = tmp_1

    if (D.x <= _X.x) {
      ball.F.setX(0)
      ball.V.reflect(tmp.set(1, 0, 0))
      ball.X.setX(cube.X.x + D.x)
    } else if (-D.x >= _X.x) {
      ball.F.setX(0)
      ball.V.reflect(tmp.set(1, 0, 0))
      ball.X.setX(cube.X.x - D.x)
    }

    if (D.y <= _X.y) {
      ball.F.setY(0)
      ball.V.reflect(tmp.set(0, 1, 0))
      ball.X.setY(cube.X.y + D.y)
    } else if (-D.y >= _X.y) {
      ball.F.setY(0)
      ball.V.reflect(tmp.set(0, 1, 0))
      ball.X.setY(cube.X.y - D.y)
    }

    if (D.z <= _X.z) {
      ball.F.setZ(0)
      ball.V.reflect(tmp.set(0, 0, 1))
      ball.X.setZ(cube.X.z + D.z)
    } else if (-D.z >= _X.z) {
      ball.F.setZ(0)
      ball.V.reflect(tmp.set(0, 0, 1))
      ball.X.setZ(cube.X.z - D.z)
    }

    ball.V.multiplyScalar(energyRetain)
    return true
  }

  return false
}

/**
 * X = X1 - X2
 * V = V1 - V2
 * M1 = (2 * m2) / (m1 + m2)
 * M2 = (2 * m1) / (m1 + m2)
 *
 * collision condition:
 * ||X|| <= r1 + r2
 *
 * V1' = V1 - M1 * dot(V, X) * X / (||X|| * ||X||)
 * V2' = V2 + M2 * dot(V, X) * X / (||X|| * ||X||)
 *
 * faster version and less accurate
 *
 * @returns true if collision
 */
export function ballCollideBall(
  ball1: Ball,
  ball2: Ball,
  energyRetain: number
) {
  const V = tmp_1
  const X = tmp_2

  V.copy(ball1.V).sub(ball2.V)
  X.copy(ball1.X).sub(ball2.X)
  const length = X.length()

  if (length <= ball1.r + ball2.r) {
    const m = ball1.m + ball2.m
    const m1 = (2 * ball2.m) / m
    const m2 = (2 * ball1.m) / m

    const vProjection = (V.dot(X) / length) * length

    ball1.V.sub(tmp_3.copy(X).multiplyScalar(m1 * vProjection))
    ball2.V.add(X.multiplyScalar(m2 * vProjection))

    ball1.V.multiplyScalar(energyRetain)
    ball2.V.multiplyScalar(energyRetain)

    return true
  }

  return false
}
