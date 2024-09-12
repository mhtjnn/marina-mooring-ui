import React, { useEffect, useState } from 'react'
import { NavLink, Outlet } from 'react-router-dom'
import { SidebarMenu } from '../LayoutComponents/SidebarMenu'
import Header from '../LayoutComponents/Header'
import { filterModalStyle } from '../../Style'
import { style } from '../../CustomComponent/CustomModal'

const AdminLayout = () => {
  const [openSubMenus, setOpenSubMenus] = useState(new Array(SidebarMenu.length).fill(false))
  const [open, setOpen] = useState(true)
  const [selectedSubcategory, setSelectedSubcategory] = useState<any>(undefined)

  const handleExpand = (index: number) => {
    setOpenSubMenus((prev) => {
      const updatedSubMenus = new Array(SidebarMenu.length).fill(false)
      updatedSubMenus[index] = !prev[index]
      return updatedSubMenus
    })
  }

  const handleNavLink = (index: any) => {
    setSelectedSubcategory(undefined)
    setSelectedSubcategory(0)
    handleExpand(index)
  }

  useEffect(() => {
    if (open) {
      filterModalStyle.left = '40vw'
      style.left = '58.2%'
    } else {
      filterModalStyle.left = '34vw'
      style.left = '52%'
    }
  }, [open])

  const handleToggleDrawer = () => {
    setOpen((prev) => !prev)
  }

  return (
    <>
      <Header />
      <div style={{ display: 'flex' }}>
        <button
          onClick={handleToggleDrawer}
          style={{
            height: '35px',
            width: '20px',
            minWidth: '5px',
            marginRight: '-20rem',
            marginLeft: open ? '15rem' : '4rem',
            marginTop: '5rem',
            border: '1px solid #B3B3B3',
            display: 'inline-block',
            background: '#D9D9D9',
            position: 'absolute',
            zIndex: 999,
          }}>
          <img
            src={open ? '/assets/images/chevron_left.svg' : '/assets/images/chevron_right.svg'}
            alt={open ? 'ChevronLeft' : 'ChevronRight'}
            style={{ width: '100%', height: '100%', marginLeft: '-1px' }}
          />
        </button>

        <div
          style={{
            width: open ? '15rem' : '4rem',
            height: '100vh',
            background: '#F2F2F2',
            borderRight: 'none',
            transition: 'width 0.3s ease-in-out',
            position: 'relative',
            overflowY: 'auto',
          }}>
          {SidebarMenu.map((item, index) => (
            <React.Fragment key={index}>
              {item.name && (
                <NavLink
                  to={item.link}
                  style={{
                    display: 'flex',
                    height: '30px',
                    background: '#D9D9D9',
                    flexDirection: 'row',
                    alignItems: 'center',
                    border: '1px solid #B3B3B3',
                    position: 'relative',
                  }}
                  onClick={() => {
                    handleNavLink(index)
                  }}>
                  <img
                    src={item.icon}
                    alt=""
                    width={17}
                    style={{
                      marginRight: open ? '15px' : '5px',
                      marginLeft: open ? '30px' : '20px',
                    }}
                  />
                  <span
                    style={{
                      fontSize: '12.5px',
                      fontWeight: 700,
                      letterSpacing: '0.2px',
                      textAlign: 'left',
                      color: '#000000',
                      display: open ? 'flex' : 'none',
                      flexGrow: 1,
                    }}>
                    {item.name}
                  </span>
                  {item.subcategories && open && (
                    <img
                      src={
                        openSubMenus[index] ? '/assets/images/minus.png' : '/assets/images/plus.png'
                      }
                      alt={openSubMenus[index] ? 'Minus' : 'Plus'}
                      style={{
                        width: '10px',
                        position: 'absolute',
                        right: '8px',
                        top: '50%',
                        transform: 'translateY(-50%)',
                      }}
                    />
                  )}
                </NavLink>
              )}

              {/* Submenu Items */}
              {item.subcategories && openSubMenus[index] && (
                <div>
                  {item.subcategories.map((subcategory, subIndex) => (
                    <NavLink
                      to={subcategory.link}
                      style={{ textDecoration: 'none' }}
                      key={subIndex}>
                      <div
                        style={{
                          display: 'flex',
                          justifyContent: 'flex-start',
                          alignItems: 'center',
                          padding: '5px 16px',
                          cursor: 'pointer',
                          background: '#F2F2F2',
                          border: '1px solid #B3B3B3',
                        }}
                        onClick={() => setSelectedSubcategory(subIndex)}>
                        <img
                          src={subcategory.icon}
                          width={17}
                          style={{
                            marginRight: '4px',
                            marginLeft: open ? '50px' : '3px',
                          }}
                        />
                        {open && (
                          <span
                            style={{
                              fontSize: '12.5px',
                              fontWeight: selectedSubcategory === subIndex ? 700 : 400,
                              lineHeight: '1.5',
                              letterSpacing: '0.2px',
                              textAlign: 'left',
                              marginLeft: '5px',
                              color: '#000000',
                            }}>
                            {subcategory.name}
                          </span>
                        )}
                      </div>
                    </NavLink>
                  ))}
                </div>
              )}

              {/* Add spacer between items */}
              {index !== SidebarMenu.length - 1 && <div style={{ height: '25px' }} />}
            </React.Fragment>
          ))}

          {/* Logout Button */}
          <div
            style={{
              position: 'absolute',
              bottom: '10px',
              right: '10px',
              width: open ? '15rem' : '4rem',
              background: '#F2F2F2',
              borderRight: 'none',
              transition: 'width 0.3s ease-in-out',
              marginRight: '-10px',
              marginBottom: '-8px',
            }}>
            <NavLink
              to={''}
              style={{
                display: 'flex',
                height: '30px',
                background: '#D9D9D9',
                flexDirection: 'row',
                alignItems: 'center',
                border: '1px solid #B3B3B3',
                position: 'relative',
              }}>
              <img
                src="/assets/images/square.png"
                alt="Logout"
                width={17}
                style={{
                  marginRight: open ? '15px' : '20px',
                  marginLeft: open ? '30px' : '8px',
                }}
              />
              <span
                style={{
                  fontSize: '12.5px',
                  fontWeight: 700,
                  letterSpacing: '0.2px',
                  textAlign: 'left',
                  color: '#000000',
                  display: open ? 'flex' : 'none',
                  flexGrow: 1,
                }}>
                {'Logout'}
              </span>
            </NavLink>
          </div>
        </div>

        <div
          style={{
            flexGrow: 1,
            width: '82%',
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'space-between',
          }}>
          <Outlet />
        </div>
      </div>
    </>
  )
}

export default AdminLayout
