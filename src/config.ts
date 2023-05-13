/**
 * area configuration
 */

/**
 * balls configuration
 */
export const BALL_RADIUS = 0.2
export const BALL_ENERGY_LOSS = 0.05
export const BALL_MASS = 1

/**
 * camera configuration
 */
export const FOV = 60
export const NEAR = 1.0
export const FAR = 1000.0
export const CAMERA_POSITION = [20, 0, 0] as const
export const ORBIT_TARGET = [0, 0, 0] as const

/**
 * do not change
 */
export const ENERGY_LOSS_INDICATOR = 1 - BALL_ENERGY_LOSS
