import { Ball } from './ball'
import { BALLS_PER_ROW } from './config'
import { Spring } from './spring'

export const createSprings = {
  square: createSquareSprings,
  diagonal: createDiagonalSprings,
  joined: createJoinedSprings,
}

function createSquareSprings(scene: THREE.Scene, balls: Ball[][]) {
  const springs: Spring[] = []

  for (let i = 0; i < BALLS_PER_ROW; i++) {
    for (let j = 1; j < BALLS_PER_ROW; j++) {
      const spring1 = new Spring(balls[i][j], balls[i][j - 1])
      const spring2 = new Spring(balls[j][i], balls[j - 1][i])

      scene.add(spring1.mesh, spring2.mesh)
      springs.push(spring1, spring2)
    }
  }
  return springs
}

function createDiagonalSprings(scene: THREE.Scene, balls: Ball[][]) {
  const springs: Spring[] = []

  for (let i = 1; i < BALLS_PER_ROW; i++) {
    for (let j = 1; j < BALLS_PER_ROW; j++) {
      const spring1 = new Spring(balls[i][j], balls[i - 1][j - 1])
      const spring2 = new Spring(balls[i][j - 1], balls[i - 1][j])

      scene.add(spring1.mesh, spring2.mesh)
      springs.push(spring1, spring2)
    }
  }
  return springs
}

function createJoinedSprings(scene: THREE.Scene, balls: Ball[][]) {
  return [
    ...createSquareSprings(scene, balls),
    ...createDiagonalSprings(scene, balls),
  ]
}
