import { GUI } from 'dat.gui'
import { config } from '../config'
import { percentControl, vectorControl } from './controls'

export function createEnvironmentFolder(gui: GUI) {
  const folder = gui.addFolder('Environment')
  const { gravity, wind } = config.environment

  percentControl(folder, config.environment, 'energyRetain', 'Energy retain')

  const gravFolder = folder.addFolder('Gravity force vector')
  vectorControl(gravFolder, gravity)
  gravFolder.open()

  const windFolder = folder.addFolder('Wind force vector')
  vectorControl(windFolder, wind)
  windFolder.open()
}
