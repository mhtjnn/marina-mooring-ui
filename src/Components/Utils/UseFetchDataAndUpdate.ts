import { useCallback, useState } from 'react'
import {
  GetMooringIds,
  GetTechnicians,
  GetWorkOrderStatus,
} from '../CommonComponent/MetaDataComponent/MoorserveMetaDataApi'
import {
  AttachFormsTypesData,
  BoatyardNameData,
  CustomersData,
} from '../CommonComponent/MetaDataComponent/MetaDataApi'
import { MetaData } from '../../Type/CommonType'

const useFetchDataAndUpdate = (selectedCustomerId: any, workOrderData: any) => {
  const [technicians, setTechnicians] = useState<any[]>()
  const [moorings, setMoorings] = useState<MetaData[]>()
  const [workOrderStatusValue, setWorkOrderStatusValue] = useState<MetaData[]>()
  const [customerNameValue, setcustomerNameValue] = useState<any[]>()
  const [boatyardsName, setBoatYardsName] = useState<MetaData[]>()
  const [formsData, setFormsData] = useState<any[]>([])
  const [isLoader, setIsLoader] = useState(true)
  const { getTechniciansData } = GetTechnicians()
  const { getMooringIdsData } = GetMooringIds()
  const { getWorkOrderStatusData } = GetWorkOrderStatus()
  const { getAttachFormsTypeData } = AttachFormsTypesData()
  const { getCustomersData } = CustomersData(selectedCustomerId)
  const { getBoatYardNameData } = BoatyardNameData(selectedCustomerId)

  const fetchDataAndUpdate = useCallback(async () => {
    setIsLoader(true)

    const { getTechnicians } = await getTechniciansData()
    const { mooringIds } = await getMooringIdsData()
    const { WorkOrderStatus } = await getWorkOrderStatusData()
    const { customersData } = await getCustomersData()
    const { boatYardName } = await getBoatYardNameData()
    const { attachFormsTypeValue } = await getAttachFormsTypeData()

    if (getTechnicians) {
      const firstLastName = getTechnicians.map((item) => ({
        firstName: `${item?.firstName} ${item?.lastName}`,
        id: item?.id,
      }))
      setTechnicians(firstLastName)
    }

    if (mooringIds) {
      const filteredMoorings = mooringIds.filter((mooring) => mooring?.mooringNumber !== '')
      setMoorings(filteredMoorings)
    }

    if (WorkOrderStatus) {
      setWorkOrderStatusValue(WorkOrderStatus)
    }

    if (attachFormsTypeValue) {
      setFormsData(attachFormsTypeValue)
      if (workOrderData?.formResponseDtoList) {
        setFormsData((prevState) => [...prevState, ...workOrderData?.formResponseDtoList])
      }
    }

    if (customersData) {
      const firstLastName = customersData.map((item) => ({
        firstName: `${item?.firstName} ${item?.lastName}`,
        id: item?.id,
      }))
      setcustomerNameValue(firstLastName)
    }

    if (boatYardName) {
      setBoatYardsName(boatYardName)
    }

    setIsLoader(false)
  }, [workOrderData])

  return {
    fetchDataAndUpdate,
    technicians,
    moorings,
    workOrderStatusValue,
    customerNameValue,
    boatyardsName,
    formsData,
    isLoader,
  }
}

export default useFetchDataAndUpdate
