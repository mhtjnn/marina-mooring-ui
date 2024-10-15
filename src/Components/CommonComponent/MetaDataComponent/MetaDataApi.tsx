import {
  useGetBoatTypeMutation,
  useGetBottomChainConditionsMutation,
  useGetCountriesMutation,
  useGetEyeConditionMutation,
  useGetPennantConditionsMutation,
  useGetRolesMutation,
  useGetShackleSwivelConditionsMutation,
  useGetSizeOfWeightMutation,
  useGetStatesMutation,
  useGetServiceAreaTypeMutation,
  useGetStatusMutation,
  useGetTopChainConditionMutation,
  useGetTypeOfWeightMutation,
  useGetBoatyardsTypeMutation,
  useGetCustomersDataMutation,
  useGetInventoryTypeMutation,
  useGetCustomerTypeMutation,
  useGetServiceAreasMutation,
  useGetQuickBookCustomerMutation,
  useGetPaymentOptionMutation,
  useGetJobTypeMutation,
  useGetMooringStatusTypeMutation,
  useGetAttachFormsTypeMutation,
  useGetVendorDataMutation,
  useGetInventoryDataMutation,
} from '../../../Services/MetaDataApi'
import { ErrorResponse, MetaDataCustomerResponse, MetaDataResponse } from '../../../Type/ApiTypes'

export const StatesData = (countryId: number) => {
  const [getStates] = useGetStatesMutation()

  const fetchMetaData = async (getData: any) => {
    try {
      const response = await getData({ countryId: countryId })
      const { status, content } = response.data as MetaDataResponse
      return status === 200 && Array.isArray(content) ? content : null
    } catch (error) {
      const { message } = error as ErrorResponse
      console.error('Error fetching metadata:', message)
      return null
    }
  }

  const getStatesData = async () => ({ statesData: await fetchMetaData(getStates) })

  return { getStatesData }
}

export const ServiceAreaTypeData = () => {
  const [getServiceAreaType] = useGetServiceAreaTypeMutation()

  const fetchMetaData = async (getData: any) => {
    try {
      const response = await getData({})
      const { status, content } = response.data as MetaDataResponse
      return status === 200 && Array.isArray(content) ? content : null
    } catch (error) {
      const { message } = error as ErrorResponse
      console.error('Error fetching metadata:', message)
      return null
    }
  }

  const getServiceAreaTypeData = async () => ({
    ServiceAreaTypeData: await fetchMetaData(getServiceAreaType),
  })

  return { getServiceAreaTypeData }
}

export const CountriesData = () => {
  const [getCountries] = useGetCountriesMutation()

  const fetchMetaData = async (getData: any) => {
    try {
      const response = await getData({})
      const { status, content } = response.data as MetaDataResponse
      return status === 200 && Array.isArray(content) ? content : null
    } catch (error) {
      const { message } = error as ErrorResponse
      console.error('Error fetching metadata:', message)
      return null
    }
  }

  const getCountriesData = async () => ({ countriesData: await fetchMetaData(getCountries) })

  return { getCountriesData }
}

export const RolesData = () => {
  const [getRoles] = useGetRolesMutation()

  const fetchRolesData = async (getData: any) => {
    try {
      const response = await getData({})
      const { status, content } = response.data as MetaDataResponse
      return status === 200 && Array.isArray(content) ? content : null
    } catch (error) {
      const { message } = error as ErrorResponse
      console.error('Error fetching metadata:', message)
      return null
    }
  }

  const getRolesData = async () => ({ rolesData: await fetchRolesData(getRoles) })

  return { getRolesData }
}

export const TypeOfWeightData = () => {
  const [getTypeOfWeight] = useGetTypeOfWeightMutation()

  const fetchTypeOfWeightData = async (getData: any) => {
    try {
      const response = await getData({})
      const { status, content } = response.data as MetaDataResponse
      return status === 200 && Array.isArray(content) ? content : null
    } catch (error) {
      const { message } = error as ErrorResponse
      console.error('Error fetching metadata:', message)
      return null
    }
  }

  const getTypeOfWeightData = async () => ({
    typeOfWeightData: await fetchTypeOfWeightData(getTypeOfWeight),
  })

  return { getTypeOfWeightData }
}

export const BoatyardNameData = (customerOwnerId: any) => {
  const [getboatyardName] = useGetBoatyardsTypeMutation()

  const fetchBoatyardName = async (getData: any) => {
    try {
      const response = await getData({ customerOwnerId: customerOwnerId })
      const { status, content } = response.data as MetaDataResponse
      return status === 200 && Array.isArray(content) ? content : null
    } catch (error) {
      const { message } = error as ErrorResponse
      console.error('Error fetching metadata:', message)
      return null
    }
  }

  const getBoatYardNameData = async () => ({
    boatYardName: await fetchBoatyardName(getboatyardName),
  })

  return { getBoatYardNameData }
}

export const JobTypesData = () => {
  const [getJobTypes] = useGetJobTypeMutation()

  const fetchJobTypes = async (getData: any) => {
    try {
      const response = await getData({})
      const { status, content } = response.data as MetaDataResponse
      return status === 200 && Array.isArray(content) ? content : null
    } catch (error) {
      const { message } = error as ErrorResponse
      console.error('Error fetching metadata:', error)
      return null
    }
  }

  const getJobTypeData = async () => ({
    jobTypeValue: await fetchJobTypes(getJobTypes),
  })

  return { getJobTypeData }
}

export const AttachFormsTypesData = () => {
  const [getAttachFormsTypes] = useGetAttachFormsTypeMutation()

  const fetchAttachFormsTypes = async (getData: any) => {
    try {
      const response = await getData({})
      const { status, content } = response.data as MetaDataResponse
      return status === 200 && Array.isArray(content) ? content : null
    } catch (error) {
      const { message } = error as ErrorResponse
      console.error('Error fetching metadata:', error)
      return null
    }
  }

  const getAttachFormsTypeData = async () => ({
    attachFormsTypeValue: await fetchAttachFormsTypes(getAttachFormsTypes),
  })

  return { getAttachFormsTypeData }
}

export const VendorData = () => {
  const [getVendorDataValues] = useGetVendorDataMutation()

  const fetchVendorDataValues = async (getData: any) => {
    try {
      const response = await getData({})
      const { status, content } = response.data as MetaDataResponse
      return status === 200 && Array.isArray(content) ? content : null
    } catch (error) {
      const { message } = error as ErrorResponse
      console.error('Error fetching metadata:', error)
      return null
    }
  }

  const getVendorValue = async () => ({
    vendorValue: await fetchVendorDataValues(getVendorDataValues),
  })

  return { getVendorValue }
}

export const InventoryDetailsData = (vendorId: number) => {
  const [getVendorDataValues] = useGetInventoryDataMutation()

  const fetchInventoryDetailsData = async (getData: any) => {
    try {
      const response = await getData({ vendorId: vendorId })
      const { status, content } = response.data as MetaDataResponse
      return status === 200 && Array.isArray(content) ? content : null
    } catch (error) {
      const { message } = error as ErrorResponse
      console.error('Error fetching metadata:', error)
      return null
    }
  }

  const getInventoryDetails = async () => ({
    inventoryDetails: await fetchInventoryDetailsData(getVendorDataValues),
  })

  return { getInventoryDetails }
}

export const TypeOfChainCondition = () => {
  const [getTopChainCondition] = useGetTopChainConditionMutation()

  const fetchTypeOfChainCondition = async (getData: any) => {
    try {
      const response = await getData({})
      const { status, content } = response.data as MetaDataResponse
      return status === 200 && Array.isArray(content) ? content : null
    } catch (error) {
      const { message } = error as ErrorResponse
      console.error('Error fetching metadata:', message)
      return null
    }
  }

  const getTypeOfChainData = async () => ({
    typeOfChainData: await fetchTypeOfChainCondition(getTopChainCondition),
  })

  return { getTypeOfChainData }
}

export const ServiceAreaData = () => {
  const [getServiceAreaType] = useGetServiceAreasMutation()

  const fetchTypeOfServiceArea = async (getData: any) => {
    try {
      const response = await getData({})
      const { status, content } = response.data as MetaDataResponse
      return status === 200 && Array.isArray(content) ? content : null
    } catch (error) {
      const { message } = error as ErrorResponse
      console.error('Error fetching metadata:', message)
      return null
    }
  }

  const getServiceAreaData = async () => ({
    serviceAreaData: await fetchTypeOfServiceArea(getServiceAreaType),
  })

  return { getServiceAreaData }
}

export const TypeOfStatus = () => {
  const [getStatus] = useGetStatusMutation()

  const fetchTypeOfStatus = async (getData: any) => {
    try {
      const response = await getData({})
      const { status, content } = response.data as MetaDataResponse
      return status === 200 && Array.isArray(content) ? content : null
    } catch (error) {
      const { message } = error as ErrorResponse
      console.error('Error fetching metadata:', message)
      return null
    }
  }

  const getTypeOfStatusData = async () => ({
    typeOfStatusData: await fetchTypeOfStatus(getStatus),
  })

  return { getTypeOfStatusData }
}

export const TypeOfSizeOfWeight = () => {
  const [getSizeOfWeight] = useGetSizeOfWeightMutation()

  const fetchTypeOfSizeOfWeight = async (getData: any) => {
    try {
      const response = await getData({})
      const { status, content } = response.data as MetaDataResponse
      return status === 200 && Array.isArray(content) ? content : null
    } catch (error) {
      const { message } = error as ErrorResponse
      console.error('Error fetching metadata:', message)
      return null
    }
  }

  const getTypeOfSizeOfWeightData = async () => ({
    TypeOfSizeOfWeightData: await fetchTypeOfSizeOfWeight(getSizeOfWeight),
  })

  return { getTypeOfSizeOfWeightData }
}

export const TypeOfShackleSwivel = () => {
  const [getShackleSwivelConditions] = useGetShackleSwivelConditionsMutation()

  const fetchTypeOfShackleSwivel = async (getData: any) => {
    try {
      const response = await getData({})
      const { status, content } = response.data as MetaDataResponse
      return status === 200 && Array.isArray(content) ? content : null
    } catch (error) {
      const { message } = error as ErrorResponse
      console.error('Error fetching metadata:', message)
      return null
    }
  }

  const getTypeOfShackleSwivelData = async () => ({
    typeOfShackleSwivelData: await fetchTypeOfShackleSwivel(getShackleSwivelConditions),
  })

  return { getTypeOfShackleSwivelData }
}

export const TypeOfPennant = () => {
  const [getPennantConditions] = useGetPennantConditionsMutation()

  const fetchTypeOfPennant = async (getData: any) => {
    try {
      const response = await getData({})
      const { status, content } = response.data as MetaDataResponse
      return status === 200 && Array.isArray(content) ? content : null
    } catch (error) {
      const { message } = error as ErrorResponse
      console.error('Error fetching metadata:', message)
      return null
    }
  }

  const getTypeOfPennantData = async () => ({
    typeOfPennantData: await fetchTypeOfPennant(getPennantConditions),
  })

  return { getTypeOfPennantData }
}

export const TypeOfEye = () => {
  const [getEyeCondition] = useGetEyeConditionMutation()

  const fetchTypeOfEye = async (getData: any) => {
    try {
      const response = await getData({})
      const { status, content } = response.data as MetaDataResponse
      return status === 200 && Array.isArray(content) ? content : null
    } catch (error) {
      const { message } = error as ErrorResponse
      console.error('Error fetching metadata:', message)
      return null
    }
  }

  const getTypeOfEyeData = async () => ({
    typeOfEyeData: await fetchTypeOfEye(getEyeCondition),
  })

  return { getTypeOfEyeData }
}

export const TypeOfBottomChain = () => {
  const [getBottomChainConditions] = useGetBottomChainConditionsMutation()

  const fetchTypeOfBottomChain = async (getData: any) => {
    try {
      const response = await getData({})
      const { status, content } = response.data as MetaDataResponse
      return status === 200 && Array.isArray(content) ? content : null
    } catch (error) {
      const { message } = error as ErrorResponse
      console.error('Error fetching metadata:', message)
      return null
    }
  }

  const getTypeOfBottomChainData = async () => ({
    typeOfBottomChainData: await fetchTypeOfBottomChain(getBottomChainConditions),
  })

  return { getTypeOfBottomChainData }
}

export const TypeOfBoatYards = (customerOwnerId: any) => {
  const [getBoatyards] = useGetBoatyardsTypeMutation()

  const fetchBoatYardsData = async (getData: any) => {
    try {
      const response = await getData({ customerOwnerId: customerOwnerId })
      const { status, content } = response.data as MetaDataResponse
      return status === 200 && Array.isArray(content) ? content : null
    } catch (error) {
      const { message } = error as ErrorResponse
      console.error('Error fetching metadata:', message)
      return null
    }
  }

  const getBoatYardsData = async () => ({ boatYards: await fetchBoatYardsData(getBoatyards) })

  return { getBoatYardsData }
}

export const TypeOfBoatType = () => {
  const [getBoatType] = useGetBoatTypeMutation()

  const fetchTypeOfBoatType = async (getData: any) => {
    try {
      const response = await getData({})
      const { status, content } = response.data as MetaDataResponse
      return status === 200 && Array.isArray(content) ? content : null
    } catch (error) {
      const { message } = error as ErrorResponse
      console.error('Error fetching metadata:', message)
      return null
    }
  }

  const getTypeOfBoatTypeData = async () => ({
    typeOfBoatTypeData: await fetchTypeOfBoatType(getBoatType),
  })

  return { getTypeOfBoatTypeData }
}

export const TypeOfMooringStatus = () => {
  const [getMooringStatusType] = useGetMooringStatusTypeMutation()

  const fetchTypeOfMooringStatusType = async (getData: any) => {
    try {
      const response = await getData({})
      const { status, content } = response.data as MetaDataResponse
      return status === 200 && Array.isArray(content) ? content : null
    } catch (error) {
      const { message } = error as ErrorResponse
      console.error('Error fetching metadata:', message)
      return null
    }
  }

  const getTypeOfMooringStatusData = async () => ({
    typeOfMooringStatusTypeData: await fetchTypeOfMooringStatusType(getMooringStatusType),
  })

  return { getTypeOfMooringStatusData }
}

export const CustomersData = (customerOwnerId: any) => {
  const [getCustomers] = useGetCustomersDataMutation()

  const fetchCustomersData = async (getData: any) => {
    try {
      const response = await getData({ customerOwnerId: customerOwnerId })
      const { status, content } = response.data as MetaDataCustomerResponse
      return status === 200 && Array.isArray(content) ? content : null
    } catch (error) {
      const { message } = error as ErrorResponse
      console.error('Error fetching metadata:', message)
      return null
    }
  }

  const getCustomersData = async () => ({ customersData: await fetchCustomersData(getCustomers) })

  return { getCustomersData }
}

export const CustomersType = () => {
  const [getCustomersTypeData] = useGetCustomerTypeMutation()

  const fetchCustomersType = async (getData: any) => {
    try {
      const response = await getData({})
      const { status, content } = response.data as MetaDataResponse
      return status === 200 && Array.isArray(content) ? content : null
    } catch (error) {
      const { message } = error as ErrorResponse
      console.error('Error fetching metadata:', message)
      return null
    }
  }

  const getCustomersType = async () => ({
    customersType: await fetchCustomersType(getCustomersTypeData),
  })

  return { getCustomersType }
}

export const TypeOfInventoryType = () => {
  const [getInventoryType] = useGetInventoryTypeMutation()

  const fetchTypeInventoryType = async (getData: any) => {
    try {
      const response = await getData({})
      const { status, content } = response.data as MetaDataResponse
      return status === 200 && Array.isArray(content) ? content : null
    } catch (error) {
      const { message } = error as ErrorResponse
      console.error('Error fetching metadata:', message)
      return null
    }
  }

  const getTypeOfInventoryTypeData = async () => ({
    typeOfBoatTypeData: await fetchTypeInventoryType(getInventoryType),
  })

  return { getTypeOfInventoryTypeData }
}

export const QuickBooksCustomerData = () => {
  const [getQuickBookCustomer] = useGetQuickBookCustomerMutation()

  const fetchQuickBookCustomer = async (getData: any) => {
    try {
      const response = await getData({})
      const { status, content } = response.data as MetaDataResponse
      return status === 200 && Array.isArray(content) ? content : null
    } catch (error) {
      const { message } = error as ErrorResponse
      console.error('Error fetching metadata:', message)
      return null
    }
  }

  const getQuickBookCustomerData = async () => ({
    quickBookCustomerData: await fetchQuickBookCustomer(getQuickBookCustomer),
  })

  return { getQuickBookCustomerData }
}

export const PaymentOptionType = () => {
  const [getPaymentOptionTypeData] = useGetPaymentOptionMutation()

  const fetchPaymentOptionType = async (getData: any) => {
    try {
      const response = await getData({})
      const { status, content } = response.data as MetaDataResponse
      return status === 200 && Array.isArray(content) ? content : null
    } catch (error) {
      const { message } = error as ErrorResponse
      console.error('Error fetching metadata:', message)
      return null
    }
  }

  const getPaymentOptionType = async () => ({
    paymentOptionType: await fetchPaymentOptionType(getPaymentOptionTypeData),
  })

  return { getPaymentOptionType }
}
