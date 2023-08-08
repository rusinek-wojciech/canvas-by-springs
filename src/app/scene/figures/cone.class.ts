import { ConeGeometry, Vector3, Scene } from 'three'

import { ballCollideCone } from '../../math/collisions'
import { Ball } from '../canvas/ball.class'
import { Figure } from './figure.abstract.class'
import { config } from '../../config'

const buff = new Vector3()

export class Cone extends Figure<ConeGeometry> {
  readonly tg: number
  readonly ctg: number

  readonly translateToOrigin: Vector3
  readonly radiusVec: Vector3

  constructor(scene: Scene, position: Vector3) {
    const { radius, height } = config.figure
    const geometry = new ConeGeometry(radius, height)
    super(scene, geometry, position)

    this.tg = this.r / this.h
    this.ctg = this.h / this.r
    this.translateToOrigin = new Vector3(0, 0.5 * this.h, 0)
    this.radiusVec = new Vector3(0, this.r, 0)
  }

  get r() {
    return this.geometry.parameters.radius
  }

  get h() {
    return this.geometry.parameters.height
  }

  collide(ball: Ball) {
    return this.isEnabled
      ? ballCollideCone(ball, this, config.environment.energyRetain.collision)
      : false
  }

  getX0(dir: Vector3, y: number, xzLength: number) {
    const x0 = (this.h - y + this.tg * xzLength) / (this.ctg + this.tg)
    const y0 = this.h - this.ctg * x0
    return dir.multiplyScalar(x0).add(buff.set(0, y0, 0))
  }

  getNormal(dir: Vector3) {
    return dir.multiplyScalar(this.h).add(this.radiusVec).normalize()
  }
}
