import * as THREE from 'three'
import { Cone, Ball, Sphere, Cube } from '../scene/figures'

const tmp_1 = new THREE.Vector3()
const tmp_2 = new THREE.Vector3()
const tmp_3 = new THREE.Vector3()
const tmp_4 = new THREE.Vector3()

/**
 * @returns true if collision
 */
export function ballCollideCone(ball: Ball, cone: Cone, energyRetain: number) {
  const X = tmp_1
  const T = tmp_2
  const Y = tmp_3
  const buff = tmp_4
  const D = tmp_3
  const N = tmp_3

  X.copy(ball.X)
    .sub(cone.X)
    .add(T.set(0, 0.5 * cone.h, 0))

  if (X.y > cone.h || X.y < 0) {
    return false
  }

  Y.set(X.x, 0, X.z)
  const radius = cone.r * (1.0 - X.y / cone.h)

  if (Y.length() > radius + ball.r) {
    return false
  }

  D.set(X.x, X.y - cone.h, X.z)
  N.cross(buff.set(0, X.y, 0).cross(D)).normalize()

  const vProjection = ball.V.dot(N)
  ball.V.sub(buff.copy(N).multiplyScalar(2 * vProjection * energyRetain))

  // reaction force
  const fProjection = ball.F.dot(N)
  ball.F.sub(buff.copy(N).multiplyScalar(fProjection))

  // TODO: position alignment

  return true
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
  const buff = tmp_2

  X.copy(ball.X).sub(sphere.X)
  const length = X.length()

  if (length > sphere.r + ball.r) {
    return false
  }

  const length2 = length * length

  const vProjection = ball.V.dot(X) / length2
  ball.V.sub(buff.copy(X).multiplyScalar(2 * vProjection * energyRetain))

  // reaction force
  const fProjection = ball.F.dot(X) / length2
  ball.F.sub(buff.copy(X).multiplyScalar(fProjection))

  // align position
  ball.X.copy(
    X.normalize()
      .multiplyScalar(sphere.r + ball.r)
      .add(sphere.X)
  )

  return true
}

/**
 * @returns true if collision
 */
export function ballCollideCube(ball: Ball, cube: Cube, energyRetain: number) {
  const X = tmp_1
  const _X = tmp_2
  const D = tmp_3
  const buff = tmp_1

  X.copy(ball.X).sub(cube.X)
  _X.copy(ball._X).sub(cube.X)
  D.set(cube.w, cube.h, cube.d).multiplyScalar(0.5).addScalar(ball.r)

  if (
    D.x >= X.x &&
    -D.x <= X.x &&
    D.y >= X.y &&
    -D.y <= X.y &&
    D.z >= X.z &&
    -D.z <= X.z
  ) {
    if (D.x <= _X.x) {
      ball.F.setX(0)
      ball.V.reflect(buff.set(energyRetain, 0, 0))
      ball.X.setX(cube.X.x + D.x)
    } else if (-D.x >= _X.x) {
      ball.F.setX(0)
      ball.V.reflect(buff.set(energyRetain, 0, 0))
      ball.X.setX(cube.X.x - D.x)
    }

    if (D.y <= _X.y) {
      ball.F.setY(0)
      ball.V.reflect(buff.set(0, energyRetain, 0))
      ball.X.setY(cube.X.y + D.y)
    } else if (-D.y >= _X.y) {
      ball.F.setY(0)
      ball.V.reflect(buff.set(0, energyRetain, 0))
      ball.X.setY(cube.X.y - D.y)
    }

    if (D.z <= _X.z) {
      ball.F.setZ(0)
      ball.V.reflect(buff.set(0, 0, energyRetain))
      ball.X.setZ(cube.X.z + D.z)
    } else if (-D.z >= _X.z) {
      ball.F.setZ(0)
      ball.V.reflect(buff.set(0, 0, energyRetain))
      ball.X.setZ(cube.X.z - D.z)
    }

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
  const buff = tmp_3

  V.copy(ball1.V).sub(ball2.V)
  X.copy(ball1.X).sub(ball2.X)
  const length = X.length()

  if (length > ball1.r + ball2.r) {
    return false
  }

  const m = ball1.m + ball2.m
  const m1 = (2 * ball2.m) / m
  const m2 = (2 * ball1.m) / m

  const vProjection = V.dot(X) / (length * length)
  ball1.V.sub(buff.copy(X).multiplyScalar(m1 * vProjection * energyRetain))
  ball2.V.add(X.multiplyScalar(m2 * vProjection * energyRetain))

  // TODO: reaction force and position alignment ?

  return true
}
