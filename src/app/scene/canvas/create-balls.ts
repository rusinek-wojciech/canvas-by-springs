import * as THREE from 'three'
import { config } from '../../config'
import { Ball } from '../figures'

export function createBalls(scene: THREE.Scene) {
  const length = config.canvas.distanceBetween * (config.canvas.perRow - 1)

  const balls: Ball[][] = []

  let i = config.canvas.perRow

  let dz = 0

  while (i > 0) {
    const row: Ball[] = []

    let j = config.canvas.perRow

    let dx = 0

    while (j > 0) {
      const ball = new Ball(
        new THREE.Vector3(dx - 0.5 * length, 0, dz - 0.5 * length).add(
          config.canvas.position
        ),
        colorByIterators(dx, dz, length),
        config.canvas.ball.mass
      )

      scene.add(ball.mesh)
      row.push(ball)

      dx += config.canvas.distanceBetween
      j--
    }
    balls.push(row)

    dz += config.canvas.distanceBetween
    i--
  }

  return balls
}

function colorByIterators(x: number, z: number, length: number) {
  const r = 200
  const g = Math.floor(z * (150 / length))
  const b = Math.floor(x * (150 / length))
  return `rgb(${r}, ${g}, ${b})`
}
