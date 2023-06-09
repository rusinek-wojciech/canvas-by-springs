import { GUI } from 'dat.gui'
import { config } from '../config'
import {
  positionControl,
  floatControl,
  intControl,
  angleControl,
} from './controls'

export function createCanvasFolder(gui: GUI, onToggleSurface: () => void) {
  const folder = gui.addFolder('Canvas')
  const { position, spring, ball, angle } = config.canvas

  folder
    .add(config.canvas, 'type', ['square', 'diagonal', 'merged'])
    .name('Type')
  folder.add(config.canvas, 'surface').name('Surface').onChange(onToggleSurface)
  intControl(folder, config.canvas, 'perRow', 'Balls per row')
  floatControl(folder, config.canvas, 'distanceBetween', 'Distance between')

  const orFolder = folder.addFolder('Orientation')
  positionControl(orFolder, position)
  angleControl(orFolder, angle, 'yaw', 'Yaw')
  angleControl(orFolder, angle, 'pitch', 'Pitch')
  angleControl(orFolder, angle, 'roll', 'Roll')

  const ballFolder = folder.addFolder('Ball')
  floatControl(ballFolder, ball, 'radius', 'Radius')
  floatControl(ballFolder, ball, 'mass', 'Mass')

  const springFolder = folder.addFolder('Spring')
  floatControl(springFolder, spring, 'L', 'L')
  floatControl(springFolder, spring, 'K', 'K')
  floatControl(springFolder, spring, 'B', 'B')
}
