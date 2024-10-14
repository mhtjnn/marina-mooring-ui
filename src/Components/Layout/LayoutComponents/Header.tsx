import React, { useCallback, useEffect, useState } from 'react'
import { Button } from 'primereact/button'
import { Avatar } from 'primereact/avatar'
import { Dropdown } from 'primereact/dropdown'
import { Dialog } from 'primereact/dialog' // Import Dialog component
import { HeaderProps } from '../../../Type/ComponentBasedType'
import { useDispatch, useSelector } from 'react-redux'
import { ErrorResponse, GetUserResponse } from '../../../Type/ApiTypes'
import { setCustomerId, setCustomerName, selectCustomerName } from '../../../Store/Slice/userSlice'
import { useGetCustomersOwnersMutation } from '../../../Services/MetaDataApi'
import HeaderProfile from './HeaderProfile'

const Header: React.FC<HeaderProps> = ({ header, customer }) => {
  const userData = useSelector((state: any) => state.user?.userData)
  const role = userData?.role?.id
  const dispatch = useDispatch()
  const selectedCustomerName = useSelector(selectCustomerName)
  const [getCustomerOwnerData, setgetCustomerOwnerData] = useState<any[]>([])
  const [getUser] = useGetCustomersOwnersMutation()
  const imageData = userData?.imageDto?.imageData
  const UserName =
    userData && userData?.firstName && userData?.lastName
      ? userData.firstName + ' ' + userData.lastName
      : ''
  const imageUrl = imageData ? `data:image/jpeg;base64,${imageData}` : '/assets/images/user12.png'

  const handleCustomerIdSelection = (customerId: any) => {
    const firstName = customerId?.firstName || '-'
    const lastName = customerId?.lastName || '-'
    const firstLastName = `${firstName} ${lastName}`

    dispatch(setCustomerName(firstLastName))
    dispatch(setCustomerId(customerId?.id))
  }

  const getUserHandler = useCallback(async () => {
    try {
      const response = await getUser({}).unwrap()
      const { status, message, content } = response as GetUserResponse
      if (status === 200 && Array.isArray(content)) {
        if (content.length > 0) {
          const firstLastName = content.map((item) => ({
            label: `${item.firstName || '-'} ${item.lastName || '-'}`,
            value: item,
          }))

          setgetCustomerOwnerData(firstLastName)
          if (!selectedCustomerName) {
            dispatch(setCustomerName(firstLastName[0]?.label))
            dispatch(setCustomerId(firstLastName[0]?.value?.id))
          }
        } else {
          setgetCustomerOwnerData([])
        }
      }
    } catch (error) {
      const { message } = error as ErrorResponse
      console.error('Error occurred while fetching customer data:', message)
    }
  }, [getUser, role === 1, customer])

  const handleQuickBookApi = () => {
    const token = localStorage.getItem('token')
    const quickBooksLoginUrl = `${process.env.REACT_APP_BASE_URL}api/v1/QBO/connectToQuickbooks?authToken=${token}`
    window.open(quickBooksLoginUrl, 'QuickBooksWindow', 'width=800,height=600,scrollbars=yes')
  }

  useEffect(() => {
    if (role === 1) {
      getUserHandler()
    }
  }, [role === 1, customer])

  return (
    <div
      style={{
        background: '#FFFFFF',
        padding: '15px 20px',
        display: 'flex',
        flexWrap: 'wrap',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginTop: '1rem',
        marginLeft: '3rem',
        marginRight: '2rem',
        borderRadius: '0.5rem',
        fontSize: '18px',
        fontWeight: 500,
        textAlign: 'left',
        color: '#AEAEAE',
      }}>
      {header}
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          gap: '8px',
          minWidth: '300px',
          justifyContent: 'end',
        }}>
        {(role === 1 || role === 2 || role === 3) && (
          <>
            <button
              style={{
                backgroundColor: 'transparent',
                border: 'none',
                cursor: 'pointer',
                marginRight: '10px',
              }}
              onClick={handleQuickBookApi}>
              <img
                src="/assets/images/quickBook.png"
                alt="Button Icon"
                style={{ width: '150px', height: '35px' }}
              />
            </button>
          </>
        )}
        {role === 1 && (
          <>
            <Dropdown
              value={selectedCustomerName || '-'}
              onChange={(e) => {
                handleCustomerIdSelection(e.value)
              }}
              optionLabel="label"
              optionValue="value"
              placeholder="Select"
              options={getCustomerOwnerData}
              editable
              style={{
                width: '160px',
                height: '32px',
                minHeight: '32px',
                border: '1px solid gray',
                borderRadius: '0.5rem',
                color: 'black',
                marginRight: '40px',
              }}
            />
          </>
        )}
        {userData && (
          <>
            <Avatar image={imageUrl} shape="circle" />
            <span style={{ color: '#000000', fontSize: '16px', fontWeight: 400 }}>{UserName}</span>
          </>
        )}
        <HeaderProfile customer={userData} />
      </div>
    </div>
  )
}

export default Header
