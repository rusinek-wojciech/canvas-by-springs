import * as THREE from 'three'
import { config } from '../../config'
import { Ball } from '../figures'

export function createBalls() {
  const { angle, perRow, distanceBetween, position, ball } = config.canvas
  const { yaw, roll } = angle

  const xDistance = distanceBetween
  const yDistance = distanceBetween * Math.sin(roll)
  const zDistance = distanceBetween * Math.cos(roll)

  const rot = new THREE.Matrix3()
  rot.set(
    Math.cos(yaw),
    0,
    Math.sin(yaw),
    0,
    1,
    0,
    -Math.sin(yaw),
    0,
    Math.cos(yaw)
  )

  const num = perRow - 1
  const xLength = xDistance * num
  const yLength = yDistance * num
  const zLength = zDistance * num

  const balls: Ball[][] = []

  let dx = 0
  let dy = 0
  let dz = 0

  let i = 0
  while (i < perRow) {
    const row: Ball[] = []

    dx = 0

    let j = 0
    while (j < perRow) {
      const pos = new THREE.Vector3(
        dx - 0.5 * xLength,
        dy - 0.5 * yLength,
        dz - 0.5 * zLength
      )
      pos.applyMatrix3(rot)

      row.push(
        new Ball(
          pos.add(position),
          colorByIterators(dx, dz, xLength),
          ball.mass
        )
      )

      dx += xDistance
      j++
    }
    balls.push(row)

    dy += yDistance
    dz += zDistance
    i++
  }

  for (let i = 0; i < perRow; i++) {
    for (let j = 0; j < perRow; j++) {}
  }

  return balls
}

function colorByIterators(x: number, z: number, length: number) {
  const r = 200
  const g = Math.floor(z * (150 / length))
  const b = Math.floor(x * (150 / length))
  return `rgb(${r}, ${g}, ${b})`
}
