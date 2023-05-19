import * as THREE from 'three'
import { Ball } from './ball.class'

export abstract class Figure<T extends THREE.BufferGeometry> {
  readonly mesh: THREE.Mesh<T, THREE.MeshStandardMaterial>
  readonly X: THREE.Vector3

  constructor(geometry: T, position: THREE.Vector3) {
    this.mesh = new THREE.Mesh(
      geometry,
      new THREE.MeshStandardMaterial({ color: 'teal' })
    )
    this.X = this.mesh.position
    this.X.copy(position)
  }

  abstract collide(ball: Ball, energyRetain: number): boolean

  get geometry() {
    return this.mesh.geometry
  }
}
