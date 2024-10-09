import React, { useContext, useEffect, useRef, useState } from 'react'
import {
  useLogoutMutation,
  useUploadProfileImageMutation,
} from '../../../Services/Authentication/AuthApi'
import { useDispatch } from 'react-redux'
import { useNavigate } from 'react-router-dom'
import {
  selectUserRole,
  setCustomerId,
  setCustomerName,
  setOpen,
  setToken,
  setUserData,
} from '../../../Store/Slice/userSlice'
import { ErrorResponse } from '../../../Type/ApiTypes'
import ResetPassword from '../../AdminTools/ResetPassword'
import { HeaderProps } from '../../../Type/ComponentBasedType'
import { Dialog } from 'primereact/dialog'
import HeaderUploadImage from './HeaderUploadImage'
import { AppContext } from '../../../Services/ContextApi/AppContext'

const HeaderProfile: React.FC<HeaderProps> = ({ customer }) => {
  const [getLogout] = useLogoutMutation()

  const [tooltipVisible, setTooltipVisible] = useState(false)
  const [expanded, setExpanded] = useState(false)
  const dispatch = useDispatch()
  const navigate = useNavigate()
  const {
    IsdialogVisible,
    setDialogVisible,
    isUploadImageDialogVisible,
    setUploadImageDialogVisible,
  } = useContext(AppContext)
  const tooltipRef = useRef<HTMLDivElement>(null)
  const handleMenu = () => {
    setExpanded(!expanded)
    setTooltipVisible(!tooltipVisible)
  }

  const handleItemClick = (value: string) => {
    switch (value) {
      case 'Logout':
        handleLogout()
        navigate('/login')
        break
      case 'Reset Password':
        setDialogVisible(true)
        break
      case 'Upload Photo':
        setUploadImageDialogVisible(true)
        break
      default:
        console.warn(`Unhandled item click: ${value}`)
    }
  }

  const tooltipItemStyle = {
    padding: '8px 12px',
    cursor: 'pointer',
    borderRadius: '10px',
  }

  const handleModalClose = () => {
    setDialogVisible(false)
    setUploadImageDialogVisible(false)
  }

  const tooltipItemHoverStyle = {
    backgroundColor: '#00426F',
    color: 'white',
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
      sessionStorage.removeItem('token')
      sessionStorage.removeItem('refreshToken')
      sessionStorage.removeItem('role')
      const response = await getLogout({}).unwrap()
    } catch (error) {
      const { message } = error as ErrorResponse
      console.error('Error occurred while fetching customer data:', message)
    }
  }

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (tooltipRef.current && !tooltipRef.current.contains(event.target as Node)) {
        setTooltipVisible(false)
      }
    }
    document.addEventListener('mousedown', handleClickOutside)
    return () => {
      document.removeEventListener('mousedown', handleClickOutside)
    }
  }, [])

  return (
    <>
      <div style={{ position: 'relative', display: 'inline-block' }}>
        <button
          onClick={handleMenu}
          className="p-button-rounded p-button-outlined"
          style={{ background: 'transparent', border: 'none', cursor: 'pointer' }}>
          <img
            src={expanded ? '/assets/images/angleDown.svg' : '/assets/images/angleDown.svg'}
            alt="angleDown"
            style={{ width: '12px', height: '10px' }}
          />
        </button>
        {tooltipVisible && (
          <div
            ref={tooltipRef}
            style={{
              position: 'absolute',
              width: '200px',
              height: '150px',
              top: '120%',
              right: '-900%',
              transform: 'translateX(-50%)',
              backgroundColor: 'white',
              border: '1px solid #ccc',
              borderRadius: '10px',
              color: 'black',
              padding: '8px',
              boxShadow: '0 2px 10px rgba(0, 0, 0, 0.1)',
              zIndex: 2,
            }}>
            <ul style={{ listStyleType: 'none', margin: 0, padding: 0 }}>
              {['Upload Photo', 'Reset Password', 'Logout']?.map((item) => (
                <li
                  key={item}
                  style={tooltipItemStyle}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.backgroundColor = tooltipItemHoverStyle.backgroundColor
                    e.currentTarget.style.color = tooltipItemHoverStyle.color
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.backgroundColor = 'transparent'
                    e.currentTarget.style.color = 'black'
                  }}
                  onClick={() => handleItemClick(item)}>
                  {item}
                </li>
              ))}
            </ul>
          </div>
        )}
      </div>

      <Dialog
        position="center"
        style={{
          width: '650px',
          minWidth: '650px',
          height: '500px',
          minHeight: '500px',
          borderRadius: '1rem',
          fontWeight: '400',
          cursor: 'alias',
        }}
        draggable={false}
        headerStyle={{ cursor: 'alias' }}
        header="Reset Password"
        onHide={handleModalClose}
        visible={IsdialogVisible}>
        {IsdialogVisible && (
          <ResetPassword
            isResetModalOpen={() => {
              setDialogVisible(false)
            }}
            customerId={customer}
            isLoggedInUser={true}
          />
        )}
      </Dialog>

      <Dialog
        position="center"
        style={{
          width: '650px',
          minWidth: '650px',
          height: '500px',
          minHeight: '500px',
          borderRadius: '1rem',
          fontWeight: '400',
          cursor: 'alias',
        }}
        draggable={false}
        headerStyle={{ cursor: 'alias' }}
        header=""
        onHide={handleModalClose}
        visible={isUploadImageDialogVisible}>
        {isUploadImageDialogVisible && (
          <HeaderUploadImage handleModalClose={handleModalClose} customerId={customer} />
        )}
      </Dialog>
    </>
  )
}

export default HeaderProfile
