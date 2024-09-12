import React, { useState } from 'react'
import { Button } from 'primereact/button'

const Header: React.FC = () => {
  const [expanded, setExpanded] = useState(false)

  const handleMenu = () => {
    setExpanded(!expanded)
  }

  return (
    <>
      <div
        style={{
          backgroundColor: 'black',
          padding: '8px 16px',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
        }}>
        <img alt="Logo" src={'/assets/images/Moorfind.png'} style={{ width: 100, height: 80 }} />
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <Button
            icon={expanded ? 'pi pi-angle-up' : 'pi pi-angle-down'}
            onClick={handleMenu}
            className="p-button-rounded p-button-outlined"
          />
        </div>
      </div>
    </>
  )
}

export default Header
