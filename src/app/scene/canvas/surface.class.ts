import {
  MeshPhysicalMaterial,
  DoubleSide,
  Mesh,
  PlaneGeometry,
  Scene,
} from 'three'

import { Ball } from '../figures'

class Plane {
  readonly mesh

  readonly ball1
  readonly ball2
  readonly ball3
  readonly ball4

  private static readonly material = new MeshPhysicalMaterial({
    roughness: 0.4,
    thickness: 0.4,
    color: 0xb7a99b,
    side: DoubleSide,
  })

  constructor(ball1: Ball, ball2: Ball, ball3: Ball, ball4: Ball) {
    this.ball1 = ball1
    this.ball2 = ball2
    this.ball3 = ball3
    this.ball4 = ball4

    this.mesh = new Mesh(
      new PlaneGeometry().setFromPoints([
        ball1._X,
        ball2._X,
        ball3._X,
        ball4._X,
      ]),
      Plane.material
    )
  }
}

export class Surface {
  readonly planes: Plane[] = []

  constructor(scene: Scene, balls: Ball[][]) {
    for (let i = 1; i < balls.length; i++) {
      for (let j = 1; j < balls.length; j++) {
        const plane = new Plane(
          balls[i - 1][j - 1],
          balls[i][j - 1],
          balls[i - 1][j],
          balls[i][j]
        )
        this.planes.push(plane)
        scene.add(plane.mesh)
      }
    }
  }

  repaint() {
    // for petter perfomance - updated reference
    for (const { ball1, ball2, ball3, ball4, mesh } of this.planes) {
      const positions = mesh.geometry.getAttribute('position').array as number[]

      positions[0] = ball1.X.x
      positions[1] = ball1.X.y
      positions[2] = ball1.X.z
      positions[3] = ball2.X.x
      positions[4] = ball2.X.y
      positions[5] = ball2.X.z

      positions[6] = ball3.X.x
      positions[7] = ball3.X.y
      positions[8] = ball3.X.z
      positions[9] = ball4.X.x
      positions[10] = ball4.X.y
      positions[11] = ball4.X.z

      mesh.geometry.attributes.position.needsUpdate = true
      mesh.geometry.computeBoundingSphere()
      mesh.geometry.computeVertexNormals()
      mesh.geometry.computeBoundingBox()
    }
  }
}
