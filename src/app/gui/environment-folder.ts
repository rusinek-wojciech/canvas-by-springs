import { GUI } from 'dat.gui'
import { config } from '../config'
import { percentControl, positionControl, vectorControl } from './controls'

export function createEnvironmentFolder(
  gui: GUI,
  onLightPositionChange: () => void
) {
  const folder = gui.addFolder('Environment')
  const { gravityAcceleration, windForce, lightPosition } = config.environment

  percentControl(folder, config.environment, 'energyRetain', 'Energy retain')

  const gravFolder = folder.addFolder('Gravity')
  vectorControl(gravFolder, gravityAcceleration)
  gravFolder.open()

  const windFolder = folder.addFolder('Wind')
  vectorControl(windFolder, windForce)
  windFolder.open()

  const lightFolder = folder.addFolder('Light')
  const [xCtrl, yCtrl, zCtrl] = positionControl(lightFolder, lightPosition)
  xCtrl.onChange(onLightPositionChange)
  yCtrl.onChange(onLightPositionChange)
  zCtrl.onChange(onLightPositionChange)
  lightFolder.open()
}
