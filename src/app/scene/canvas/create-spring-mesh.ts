import { Ball } from '../figures'
import { Spring } from './spring.class'

export const createSpringMesh = {
  square: createSquareMesh,
  diagonal: createDiagonalMesh,
  merged: createMergedMesh,
}

function createSquareMesh(scene: THREE.Scene, balls: Ball[][], rows: number) {
  const springs: Spring[] = []

  for (let i = 0; i < rows; i++) {
    for (let j = 1; j < rows; j++) {
      const spring1 = new Spring(balls[i][j], balls[i][j - 1])
      const spring2 = new Spring(balls[j][i], balls[j - 1][i])

      scene.add(spring1.mesh, spring2.mesh)
      springs.push(spring1, spring2)
    }
  }
  return springs
}

function createDiagonalMesh(scene: THREE.Scene, balls: Ball[][], rows: number) {
  const springs: Spring[] = []

  for (let i = 1; i < rows; i++) {
    for (let j = 1; j < rows; j++) {
      const spring1 = new Spring(balls[i][j], balls[i - 1][j - 1])
      const spring2 = new Spring(balls[i][j - 1], balls[i - 1][j])

      scene.add(spring1.mesh, spring2.mesh)
      springs.push(spring1, spring2)
    }
  }
  return springs
}

function createMergedMesh(scene: THREE.Scene, balls: Ball[][], rows: number) {
  return [
    ...createSquareMesh(scene, balls, rows),
    ...createDiagonalMesh(scene, balls, rows),
  ]
}
