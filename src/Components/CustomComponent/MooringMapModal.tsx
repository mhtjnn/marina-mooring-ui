import React, { useState, useContext, useCallback, useRef } from 'react'
import { TimeLineProps } from '../../Type/Components/MapTypes'
import CustomModal from './CustomModal'
import AddMoorings from '../Moormanage/Moorings/AddMoorings'
import { AppContext } from '../../Services/ContextApi/AppContext'
import { useGetMooringByIdMutation } from '../../Services/MoorManage/MoormanageApi'
import { ErrorResponse, MooringResponse } from '../../Type/ApiTypes'
import { Toast } from 'primereact/toast'
import { formatCoordinates } from '../Helper/Helper'

const MooringMapModal: React.FC<TimeLineProps> = ({ gpsValue, mooringId, selectedMooring }) => {
  const [customModalVisible, setCustomModalVisible] = useState(false)
  const { isMapModalOpen, setMapModalOpen } = useContext(AppContext)
  const [mooringDetails, setmooringDetails] = useState<any>()
  const [getMooringDetails] = useGetMooringByIdMutation()
  const toastRef = useRef<Toast>(null)
  const getMooringDataById = useCallback(async (id: any) => {
    try {
      const response = await getMooringDetails({ id: id }).unwrap()
      const { status, content, message } = response as MooringResponse
      if (status === 200) {
        setmooringDetails(content)
      } else {
        toastRef?.current?.show({
          severity: 'error',
          summary: 'Error',
          detail: message,
          life: 3000,
        })
      }
    } catch (error) {
      const { message: msg } = error as ErrorResponse
      console.error('Error occurred while fetching customer data:', msg)
    }
  }, [])

  const viewEdit = () => {
    getMooringDataById(selectedMooring.id)
    setMapModalOpen((prevState: any) => ({ ...prevState, editMode: true }))
    setCustomModalVisible(true)
  }

  const handleModalClose = () => {
    setMapModalOpen((prevState: any) => ({ ...prevState, editMode: false }))
    setCustomModalVisible(false)
  }
  return (
    <>
      <Toast ref={toastRef} />
      <div className="rounded-sm flex gap-20">
        <div>
          <div>
            <p className="text-sm m-0 font-bold text-white">{mooringId != null && mooringId}</p>
          </div>
          <div>
            <p className="text-xs text-white mt-2">
              GPS Coordinates:
              <br />
              {formatCoordinates(gpsValue)}
            </p>
          </div>
        </div>
        <div>
          <p
            className="text-black cursor-pointer mt-[5rem] p-1 border rounded-sm bg-[#B1E0FF]"
            onClick={viewEdit}>
            View/edit
          </p>
        </div>

        {customModalVisible && (
          <CustomModal
            button={true}
            children={
              <AddMoorings
                moorings={mooringDetails}
                mooringRowData={mooringDetails}
                editMode={isMapModalOpen.editMode}
                isEditMooring={true}
                closeModal={handleModalClose}
                getCustomer={() => {}}
              />
            }
            headerText={<h1 className="text-xxl font-bold text-black">Mooring Information</h1>}
            visible={customModalVisible}
            onHide={handleModalClose}
            dialogStyle={{
              width: '800px',
              minWidth: '800px',
              height: '630px',
              minHeight: '630px',
              borderRadius: '1rem',
              maxHeight: '95% !important',
            }}
          />
        )}
      </div>
    </>
  )
}

export default MooringMapModal
