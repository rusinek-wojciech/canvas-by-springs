/**
 * area configuration
 */
export const GRAVITY = [0, -5, 0] as const
export const WIND = [0, 0, 0] as const

/**
 * balls configuration
 */
export const BALLS_PER_ROW = 10
export const BALL_RADIUS = 0.15
export const DISTANCE_BETWEEN_BALLS = 2.0
export const ALTITUDE = 20

export const BALL_ENERGY_LOSS = 0.5
export const BALL_MASS = 1

export const SPRING_L = DISTANCE_BETWEEN_BALLS
export const SPRING_K = 5.9
export const SPRING_B = 0.9

/**
 * do not change
 */
export const ROW_LENGTH = DISTANCE_BETWEEN_BALLS * (BALLS_PER_ROW - 1)
export const HALF_ROW_LENGTH = ROW_LENGTH * 0.5
export const ENERGY_LOSS_INDICATOR = 1 - BALL_ENERGY_LOSS
