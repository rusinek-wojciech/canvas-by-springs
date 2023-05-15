import * as THREE from 'three'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls'

const FOV = 60
const NEAR = 1.0
const FAR = 1000.0
const CAMERA_POSITION = [0, 30, 0] as const
const ORBIT_TARGET = [0, 5, 0] as const

const aspect = () => window.innerWidth / window.innerHeight

export function createCamera(renderer: THREE.WebGLRenderer) {
  const camera = new THREE.PerspectiveCamera(FOV, aspect(), NEAR, FAR)
  camera.position.set(...CAMERA_POSITION)

  const controls = new OrbitControls(camera, renderer.domElement)
  controls.target.set(...ORBIT_TARGET)
  controls.update()

  window.addEventListener(
    'resize',
    () => {
      camera.aspect = aspect()
      camera.updateProjectionMatrix()
      renderer.setSize(window.innerWidth, window.innerHeight)
    },
    { once: true }
  )

  return camera
}
