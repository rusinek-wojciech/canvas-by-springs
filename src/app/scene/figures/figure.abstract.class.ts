import * as THREE from 'three'
import { Ball } from '../canvas/ball.class'
import { config } from '../../config'

export abstract class Figure<T extends THREE.BufferGeometry> {
  readonly mesh: THREE.Mesh<T, THREE.MeshLambertMaterial>
  readonly X: THREE.Vector3

  private static readonly material = new THREE.MeshLambertMaterial({
    color: 'teal',
  })

  constructor(scene: THREE.Scene, geometry: T, position: THREE.Vector3) {
    this.mesh = new THREE.Mesh(geometry, Figure.material)

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
