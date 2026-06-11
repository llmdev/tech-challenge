import React from 'react'
import * as ReactDOM from 'react-dom/client'

// Import a presentational component from the shared package (relative source)
import HomeWidget from '../../../packages/shared-components/src/index.tsx'

let root: ReactDOM.Root | null = null

export function bootstrap(props: any) {
  return Promise.resolve()
}

export function mount(props: any) {
  return new Promise<void>(resolve => {
    const el = document.getElementById('mfe-next-root') || document.createElement('div')
    el.id = 'mfe-next-root'
    document.getElementById('root')!.appendChild(el)
    root = ReactDOM.createRoot(el)
    root.render(React.createElement(HomeWidget, props as any))
    resolve()
  })
}

export function unmount(props: any) {
  return new Promise<void>(resolve => {
    if (root) root.unmount()
    const el = document.getElementById('mfe-next-root')
    if (el && el.parentNode) el.parentNode.removeChild(el)
    resolve()
  })
}

// Expose lifecycles on globalThis for shell consumption (classic script loader)
if (typeof globalThis !== 'undefined') {
  // @ts-ignore
  globalThis.mfeNext = { bootstrap, mount, unmount }
}
