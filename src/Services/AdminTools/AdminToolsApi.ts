import { userApi } from '../UserApi'
import { AddUserPayload } from '../../Type/ApiTypes'

const adminToolsApi = userApi.injectEndpoints({
  endpoints: (builder: any) => ({
    addUser: builder.mutation({
      query: ({
        payload,
        customerOwnerId,
      }: {
        payload: AddUserPayload
        customerOwnerId: number
      }) => ({
        url: 'api/v1/user/',
        method: 'POST',
        body: payload,
        params: { customerOwnerId },
      }),
    }),

    getUsers: builder.mutation({
      query: ({
        pageNumber,
        pageSize,
        sortBy,
        sortDir,
        customerOwnerId,
        searchText,
      }: {
        pageNumber?: number
        pageSize?: number
        sortBy?: string
        sortDir?: string
        customerOwnerId?: number
        searchText?: string
      }) => ({
        url: 'api/v1/user/',
        method: 'GET',
        params: { pageNumber, pageSize, sortBy, sortDir, customerOwnerId, searchText },
      }),
    }),

    getQuickBook: builder.mutation({
      query: ({}) => ({
        url: 'api/v1/QBOCustomer/',
        method: 'GET',
      }),
    }),

    deleteUser: builder.mutation({
      query: ({ userId, customerOwnerId }: { userId?: number; customerOwnerId?: number }) => ({
        url: `api/v1/user/${userId}`,
        method: 'DELETE',
        params: { customerOwnerId },
      }),
    }),

    updateUser: builder.mutation({
      query: ({
        payload,
        id,
        customerOwnerId,
      }: {
        payload: AddUserPayload
        id: number
        customerOwnerId?: number
      }) => ({
        url: `api/v1/user/${id}`,
        method: 'PUT',
        body: payload,
        params: { customerOwnerId },
      }),
    }),

    mapCustomerToQuickBook: builder.mutation({
      query: ({
        quickbookCustomerId,
        customerId,
      }: {
        quickbookCustomerId: string
        customerId: number
      }) => ({
        url: `api/v1/quickbook/saveMappingCustomerToQuickbook/${quickbookCustomerId}/${customerId}`,
        method: 'POST',
      }),
    }),

    editMapCustomerToQuickBook: builder.mutation({
      query: ({
        quickbookCustomerId,
        customerId,
      }: {
        quickbookCustomerId: number
        customerId: number
      }) => ({
        url: `api/v1/quickbook/editMappingCustomerToQuickbook/${quickbookCustomerId}/${customerId}`,
        method: 'PUT',
      }),
    }),
  }),
})

export const {
  useAddUserMutation,
  useGetUsersMutation,
  useDeleteUserMutation,
  useUpdateUserMutation,
  useMapCustomerToQuickBookMutation,
  useEditMapCustomerToQuickBookMutation,
  useGetQuickBookMutation,
} = adminToolsApi
