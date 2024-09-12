import { userApi } from './UserApi'

const metaDataApi = userApi.injectEndpoints({
  endpoints: (builder: any) => ({
    getRoles: builder.mutation({
      query: () => ({
        url: 'api/v1/metadata/roles',
        method: 'GET',
      }),
    }),

    getStates: builder.mutation({
      query: () => ({
        url: 'api/v1/metadata/states',
        method: 'GET',
      }),
    }),

    getCountries: builder.mutation({
      query: () => ({
        url: 'api/v1/metadata/countries',
        method: 'GET',
      }),
    }),
  }),
})

export const { useGetRolesMutation, useGetStatesMutation, useGetCountriesMutation } = metaDataApi
