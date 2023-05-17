import * as THREE from 'three'
import { createCamera } from './camera'
import { createScene } from './scene/scene'
import { config } from './config'
import { createGui } from './gui'

function createRenderer() {
  const renderer = new THREE.WebGLRenderer({
    antialias: false,
    powerPreference: 'high-performance',
    alpha: true,
    precision: 'lowp',
  })
  renderer.setPixelRatio(window.devicePixelRatio)
  renderer.setSize(window.innerWidth, window.innerHeight)
  document.body.appendChild(renderer.domElement)
  return renderer
}

export function loadApp() {
  const renderer = createRenderer()
  const camera = createCamera(renderer)
  const clock = new THREE.Clock()

  createGui({
    onRestartClick() {
      handleRestart()
      handleStart()
    },
  })

  handleStart()

  function handleStart() {
    const { scene, balls, springs, cube } = createScene()

    renderer.setAnimationLoop(() => {
      const dt = clock.getDelta()

      for (let i = 0; i < springs.length; i++) {
        springs[i].calculate(dt)
        springs[i].draw(dt)
      }
      for (let i = 0; i < balls.length; i++) {
        balls[i].calculate(dt, cube, balls.slice(i + 1))
        balls[i].draw(dt)
      }

      renderer.render(scene, camera)
    })
  }

  function handleRestart() {
    renderer.setAnimationLoop(null)
    renderer.setPixelRatio(window.devicePixelRatio * config.app.performance)
  }
}
