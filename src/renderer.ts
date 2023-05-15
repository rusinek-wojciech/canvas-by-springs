import * as THREE from 'three'
import { createCamera } from './camera'
import { createScene } from './scene'

function createRenderer() {
  const renderer = new THREE.WebGLRenderer({ antialias: true })
  renderer.shadowMap.enabled = true
  renderer.shadowMap.type = THREE.PCFSoftShadowMap
  renderer.setPixelRatio(window.devicePixelRatio)
  renderer.setSize(window.innerWidth, window.innerHeight)

  document.body.appendChild(renderer.domElement)

  return renderer
}

export function loadApp() {
  const renderer = createRenderer()
  const camera = createCamera(renderer)
  const { scene, balls, springs, cube } = createScene()
  const clock = new THREE.Clock()

  renderer.setAnimationLoop(() => {
    const dt = clock.getDelta()

    for (let i = 0; i < springs.length; i++) {
      springs[i].calculate()
    }
    for (let i = 0; i < balls.length; i++) {
      balls[i].calculate(dt, cube, balls.slice(i + 1))
    }

    for (let i = 0; i < balls.length; i++) {
      balls[i].draw(dt)
    }
    for (let i = 0; i < springs.length; i++) {
      springs[i].draw()
    }

    renderer.render(scene, camera)
  })
}
