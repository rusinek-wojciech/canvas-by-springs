/**
 * app configuration
 */
export const PERFORMANCE = 1.0

/**
 * area configuration
 */
export const GRAVITY = [0, -2, 0] as const
export const WIND = [0.3, 0, 0.2] as const

/**
 * canvas configuration
 */
export const BALLS_PER_ROW = 20
export const BALL_RADIUS = 0.15
export const DISTANCE_BETWEEN_BALLS = 1.0
export const ALTITUDE = 12.5

/**
 * balls configuration
 */
export const BALL_ENERGY_LOSS = 0.5
export const BALL_MASS = 1
export const SPRING_L = DISTANCE_BETWEEN_BALLS
export const SPRING_K = 18.2
export const SPRING_B = 0.9
