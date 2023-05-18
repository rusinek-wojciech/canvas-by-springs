import * as THREE from 'three'

export const config = {
  app: {
    performance: 1.0,
  },
  environment: {
    gravity: new THREE.Vector3(0, -2, 0),
    wind: new THREE.Vector3(0.3, 0, 0.2),
    figure: {
      position: new THREE.Vector3(0, 0, 0),
      type: 'cube' as 'sphere' | 'cube' | 'cone',
    },
  },
  canvas: {
    perRow: 20,
    distanceBetween: 1.0,
    altitude: 12.5,
    mesh: 'square' as 'square' | 'diagonal' | 'merged',
    ball: {
      mass: 1.0,
      radius: 0.15,
      energyRetain: 0.5,
    },
    spring: {
      L: 1.0,
      K: 18.2,
      B: 0.9,
    },
  },
} as const
