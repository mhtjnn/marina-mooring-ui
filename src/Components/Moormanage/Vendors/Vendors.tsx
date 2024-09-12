import { useEffect, useMemo, useState } from 'react'
import CustomModal from '../../CustomComponent/CustomModal'
import AddVendor from './AddVendor'
import { InputText } from 'primereact/inputtext'
import {
  useDeleteVendorMutation,
  useGetVendorsMutation,
} from '../../../Services/MoorManage/MoormanageApi'
import { VendorPayload, VendorResponse } from '../../../Type/ApiTypes'
import DataTableSearchFieldComponent from '../../CommonComponent/Table/DataTableComponent'
import { boatData } from '../../Utils/CustomData'
import { ActionButtonColumnProps } from '../../../Type/Components/TableTypes'

const Vendors = () => {
  const [modalVisible, setModalVisible] = useState(false)
  const [vendorData, setVendorData] = useState<VendorPayload[]>([])
  const [selectedCustomer, setSelectedCustomer] = useState<any>(undefined)
  const [editMode, setEditMode] = useState(false)

  const [getVendors] = useGetVendorsMutation()
  const [deleteVendor] = useDeleteVendorMutation()

  const handleButtonClick = () => {
    setModalVisible(true)
  }

  const getVendorData = async () => {
    try {
      const response = await getVendors({}).unwrap()
      const { status, content } = response as VendorResponse
      if (status === 200 && Array.isArray(content)) {
        setVendorData(content)
      }
    } catch (error) {
      console.error('Error fetching vendor data:', error)
    }
  }

  const handleEdit = (rowData: any) => {
    setSelectedCustomer(rowData)
    setEditMode(true)
  }

  const handleDelete = async (rowData: any) => {
    try {
      const response = await deleteVendor({ id: rowData?.id })
      getVendorData()
    } catch (error) {
      console.error('Error deleting customer:', error)
    }
  }

  const handleModalClose = () => {
    setModalVisible(false)
    setEditMode(false)
  }

  useEffect(() => {
    getVendorData()
  }, [])

  const tableColumns = useMemo(
    () => [
      {
        id: 'id',
        label: 'ID',
        style: { width: '6vw', backgroundColor: '#F2F2F2' },
      },
      {
        id: 'companyName',
        label: 'Company Name',
        style: { width: '12vw', backgroundColor: '#F2F2F2' },
      },
      {
        id: 'phoneNumber',
        label: 'Phone Number',
        style: { width: '10vw', backgroundColor: '#F2F2F2' },
      },
      {
        id: 'emailAddress',
        label: 'Email Address',
        style: { width: '12vw', backgroundColor: '#F2F2F2' },
      },
      {
        id: 'inventoryItems',
        label: 'Inventory Items',
        style: { width: '10vw', backgroundColor: '#F2F2F2' },
      },
    ],
    [],
  )

  const ActionButtonColumn: ActionButtonColumnProps = useMemo(
    () => ({
      header: 'Action',
      buttons: [
        {
          color: 'black',
          label: 'View Inventory',
        },
        {
          color: 'green',
          label: 'Edit',
          onClick: handleEdit,
        },
        {
          color: 'red',
          label: 'Delete',
        },
      ],
      headerStyle: { backgroundColor: '#F2F2F2' },
    }),
    [],
  )
  return (
    <>
      <div className="flex justify-between items-center ml-2">
        <div>
          <h1 className="mt-14 ml-[7.50rem] opacity-30 text-2xl font-normal">Moormanage/Vendor</h1>
        </div>

        <div className="flex gap-4 items-center  mr-[8rem] mt-14">
          <div>
            <div className="p-input-icon-left">
              <i className="pi pi-search text-[#D2D2D2]" />
              <InputText placeholder="Search" className="h-[5vh] cursor-pointer font-bold" />
            </div>
          </div>

          <CustomModal
            header={<h1 className="text-lg font-bold text-black mt-4">Add Compony</h1>}
            onClick={handleButtonClick}
            visible={modalVisible || editMode}
            onHide={handleModalClose}
            style={{ borderRadius: '2rem' }}>
            <AddVendor
              vendors={selectedCustomer}
              editMode={editMode}
              closeModal={handleModalClose}
              getVendor={getVendorData}
            />
          </CustomModal>
        </div>
      </div>
      {/* </div> */}
      <div className="bg-[F2F2F2] rounded-md border-[1px] border-gray-300 w-[67vw] p-1 ml-32 mb-80">
        <DataTableSearchFieldComponent
          tableStyle={{
            fontSize: '12px',
            color: '#000000',
            fontWeight: 600,
          }}
          data={boatData}
          columns={tableColumns}
          header={undefined}
          actionButtons={ActionButtonColumn}
          style={{ backgroundColor: '#F2F2F2' }}
        />
      </div>
    </>
  )
}

export default Vendors
