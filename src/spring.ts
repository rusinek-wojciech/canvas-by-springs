import * as THREE from 'three'
import { Ball } from './ball'
import { BALLS_PER_ROW, SPRING_B, SPRING_K, SPRING_L } from './config'
import { springForce } from './physics'

interface Spring {
  mesh: THREE.Line<THREE.BufferGeometry, THREE.Material>
  calculate: (dt: number) => void
  draw: () => void
}

export function createSquareSprings(scene: THREE.Scene, balls: Ball[][]) {
  const springs: Spring[] = []

  for (let i = 0; i < BALLS_PER_ROW; i++) {
    for (let j = 1; j < BALLS_PER_ROW; j++) {
      const spring1 = createSpring(balls[i][j], balls[i][j - 1])
      const spring2 = createSpring(balls[j][i], balls[j - 1][i])

      scene.add(spring1.mesh, spring2.mesh)
      springs.push(spring1, spring2)
    }
  }
  return springs
}

export function createDiagonalSprings(scene: THREE.Scene, balls: Ball[][]) {
  const springs: Spring[] = []

  for (let i = 1; i < BALLS_PER_ROW; i++) {
    for (let j = 1; j < BALLS_PER_ROW; j++) {
      const spring1 = createSpring(balls[i][j], balls[i - 1][j - 1])
      const spring2 = createSpring(balls[i][j - 1], balls[i - 1][j])

      scene.add(spring1.mesh, spring2.mesh)
      springs.push(spring1, spring2)
    }
  }
  return springs
}

export function createJoinedSprings(scene: THREE.Scene, balls: Ball[][]) {
  return [
    ...createSquareSprings(scene, balls),
    ...createDiagonalSprings(scene, balls),
  ]
}

function createSpring(ball1: Ball, ball2: Ball): Spring {
  const mesh = new THREE.Line(
    new THREE.BufferGeometry(),
    new THREE.LineBasicMaterial({ color: 0x000000 })
  )
  return {
    mesh,
    calculate(dt: number) {
      const [F1, F2] = springForce(
        dt,
        ball1,
        ball2,
        SPRING_K,
        SPRING_L,
        SPRING_B
      )
      ball1.force.add(F1)
      ball2.force.add(F2)
    },
    draw() {
      mesh.geometry.setFromPoints([ball1.position, ball2.position])
      mesh.geometry.computeBoundingSphere()
    },
  }
}
