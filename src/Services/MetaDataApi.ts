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
      query: ({ countryId }: { countryId: number }) => ({
        url: `api/v1/metadata/states/${countryId}`,
        method: 'GET',
      }),
    }),

    getServiceAreaType: builder.mutation({
      query: () => ({
        url: 'api/v1/metadata/serviceAreaTypes',
        method: 'GET',
      }),
    }),

    getCountries: builder.mutation({
      query: () => ({
        url: 'api/v1/metadata/countries',
        method: 'GET',
      }),
    }),

    getTypeOfWeight: builder.mutation({
      query: ({ pageNumber, pageSize }: { pageNumber?: number; pageSize?: number }) => ({
        url: 'api/v1/metadata/typeOfWeight',
        method: 'GET',
        params: { pageNumber, pageSize },
      }),
    }),

    getCustomersData: builder.mutation({
      query: ({
        pageNumber,
        pageSize,
        customerOwnerId,
      }: {
        pageNumber?: number
        pageSize?: number
        customerOwnerId?: number
      }) => ({
        url: 'api/v1/metadata/customers',
        method: 'GET',
        params: { pageNumber, pageSize, customerOwnerId },
      }),
    }),

    getCustomersOwners: builder.mutation({
      query: ({
        pageNumber,
        pageSize,
        sortBy,
        sortDir,
      }: {
        pageNumber?: number
        pageSize?: number
        sortBy?: string
        sortDir?: string
      }) => ({
        url: 'api/v1/metadata/customerOwners',
        method: 'GET',
        params: { pageNumber, pageSize, sortBy, sortDir },
      }),
    }),

    getTopChainCondition: builder.mutation({
      query: ({ pageNumber, pageSize }: { pageNumber?: number; pageSize?: number }) => ({
        url: 'api/v1/metadata/topChainCondition',
        method: 'GET',
        params: { pageNumber, pageSize },
      }),
    }),

    getStatus: builder.mutation({
      query: ({ pageNumber, pageSize }: { pageNumber?: number; pageSize?: number }) => ({
        url: 'api/v1/metadata/status',
        method: 'GET',
        params: { pageNumber, pageSize },
      }),
    }),

    getSizeOfWeight: builder.mutation({
      query: ({ pageNumber, pageSize }: { pageNumber?: number; pageSize?: number }) => ({
        url: 'api/v1/metadata/sizeOfWeight',
        method: 'GET',
        params: { pageNumber, pageSize },
      }),
    }),

    getShackleSwivelConditions: builder.mutation({
      query: ({ pageNumber, pageSize }: { pageNumber?: number; pageSize?: number }) => ({
        url: 'api/v1/metadata/shackleSwivelConditions',
        method: 'GET',
        params: { pageNumber, pageSize },
      }),
    }),

    getPennantConditions: builder.mutation({
      query: ({ pageNumber, pageSize }: { pageNumber?: number; pageSize?: number }) => ({
        url: 'api/v1/metadata/pendantConditions',
        method: 'GET',
        params: { pageNumber, pageSize },
      }),
    }),

    getEyeCondition: builder.mutation({
      query: ({ pageNumber, pageSize }: { pageNumber?: number; pageSize?: number }) => ({
        url: 'api/v1/metadata/eyeCondition',
        method: 'GET',
        params: { pageNumber, pageSize },
      }),
    }),

    getBottomChainConditions: builder.mutation({
      query: ({ pageNumber, pageSize }: { pageNumber?: number; pageSize?: number }) => ({
        url: 'api/v1/metadata/bottomChainConditions',
        method: 'GET',
        params: { pageNumber, pageSize },
      }),
    }),

    getBoatyardsType: builder.mutation({
      query: ({
        pageNumber,
        pageSize,
        customerOwnerId,
      }: {
        pageNumber?: number
        pageSize?: number
        customerOwnerId?: number
      }) => ({
        url: 'api/v1/metadata/boatyards',
        method: 'GET',
        params: { pageNumber, pageSize, customerOwnerId },
      }),
    }),

    getBoatType: builder.mutation({
      query: ({ pageNumber, pageSize }: { pageNumber?: number; pageSize?: number }) => ({
        url: 'api/v1/metadata/boatType',
        method: 'GET',
        params: { pageNumber, pageSize },
      }),
    }),

    getInventoryType: builder.mutation({
      query: ({ pageNumber, pageSize }: { pageNumber?: number; pageSize?: number }) => ({
        url: 'api/v1/metadata/inventoryType',
        method: 'GET',
        params: { pageNumber, pageSize },
      }),
    }),

    getCustomerType: builder.mutation({
      query: ({ pageNumber, pageSize }: { pageNumber?: number; pageSize?: number }) => ({
        url: 'api/v1/metadata/customerTypes',
        method: 'GET',
        params: { pageNumber, pageSize },
      }),
    }),

    getServiceAreas: builder.mutation({
      query: ({ pageNumber, pageSize }: { pageNumber?: number; pageSize?: number }) => ({
        url: 'api/v1/metadata/serviceAreas',
        method: 'GET',
        params: { pageNumber, pageSize },
      }),
    }),

    getQuickBookCustomer: builder.mutation({
      query: ({ pageNumber, pageSize }: { pageNumber?: number; pageSize?: number }) => ({
        url: 'api/v1/QBOCustomer/',
        // url: 'api/v1/metadata/quickbookCustomers',
        method: 'GET',
        params: { pageNumber, pageSize },
      }),
    }),

    getPaymentOption: builder.mutation({
      query: ({ pageNumber, pageSize }: { pageNumber?: number; pageSize?: number }) => ({
        url: 'api/v1/metadata/paymentTypes',
        method: 'GET',
        params: { pageNumber, pageSize },
      }),
    }),

    getJobType: builder.mutation({
      query: ({ pageNumber, pageSize }: { pageNumber?: number; pageSize?: number }) => ({
        url: 'api/v1/metadata/jobTypes',
        method: 'GET',
        params: { pageNumber, pageSize },
      }),
    }),

    getMooringStatusType: builder.mutation({
      query: ({ pageNumber, pageSize }: { pageNumber?: number; pageSize?: number }) => ({
        url: 'api/v1/metadata/mooringStatus',
        method: 'GET',
        params: { pageNumber, pageSize },
      }),
    }),

    getAttachFormsType: builder.mutation({
      query: ({ pageNumber, pageSize }: { pageNumber?: number; pageSize?: number }) => ({
        url: 'api/v1/metadata/forms',
        method: 'GET',
        params: { pageNumber, pageSize },
      }),
    }),

    getVendorData: builder.mutation({
      query: ({ pageNumber, pageSize }: { pageNumber?: number; pageSize?: number }) => ({
        url: 'api/v1/metadata/vendors',
        method: 'GET',
        params: { pageNumber, pageSize },
      }),
    }),

    getInventoryData: builder.mutation({
      query: ({
        pageNumber,
        pageSize,
        vendorId,
      }: {
        pageNumber?: number
        pageSize?: number
        vendorId: number
      }) => ({
        url: `api/v1/metadata/inventory/${vendorId}`,
        method: 'GET',
        params: { pageNumber, pageSize },
      }),
    }),
  }),
})

export const {
  useGetRolesMutation,
  useGetStatesMutation,
  useGetServiceAreaTypeMutation,
  useGetCountriesMutation,
  useGetTypeOfWeightMutation,
  useGetCustomersDataMutation,
  useGetTopChainConditionMutation,
  useGetStatusMutation,
  useGetSizeOfWeightMutation,
  useGetShackleSwivelConditionsMutation,
  useGetPennantConditionsMutation,
  useGetEyeConditionMutation,
  useGetBottomChainConditionsMutation,
  useGetBoatTypeMutation,
  useGetBoatyardsTypeMutation,
  useGetJobTypeMutation,
  useGetInventoryTypeMutation,
  useGetCustomersOwnersMutation,
  useGetCustomerTypeMutation,
  useGetServiceAreasMutation,
  useGetQuickBookCustomerMutation,
  useGetPaymentOptionMutation,
  useGetMooringStatusTypeMutation,
  useGetAttachFormsTypeMutation,
  useGetVendorDataMutation,
  useGetInventoryDataMutation,
} = metaDataApi
