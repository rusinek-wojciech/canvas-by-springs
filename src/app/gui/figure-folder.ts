import { GUI } from 'dat.gui'
import { config } from '../config'
import { positionControl, floatControl } from './controls'

export function createFigureFolder(
  gui: GUI,
  onToggleFigure: (v: boolean) => void,
  onFigurePositionChange: () => void
) {
  const folder = gui.addFolder('Figure')
  const { position } = config.figure

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

  const [xCtrl, yCtrl, zCtrl] = positionControl(folder, position)
  xCtrl.onChange(onFigurePositionChange)
  yCtrl.onChange(onFigurePositionChange)
  zCtrl.onChange(onFigurePositionChange)

  folder.add({ v: true }, 'v', true).name('Enabled').onChange(onToggleFigure)
}
