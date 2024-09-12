
import { DataTable } from 'primereact/datatable'
import CustomModal from '../../CustomComponent/CustomModal'
import AddMoorings from './AddMoorings'
import React, { useState, useEffect, useMemo } from 'react'
import { Column } from 'primereact/column'
import { useGetMooringsMutation } from '../../../Services/MoorManage/MoormanageApi'
import { InputSwitch, InputSwitchChangeEvent } from 'primereact/inputswitch'
import { MooringPayload, MooringResponse } from '../../../Type/ApiTypes'
import { FaCircle, FaEdit } from 'react-icons/fa'
import { Dialog } from 'primereact/dialog'
import { CustomerData, CustomerProps } from '../../../Type/CommonType'
import DataTableComponent from '../../CommonComponent/Table/DataTableComponent'
import InputTextWithHeader from '../../CommonComponent/Table/InputTextWithHeader'
import { properties } from '../../Utils/MeassageProperties'
const Moorings = () => {
  const [modalVisible, setModalVisible] = useState(false)
  const [mooringData, setMooringData] = useState<MooringPayload[]>([])
  const [selectedCustomer, setSelectedCustomer] = useState<any>(undefined)
  const [editMode, setEditMode] = useState(false)
  const [searchQuery, setSearchQuery] = useState<string>('')
  const [filteredMooringData, setFilteredMooringData] = useState<MooringPayload[]>([])
  const [edit, setEdit] = useState<CustomerProps>({
    id: '#43453',
    name: 'John Smith',
    phone: '+1 234 543 4324',
    email: 'john@gmail.com',
    address: 'Suite 333 17529 Miller Spur South Ervinstad',
  })
  const [isChecked, setIsChecked] = useState(false)
  const [isDialogVisible, setIsDialogVisible] = useState(false)
  const [selectedMooring, setSelectedMooring] = useState<MooringPayload>()

  const handleInputChange = (e: InputSwitchChangeEvent) => {
    console.log(e.value)
    setIsChecked(e.value)
  }

  const [getMoorings] = useGetMooringsMutation()

  const handleButtonClick = () => {
    setModalVisible(true)
  }

  const handleModalClose = () => {
    setModalVisible(false)
    setEditMode(false)
  }

  const handleSearchChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const query = event.target.value
    setSearchQuery(query)
    const filteredData = mooringData.filter((data) => {
      const id = typeof data.id === 'number' ? data.id.toString() : ''
      const customerName =
        typeof data.customerName === 'string' ? data.customerName.toLowerCase() : ''
      const gpsCoordinates =
        typeof data.gpsCoordinates === 'string' ? data.gpsCoordinates.toLowerCase() : ''
      return (
        id.includes(query.toLowerCase()) ||
        customerName.includes(query.toLowerCase()) ||
        gpsCoordinates.includes(query.toLowerCase())
      )
    })
    setFilteredMooringData(filteredData)
  }
  const boatData: CustomerData[] = [
    {
      id: '#001',
      email: 'M001',
      name: 'John Doe',
      phone: 9789756452,
    },
    {
      id: '#001',
      email: 'M001',
      name: 'John Doe',
      phone: 9789756452,
    },
    {
      id: '#001',
      email: 'M001',
      name: 'John Doe',
      phone: 9789756452,
    },
    {
      id: '#001',
      email: 'M001',
      name: 'John Doe',
      phone: 9789756452,
    },
  ]
  const tableColumns = useMemo(
    () => [
      {
        id: 'id',
        label: 'ID:',
        style: { width: '4vw', borderBottom: '1px solid #C0C0C0', backgroundColor: '#F2F2F2' },
      },
      {
        id: 'mooringName',
        label: 'Mooring Name:',
        style: { width: '6vw', borderBottom: '1px solid #C0C0C0', backgroundColor: '#F2F2F2' },
      },
      {
        id: 'gpsCoordinates',
        label: 'GPS Coordinates:',
        style: { width: '6vw', borderBottom: '1px solid #C0C0C0', backgroundColor: '#F2F2F2' },
      },
    ],
    [],
  )

  const getMooringsData = async () => {
    try {
      const response = await getMoorings({}).unwrap();
      const { status, content } = response as MooringResponse;
      if (status === 200 && Array.isArray(content)) {
        setMooringData(content);
        setFilteredMooringData(content);
      }
    } catch (error) {
      console.error("Error fetching moorings data:", error);
    }
  };

  const handleEdit = (rowData: any) => {
    setSelectedCustomer(rowData)
    setEditMode(true)
  }

  useEffect(() => {
    getMooringsData()
  }, [])


  return (
    <>
      <div className="flex items-center justify-between ml-12 overflow-hidden">
        <div>
          <h1 className="mt-14 ml-8 opacity-30 text-2xl font-normal">{properties.MoormanageMoorings}</h1>
        </div>
        <div className="flex gap-4 items-center mr-20  mt-14">
          <CustomModal
            label={'ADD NEW'}
            style={{
              width: "8vw",
              height: "7vh",
              backgroundColor: "black",
              cursor: "pointer",
              fontSize: "15px",
              fontWeight: "bold",
              color: "white",
            }}
            onClick={handleButtonClick}
            visible={modalVisible || editMode}
            onHide={handleModalClose}
            header={<h1 className="text-lg font-bold text-black ml-4">Add Mooring</h1>}
          >
            <AddMoorings moorings={selectedCustomer} editMode={editMode} />
          </CustomModal>
        </div>
      </div>

      <div className="flex ml-12 gap-4 mt-10">
        <div className="bg-[F2F2F2] rounded-md border-[1px]  border-gray-300 w-[35vw] h-[60%]">

          <InputTextWithHeader header={properties.customerMooringHeader} placeholder={'Search by name, ID,mooring no,boat name,phone no...'}
            style={{ marginLeft: "1rem", color: "A4A4A4" }}
            inputTextStyle={{ height: "5vh", width: "38vh", cursor: "pointer", fontSize: "0.63rem", color: "#A4A4A4", border: "1px solid #A4A4A4", paddingLeft: "3rem", borderRadius: "0.45rem" }}
            onChange={handleSearchChange}
            value={searchQuery}
          />
          <div className="border-[1px]  border-[#9F9F9F]   mt-3 "></div>
          <DataTableComponent
            data={mooringData}
            tableStyle={{
              fontSize: '12px',
              color: '#000000',
              fontWeight: 600,
              backgroundColor: '#D9D9D9',
            }}
            scrollable={true}
            columns={tableColumns}
            header={""}
          />
        </div>

        <div className="relative">
          <img
            src="/assets/images/map.png"
            className="bg-no-repeat object-cover bg-auto rounded-md w-full h-[105vh]"
            alt="Sea"
          />
          <div className="absolute top-72">
            <div className="">
            </div>
            <div className="rounded-md border-[1px] pb-1 border-gray-300 mt-16 ml-10 w-[17vw]  h-[13vh] bg-white">
              <p className="text-[0.7rem] ml-1 text-black">Status</p>
              <hr className="m-1 border-black" />
              <div className="flex">
                <div>
                  <FaCircle className="h-3 text-red-600 mt-1" data-testid="Facircle1" />
                  <FaCircle className="h-3 text-green-600 mt-2" data-testid="Facircle2" />
                </div>
                <div>
                  <p className="text-[0.6rem] text-black mt-1">Need inspection</p>
                  <p className="text-[0.6rem] text-black tracking-tighter mt-[0.3rem]">
                    Gear On (in the water)
                  </p>
                </div>
                <div className="ml-1">
                  <FaCircle className="h-3 text-violet-600 mt-1 " data-testid="Facircle3" />
                  <FaCircle className="h-3 text-gray-500 mt-2" data-testid="Facircle4" />
                </div>
                <div>
                  <p className="text-[0.6rem] text-black tracking-tighter mt-1">
                    Gear Off (out of the water)
                  </p>
                  <p className="text-[0.6rem] text-black mt-[0.3rem]">Not in Use</p>
                </div>
              </div>
            </div>
          </div>
          <div className=" border-gray-300 absolute top-5 right-5  w-[25em]  ">


            <div className="flex rounded-md bg-gray-500  py-3 pl-4 ">
              <div className="flex items-center">
                <span className="font-bold">Customers Record</span>
                <span>
                  <FaEdit className="ml-2" onClick={handleEdit} data-testid="edit" />
                </span>
                <InputSwitch
                  checked={isChecked}
                  onChange={handleInputChange}
                  className="border-none ml-20"
                  color='green'
                />
              </div>
            </div>

            {isChecked && (
              <div className=''>
                <div className="bg-[#F2F2F2] px-2">
                  <div className="flex gap-32 ">
                    <div className="font-bold text-sm ml-2 tracking-tighter">
                      <p>ID:{edit.id}</p>
                      <p>Phone:{edit.phone}</p>
                    </div>
                    <div className="font-bold text-sm tracking-tighter">
                      <p>Name:{edit.name}</p>
                      <p>Email:{edit.email}</p>
                    </div>
                  </div>
                  <div className="font-bold text-sm  ml-2 mt-2">
                    <p>Address:{edit.address}</p>
                  </div>
                  <div className="font-bold text-sm mt-2 ml-2 pb-2">
                    <p>
                      Boatyard:
                      <span className="bg-[#D9D9D9] ml-2">Pioneer</span>{' '}
                      <span className="bg-[#D9D9D9] ml-2">02Pioneer</span>{' '}
                      <span className="bg-[#D9D9D9] ml-2">Pioneer</span>
                    </p>
                  </div>
                </div>

                <div className="">
                  <h3 className="bg-[#D9D9D9] font-bold h12 py-4 pl-2 ">Moorings</h3>
                  <DataTable
                    className="bg[#F2F2F2]"
                    value={mooringData}
                    scrollable={true}
                    selectionMode="single"
                    onRowSelect={(e) => {
                      setSelectedMooring(e.data)
                      setIsDialogVisible(true)
                    }}
                    style={{ overflow: 'scroll', maxHeight: '60vh' }}>
                    <Column
                      field="id"
                      header="ID"
                      headerClassName="text-sm"
                      style={{ fontSize: '0.75rem' }}></Column>
                    <Column
                      field="mooringName"
                      header="Mooring Name"
                      headerStyle={{ fontSize: '0.875rem' }}
                      style={{ fontSize: '0.75rem' }}></Column>
                    <Column
                      field="gpsCoordinates"
                      header="GPS Coordinate"
                      headerStyle={{ fontSize: '0.87rem' }}
                      style={{ fontSize: '0.75rem' }}></Column>
                  </DataTable>
                  <Dialog
                    visible={isDialogVisible}
                    onHide={() => setIsDialogVisible(false)}
                    header={
                      <div className="flex gap-4">
                        <div className="font-bold">Mooring Information</div>
                        <div className="font-bold mt-1">
                          <FaEdit onClick={handleEdit} />
                        </div>
                      </div>
                    }>
                    <hr className="border border-black  my-0 mx-0"></hr>
                    {selectedMooring && (
                      <div className="flex leading-10 gap-4">
                        <div>
                          <p>
                            <span style={{ fontWeight: 'bold' }}>ID:</span> {selectedMooring?.id}
                          </p>
                          <p>
                            <span style={{ fontWeight: 'bold' }}>Mooring No:</span>{' '}
                            {selectedMooring?.mooringNumber}
                          </p>
                          <p>
                            <span style={{ fontWeight: 'bold' }}>Boat Name:</span>{' '}
                            {selectedMooring?.boatName}
                          </p>
                          <p>
                            <span style={{ fontWeight: 'bold' }}>Type:</span>{' '}
                            {selectedMooring?.boatType}
                          </p>
                          <p>
                            <span style={{ fontWeight: 'bold' }}>Size of Weight:</span>{' '}
                            {selectedMooring?.sizeOfWeight}
                          </p>
                          <p>
                            <span style={{ fontWeight: 'bold' }}>Top Chain Condition:</span>{' '}
                            {selectedMooring?.topChainCondition}
                          </p>
                          <p className="tracking-tighter">
                            <span style={{ fontWeight: 'bold' }}>Bottom Chain Condition:</span>{' '}
                            {selectedMooring?.bottomChainCondition}
                          </p>
                          <p>
                            <span style={{ fontWeight: 'bold' }}>Pennant Condition:</span>{' '}
                            {selectedMooring?.pennantCondition}
                          </p>
                          <p>
                            <span style={{ fontWeight: 'bold' }}>Water Depth:</span>{' '}
                            {selectedMooring?.waterDepth}
                          </p>
                        </div>
                        <div>
                          <p>
                            <span style={{ fontWeight: 'bold' }}>Harbor:</span>{' '}
                            {selectedMooring?.harbor}
                          </p>
                          <p>
                            <span style={{ fontWeight: 'bold' }}>G.P.S Coordinates:</span>{' '}
                            {selectedMooring?.gpsCoordinates}
                          </p>
                          <p>
                            <span style={{ fontWeight: 'bold' }}>Boat Size:</span>{' '}
                            {selectedMooring?.boatSize}
                          </p>
                          <p>
                            <span style={{ fontWeight: 'bold' }}>Weight:</span>{' '}
                            {selectedMooring?.boatWeight}
                          </p>

                          <p>
                            <span style={{ fontWeight: 'bold' }}>Type of Weight:</span>{' '}
                            {selectedMooring?.typeOfWeight}
                          </p>

                          <p>
                            <span style={{ fontWeight: 'bold' }}>Condition of Eye:</span>{' '}
                            {selectedMooring?.conditionOfEye}
                          </p>

                          <p>
                            <span style={{ fontWeight: 'bold' }}>Shackle, Swivel Condition:</span>{' '}
                            {selectedMooring?.shackleSwivelCondition}
                          </p>

                          <p>
                            <span style={{ fontWeight: 'bold' }}>Dept at Mean High Water:</span>{' '}
                            {selectedMooring?.deptAtMeanHighWater}
                          </p>
                        </div>
                      </div>
                    )}
                  </Dialog>
                </div>


              </div>



            )}
          </div>
        </div>



      </div>
    </>
  )
}

export default Moorings
