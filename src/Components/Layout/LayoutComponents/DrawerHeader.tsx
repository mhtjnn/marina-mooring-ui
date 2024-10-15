import React from 'react'
import { Button } from 'primereact/button'
import 'primereact/resources/themes/saga-blue/theme.css'
import 'primereact/resources/primereact.min.css'
import 'primeicons/primeicons.css'

interface DrawerHeaderProps {
  handleDrawerClose: () => void
}

const DrawerHeader: React.FC<DrawerHeaderProps> = ({ handleDrawerClose }) => {
  return (
    <header>
      <div className="drawer-header">
        <Button
          icon="pi pi-chevron-left"
          onClick={handleDrawerClose}
          className="p-button-rounded p-button-text"
        />
        <img
          src={'/assets/images/Moorfind.png'}
          alt="logo"
          style={{
            height: '120px',
            width: '120px',
            background: 'black',
          }}
        />
      </div>
    </header>
  )
}

export default DrawerHeader
