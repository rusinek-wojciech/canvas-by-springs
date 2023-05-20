import { GUI } from 'dat.gui'
import { config } from '../config'
import { createCanvasFolder } from './canvas-folder'
import { createFigureFolder } from './figure-folder'
import { createEnvironmentFolder } from './environment-folder'
import { percentControl } from './controls'

export function createGui(options: {
  onRestartClick: () => void
  onToggleFigure: (v: boolean) => void
  onFigurePositionChange: () => void
}) {
  const gui = new GUI()

  const folder = gui.addFolder('Application')
  percentControl(folder, config.app, 'performance', 'Performance')

  createEnvironmentFolder(gui)
  createFigureFolder(
    gui,
    options.onToggleFigure,
    options.onFigurePositionChange
  )
  createCanvasFolder(gui)

  gui
    .add(
      {
        restart: options.onRestartClick,
      },
      'restart'
    )
    .name('APPLY & RESTART SIMULATION')
}
