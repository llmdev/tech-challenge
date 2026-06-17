import React from 'react'
import * as ReactDOM from 'react-dom/client'
import TransactionsWidget from './TransactionsWidget'

let root: ReactDOM.Root | null = null

export function bootstrap(_props: unknown) {
  return Promise.resolve()
}

export function mount(props: unknown) {
  return new Promise<void>(resolve => {
    const el = document.getElementById('mfe-transactions-root') || document.createElement('div')
    el.id = 'mfe-transactions-root'
    document.getElementById('root')!.appendChild(el)
    root = ReactDOM.createRoot(el)
    root.render(React.createElement(TransactionsWidget, props as Record<string, unknown>))
    resolve()
  })
}

export function unmount(_props: unknown) {
  return new Promise<void>(resolve => {
    if (root) root.unmount()
    const el = document.getElementById('mfe-transactions-root')
    if (el?.parentNode) el.parentNode.removeChild(el)
    resolve()
  })
}

if (typeof globalThis !== 'undefined') {
  // @ts-ignore
  globalThis.mfeTransactions = { bootstrap, mount, unmount }
}
