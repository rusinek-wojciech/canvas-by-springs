import * as THREE from 'three'
import {
  ballCollideCone,
  ballCollideCube,
  ballCollideSphere,
} from '../physics/collisions'
import { Ball } from './ball'

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

export class Cube extends Figure<THREE.BoxGeometry> {
  readonly D: THREE.Vector3

  constructor(position: THREE.Vector3) {
    const geometry = new THREE.BoxGeometry(10, 10, 10)
    super(geometry, position)

    const { width, height, depth } = this.geometry.parameters
    this.D = new THREE.Vector3(width, height, depth)
  }

  collide(ball: Ball, energyRetain: number) {
    return ballCollideCube(ball, this, energyRetain)
  }
}

export class Sphere extends Figure<THREE.SphereGeometry> {
  constructor(position: THREE.Vector3) {
    const geometry = new THREE.SphereGeometry(5)
    super(geometry, position)
  }

  get r() {
    return this.geometry.parameters.radius
  }

  collide(ball: Ball, energyRetain: number) {
    return ballCollideSphere(ball, this, energyRetain)
  }
}

export class Cone extends Figure<THREE.ConeGeometry> {
  constructor(position: THREE.Vector3) {
    const geometry = new THREE.ConeGeometry(5, 10)
    super(geometry, position)
  }

  get r() {
    return this.geometry.parameters.radius
  }

  collide(ball: Ball, energyRetain: number) {
    return ballCollideCone(ball, this, energyRetain)
  }
}

export const createFigure = {
  cube: Cube,
  sphere: Sphere,
  cone: Cone,
} as const
