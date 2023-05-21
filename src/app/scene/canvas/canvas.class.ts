import * as THREE from 'three'
import { config } from '../../config'
import { Ball, Cone, Cube, Sphere } from '../figures'
import { createSpringMesh } from './create-spring-mesh'
import { Spring } from './spring.class'
import { createBalls } from './create-balls'

export class Canvas {
  readonly balls: Ball[]
  readonly springs: Spring[]

  constructor(scene: THREE.Scene) {
    const balls = createBalls()

    this.springs = createSpringMesh[config.canvas.type](
      scene,
      balls,
      config.canvas.perRow
    )
    this.balls = balls.flatMap((b) => b)
    scene.add(...this.balls.map((b) => b.mesh))
  }

  updateState(dt: number) {
    for (let i = 0; i < this.balls.length; i++) {
      this.balls[i].updateState(dt)
    }
    for (let i = 0; i < this.springs.length; i++) {
      this.springs[i].updateState()
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
}
