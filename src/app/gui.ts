import { GUI } from 'dat.gui'
import { config } from './config'

export function createGui(options: { onRestartClick: () => void }) {
  const gui = new GUI()

  const appFolder = gui.addFolder('Application')
  appFolder.add(config.app, 'performance', 0.1, 1, 0.01).name('Performance')

  const envFolder = gui.addFolder('Environment')

  const gravFolder = envFolder.addFolder('Gravity force')
  gravFolder.add(config.environment.gravity, 'x', -10, 10, 0.1).name('X')
  gravFolder.add(config.environment.gravity, 'y', -10, 10, 0.1).name('Y')
  gravFolder.add(config.environment.gravity, 'z', -10, 10, 0.1).name('Z')

  const windFolder = envFolder.addFolder('Wind force')
  windFolder.add(config.environment.wind, 'x', -10, 10, 0.1).name('X')
  windFolder.add(config.environment.wind, 'y', -10, 10, 0.1).name('Y')
  windFolder.add(config.environment.wind, 'z', -10, 10, 0.1).name('Z')

  const figFolder = envFolder.addFolder('Figure')
  figFolder.add(config.environment.figure.position, 'x', -20, 20, 0.1).name('X')
  figFolder.add(config.environment.figure.position, 'y', -20, 20, 0.1).name('Y')
  figFolder.add(config.environment.figure.position, 'z', -20, 20, 0.1).name('Z')
  figFolder
    .add(config.environment.figure, 'type', ['sphere', 'cube', 'cone'])
    .name('Type')

  const canvasFolder = gui.addFolder('Canvas')
  canvasFolder.add(config.canvas, 'perRow', 0, 100, 1).name('Balls per row')
  canvasFolder
    .add(config.canvas, 'distanceBetween', 0, 10, 0.01)
    .name('Distance between balls')
  canvasFolder
    .add(config.canvas, 'altitude', -100, 100, 1)
    .name('Initial altitude')
  canvasFolder
    .add(config.canvas, 'mesh', ['square', 'diagonal', 'merged'])
    .name('Mesh')

  const ballFolder = canvasFolder.addFolder('Ball')
  ballFolder.add(config.canvas.ball, 'radius', 0.01, 5, 0.01).name('Radius')
  ballFolder.add(config.canvas.ball, 'mass', 0.1, 10, 0.1).name('Mass')
  ballFolder
    .add(config.canvas.ball, 'energyRetain', 0, 1, 0.01)
    .name('Energy retain in %')

  const springFolder = canvasFolder.addFolder('Springs')
  springFolder.add(config.canvas.spring, 'L', 0, 50, 0.01).name('L')
  springFolder.add(config.canvas.spring, 'K', 0, 50, 0.01).name('K')
  springFolder.add(config.canvas.spring, 'B', 0, 50, 0.01).name('B')

  gui
    .add(
      {
        restart: options.onRestartClick,
      },
      'restart'
    )
    .name('APPLY & RESTART SIMULATION')
}
