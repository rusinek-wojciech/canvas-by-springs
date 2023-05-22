import { GUI, GUIController } from 'dat.gui'
import { Vector3 } from 'three'

type ControlFn = <T extends object>(
  folder: GUI,
  target: T,
  prop: keyof T,
  name: string
) => GUIController<object>

type VecControlFn = (
  folder: GUI,
  target: Vector3
) => readonly [
  GUIController<object>,
  GUIController<object>,
  GUIController<object>
]

export const positionControl: VecControlFn = (folder, target) => {
  const xCtrl = folder.add(target, 'x', -50, 50, 1).name('X')
  const yCtrl = folder.add(target, 'y', -50, 50, 1).name('Y')
  const zCtrl = folder.add(target, 'z', -50, 50, 1).name('Z')
  return [xCtrl, yCtrl, zCtrl] as const
}

export const vectorControl: VecControlFn = (folder, target) => {
  const xCtrl = folder.add(target, 'x', -25, 25, 0.1).name('X')
  const yCtrl = folder.add(target, 'y', -25, 25, 0.1).name('Y')
  const zCtrl = folder.add(target, 'z', -25, 25, 0.1).name('Z')
  return [xCtrl, yCtrl, zCtrl] as const
}

export const floatControl: ControlFn = (folder, target, prop, name) => {
  return folder.add(target, prop, 0.0, undefined, 0.01).name(name)
}

export const percentControl: ControlFn = (folder, target, prop, name) => {
  return folder.add(target, prop, 0.0, 1.0, 0.01).name(name)
}

export const intControl: ControlFn = (folder, target, prop, name) => {
  return folder.add(target, prop, 0, undefined, 1).name(name)
}
