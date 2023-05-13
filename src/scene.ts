import * as THREE from 'three'
import { SceneBall } from './SceneBall'
import { BALL_MASS, BALL_RADIUS } from './config'
import { from } from './utils'

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

  const balls: SceneBall[] = []
  const step = 20 / 19
  for (let z = -10; z <= 10; z += step) {
    for (let x = -10; x < 10; x += step) {
      const geometry = new THREE.SphereGeometry(BALL_RADIUS)
      const material = new THREE.MeshStandardMaterial({
        color: `hsl(220, ${Math.random() * 100}%, ${Math.random() * 100}%)`,
      })
      const mesh = new THREE.Mesh(geometry, material)
      mesh.castShadow = true
      mesh.receiveShadow = true
      mesh.position.copy(new THREE.Vector3(x, 20, z))
      scene.add(mesh)
      const ball = new SceneBall(mesh, from(), from(), BALL_MASS)
      balls.push(ball)
    }
  }
  return { scene, balls }
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

function createSpring(scene: THREE.Scene, ball1: SceneBall, ball2: SceneBall) {
  const spring = new THREE.Line(
    new THREE.BufferGeometry().setFromPoints([]),
    new THREE.LineBasicMaterial({ color: 0x000000 })
  )
  scene.add(spring)
  return {
    draw() {
      spring.geometry.setFromPoints([
        from(ball1.position),
        from(ball2.position),
      ])
    },
  }
}
