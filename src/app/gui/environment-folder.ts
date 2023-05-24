import { GUI } from 'dat.gui'
import { config } from '../config'
import { percentControl, positionControl, vectorControl } from './controls'

export function createEnvironmentFolder(
  gui: GUI,
  onLightPositionChange: () => void
) {
  const folder = gui.addFolder('Environment')
  const { gravityAcceleration, windForce, lightPosition, energyRetain } =
    config.environment

  const energyFolder = folder.addFolder('Energy retain')
  percentControl(energyFolder, energyRetain, 'collision', 'Collision')
  percentControl(energyFolder, energyRetain, 'airDrag', 'Air drag')
  energyFolder.open()

  const gravFolder = folder.addFolder('Gravity acceleration')
  vectorControl(gravFolder, gravityAcceleration)
  gravFolder.open()

  const windFolder = folder.addFolder('Wind force')
  vectorControl(windFolder, windForce)
  windFolder.open()

  const lightFolder = folder.addFolder('Light position')
  const [xCtrl, yCtrl, zCtrl] = positionControl(lightFolder, lightPosition)
  xCtrl.onChange(onLightPositionChange)
  yCtrl.onChange(onLightPositionChange)
  zCtrl.onChange(onLightPositionChange)
  lightFolder.open()
}
