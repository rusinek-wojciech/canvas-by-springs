import * as THREE from 'three'
import { createCamera } from './camera'
import { createScene } from './scene'
import { PERFORMANCE } from './config'

function createRenderer() {
  const renderer = new THREE.WebGLRenderer({
    antialias: false,
    powerPreference: 'high-performance',
    alpha: true,
    precision: 'lowp',
  })
  renderer.setPixelRatio(window.devicePixelRatio * PERFORMANCE)
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
      springs[i].calculate(dt)
      springs[i].draw()
    }
    for (let i = 0; i < balls.length; i++) {
      balls[i].calculate(dt, cube, balls.slice(i + 1))
      balls[i].draw(dt)
    }

    renderer.render(scene, camera)
  })
}
