import {
  BoatYardPayload,
  ServiceAreaPayload,
  CustomerPayload,
  ImagePayload,
  InventoryPayload,
  MooringPayload,
  TechnicianPayload,
  UpdateMooringPayload,
  VendorPayload,
} from '../../Type/ApiTypes'
import { userApi } from '../UserApi'

const moormanageApi = userApi.injectEndpoints({
  endpoints: (builder: any) => ({
    //Customer API
    addCustomer: builder.mutation({
      query: (payload: CustomerPayload) => ({
        url: 'api/v1/customer/',
        method: 'POST',
        body: payload,
      }),
    }),

    getCustomer: builder.mutation({
      query: ({
        pageNumber,
        pageSize,
        sortBy,
        sortDir,
        searchText,
        customerOwnerId,
      }: {
        pageNumber?: number
        pageSize?: number
        sortBy?: string
        sortDir?: string
        searchText?: string
        customerOwnerId?: number
      }) => ({
        url: 'api/v1/customer/',
        method: 'GET',
        params: { pageNumber, pageSize, sortBy, sortDir, searchText, customerOwnerId },
      }),
    }),

    deleteCustomer: builder.mutation({
      query: ({ id }: { id?: number }) => ({
        url: `api/v1/customer/${id}`,
        method: 'DELETE',
      }),
    }),

    updateCustomer: builder.mutation({
      query: ({ payload, id }: { payload: CustomerPayload; id: number }) => ({
        url: `api/v1/customer/${id}`,
        method: 'PUT',
        body: payload,
      }),
    }),

    //Mooring API
    addMoorings: builder.mutation({
      query: (payload: MooringPayload) => ({
        url: 'api/v1/mooring/',
        method: 'POST',
        body: payload,
      }),
    }),

    getMoorings: builder.mutation({
      query: ({
        pageNumber,
        pageSize,
        sortBy,
        sortDir,
        searchText,
        customerOwnerId,
      }: {
        pageNumber?: number
        pageSize?: number
        sortBy?: string
        sortDir?: string
        searchText?: string
        customerOwnerId?: number
      }) => ({
        url: 'api/v1/mooring/',
        method: 'GET',
        params: { pageNumber, pageSize, sortBy, sortDir, searchText, customerOwnerId },
      }),
    }),

    deleteMoorings: builder.mutation({
      query: ({ id }: { id?: number }) => ({
        url: `api/v1/mooring/${id}`,
        method: 'DELETE',
      }),
    }),

    getMooringById: builder.mutation({
      query: ({ id }: { id: number }) => ({
        url: `api/v1/mooring/${id}`,
        method: 'GET',
        // params: { id },
      }),
    }),

    updateMoorings: builder.mutation({
      query: ({ payload, id }: { payload: UpdateMooringPayload; id: number }) => ({
        url: `api/v1/mooring/${id}`,
        method: 'PUT',
        body: payload,
      }),
    }),

    // Vendor API
    addVendors: builder.mutation({
      query: (payload: VendorPayload) => ({
        url: 'api/v1/vendor/',
        method: 'POST',
        body: payload,
      }),
    }),

    getVendors: builder.mutation({
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
        url: 'api/v1/vendor/',
        method: 'GET',
        params: { pageNumber, pageSize, sortBy, sortDir, searchText },
      }),
    }),

    getVendorById: builder.mutation({
      query: ({ id }: { id: number }) => ({
        url: `api/v1/vendor/${id}`,
        method: 'GET',
      }),
    }),

    deleteVendor: builder.mutation({
      query: ({ id }: { id?: number }) => ({
        url: `api/v1/vendor/${id}`,
        method: 'DELETE',
      }),
    }),

    updateVendor: builder.mutation({
      query: ({ payload, id }: { payload: VendorPayload; id: number }) => ({
        url: `api/v1/vendor/${id}`,
        method: 'PUT',
        body: payload,
      }),
    }),

    // ServiceArea API
    addServiceArea: builder.mutation({
      query: (payload: ServiceAreaPayload) => ({
        url: '/api/v1/serviceArea/',
        method: 'POST',
        body: payload,
      }),
    }),

    getServiceArea: builder.mutation({
      query: ({
        pageNumber,
        pageSize,
        sortBy,
        sortDir,
        searchText,
        customerOwnerId,
      }: {
        pageNumber?: number
        pageSize?: number
        sortBy?: string
        sortDir?: string
        searchText?: string
        customerOwnerId?: number | null
      }) => ({
        url: 'api/v1/serviceArea/',
        method: 'GET',
        params: { pageNumber, pageSize, sortBy, sortDir, searchText, customerOwnerId },
      }),
    }),

    deleteServiceArea: builder.mutation({
      query: ({ id }: { id?: number }) => ({
        url: `api/v1/serviceArea/${id}`,
        method: 'DELETE',
      }),
    }),

    updateServiceArea: builder.mutation({
      query: ({ payload, id }: { payload: ServiceAreaPayload; id: number }) => ({
        url: `api/v1/serviceArea/${id}`,
        method: 'PUT',
        body: payload,
      }),
    }),

    // Boatyards API
    addBoatyards: builder.mutation({
      query: (payload: BoatYardPayload) => ({
        url: 'api/v1/boatyard/',
        method: 'POST',
        body: payload,
      }),
    }),

    getBoatyards: builder.mutation({
      query: ({
        pageNumber,
        pageSize,
        sortBy,
        sortDir,
        searchText,
        customerOwnerId,
      }: {
        pageNumber?: number
        pageSize?: number
        sortBy?: string
        sortDir?: string
        searchText?: string
        customerOwnerId?: number | null
      }) => ({
        url: 'api/v1/boatyard/',
        method: 'GET',
        params: { pageNumber, pageSize, sortBy, sortDir, searchText, customerOwnerId },
      }),
    }),

    deleteBoatyards: builder.mutation({
      query: ({ id }: { id?: number }) => ({
        url: `api/v1/boatyard/${id}`,
        method: 'DELETE',
      }),
    }),

    updateBoatyards: builder.mutation({
      query: ({ payload, id }: { payload: BoatYardPayload; id: number }) => ({
        url: `api/v1/boatyard/${id}`,
        method: 'PUT',
        body: payload,
      }),
    }),

    // Technician API
    addTechnician: builder.mutation({
      query: (payload: TechnicianPayload) => ({
        url: 'api/v1/technician/',
        method: 'POST',
        body: payload,
      }),
    }),

    getTechnician: builder.mutation({
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
        url: 'api/v1/technician/',
        method: 'GET',
        params: { pageNumber, pageSize, sortBy, sortDir },
      }),
    }),

    getTechnicianById: builder.mutation({
      query: ({ id }: { id?: number }) => ({
        url: `api/v1/technician/${id}`,
        method: 'GET',
      }),
    }),

    deleteTechnician: builder.mutation({
      query: ({ id }: { id?: number }) => ({
        url: `api/v1/technician/${id}`,
        method: 'DELETE',
      }),
    }),

    updateTechnician: builder.mutation({
      query: ({ payload, id }: { payload: TechnicianPayload; id: number }) => ({
        url: `api/v1/technician/${id}`,
        method: 'PUT',
        body: payload,
      }),
    }),

    //FetchCustomersWithMooring
    getCustomersWithMooring: builder.mutation({
      query: ({
        id,
        pageNumber,
        pageSize,
        sortBy,
        sortDir,
        customerOwnerId,
      }: {
        id?: number
        pageNumber?: number
        pageSize?: number
        sortBy?: string
        sortDir?: string
        customerOwnerId?: number
      }) => ({
        url: `api/v1/customer/fetchCustomerWithMoorings/${id}`,
        method: 'GET',
        params: { pageNumber, pageSize, sortBy, sortDir, customerOwnerId },
      }),
    }),

    getMooringWithBoatyard: builder.mutation({
      query: ({
        id,
        pageNumber,
        pageSize,
      }: {
        id?: number
        pageNumber?: number
        pageSize?: number
      }) => ({
        url: `api/v1/boatyard/fetchMooringsWithBoatyard/${id}`,
        method: 'GET',
        params: { pageNumber, pageSize },
      }),
    }),

    getMooringWithServiceArea: builder.mutation({
      query: ({
        id,
        pageNumber,
        pageSize,
      }: {
        id?: number
        pageNumber?: number
        pageSize?: number
      }) => ({
        url: `api/v1/serviceArea/fetchMooringsWithServiceArea/${id}`,
        method: 'GET',
        params: { pageNumber, pageSize },
      }),
    }),

    //Inventory Details
    getInventoryDetails: builder.mutation({
      query: ({
        pageNumber,
        pageSize,
        sortBy,
        sortDir,
        searchText,
        vendorId,
      }: {
        pageNumber?: number
        pageSize?: number
        sortBy?: string
        sortDir?: string
        searchText?: string
        vendorId: number
      }) => ({
        url: 'api/v1/inventory/',
        method: 'GET',
        params: { pageNumber, pageSize, sortBy, sortDir, searchText, vendorId },
      }),
    }),

    deleteInventory: builder.mutation({
      query: ({ vendorId, id }: { vendorId: number; id: number }) => ({
        url: `api/v1/inventory/${id}`,
        method: 'DELETE',
        params: { vendorId },
      }),
    }),

    addInventory: builder.mutation({
      query: ({ vendorId, payload }: { vendorId: number; payload: InventoryPayload }) => ({
        url: 'api/v1/inventory/',
        method: 'POST',
        body: payload,
        params: { vendorId },
      }),
    }),

    updateInventory: builder.mutation({
      query: ({
        vendorId,
        payload,
        id,
      }: {
        vendorId: number
        payload: InventoryPayload
        id: number
      }) => ({
        url: `api/v1/inventory/${id}`,
        method: 'PUT',
        body: payload,
        params: { vendorId },
      }),
    }),

    getTechnicianData: builder.mutation({
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
        url: '/api/v1/user/fetchTechnicians',
        method: 'GET',
        params: { pageNumber, pageSize, sortBy, sortDir, searchText },
      }),
    }),

    getOpenWorkOrders: builder.mutation({
      query: ({
        technicianId,
        pageNumber,
        pageSize,
        sortBy,
        sortDir,
        searchText,
        filterDateFrom,
        filterDateTo,
      }: {
        technicianId?: number
        pageNumber?: number
        pageSize?: number
        sortBy?: string
        sortDir?: string
        searchText?: string
        filterDateTo?: string
        filterDateFrom?: string
      }) => ({
        url: `api/v1/workOrder/fetchOpenWorkOrders/${technicianId}`,
        method: 'GET',
        params: { pageNumber, pageSize, sortBy, sortDir, searchText, filterDateFrom, filterDateTo },
      }),
    }),

    getClosedWorkOrders: builder.mutation({
      query: ({
        technicianId,
        pageNumber,
        pageSize,
        sortBy,
        sortDir,
        searchText,
        filterDateFrom,
        filterDateTo,
      }: {
        technicianId?: number
        pageNumber?: number
        pageSize?: number
        sortBy?: string
        sortDir?: string
        searchText?: string
        filterDateTo?: string
        filterDateFrom?: string
      }) => ({
        url: `api/v1/workOrder/fetchCloseWorkOrders/${technicianId}`,
        method: 'GET',
        params: { pageNumber, pageSize, sortBy, sortDir, searchText, filterDateFrom, filterDateTo },
      }),
    }),

    getAllOpenWorkOrders: builder.mutation({
      query: ({
        pageNumber,
        pageSize,
        sortBy,
        sortDir,
        searchText,
        filterDateFrom,
        filterDateTo,
      }: {
        pageNumber?: number
        pageSize?: number
        sortBy?: string
        sortDir?: string
        searchText?: string
        filterDateTo?: string
        filterDateFrom?: string
      }) => ({
        url: `api/v1/workOrder/fetchAllOpenWorkOrders`,
        method: 'GET',
        params: { pageNumber, pageSize, sortBy, sortDir, searchText, filterDateFrom, filterDateTo },
      }),
    }),

    getMooringsDueForService: builder.mutation({
      query: () => ({
        url: 'api/v1/mooring/fetchMooringDueForService',
        method: 'GET',
        params: {},
      }),
    }),

    getAllOpenWorkOrdersAndMooringDueForService: builder.mutation({
      query: ({
        pageNumber,
        pageSize,
        sortBy,
        sortDir,
        filterDateFrom,
        filterDateTo,
      }: {
        pageNumber?: number
        pageSize?: number
        sortBy?: string
        sortDir?: string
        filterDateFrom: string
        filterDateTo: string
      }) => ({
        url: `/api/v1/workOrder/fetchAllOpenWorkOrdersAndMooringDueForService`,
        method: 'GET',
        params: { pageNumber, pageSize, sortBy, sortDir, filterDateFrom, filterDateTo },
      }),
    }),

    updateImage: builder.mutation({
      query: ({
        id,
        entityId,
        entity,
        payload,
      }: {
        id: number
        entityId: number
        entity: string
        payload: ImagePayload
      }) => ({
        url: `api/v1/image/editImage/${id}/${entityId}`,
        method: 'PUT',
        body: payload,
        params: { entity },
      }),
    }),

    getCustomerWithMooringWithCustomerImages: builder.mutation({
      query: ({
        id,
        pageNumber,
        pageSize,
        sortBy,
        sortDir,
      }: {
        id: number
        pageNumber?: number
        pageSize?: number
        sortBy?: string
        sortDir?: string
      }) => ({
        url: `/api/v1/customer/fetchCustomerWithMooringsWithCustomerImages/${id}`,
        method: 'GET',
        params: { id, pageNumber, pageSize, sortBy, sortDir },
      }),
    }),

    getCustomerWithMooringWithMooringImages: builder.mutation({
      query: ({
        id,
        pageNumber,
        pageSize,
        sortBy,
        sortDir,
      }: {
        id: number
        pageNumber?: number
        pageSize?: number
        sortBy?: string
        sortDir?: string
      }) => ({
        url: `/api/v1/customer/fetchCustomerWithMooringsWithMooringImages/${id}`,
        method: 'GET',
        params: { id, pageNumber, pageSize, sortBy, sortDir },
      }),
    }),
  }),
})

export const {
  useGetCustomerMutation,
  useAddCustomerMutation,
  useDeleteCustomerMutation,
  useUpdateCustomerMutation,
  useAddMooringsMutation,
  useGetMooringsMutation,
  useDeleteMooringsMutation,
  useUpdateMooringsMutation,
  useAddVendorsMutation,
  useGetVendorsMutation,
  useGetVendorByIdMutation,
  useDeleteVendorMutation,
  useUpdateVendorMutation,
  useAddServiceAreaMutation,
  useGetServiceAreaMutation,
  useDeleteServiceAreaMutation,
  useUpdateServiceAreaMutation,
  useAddBoatyardsMutation,
  useDeleteBoatyardsMutation,
  useUpdateBoatyardsMutation,
  useGetBoatyardsMutation,
  useAddTechnicianMutation,
  useGetTechnicianMutation,
  useDeleteTechnicianMutation,
  useUpdateTechnicianMutation,
  useGetTechnicianByIdMutation,
  useGetCustomersWithMooringMutation,
  useGetMooringWithBoatyardMutation,
  useGetMooringWithServiceAreaMutation,
  useGetInventoryDetailsMutation,
  useDeleteInventoryMutation,
  useAddInventoryMutation,
  useUpdateInventoryMutation,
  useGetTechnicianDataMutation,
  useGetOpenWorkOrdersMutation,
  useGetClosedWorkOrdersMutation,
  useGetMooringsDueForServiceMutation,
  useGetAllOpenWorkOrdersMutation,
  useGetAllOpenWorkOrdersAndMooringDueForServiceMutation,
  useUpdateImageMutation,
  useGetCustomerWithMooringWithCustomerImagesMutation,
  useGetCustomerWithMooringWithMooringImagesMutation,
  useGetMooringByIdMutation,
} = moormanageApi
