import { GUI } from 'dat.gui'
import { config } from '../config'
import {
  percentControl,
  positionControl,
  floatControl,
  intControl,
} from './controls'

export function createCanvasFolder(gui: GUI) {
  const folder = gui.addFolder('Canvas')
  const { position, spring, ball } = config.canvas

  folder
    .add(config.canvas, 'type', ['square', 'diagonal', 'merged'])
    .name('Type')
  intControl(folder, config.canvas, 'perRow', 'Balls per row')
  floatControl(folder, config.canvas, 'distanceBetween', 'Distance between')
  positionControl(folder, position)

  const ballFolder = folder.addFolder('Ball')
  floatControl(ballFolder, ball, 'radius', 'Radius')
  floatControl(ballFolder, ball, 'mass', 'Mass')
  floatControl(ballFolder, ball, 'mass', 'Mass')
  percentControl(ballFolder, ball, 'energyRetain', 'Energy retain')

  const springFolder = folder.addFolder('Springs')
  floatControl(springFolder, spring, 'L', 'L')
  floatControl(springFolder, spring, 'K', 'K')
  floatControl(springFolder, spring, 'B', 'B')
}
