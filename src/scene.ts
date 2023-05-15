import * as THREE from 'three'
import { Ball } from './ball'
import {
  ALTITUDE,
  BALL_RADIUS,
  DISTANCE_BETWEEN_BALLS,
  HALF_ROW_LENGTH,
  ROW_LENGTH,
} from './config'
import { createSquareSprings } from './spring'

export function createScene() {
  const scene = new THREE.Scene()
  scene.background = new THREE.Color(0x87ceeb)

  const directionalLight = new THREE.DirectionalLight(0xffffff, 1.0)
  directionalLight.position.set(0.33, 0.66, 0.1)
  directionalLight.target.position.set(0, 0, 0)
  directionalLight.castShadow = true
  directionalLight.shadow.bias = -0.001
  directionalLight.shadow.mapSize.width = 2048
  directionalLight.shadow.mapSize.height = 2048
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

  const cube = createCube()
  scene.add(cube)
  const balls = createBalls(scene)
  const springs = createSquareSprings(scene, balls)

  return {
    scene,
    balls: balls.flatMap((b) => b),
    springs: springs,
    cube: cube,
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
        new THREE.SphereGeometry(BALL_RADIUS, 12, 6),
        new THREE.MeshStandardMaterial({
          color: colorByIterators(i, j),
        })
      )
      mesh.position.set(j - HALF_ROW_LENGTH, ALTITUDE, i - HALF_ROW_LENGTH)
      mesh.castShadow = true
      mesh.receiveShadow = true
      scene.add(mesh)

      row.push(new Ball(mesh))
    }
    balls.push(row)
  }
  return balls
}

function createCube() {
  const solidMaterial = new THREE.MeshStandardMaterial({ color: 'teal' })
  const geometry = new THREE.BoxGeometry(10, 10, 10)
  geometry.computeVertexNormals()
  const mesh = new THREE.Mesh(geometry, solidMaterial)
  mesh.castShadow = true
  mesh.receiveShadow = true
  return mesh
}
