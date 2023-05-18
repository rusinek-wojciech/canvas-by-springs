import * as THREE from 'three'

const tmp_1 = new THREE.Vector3()
const tmp_2 = new THREE.Vector3()
const tmp_3 = new THREE.Vector3()

/**
 * @param _V1 has result!
 * @param _V2 has result!
 *
 * @returns true if collision
 */
export function ballsCollision(
  X1: THREE.Vector3,
  X2: THREE.Vector3,
  V1: THREE.Vector3,
  V2: THREE.Vector3,
  _V1: THREE.Vector3,
  _V2: THREE.Vector3,
  m1: number,
  m2: number,
  r1: number,
  r2: number,
  dt: number
) {
  const V = tmp_1.copy(V1).sub(V2)
  const V_ = tmp_2.copy(V).multiplyScalar(dt)
  const X = tmp_3.copy(X1).sub(X2)
  const distance = V_.add(X).length()

  if (distance < r1 + r2) {
    const m = m1 + m2
    const m1_ = (2 * m2) / m
    const m2_ = (2 * m1) / m

    const direction = X.normalize()
    const dot = V.dot(direction)

    _V1.sub(tmp_1.copy(direction).multiplyScalar(m1_ * dot))
    _V2.add(direction.multiplyScalar(m2_ * dot))

    return true
  }

  return false
}

/**
 * @param _V1 has result!
 *
 * @returns true if collision
 */
export function ballStaticBoxCollision(
  _V1: THREE.Vector3,
  X1: THREE.Vector3,
  r: number,
  _X2: THREE.Vector3,
  _D2: THREE.Vector3
) {
  const X = tmp_1.copy(X1).sub(_X2)
  const D = tmp_2.copy(_D2).multiplyScalar(0.5).addScalar(r)

  if (
    D.x > X.x &&
    -D.x < X.x &&
    D.y > X.y &&
    -D.y < X.y &&
    D.z > X.z &&
    -D.z < X.z
  ) {
    if (D.x > X.x || -D.x < X.x) {
      _V1.setX(-_V1.x)
    }

    if (D.y > X.y || -D.y < X.y) {
      _V1.setY(-_V1.y)
    }

    if (D.z > X.z || -D.z < X.z) {
      _V1.setZ(-_V1.z)
    }

    return true
  }

  return false
}
