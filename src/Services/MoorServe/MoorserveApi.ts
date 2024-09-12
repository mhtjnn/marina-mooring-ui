import { PaymentPayload, UploadPayload, WorkOrderPayload } from '../../Type/ApiTypes'
import { userApi } from '../UserApi'

const MoorserveApi = userApi.injectEndpoints({
  endpoints: (builder: any) => ({
    //ADD Work Order
    addWorkOrder: builder.mutation({
      query: (payload: WorkOrderPayload) => ({
        url: 'api/v1/workOrder/',
        method: 'POST',
        body: payload,
      }),
    }),

    //Get Work Order By Id
    getWorkOrderById: builder.mutation({
      query: ({ id }: { id?: string }) => ({
        url: `api/v1/workOrder/${id}`,
        method: 'GET',
      }),
    }),

    //Get WorkOrders
    getWorkOrders: builder.mutation({
      query: ({
        pageNumber,
        pageSize,
        sortBy,
        sortDir,
        searchText,
        showCompletedWorkOrders,
      }: {
        pageNumber?: number
        pageSize?: number
        sortBy?: string
        sortDir?: string
        searchText?: string
        showCompletedWorkOrders?: string
      }) => ({
        url: 'api/v1/workOrder/',
        method: 'GET',
        params: { pageNumber, pageSize, sortBy, sortDir, searchText, showCompletedWorkOrders },
      }),
    }),

    getCompletedWorkOrderWithPendingPayApproval: builder.mutation({
      query: ({
        pageNumber,
        pageSize,
        sortBy,
        sortDir,
        searchText,
      }: {
        pageNumber?: number
        pageSize?: number
        sortBy?: string
        sortDir?: string
        searchText?: string
      }) => ({
        url: 'api/v1/workOrder/fetchCompletedWorkOrdersWithPayStatus',
        method: 'GET',
        params: { pageNumber, pageSize, sortBy, sortDir, searchText },
      }),
    }),

    getWorkOrderInvoices: builder.mutation({
      query: ({
        pageNumber,
        pageSize,
        sortBy,
        sortDir,
        searchText,
      }: {
        pageNumber?: number
        pageSize?: number
        sortBy?: string
        sortDir?: string
        searchText?: string
      }) => ({
        url: 'api/v1/workOrder/fetchWorkOrderInvoice',
        method: 'GET',
        params: { pageNumber, pageSize, sortBy, sortDir, searchText },
      }),
    }),

    //Edit WorkOrder
    updateWorkOrder: builder.mutation({
      query: ({ payload, id }: { payload: WorkOrderPayload; id: number }) => ({
        url: `api/v1/workOrder/${id}`,
        method: 'PUT',
        body: payload,
      }),
    }),

    //Approve WorkOrder
    approveWorkOrder: builder.mutation({
      query: ({ id, invoiceAmount }: { id: number; invoiceAmount: number }) => ({
        url: `api/v1/workOrder/approveWorkOrder/${id}`,
        method: 'PUT',
        params: { invoiceAmount },
      }),
    }),

    //Deny WorkOrder
    denyWorkOrder: builder.mutation({
      query: ({ id, reportProblem }: { id: number; reportProblem: string }) => ({
        url: `api/v1/workOrder/denyWorkOrder/${id}`,
        method: 'PUT',
        params: { reportProblem },
      }),
    }),

    //Delete Work Order
    deleteWorkOrder: builder.mutation({
      query: ({ id }: { id?: string }) => ({
        url: `api/v1/workOrder/${id}`,
        method: 'DELETE',
      }),
    }),

    //Upload Form
    uploadForm: builder.mutation({
      query: (payload: UploadPayload) => ({
        url: 'api/v1/form/uploadForm',
        method: 'POST',
        body: payload,
      }),
    }),

    //Get Form
    getForms: builder.mutation({
      query: ({
        pageNumber,
        pageSize,
        sortBy,
        sortDir,
        searchText,
      }: {
        pageNumber?: number
        pageSize?: number
        sortBy?: string
        sortDir?: string
        searchText?: string
      }) => ({
        url: 'api/v1/form/fetchForms',
        method: 'GET',
        params: { pageNumber, pageSize, sortBy, sortDir, searchText },
      }),
    }),

    //Download Form
    DownloadForm: builder.mutation({
      query: ({ id }: { id?: number }) => ({
        url: `api/v1/form/downloadForm/${id}`,
        'content/type': 'application/pdf',
        method: 'GET',
      }),
    }),

    //View Form
    getViewForm: builder.mutation({
      query: ({ id }: { id?: number }) => ({
        url: `api/v1/form/viewForm/${id}`,
        'content/type': 'application/pdf',
        method: 'GET',
      }),
    }),

    //Delete Form
    DeleteForm: builder.mutation({
      query: ({ id }: { id?: number }) => ({
        url: `api/v1/form/deleteForm/${id}`,
        method: 'DELETE',
      }),
    }),

    addEstimate: builder.mutation({
      query: (payload: WorkOrderPayload) => ({
        url: 'api/v1/estimate/',
        method: 'POST',
        body: payload,
      }),
    }),

    getEstimate: builder.mutation({
      query: ({
        page,
        size,
        sortBy,
        sortDir,
        searchText,
      }: {
        page?: number
        size?: number
        sortBy?: string
        sortDir?: string
        searchText?: string
      }) => ({
        url: 'api/v1/estimate/',
        method: 'GET',
        params: { page, size, sortBy, sortDir, searchText },
      }),
    }),

    updateEstimate: builder.mutation({
      query: ({ payload, id }: { payload: WorkOrderPayload; id: number }) => ({
        url: `api/v1/estimate/${id}`,
        method: 'PUT',
        body: payload,
      }),
    }),

    getConvertEstimateToWorkOrder: builder.mutation({
      query: ({ id }: { id?: number }) => ({
        url: `api/v1/estimate/convertEstimateToWorkOrder/${id}`,
        method: 'GET',
      }),
    }),

    DeleteEstimate: builder.mutation({
      query: ({ id }: { id?: string }) => ({
        url: `api/v1/estimate/${id}`,
        method: 'DELETE',
      }),
    }),

    savePayment: builder.mutation({
      query: ({
        payload,
        workOrderInvoiceId,
      }: {
        payload: PaymentPayload
        workOrderInvoiceId?: number
      }) => ({
        url: `api/v1/payment/${workOrderInvoiceId}`,
        method: 'POST',
        body: payload,
      }),
    }),
  }),
})

export const {
  useAddWorkOrderMutation,
  useGetWorkOrderByIdMutation,
  useGetCompletedWorkOrderWithPendingPayApprovalMutation,
  useGetWorkOrderInvoicesMutation,
  useDeleteWorkOrderMutation,
  useGetWorkOrdersMutation,
  useUpdateWorkOrderMutation,
  useApproveWorkOrderMutation,
  useDenyWorkOrderMutation,
  useUploadFormMutation,
  useGetFormsMutation,
  useDownloadFormMutation,
  useAddEstimateMutation,
  useUpdateEstimateMutation,
  useDeleteEstimateMutation,
  useGetEstimateMutation,
  useGetConvertEstimateToWorkOrderMutation,
  useSavePaymentMutation,
  useDeleteFormMutation,
  useGetViewFormMutation,
} = MoorserveApi
