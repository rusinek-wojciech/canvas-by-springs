import { GUI } from 'dat.gui'
import { config } from '../config'
import { positionControl, floatControl } from './controls'

export function createFigureFolder(gui: GUI) {
  const figFolder = gui.addFolder('Figure')
  const { position } = config.figure

  const typeCtrl = figFolder
    .add(config.figure, 'type', ['sphere', 'cube', 'cone'])
    .name('Type')

  const radiusCtrl = floatControl(figFolder, config.figure, 'radius', 'Radius')
  const widthCtrl = floatControl(figFolder, config.figure, 'width', 'Width')
  const heightCtrl = floatControl(figFolder, config.figure, 'height', 'Height')
  const depthCtrl = floatControl(figFolder, config.figure, 'depth', 'Depth')

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
  positionControl(figFolder, position)
}
