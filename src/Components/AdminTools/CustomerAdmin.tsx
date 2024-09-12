import { useMemo, useState } from 'react'
import CustomModal from '../CustomComponent/CustomModal'
import { IoSearch } from 'react-icons/io5'
import { InputText } from 'primereact/inputtext'
import { customerAdmin, customerAdminUser } from '../Utils/CustomData'
import './AddCustomer.module.css'
import DataTableComponent from '../CommonComponent/Table/DataTableComponent'
import { properties } from '../Utils/MeassageProperties'
import { PermissionData } from '../../Type/ComponentBasedType'
import { Dropdown } from 'primereact/dropdown'
import { FaFilter } from 'react-icons/fa6'
import AddNewCustomer from './AddNewCustomer'
import { ActionButtonColumnProps } from '../../Type/Components/TableTypes'
import { useGetCustomerMutation } from '../../Services/MoorManage/MoormanageApi'
import { CustomerPayload, CustomerResponse } from '../../Type/ApiTypes'

const Permission = () => {
  const [modalVisible, setModalVisible] = useState(false)
  const [selectedCustomer, setSelectedCustomer] = useState<any>(undefined)
  const [editMode, setEditMode] = useState(false)
  const [selectRole, setSelectRole] = useState()
  const [getCustomer] = useGetCustomerMutation()
  const [getAdminData, setGetAdminData] = useState<CustomerPayload[]>([])

  const handleButtonClick = () => {
    setModalVisible(true)
  }

  const handleModalClose = () => {
    setModalVisible(false)
  }

  const CustomersHeader = () => {
    return (
      <div className="flex items-center flex-col">
        <div className="p-input-icon-left ">
          <IoSearch style={{ marginLeft: '1rem', color: '#A4A4A4' }} />
          <InputText
            placeholder="Search by name, ID,phone no..."
            className="h-[5vh] w-[55vh] cursor-pointer text-[0.65rem]
                border-1 border-[1px]
               border-[#9F9F9F] rounded-lg pl-10"
            style={{ color: '#A4A4A4' }}
          />
        </div>
        <span
          className="border-[1px]
               border-[#9F9F9F]  w-[26vw] mt-3 "></span>
      </div>
    )
  }

  const TechniciansHeader = () => {
    return (
      <div className="flex items-center flex-col">
        <div className="p-input-icon-left ">
          <IoSearch style={{ marginLeft: '1rem', color: '#A4A4A4' }} />
          <InputText
            placeholder="Search by name, ID,Email,Role,phone no..."
            className="h-[5vh] w-[64vh] cursor-pointer text-[0.65rem]
              text-[#A4A4A4]  border-1 border-[1px]
               border-[#9F9F9F] rounded-md pl-10"
            style={{ color: 'red !important' }}
          />
        </div>
        <span
          className="border-[1px]
               border-[#9F9F9F]  w-[32vw] mt-3 "></span>
      </div>
    )
  }

  const ActionButtonColumn: ActionButtonColumnProps = {
    header: 'Action',
    buttons: [
      {
        color: 'black',
        label: 'Edit',
        underline: true,
      },
    ],
    headerStyle: { backgroundColor: '#F2F2F2', color: 'black' },
  }

  const tableColumns = useMemo(
    () => [
      {
        id: 'id',
        label: 'ID:',
        style: {
          width: '4vw',
          borderBottom: '1px solid #C0C0C0',
          backgroundColor: '#F2F2F2',
          color: 'black',
        },
      },
      {
        id: 'name',
        label: 'Name:',
        style: {
          width: '6vw',
          borderBottom: '1px solid #C0C0C0',
          backgroundColor: '#F2F2F2',
          color: 'black',
        },
      },

      {
        id: 'phone',
        label: 'Phone:',
        style: {
          width: '6vw',
          borderBottom: '1px solid #C0C0C0',
          backgroundColor: '#F2F2F2',
          color: 'black',
        },
      },
    ],
    [],
  )

  const tableColumnsTechnicians = useMemo(
    () => [
      {
        id: 'id',
        label: 'ID:',
        style: { width: '4vw', backgroundColor: '#F2F2F2', color: 'black' },
      },
      {
        id: 'name',
        label: 'Name:',
        style: { width: '6vw', backgroundColor: '#F2F2F2', color: 'black' },
      },

      {
        id: 'email',
        label: 'Email:',
        style: { width: '6vw', backgroundColor: '#F2F2F2', color: 'black' },
      },

      {
        id: 'phone',
        label: 'Phone:',
        style: { width: '6vw', backgroundColor: '#F2F2F2', color: 'black' },
      },

      {
        id: 'role',
        label: 'Role:',
        style: { width: '6vw', backgroundColor: '#F2F2F2', color: 'black' },
      },
    ],
    [],
  )

  const getCustomerData = async () => {
    try {
      const response = await getCustomer({}).unwrap()
      const { status, content } = response as CustomerResponse
      if (status === 200 && Array.isArray(content)) {
        setGetAdminData(content)
      }
    } catch (error) {
      console.error('Error occurred while fetching customer data:', error)
    }
  }

  return (
    <>
      <div className="flex justify-between ml-12">
        <div>
          <h1 className="mt-14 ml-8 opacity-30 text-2xl font-normal">MOORMANAGE/permission</h1>
        </div>
        <div className="flex mr-24">
          <div className="mt-14 mr-5 relative">
            <FaFilter className='absolute z-10 top-[0.8rem] left-2 text-gray-500' />
            <Dropdown
              value={selectRole}
              onChange={(e) => setSelectRole(e.value)}
              // options={cities}
              optionLabel="name"
              placeholder="Select Role"
              className="h-[7vh] w-[12vw] border-[1px] border-gray-400 !pl-[1.3rem] !font-sm"
            />
          </div>

          <div className="mt-14">
            <CustomModal
              label={'ADD NEW'}
              style={{
                width: '9vw',
                height: '7vh',
                backgroundColor: '#0098FF',
                cursor: 'pointer',
                fontSize: '14px',
                fontWeight: 'bold',
                color: 'white',
              }}
              onClick={handleButtonClick}
              visible={modalVisible}
              onHide={handleModalClose}
              header={<h1 className="text-xl font-bold text-black ml-4">New User</h1>}>
              <AddNewCustomer customerData={selectedCustomer} editMode={editMode} getCustomer={getCustomerData} closeModal={handleModalClose} />
            </CustomModal>
          </div>
        </div>
      </div>
      <div className="flex gap-10 ml-8">
        <div className="bg-[F2F2F2]  rounded-md border-[1px]  border-gray-300 w-[28vw] h-[65vh] mb-10">
          <div className="text-sm font-extrabold rounded-sm w-full  bg-[#D9D9D9]">
            <h1 className="p-4">{properties.Customersadmins}</h1>
          </div>
          <div data-testid="customer-admin-data">
            <DataTableComponent
              data={customerAdmin}
              tableStyle={{
                fontSize: '12px',
                color: '#000000',
                fontWeight: 600,
                backgroundColor: '#D9D9D9',
              }}
              scrollable={false}
              columns={tableColumns}
              header={CustomersHeader}

            />

          </div>
        </div>
        <div className="bg-[F2F2F2]  rounded-md border-[1px]  border-gray-300 w-[33vw] h-[65vh]">
          <div className="text-sm font-extrabold rounded-sm w-full  bg-[#D9D9D9]">
            <h1 className="p-4">{properties.CustomerAdminUsers}</h1>
          </div>

          <div data-testid="customer-admin-users-table">

            <DataTableComponent
              tableStyle={{
                fontSize: '12px',
                color: '#000000',
                fontWeight: 600,
              }}
              data={customerAdminUser}
              columns={tableColumnsTechnicians}
              header={TechniciansHeader}
              actionButtons={ActionButtonColumn}

            />

          </div>
        </div>
      </div>
    </>
  )
}

export default Permission
