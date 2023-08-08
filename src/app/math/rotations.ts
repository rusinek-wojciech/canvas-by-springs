import { Matrix3 } from 'three'

export function rotationX(rad: number) {
  const sin = Math.sin(rad)
  const cos = Math.cos(rad)
  return new Matrix3().set(1, 0, 0, 0, cos, -sin, 0, sin, cos)
}

export function rotationY(rad: number) {
  const sin = Math.sin(rad)
  const cos = Math.cos(rad)
  return new Matrix3().set(cos, 0, sin, 0, 1, 0, -sin, 0, cos)
}

export function rotationZ(rad: number) {
  const sin = Math.sin(rad)
  const cos = Math.cos(rad)
  return new Matrix3().set(cos, -sin, 0, sin, cos, 0, 0, 0, 1)
}

export function rotation(radX: number, radY: number, radZ: number) {
  return rotationZ(radZ).multiply(rotationY(radY)).multiply(rotationX(radX))
}
