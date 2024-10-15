import React, { useState } from 'react'
import { NavLink, Outlet } from 'react-router-dom'
import SidebarMenu from '../LayoutComponents/SidebarMenu'
import { useDispatch, useSelector } from 'react-redux'
import {
  selectUserRole,
  setCustomerId,
  setCustomerName,
  setOpen,
  setToken,
  setUserData,
} from '../../../Store/Slice/userSlice'
import { RootState } from '../../../Store/Store'
import { useLogoutMutation } from '../../../Services/Authentication/AuthApi'
import { ErrorResponse } from '../../../Type/ApiTypes'

const AdminLayout = () => {
  const dispatch = useDispatch()
  const open = useSelector((state: RootState) => state.user.isOpen)
  const role = useSelector(selectUserRole)
  const [getLogout] = useLogoutMutation()
  const menuItems = SidebarMenu()

  const initialOpenSubMenus =
    role === 4
      ? [true, ...new Array(menuItems.length - 1).fill(false)]
      : new Array(menuItems.length).fill(false)
  const initialSelectedCategory = role === 4 ? 3 : null
  const initialSelectedSubcategory = role === 4 ? 0 : null

  const initialOpenSubMenusRole =
    role === 3
      ? [true, ...new Array(menuItems.length - 1).fill(false)]
      : new Array(menuItems.length).fill(false)
  const initialSelectedCategoryRole = role === 3 ? 4 : null
  const initialSelectedSubcategoryRole = role === 3 ? 0 : null

  const [openSubMenus, setOpenSubMenus] = useState(
    role === 4 ? initialOpenSubMenus : initialOpenSubMenusRole,
  )
  const [selectedCategory, setSelectedCategory] = useState<any>(
    role === 4 ? initialSelectedCategory : initialSelectedCategoryRole,
  )
  const [selectedSubcategory, setSelectedSubcategory] = useState<any>(
    role === 4 ? initialSelectedSubcategory : initialSelectedSubcategoryRole,
  )

  const handleExpand = (index: number) => {
    setOpenSubMenus((prev) => {
      const updatedSubMenus = new Array(menuItems.length).fill(false)
      updatedSubMenus[index] = !prev[index]
      return updatedSubMenus
    })
  }

  const handleMainCategoryClick = (index: number) => {
    setSelectedCategory(selectedCategory === index ? null : index)
    setSelectedSubcategory(0)
    handleExpand(index)
  }

  const handleSubCategoryClick = (mainIndex: number, subIndex: number) => {
    setSelectedCategory(mainIndex)
    setSelectedSubcategory(subIndex)
  }

  const handleToggleDrawer = () => {
    dispatch(setOpen(!open))
  }

  const handleLogout = async () => {
    try {
      dispatch(setToken(''))
      dispatch(setCustomerId(''))
      dispatch(setCustomerName(''))
      dispatch(
        setUserData({
          id: '',
          firstname: '',
          lastname: '',
          email: '',
          password: '',
          creationDate: '',
          lastModifiedDate: '',
          phoneNumber: '',
          role: {
            id: 0,
            name: '',
          },
        }),
      )
      const response = await getLogout({}).unwrap()
    } catch (error) {
      const { message } = error as ErrorResponse
      console.error('Error occurred while fetching customer data:', message)
    }
  }

  return (
    <div style={{ display: 'flex', minHeight: '100vh' }}>
      <div style={{ display: 'flex', maxHeight: '100vh', overflowY: 'auto' }}>
        <button
          onClick={handleToggleDrawer}
          style={{
            height: '30px',
            width: '30px',
            minWidth: '5px',
            marginLeft: open ? '15rem' : '4.8rem',
            marginTop: '3rem',
            display: 'inline-block',
            background: open ? '#FFFFFF' : '#00426F',
            position: 'absolute',
            zIndex: 999,
            borderRadius: '5px',
          }}>
          <img
            src={open ? '/assets/images/left.svg' : '/assets/images/right.svg'}
            alt={open ? 'ChevronLeft' : 'ChevronRight'}
            style={{ width: '25%', height: '100%', marginLeft: '10px' }}
          />
        </button>
        <div
          style={{
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'space-between',
            width: open ? '19rem' : '5rem',
            minWidth: open ? '18rem' : '5rem',
            maxHeight: '100vh',
            background: '#00426F',
            borderRight: 'none',
            transition: 'width 0.3s ease-in-out',
            position: 'relative',
            overflowY: 'auto',
            paddingBottom: '20px',
          }}>
          {/* Logo */}
          <div>
            <img
              src={open ? '/assets/images/MoorFindLogo.svg' : '/assets/images/moorfind.svg'}
              alt="Moorfind Logo"
              style={{
                width: open ? '45%' : '2rem',
                height: open ? 'auto' : '3rem',
                display: 'block',
                transition: 'width 0.3s ease-in-out',
                marginRight: open ? '15px' : '5px',
                marginLeft: open ? '30px' : '20px',
                marginTop: '50px',
                marginBottom: '50px',
              }}
            />
            {menuItems?.map((item, index) => (
              <React.Fragment key={index}>
                {item.name && (
                  <NavLink
                    to={item.link}
                    style={{
                      display: 'flex',
                      height: '40px',
                      width: open ? '16rem' : '3rem',
                      minWidth: open ? '16rem' : '3rem',
                      marginLeft: open ? '20px' : '10px',
                      marginRight: open ? '20px' : '10px',
                      background:
                        selectedCategory === 0 && item.name === 'DASHBOARD' ? '#0098FF' : '#00426F',
                      borderRadius: '4px',
                      flexDirection: 'row',
                      alignItems: 'center',
                      position: 'relative',
                    }}
                    onClick={() => {
                      handleMainCategoryClick(index)
                    }}>
                    <img
                      src={item.icon}
                      alt=""
                      width={22}
                      style={{
                        marginRight: open ? '15px' : '5px',
                        marginLeft: open ? '30px' : '14px',
                      }}
                    />
                    <span
                      style={{
                        fontSize: '15px',
                        fontWeight: 700,
                        letterSpacing: '0.2px',
                        textAlign: 'left',
                        color: '#FFFFFF',
                        display: open ? 'flex' : 'none',
                        flexGrow: 1,
                      }}>
                      {item.name}
                    </span>
                    {item.subcategories && open && (
                      <img
                        src={
                          openSubMenus[index]
                            ? '/assets/images/minus.svg'
                            : '/assets/images/plus.svg'
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
                  <div style={{ marginTop: '10px' }}>
                    {item.subcategories?.map((subcategory, subIndex) => (
                      <NavLink
                        to={subcategory.link}
                        style={{
                          textDecoration: 'none',
                        }}
                        key={subIndex}
                        onClick={() => handleSubCategoryClick(index, subIndex)}>
                        <div
                          style={{
                            display: 'flex',
                            height: '40px',
                            width: open ? '16rem' : '3rem',
                            minWidth: open ? '16rem' : '3rem',
                            marginLeft: open ? '10px' : '10px',
                            marginRight: open ? '10px' : '10px',
                            marginTop: '10px',
                            borderRadius: '4px',
                            flexDirection: 'row',
                            padding: '0px 16px',
                            cursor: 'pointer',
                            background:
                              selectedCategory === index && selectedSubcategory === subIndex
                                ? '#0098FF'
                                : '#00426F',
                          }}>
                          <img
                            src={subcategory.icon}
                            width={20}
                            style={{
                              marginRight: '10px',
                              marginLeft: open ? '30px' : '2px',
                            }}
                          />
                          {open && (
                            <span
                              style={{
                                fontSize: '14px',
                                fontWeight: 400,
                                lineHeight: '1.5',
                                letterSpacing: '0.2px',
                                textAlign: 'left',
                                marginLeft: '5px',
                                color: '#FFFFFF',
                                marginTop: '10px',
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
                {index !== SidebarMenu.length - 1 && <div style={{ height: '40px' }} />}
              </React.Fragment>
            ))}
          </div>

          {/* Logout Button */}
          <div
            style={{
              background: '#F2F2F2',
              transition: 'width 0.3s ease-in-out',
              marginLeft: open ? '25px' : '6px',
            }}>
            <NavLink
              to={''}
              style={{
                display: 'flex',
                height: '30px',
                background: '#00426F',
                flexDirection: 'row',
                alignItems: 'center',
                position: 'relative',
              }}
              onClick={handleLogout}>
              <img
                src="/assets/images/logout.svg"
                alt="Logout"
                width={20}
                style={{
                  marginRight: open ? '15px' : '20px',
                  marginLeft: open ? '30px' : '20px',
                }}
              />
              <span
                style={{
                  fontSize: '15px',
                  fontWeight: 700,
                  letterSpacing: '0.2px',
                  textAlign: 'left',
                  color: '#FFFFFF',
                  display: open ? 'flex' : 'none',
                }}>
                {'LOGOUT'}
              </span>
            </NavLink>
          </div>
        </div>
      </div>
      <div
        style={{
          flexGrow: 1,
          width: 'calc(100vw - 16rem)',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'space-between',
          height: '100%',
          overflowY: 'auto',
          maxHeight: '100vh',
        }}>
        <Outlet />
      </div>
    </div>
  )
}

export default AdminLayout
