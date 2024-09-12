import { useEffect } from 'react'
import {
  useGetCountriesMutation,
  useGetRolesMutation,
  useGetStatesMutation,
} from '../../Services/MetaDataApi'
import { MetaDataResponse } from '../../Type/ApiTypes'

const useMetaData = () => {
  const [getRoles] = useGetRolesMutation()
  const [getCountries] = useGetCountriesMutation()
  const [getStates] = useGetStatesMutation()

  const fetchMetaData = async (getData: any) => {
    try {
      const response = await getData({})
      const { status, content } = response.data as MetaDataResponse
      if (status === 200 && Array.isArray(content)) {
        return content
      } else {
        return null
      }
    } catch (error) {
      console.error('Error fetching metadata:', error)
      return null
    }
  }

  const getMetaData = async () => {
    const rolesData = await fetchMetaData(getRoles)
    const countriesData = await fetchMetaData(getCountries)
    const statesData = await fetchMetaData(getStates)

    return { rolesData, countriesData, statesData }
  }

  useEffect(() => {
    getMetaData()
  }, [])

  return { getMetaData }
}

export default useMetaData
