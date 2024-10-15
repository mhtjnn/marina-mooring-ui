import { userApi } from '../UserApi'

const MoorserveMetaDataApi = userApi.injectEndpoints({
  endpoints: (builder: any) => ({
    getMooringBasedOnCustomerIdAndBoatyardId: builder.mutation({
      query: ({
        pageNumber,
        pageSize,
        customerId,
        boatyardId,
      }: {
        pageNumber?: number
        pageSize?: number
        boatyardId: number
        customerId: number
      }) => ({
        url: `api/v1/metadata/mooringBasedOnCustomerIdAndBoatyardId/${customerId}/${boatyardId}`,
        method: 'GET',
        params: { pageNumber, pageSize },
      }),
    }),

    getMooringsBasedOnBoatyardId: builder.mutation({
      query: ({
        pageNumber,
        pageSize,
        boatyardId,
      }: {
        pageNumber?: number
        pageSize?: number
        boatyardId: number
      }) => ({
        url: `api/v1/metadata/mooringsBasedOnBoatyardId/${boatyardId}`,
        method: 'GET',
        params: { pageNumber, pageSize },
      }),
    }),

    getMooringsBasedOnCustomerId: builder.mutation({
      query: ({
        pageNumber,
        pageSize,
        customerId,
      }: {
        pageNumber?: number
        pageSize?: number
        customerId: number
      }) => ({
        url: `api/v1/metadata/mooringsBasedOnCustomerId/${customerId}`,
        method: 'GET',
        params: { pageNumber, pageSize },
      }),
    }),

    getBoatyardBasedOnMooringId: builder.mutation({
      query: ({
        pageNumber,
        pageSize,
        mooringId,
      }: {
        pageNumber?: number
        pageSize?: number
        mooringId: number
      }) => ({
        url: `api/v1/metadata/boatyardBasedOnMooringId/${mooringId}`,
        method: 'GET',
        params: { pageNumber, pageSize },
      }),
    }),

    getCustomerBasedOnMooringId: builder.mutation({
      query: ({
        pageNumber,
        pageSize,
        mooringId,
      }: {
        pageNumber?: number
        pageSize?: number
        mooringId: number
      }) => ({
        url: `api/v1/metadata/customerBasedOnMooringId/${mooringId}`,
        method: 'GET',
        params: { pageNumber, pageSize },
      }),
    }),

    getTechnicians: builder.mutation({
      query: ({ pageNumber, pageSize }: { pageNumber?: number; pageSize?: number }) => ({
        url: 'api/v1/metadata/technicians',
        method: 'GET',
        params: { pageNumber, pageSize },
      }),
    }),

    getMooringIds: builder.mutation({
      query: ({ pageNumber, pageSize }: { pageNumber?: number; pageSize?: number }) => ({
        url: 'api/v1/metadata/mooringIds',
        method: 'GET',
        params: { pageNumber, pageSize },
      }),
    }),

    getWorkOrderStatus: builder.mutation({
      query: ({ pageNumber, pageSize }: { pageNumber?: number; pageSize?: number }) => ({
        url: 'api/v1/metadata/workOrderStatus',
        method: 'GET',
        params: { pageNumber, pageSize },
      }),
    }),
  }),


  
})

export const {
  useGetMooringBasedOnCustomerIdAndBoatyardIdMutation,
  useGetMooringsBasedOnBoatyardIdMutation,
  useGetMooringsBasedOnCustomerIdMutation,
  useGetBoatyardBasedOnMooringIdMutation,
  useGetCustomerBasedOnMooringIdMutation,
  useGetTechniciansMutation,
  useGetMooringIdsMutation,
  useGetWorkOrderStatusMutation,
} = MoorserveMetaDataApi
