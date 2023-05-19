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

  const directionalLight = new THREE.DirectionalLight(0xffffff, 1.0)
  directionalLight.position.set(0.33, 0.66, 0.1)
  directionalLight.target.position.set(0, 0, 0)
  directionalLight.shadow.bias = -0.001
  directionalLight.shadow.camera.near = 0.1
  directionalLight.shadow.camera.far = 500.0
  directionalLight.shadow.camera.near = 0.5
  directionalLight.shadow.camera.far = 500.0
  directionalLight.shadow.camera.left = 100
  directionalLight.shadow.camera.right = -100
  directionalLight.shadow.camera.top = 100
  directionalLight.shadow.camera.bottom = -100
  scene.add(directionalLight)

  const ambientLight = new THREE.AmbientLight(0xffffff, 0.5)
  scene.add(ambientLight)

  const balls = createBalls(scene)

  const figure = new createFigure[config.figure.type](config.figure.position)
  scene.add(figure.mesh)

  const springs = createSpringMesh[config.canvas.type](
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
      const ball = new Ball(
        new THREE.Vector3(j - 0.5 * length, 0, i - 0.5 * length).add(
          config.canvas.position
        ),
        colorByIterators(i, j, length),
        config.canvas.ball.mass
      )

      scene.add(ball.mesh)
      row.push(ball)
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
