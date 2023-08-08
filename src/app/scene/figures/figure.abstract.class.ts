import {
  BufferGeometry,
  MeshLambertMaterial,
  Vector3,
  Mesh,
  Scene,
} from 'three'

import { Ball } from '../canvas/ball.class'
import { config } from '../../config'

export abstract class Figure<T extends BufferGeometry> {
  readonly mesh: Mesh<T, MeshLambertMaterial>
  readonly X: Vector3

  private static readonly material = new MeshLambertMaterial({
    color: 'teal',
  })

  constructor(scene: Scene, geometry: T, position: Vector3) {
    this.mesh = new Mesh(geometry, Figure.material)

    this.X = this.mesh.position
    this.X.copy(position)

    this.isEnabled = config.figure.enabled
    scene.add(this.mesh)
  }

  abstract collide(ball: Ball): boolean

  get isEnabled() {
    return this.mesh.visible
  }

  set isEnabled(val: boolean) {
    this.mesh.visible = val
  }

  get geometry() {
    return this.mesh.geometry
  }
}
