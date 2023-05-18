import * as THREE from 'three'
import { createCamera } from './camera'
import { createScene } from './scene/scene'
import { config } from './config'
import { createGui } from './gui'
import { ballCollideCube, ballCollideBall } from './physics/collisions'

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

      for (let i = 0; i < balls.length; i++) {
        balls[i].updateState(dt)
      }
      for (let i = 0; i < springs.length; i++) {
        springs[i].updateState()
      }

      for (let i = 0; i < balls.length; i++) {
        ballCollideCube(balls[i], cube, config.canvas.ball.energyRetain)
      }

      for (let i = 0; i < balls.length; i++) {
        for (let j = i + 1; j < balls.length; j++) {
          ballCollideBall(balls[i], balls[j], config.canvas.ball.energyRetain)
        }
      }

      for (let i = 0; i < springs.length; i++) {
        springs[i].draw()
      }

      renderer.render(scene, camera)
    })
  }

  function handleRestart() {
    renderer.setAnimationLoop(null)
    renderer.setPixelRatio(window.devicePixelRatio * config.app.performance)
  }
}
