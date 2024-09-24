import { Outlet } from 'react-router-dom'

const Moormanage = () => {
  return (
    <div
      style={{
        // flexGrow: 1,
        // maxHeight: '100vh',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'space-between',
        position: 'relative',
        overflowY: 'auto',
      }}>
      <Outlet />
    </div>
  )
}

export default Moormanage
