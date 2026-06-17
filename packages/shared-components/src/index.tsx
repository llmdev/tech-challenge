import React from 'react'

export interface HomeWidgetProps {
  userName?: string
}

export default function HomeWidget({ userName = 'Usuário' }: HomeWidgetProps) {
  function handleClick() {
    window.dispatchEvent(new CustomEvent('mfe:action', { detail: { from: 'shared-home', time: Date.now() } }))
  }

  return (
    <div style={{ padding: 16, border: '1px solid #ddd', borderRadius: 8 }}>
      <h2 style={{ margin: 0 }}>Olá, {userName} — Shared Home Widget</h2>
      <p style={{ marginTop: 8, marginBottom: 8 }}>Este componente é extraído para `packages/shared-components` e pode ser usado tanto pelo Next app quanto pelo MFE.</p>
      <button onClick={handleClick} style={{ padding: '8px 12px', borderRadius: 6 }}>Emitir evento</button>
    </div>
  )
}
