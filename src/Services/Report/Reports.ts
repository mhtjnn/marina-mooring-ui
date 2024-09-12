import { PaymentPayload, UploadPayload, WorkOrderPayload } from '../../Type/ApiTypes'
import { userApi } from '../UserApi'

const ReportsApi = userApi.injectEndpoints({
  endpoints: (builder: any) => ({
    getJobType: builder.mutation({
      query: ({}) => ({
        url: 'api/v1/report/jobType',
        method: 'GET',
      }),
    }),

    getJobLocation: builder.mutation({
      query: ({}) => ({
        url: 'api/v1/report/jobLocation',
        method: 'GET',
      }),
    }),
  }),
})

export const { useGetJobTypeMutation, useGetJobLocationMutation } = ReportsApi
