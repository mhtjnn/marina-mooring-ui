import { UploadPayload, WorkOrderPayload } from "../../Type/ApiTypes";
import { userApi } from "../UserApi";

const moorserveApi = userApi.injectEndpoints({
  endpoints: (builder: any) => ({
    //ADD Work Order
    addWorkOrder: builder.mutation({
      query: (payload: WorkOrderPayload) => ({
        url: "api/v1/workorder/",
        method: "POST",
        body: payload,
      }),
    }),

    //Get Work Order By Id
    getWorkOrderById: builder.mutation({
      query: ({ id }: { id?: string }) => ({
        url: `api/v1/workorder/${id}`,
        method: "GET",
      }),
    }),

    //Get WorkOrders
    getWorkOrders: builder.mutation({
      query: ({
        pageNumber,
        pageSize,
        sortBy,
        sortDir,
      }: {
        pageNumber?: number;
        pageSize?: number;
        sortBy?: string;
        sortDir?: string;
      }) => ({
        url: "api/v1/workorder/",
        method: "GET",
        params: { pageNumber, pageSize, sortBy, sortDir },
      }),
    }),

    //Edit WorkOrder
    updateWorkOrder: builder.mutation({
      query: ({ payload, id }: { payload: WorkOrderPayload; id: number }) => ({
        url: `api/v1/workorder/${id}`,
        method: "PUT",
        body: payload,
      }),
    }),

    //Delete Work Order
    deleteWorkOrder: builder.mutation({
      query: ({ id }: { id?: string }) => ({
        url: `api/v1/workorder/${id}`,
        method: "DELETE",
      }),
    }),

    //Upload Form
    uploadForm: builder.mutation({
      query: (payload: UploadPayload) => ({
        url: "api/v1/form/upload",
        method: "POST",
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
      }: {
        pageNumber?: number;
        pageSize?: number;
        sortBy?: string;
        sortDir?: string;
      }) => ({
        url: "api/v1/form/",
        method: "GET",
        params: { pageNumber, pageSize, sortBy, sortDir },
      }),
    }),

    //Download Form
    DownloadForm: builder.mutation({
      query: ({ filename }: { filename?: string }) => ({
        url: `api/v1/form/download/${filename}`,
        method: "GET",
      }),
    }),
  }),
});

export const {
  useAddWorkOrderMutation,
  useGetWorkOrderByIdMutation,
  useDeleteWorkOrderMutation,
  useGetWorkOrdersMutation,
  useUpdateWorkOrderMutation,
  useUploadFormMutation,
  useGetFormsMutation,
  useDownloadFormMutation,
} = moorserveApi;
