import * as THREE from 'three'
import { config } from '../config'
import { position, velocity } from '../physics/formulas'

// changeable dynamically
const ENV_CONFIG = config.environment

export class Ball {
  readonly r: number
  readonly m: number

  readonly _X = new THREE.Vector3()
  readonly X = new THREE.Vector3()

  readonly _V = new THREE.Vector3()
  readonly V = new THREE.Vector3()

  readonly _F = new THREE.Vector3()
  readonly F = new THREE.Vector3()

  constructor(
    mesh: THREE.Mesh<THREE.SphereGeometry, THREE.Material>,
    mass: number
  ) {
    this.X = mesh.position
    this.m = mass
    this.r = mesh.geometry.parameters.radius
  }

  updateState(dt: number) {
    this._F.copy(this.F)
    this.F.copy(ENV_CONFIG.gravity).add(ENV_CONFIG.wind)

    this._V.copy(this.V)
    velocity(this.V, this._F, this.m, this._V, dt)

    this._X.copy(this.X)
    position(this.X, this.V, this._X, dt)
  }
}
