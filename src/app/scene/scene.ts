import * as THREE from 'three'
import { Ball } from './ball'
import { createSpringMesh } from './spring-mesh'
import { config } from '../config'

const CANVAS_CONFIG = config.canvas

export function createScene() {
  const scene = new THREE.Scene()
  scene.background = new THREE.Color(0x87ceeb)
  const ambientLight = new THREE.AmbientLight(0xffffff, 1.0)
  scene.add(ambientLight)
  const balls = createBalls(scene)

  return {
    scene,
    balls: balls.flatMap((b) => b),
    springs: createSpringMesh[CANVAS_CONFIG.mesh](
      scene,
      balls,
      CANVAS_CONFIG.perRow
    ),
    cube: createCube(scene),
  }
}

function createBalls(scene: THREE.Scene) {
  const length = CANVAS_CONFIG.distanceBetween * (CANVAS_CONFIG.perRow - 1)

  const balls: Ball[][] = []

  for (let i = 0; i <= length; i += CANVAS_CONFIG.distanceBetween) {
    const row: Ball[] = []

    for (let j = 0; j <= length; j += CANVAS_CONFIG.distanceBetween) {
      const mesh = new THREE.Mesh(
        new THREE.SphereGeometry(CANVAS_CONFIG.ball.radius, 8, 4),
        new THREE.MeshStandardMaterial({
          color: colorByIterators(i, j, length),
        })
      )
      mesh.position.set(
        j - 0.5 * length,
        CANVAS_CONFIG.altitude,
        i - 0.5 * length
      )
      scene.add(mesh)

      row.push(new Ball(mesh, CANVAS_CONFIG.ball.mass))
    }
    balls.push(row)
  }
  return balls
}

function createCube(scene: THREE.Scene) {
  const solidMaterial = new THREE.MeshStandardMaterial({ color: 'teal' })
  const geometry = new THREE.BoxGeometry(10, 10, 10)
  const mesh = new THREE.Mesh(geometry, solidMaterial)
  mesh.position.copy(config.environment.figure.position)
  scene.add(mesh)
  return mesh
}

function colorByIterators(z: number, x: number, length: number) {
  const r = 200
  const g = Math.floor(z * (150 / length))
  const b = Math.floor(x * (150 / length))
  return `rgb(${r}, ${g}, ${b})`
}
