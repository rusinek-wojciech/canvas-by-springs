import './style.css'
import WebGL from 'three/examples/jsm/capabilities/WebGL'
import { loadApp } from './app/renderer'

function handleWebGLNotAvailable() {
  const h1 = document.createElement('h1')
  h1.appendChild(
    document.createTextNode('WebGL is not supported on this platform')
  )
  document.body.appendChild(h1)
}

window.addEventListener(
  'DOMContentLoaded',
  () => {
    WebGL.isWebGLAvailable() ? loadApp() : handleWebGLNotAvailable()
  },
  { once: true }
)
