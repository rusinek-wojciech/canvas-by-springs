import * as THREE from 'three'
import { config } from '../../config'
import { Cone, Cube, Sphere } from '../figures'
import { createSpringMesh } from './create-spring-mesh'
import { createBalls } from './create-balls'
import { Surface } from './surface.class'

export class Canvas {
  readonly balls
  readonly springs
  readonly surface

  constructor(scene: THREE.Scene) {
    const balls = createBalls()

    this.springs = createSpringMesh[config.canvas.type](
      scene,
      balls,
      config.canvas.perRow
    )

    this.balls = balls.flatMap((b) => b)

    this.surface = new Surface(scene, balls)

    scene.add(...this.balls.map((b) => b.mesh))

    this.toggleSurface(config.canvas.surface)
  }

  updateState(dt: number) {
    for (let i = 0; i < this.balls.length; i++) {
      this.balls[i].updateState(dt)
    }
    for (let i = 0; i < this.springs.length; i++) {
      this.springs[i].updateState()
    }
  }

  repaint() {
    this.surface.repaint()
    for (let i = 0; i < this.springs.length; i++) {
      this.springs[i].repaint()
    }
  }

  collide(figure: Cone | Sphere | Cube) {
    for (let i = 0; i < this.balls.length; i++) {
      figure.collide(this.balls[i])
    }
    for (let i = 0; i < this.balls.length; i++) {
      for (let j = i + 1; j < this.balls.length; j++) {
        this.balls[i].collide(this.balls[j])
      }
    }
  }

  toggleSurface(isSurface: boolean) {
    for (let i = 0; i < this.surface.planes.length; i++) {
      this.surface.planes[i].mesh.visible = isSurface
    }
    for (let i = 0; i < this.springs.length; i++) {
      this.springs[i].mesh.visible = !isSurface
    }
    for (let i = 0; i < this.balls.length; i++) {
      this.balls[i].mesh.visible = !isSurface
    }
  }
}
