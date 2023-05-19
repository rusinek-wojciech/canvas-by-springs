import * as THREE from 'three'

export const config = {
  app: {
    performance: 1.0,
  },
  environment: {
    gravity: new THREE.Vector3(0, -2, 0),
    wind: new THREE.Vector3(0.3, 0, 0.2),
  },
  figure: {
    type: 'cube' as 'sphere' | 'cube' | 'cone',
    position: new THREE.Vector3(0, 0, 0),
    radius: 5,
    width: 10,
    height: 10,
    depth: 10,
  },
  canvas: {
    type: 'square' as 'square' | 'diagonal' | 'merged',
    position: new THREE.Vector3(0, 15, 0),
    perRow: 20,
    distanceBetween: 1.0,
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
