import { createApi, fetchBaseQuery, BaseQueryApi, FetchArgs } from '@reduxjs/toolkit/query/react'
import { RootState } from '../Store/Store'
import { selectCustomerId, selectUserRole } from '../Store/Slice/userSlice'

// Fetch base query configuration
const baseQuery = fetchBaseQuery({
  baseUrl: process.env.REACT_APP_BASE_URL,
  prepareHeaders: (headers, { getState, endpoint }) => {
    const state = getState() as RootState
    const selectedCustomerId = selectCustomerId(state)
    const userRole = selectUserRole(state)
    const refreshToken = sessionStorage.getItem('getRefreshToken')
    const noAuthEndpoints = ['login', 'resetPassword', 'forgotPassword']

    if (refreshToken && !noAuthEndpoints.includes(endpoint)) {
      headers.set('Authorization', `Bearer ${refreshToken}`)
      const noAuthEndpointsForCustomer = ['getCustomersOwners']
      if (userRole === 1 && selectedCustomerId && !noAuthEndpointsForCustomer.includes(endpoint)) {
        headers.set('CUSTOMER_OWNER_ID', selectedCustomerId)
      }
    } else {
      const token = state.user.token || sessionStorage.getItem('token')
      if (token && !noAuthEndpoints.includes(endpoint)) {
        headers.set('Authorization', `Bearer ${token}`)
        const noAuthEndpointsForCustomer = ['getCustomersOwners']
        if (
          userRole === 1 &&
          selectedCustomerId &&
          !noAuthEndpointsForCustomer.includes(endpoint)
        ) {
          headers.set('CUSTOMER_OWNER_ID', selectedCustomerId)
        }
      }
    }

    return headers
  },
})

// Function to fetch base query with interceptor
const baseQueryWithInterceptor = async (
  args: FetchArgs | string,
  api: BaseQueryApi,
  extraOptions: { signal?: AbortSignal },
) => {
  try {
    let result = await baseQuery(args, api, extraOptions)
    if (result.error && result.error.status === 500) {
      const token = sessionStorage.getItem('getRefreshToken')
      if (token) {
        const newToken = await refreshToken(token)
        if (newToken) {
          // Retry the original request with the new token
          result = await baseQuery(args, api, extraOptions)
        }
      }
    }
    return result
  } catch (error) {
    throw error
  }
}

// Create API client
export const userApi = createApi({
  reducerPath: 'api',
  baseQuery: baseQueryWithInterceptor,
  endpoints: (builder) => ({}),
})

// Function to refresh token
const refreshToken = async (refreshToken: string) => {
  try {
    const response = await fetch(
      `${process.env.REACT_APP_BASE_URL}/api/v1/auth/refresh?refreshToken=${refreshToken}`,
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
      },
    )
    if (!response.ok) {
      throw new Error('Failed to refresh token')
    }
    const data = await response.json()
    if (data?.status === 200) {
      sessionStorage.setItem('getRefreshToken', data.token)
      return data.token
    }
  } catch (error) {
    console.error('Error refreshing token:', error)
    throw error
  }
}
