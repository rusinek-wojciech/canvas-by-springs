import * as THREE from 'three'

/**
 * App configuration shared with GUI
 */
export const config = {
  app: {
    performance: 1.0, // <0.0, 1.0>
  },
  environment: {
    gravity: new THREE.Vector3(0, -1.3, 0),
    wind: new THREE.Vector3(0, 0, 0),
    lightPosition: new THREE.Vector3(3, 6, 1),
    energyRetain: 0.3, // <0.0, 1.0>
  },
  figure: {
    type: 'cube' as 'sphere' | 'cube' | 'cone',
    position: new THREE.Vector3(0, 0, 0),
    radius: 8,
    width: 6,
    height: 8,
    depth: 6,
    enabled: true as boolean,
    angle: {
      // TODO: implement
      yaw: 0.0, // <0.0, 1.0>
      pitch0: 0.0, // <0.0, 1.0>
      roll: 0.0, // <0.0, 1.0>
    },
  },
  canvas: {
    type: 'square' as 'square' | 'diagonal' | 'merged',
    surface: true as boolean,
    position: new THREE.Vector3(0, 15, 0),
    angle: {
      yaw: 0.0, // <0.0, 1.0>
      roll: 0.0, // <0.0, 1.0>
    },
    perRow: 20, // integer
    distanceBetween: 0.4,
    ball: {
      mass: 1,
      radius: 0.1,
    },
    spring: {
      L: 0.4,
      K: 30,
      B: 5,
    },
  },
} as const
