import { Scene } from 'three'

import { Ball } from '../figures'
import { Spring } from './spring.class'

export const createSpringMesh = {
  square: createSquareMesh,
  diagonal: createDiagonalMesh,
  merged: createMergedMesh,
}

function createSquareMesh(scene: Scene, balls: Ball[][], rows: number) {
  const springs: Spring[] = []

  for (let i = 0; i < rows; i++) {
    for (let j = 1; j < rows; j++) {
      const ball1 = balls[i][j]
      const ball2 = balls[i][j - 1]
      const ball3 = balls[j][i]
      const ball4 = balls[j - 1][i]

      springs.push(
        new Spring(scene, ball1, ball2),
        new Spring(scene, ball3, ball4)
      )
    }
  }
  return springs
}

function createDiagonalMesh(scene: Scene, balls: Ball[][], rows: number) {
  const springs: Spring[] = []

  for (let i = 1; i < rows; i++) {
    for (let j = 1; j < rows; j++) {
      const ball1 = balls[i][j]
      const ball2 = balls[i - 1][j - 1]
      const ball3 = balls[i][j - 1]
      const ball4 = balls[i - 1][j]

      springs.push(
        new Spring(scene, ball1, ball2),
        new Spring(scene, ball3, ball4)
      )
    }
  }
  return springs
}

function createMergedMesh(scene: Scene, balls: Ball[][], rows: number) {
  return [
    ...createSquareMesh(scene, balls, rows),
    ...createDiagonalMesh(scene, balls, rows),
  ]
}
