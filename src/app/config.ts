import { Vector3 } from 'three'

/**
 * App configuration shared with GUI
 */
export const config = {
  app: {
    performance: 1.0, // <0.0, 1.0>
  },
  environment: {
    energyRetain: {
      collision: 0.75, // <0.0, 1.0> [%]
      airDrag: 0.99, // <0.0, 1.0> [%]
    },
    gravityAcceleration: new Vector3(0, -4, 0), // [m/s^2]
    windForce: new Vector3(0, 0, 0), // [N]
    lightPosition: new Vector3(3, 6, 1),
  },
  figure: {
    type: 'sphere' as 'sphere' | 'cube' | 'cone',
    position: new Vector3(0, 0, 0),
    radius: 8, // [m]
    width: 6, // [m]
    height: 8, // [m]
    depth: 6, // [m]
    enabled: true as boolean,
    angle: {
      yaw: 0, // <0, 360>
      pitch: 0, // <0, 360>
      roll: 0, // <0, 360>
    },
  },
  canvas: {
    type: 'square' as 'square' | 'diagonal' | 'merged',
    surface: true as boolean,
    position: new Vector3(0, 15, 0),
    angle: {
      yaw: 45, // <0, 360>
      pitch: 0, // <0, 360>
      roll: 0, // <0, 360>
    },
    perRow: 20, // integer
    distanceBetween: 0.4, // [m]
    ball: {
      mass: 1.0, // [kg]
      radius: 0.1, // [m]
    },
    spring: {
      L: 0.4, // [m]
      K: 100, // [N/m]
      B: 7.5, // [kg/s],
    },
  },
} as const
