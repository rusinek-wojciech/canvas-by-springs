import { Vector3 } from 'three'

import { config } from '../../config'
import { Ball } from '../figures'
import { rotation } from '../../math/rotations'

export function createBalls() {
  const { angle, perRow, distanceBetween, position, ball } = config.canvas

  const { yaw, pitch, roll } = angle
  const rot = rotation(
    (pitch * Math.PI) / 180,
    (yaw * Math.PI) / 180,
    (roll * Math.PI) / 180
  )

  const balls: Ball[][] = []
  const length = distanceBetween * (perRow - 1)

  let di = 0
  let i = 0

  while (i < perRow) {
    const row: Ball[] = []

    let dj = 0
    let j = 0

    while (j < perRow) {
      row.push(
        new Ball(
          new Vector3(dj - 0.5 * length, 0, di - 0.5 * length)
            .applyMatrix3(rot)
            .add(position),
          colorByIterators(dj, di, length),
          ball.mass
        )
      )

      dj += distanceBetween
      j++
    }
    balls.push(row)

    di += distanceBetween
    i++
  }

  return balls
}

function colorByIterators(x: number, z: number, length: number) {
  const r = 200
  const g = Math.floor(z * (150 / length))
  const b = Math.floor(x * (150 / length))
  return `rgb(${r}, ${g}, ${b})`
}
