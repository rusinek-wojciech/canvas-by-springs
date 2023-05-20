import * as THREE from 'three'
import { createCamera } from './camera'
import { createScene } from './scene/scene'
import { config } from './config'
import { createGui } from './gui/gui'

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

  let scene: ReturnType<typeof createScene>

  function handleStart() {
    scene = createScene()
    const { balls, figure, springs } = scene

    renderer.setAnimationLoop(() => {
      const dt = clock.getDelta()

      for (let i = 0; i < balls.length; i++) {
        balls[i].updateState(dt)
      }
      for (let i = 0; i < springs.length; i++) {
        springs[i].updateState()
      }
      for (let i = 0; i < balls.length; i++) {
        figure.collide(balls[i])
      }
      for (let i = 0; i < balls.length; i++) {
        for (let j = i + 1; j < balls.length; j++) {
          balls[i].collide(balls[j])
        }
      }
      for (let i = 0; i < springs.length; i++) {
        springs[i].draw()
      }

      renderer.render(scene.scene, camera)
    })
  }

  createGui({
    onRestartClick() {
      renderer.setAnimationLoop(null)
      renderer.setPixelRatio(window.devicePixelRatio * config.app.performance)
      handleStart()
    },
    onToggleFigure(value) {
      scene.figure.mesh.visible = value
    },
    onFigurePositionChange() {
      scene.figure.X.copy(config.figure.position)
    },
  })

  handleStart()
}
