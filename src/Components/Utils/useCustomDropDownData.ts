import { useCallback, useState } from 'react'
import {
  GetBoatyardBasedOnMooringId,
  GetCustomerBasedOnMooringId,
  GetMooringBasedOnCustomerIdAndBoatyardId,
  GetMooringsBasedOnBoatyardId,
  GetMooringsBasedOnCustomerId,
} from '../CommonComponent/MetaDataComponent/MoorserveMetaDataApi'
import { MetaData } from '../../Type/CommonType'

const useCustomDropDownData = (workOrder: any) => {
  const [mooringBasedOnCustomerId, setMooringBasedOnCustomerId] = useState<MetaData[]>()
  const [boatyardBasedOnMooringId, setBoatyardBasedOnMooringId] = useState<MetaData[]>()
  const [customerBasedOnMooringId, setCustomerBasedOnMooringId] = useState<any[]>()
  const [mooringsBasedOnBoatyardId, setMooringsBasedOnBoatyardId] = useState<MetaData[]>()
  const [mooringBasedOnCustomerIdAndBoatyardId, setMooringBasedOnCustomerIdAndBoatyardId] =
    useState<MetaData[]>()
  const { getMooringBasedOnCustomerIdAndBoatyardIdData } = GetMooringBasedOnCustomerIdAndBoatyardId(
    workOrder?.customerName?.id && workOrder?.customerName?.id,
    workOrder?.boatyards?.id && workOrder?.boatyards?.id,
  )
  const { getMooringsBasedOnCustomerIdData } = GetMooringsBasedOnCustomerId(
    workOrder?.customerName?.id && workOrder?.customerName?.id,
  )
  const { getMooringsBasedOnBoatyardIdData } = GetMooringsBasedOnBoatyardId(
    workOrder?.boatyards?.id && workOrder?.boatyards?.id,
  )
  const { getBoatyardBasedOnMooringIdData } = GetBoatyardBasedOnMooringId(
    workOrder?.mooringId?.id && workOrder?.mooringId?.id,
  )
  const { getCustomerBasedOnMooringIdData } = GetCustomerBasedOnMooringId(
    workOrder?.mooringId?.id && workOrder?.mooringId?.id,
  )
  const [isFetching, setIsFetching] = useState(true)

  const fetchMooringsBasedOnCustomerId = useCallback(async () => {
    setIsFetching(true)
    const { mooringsBasedOnCustomerId } = await getMooringsBasedOnCustomerIdData()
    if (mooringsBasedOnCustomerId !== null) {
      setMooringBasedOnCustomerId(mooringsBasedOnCustomerId)
    }
    setIsFetching(false)
  }, [workOrder?.customerName?.id])

  const fetchMooringsBasedOnBoatyardId = useCallback(async () => {
    setIsFetching(true)
    const { mooringBasedOnBoatyardId } = await getMooringsBasedOnBoatyardIdData()
    if (mooringBasedOnBoatyardId !== null) {
      setMooringsBasedOnBoatyardId(mooringBasedOnBoatyardId)
    }
    setIsFetching(false)
  }, [workOrder?.boatyards?.id])

  const fetchBoatyardBasedOnMooringId = useCallback(async () => {
    setIsFetching(true)
    const { boatyardBasedOnMooringId } = await getBoatyardBasedOnMooringIdData()
    if (boatyardBasedOnMooringId !== null) {
      setBoatyardBasedOnMooringId(boatyardBasedOnMooringId)
    }
    setIsFetching(false)
  }, [workOrder?.mooringId?.id])

  const fetchCustomerBasedOnMooringId = useCallback(async () => {
    setIsFetching(true)
    const { customerBasedOnMooringId } = await getCustomerBasedOnMooringIdData()
    if (customerBasedOnMooringId !== null) {
      const firstLastName = customerBasedOnMooringId?.map((item) => ({
        firstName: `${item.firstName} ${item.lastName}`,
        id: item.id,
      }))
      setCustomerBasedOnMooringId(firstLastName)
    }
    setIsFetching(false)
  }, [workOrder?.mooringId?.id])

  const fetchMooringBasedOnCustomerIdAndBoatyardId = useCallback(async () => {
    setIsFetching(true)
    const { mooringbasedOnCustomerIdAndBoatyardId } =
      await getMooringBasedOnCustomerIdAndBoatyardIdData()

    if (mooringbasedOnCustomerIdAndBoatyardId !== null) {
      setMooringBasedOnCustomerIdAndBoatyardId(mooringbasedOnCustomerIdAndBoatyardId)
    }
    setIsFetching(false)
  }, [workOrder?.customerName?.id, workOrder?.boatyards?.id])

  return {
    fetchMooringsBasedOnCustomerId,
    fetchMooringsBasedOnBoatyardId,
    fetchBoatyardBasedOnMooringId,
    fetchCustomerBasedOnMooringId,
    fetchMooringBasedOnCustomerIdAndBoatyardId,
    mooringBasedOnCustomerId,
    boatyardBasedOnMooringId,
    customerBasedOnMooringId,
    mooringsBasedOnBoatyardId,
    mooringBasedOnCustomerIdAndBoatyardId,
    isFetching,
  }
}

export default useCustomDropDownData
