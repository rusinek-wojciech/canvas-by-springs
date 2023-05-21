import * as THREE from 'three'
import { createCamera } from './scene/camera'
import { config } from './config'
import { createGui } from './gui/gui'
import { Canvas } from './scene/canvas'
import { Cone, Cube, Sphere } from './scene/figures'

function createRenderer() {
  const renderer = new THREE.WebGLRenderer({
    // antialias: false,
    powerPreference: 'high-performance',
    // alpha: true,
    // precision: 'lowp',
  })
  renderer.setPixelRatio(window.devicePixelRatio)
  renderer.setSize(window.innerWidth, window.innerHeight)
  // renderer.shadowMap.enabled = true
  document.body.appendChild(renderer.domElement)
  return renderer
}

function createScene() {
  const scene = new THREE.Scene()
  scene.background = new THREE.Color(0x87ceeb)

  const directionalLight = new THREE.DirectionalLight(0xffffff, 1.0)
  directionalLight.position.copy(config.environment.lightPosition)
  directionalLight.target.position.copy(config.environment.lightPosition)
  // directionalLight.castShadow = true
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

  const CreateFigure = {
    cube: Cube,
    sphere: Sphere,
    cone: Cone,
  } as const

  return {
    scene,
    canvas: new Canvas(scene),
    figure: new CreateFigure[config.figure.type](scene, config.figure.position),
    directionalLight,
  }
}

export function loadApp() {
  const renderer = createRenderer()
  const camera = createCamera(renderer)
  const clock = new THREE.Clock()

  let scene: ReturnType<typeof createScene>

  function handleStart() {
    scene = createScene()
    const { figure, canvas } = scene

    renderer.setAnimationLoop(() => {
      const dt = clock.getDelta()
      canvas.updateState(dt)
      canvas.collide(figure)
      renderer.render(scene.scene, camera)
    })
  }

  createGui({
    onRestartClick() {
      renderer.setAnimationLoop(null)
      renderer.setPixelRatio(window.devicePixelRatio * config.app.performance)
      handleStart()
    },
    onToggleFigure() {
      scene.figure.isEnabled = config.figure.enabled
    },
    onFigurePositionChange() {
      scene.figure.X.copy(config.figure.position)
    },
    onLightPositionChange() {
      scene.directionalLight.position.copy(config.environment.lightPosition)
    },
    onToggleSurface() {
      scene.canvas.toggleSurface(config.canvas.surface)
    },
  })

  handleStart()
}
