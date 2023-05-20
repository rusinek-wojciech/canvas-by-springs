import * as THREE from 'three'
import { Ball } from './ball.class'

export abstract class Figure<T extends THREE.BufferGeometry> {
  readonly mesh: THREE.Mesh<T, THREE.MeshStandardMaterial>
  readonly X: THREE.Vector3

  constructor(
    geometry: T,
    position: THREE.Vector3,
    material: THREE.MeshStandardMaterial = new THREE.MeshStandardMaterial({
      color: 'teal',
    })
  ) {
    this.mesh = new THREE.Mesh(geometry, material)
    this.X = this.mesh.position
    this.X.copy(position)
  }

  abstract collide(ball: Ball): boolean

  get isEnabled() {
    return this.mesh.visible
  }

  get geometry() {
    return this.mesh.geometry
  }
}
