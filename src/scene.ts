import * as THREE from 'three'
import { Ball } from './ball'
import {
  ALTITUDE,
  BALLS_PER_ROW,
  BALL_RADIUS,
  DISTANCE_BETWEEN_BALLS,
} from './config'
import { createSprings } from './create-springs'

const ROW_LENGTH = DISTANCE_BETWEEN_BALLS * (BALLS_PER_ROW - 1)
const HALF_ROW_LENGTH = ROW_LENGTH * 0.5

export function createScene() {
  const scene = new THREE.Scene()
  scene.background = new THREE.Color(0x87ceeb)
  const ambientLight = new THREE.AmbientLight(0xffffff, 1.0)
  scene.add(ambientLight)
  const balls = createBalls(scene)

  return {
    scene,
    balls: balls.flatMap((b) => b),
    springs: createSprings.square(scene, balls),
    cube: createCube(scene),
  }
}

function colorByIterators(z: number, x: number) {
  const r = 200
  const g = Math.floor(z * (150 / ROW_LENGTH))
  const b = Math.floor(x * (150 / ROW_LENGTH))
  return `rgb(${r}, ${g}, ${b})`
}

function createBalls(scene: THREE.Scene) {
  const balls: Ball[][] = []

  for (let i = 0; i <= ROW_LENGTH; i += DISTANCE_BETWEEN_BALLS) {
    const row: Ball[] = []

    for (let j = 0; j <= ROW_LENGTH; j += DISTANCE_BETWEEN_BALLS) {
      const mesh = new THREE.Mesh(
        new THREE.SphereGeometry(BALL_RADIUS, 8, 4),
        new THREE.MeshStandardMaterial({
          color: colorByIterators(i, j),
        })
      )
      mesh.position.set(j - HALF_ROW_LENGTH, ALTITUDE, i - HALF_ROW_LENGTH)
      scene.add(mesh)

      row.push(new Ball(mesh))
    }
    balls.push(row)
  }
  return balls
}

function createCube(scene: THREE.Scene) {
  const solidMaterial = new THREE.MeshStandardMaterial({ color: 'teal' })
  const geometry = new THREE.BoxGeometry(10, 10, 10)
  const mesh = new THREE.Mesh(geometry, solidMaterial)

  scene.add(mesh)
  return mesh
}
