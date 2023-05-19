import * as THREE from 'three'
import { createSpringMesh } from './spring-mesh'
import { config } from '../config'
import { Cone, Cube, Sphere, Ball } from './figures'

const createFigure = {
  cube: Cube,
  sphere: Sphere,
  cone: Cone,
} as const

export function createScene() {
  const scene = new THREE.Scene()
  scene.background = new THREE.Color(0x87ceeb)
  const ambientLight = new THREE.AmbientLight(0xffffff, 1.0)
  scene.add(ambientLight)
  const balls = createBalls(scene)

  const figure = new createFigure[config.environment.figure.type](
    config.environment.figure.position
  )
  scene.add(figure.mesh)

  const springs = createSpringMesh[config.canvas.mesh](
    scene,
    balls,
    config.canvas.perRow
  )

  return {
    scene,
    balls: balls.flatMap((b) => b),
    springs,
    figure,
  }
}

function createBalls(scene: THREE.Scene) {
  const length = config.canvas.distanceBetween * (config.canvas.perRow - 1)

  const balls: Ball[][] = []

  for (let i = 0; i <= length; i += config.canvas.distanceBetween) {
    const row: Ball[] = []

    for (let j = 0; j <= length; j += config.canvas.distanceBetween) {
      const mesh = new THREE.Mesh(
        new THREE.SphereGeometry(config.canvas.ball.radius, 8, 4),
        new THREE.MeshStandardMaterial({
          color: colorByIterators(i, j, length),
        })
      )
      mesh.position.set(
        j - 0.5 * length,
        config.canvas.altitude,
        i - 0.5 * length
      )
      scene.add(mesh)

      row.push(new Ball(mesh, config.canvas.ball.mass))
    }
    balls.push(row)
  }
  return balls
}

function colorByIterators(z: number, x: number, length: number) {
  const r = 200
  const g = Math.floor(z * (150 / length))
  const b = Math.floor(x * (150 / length))
  return `rgb(${r}, ${g}, ${b})`
}
