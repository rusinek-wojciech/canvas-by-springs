import * as THREE from 'three'

/**
 * App configuration shared with GUI
 */
export const config = {
  app: {
    performance: 1.0, // <0.0, 1.0>
  },
  environment: {
    gravityAcceleration: new THREE.Vector3(0, -9.8, 0), // [m/s^2]
    windForce: new THREE.Vector3(0, 0, 0), // [N]
    lightPosition: new THREE.Vector3(3, 6, 1),
    energyRetain: 0.3, // <0.0, 1.0> [%]
  },
  figure: {
    type: 'cube' as 'sphere' | 'cube' | 'cone',
    position: new THREE.Vector3(0, 0, 0),
    radius: 8, // [m]
    width: 6, // [m]
    height: 8, // [m]
    depth: 6, // [m]
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
    distanceBetween: 0.4, // [m]
    ball: {
      mass: 1, // [kg]
      radius: 0.1, // [m]
    },
    spring: {
      L: 0.4, // [m]
      K: 30, // [N/m]
      B: 5, // [kg/s],
    },
  },
} as const
