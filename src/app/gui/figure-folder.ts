import { GUI } from 'dat.gui'
import { config } from '../config'
import { positionControl, floatControl, angleControl } from './controls'

export function createFigureFolder(
  gui: GUI,
  onToggleFigure: () => void,
  onFigurePositionChange: () => void
) {
  const folder = gui.addFolder('Figure')
  const { position, angle } = config.figure

  folder.add(config.figure, 'enabled').name('Enabled').onChange(onToggleFigure)
  const typeCtrl = folder
    .add(config.figure, 'type', ['sphere', 'cube', 'cone'])
    .name('Type')

  const radiusCtrl = floatControl(folder, config.figure, 'radius', 'Radius')
  const widthCtrl = floatControl(folder, config.figure, 'width', 'Width')
  const heightCtrl = floatControl(folder, config.figure, 'height', 'Height')
  const depthCtrl = floatControl(folder, config.figure, 'depth', 'Depth')

  function handleTypeChange(type: typeof config.figure.type) {
    if (type === 'cone') {
      radiusCtrl.domElement.style.display = 'block'
      widthCtrl.domElement.style.display = 'none'
      heightCtrl.domElement.style.display = 'block'
      depthCtrl.domElement.style.display = 'none'
    } else if (type === 'cube') {
      radiusCtrl.domElement.style.display = 'none'
      widthCtrl.domElement.style.display = 'block'
      heightCtrl.domElement.style.display = 'block'
      depthCtrl.domElement.style.display = 'block'
    } else if (type === 'sphere') {
      radiusCtrl.domElement.style.display = 'block'
      widthCtrl.domElement.style.display = 'none'
      heightCtrl.domElement.style.display = 'none'
      depthCtrl.domElement.style.display = 'none'
    }
  }

  typeCtrl.onChange(handleTypeChange)
  handleTypeChange(config.figure.type)

  const orFolder = folder.addFolder('Orientation')
  const [xCtrl, yCtrl, zCtrl] = positionControl(orFolder, position)
  const yaCtrl = angleControl(orFolder, angle, 'yaw', 'Yaw')
  const paCtrl = angleControl(orFolder, angle, 'pitch', 'Pitch')
  const raCtrl = angleControl(orFolder, angle, 'roll', 'Roll')

  xCtrl.onChange(onFigurePositionChange)
  yCtrl.onChange(onFigurePositionChange)
  zCtrl.onChange(onFigurePositionChange)
  yaCtrl.onChange(onFigurePositionChange)
  paCtrl.onChange(onFigurePositionChange)
  raCtrl.onChange(onFigurePositionChange)

  // TODO: remove after implementing rotation for figure
  yaCtrl.domElement.style.display = 'none'
  paCtrl.domElement.style.display = 'none'
  raCtrl.domElement.style.display = 'none'
}
