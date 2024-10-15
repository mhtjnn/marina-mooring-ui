import { createSlice, PayloadAction, createAsyncThunk } from '@reduxjs/toolkit'
import { CustomerPayload, GetUserResponse, ErrorResponse } from '../../Type/ApiTypes'
import { useGetUsersMutation } from '../../Services/AdminTools/AdminToolsApi'

export const fetchCustomers = createAsyncThunk('customers/fetchCustomers', async () => {
  const [getUser] = useGetUsersMutation()
  const response = await getUser({}).unwrap()
  //   return response?.content
})

interface CustomerState {
  customers: CustomerPayload[]
  status: 'idle' | 'loading' | 'succeeded' | 'failed'
  error: string | null
}

const initialState: CustomerState = {
  customers: [],
  status: 'idle',
  error: null,
}

const customerSlice = createSlice({
  name: 'customers',
  initialState,
  reducers: {},
  //   extraReducers: (builder) => {
  //     builder
  //       .addCase(fetchCustomers.pending, (state) => {
  //         state.status = 'loading'
  //       })
  //       .addCase(fetchCustomers.fulfilled, (state, action: PayloadAction<CustomerPayload[]>) => {
  //         state.status = 'succeeded'
  //         state.customers = action.payload
  //       })
  //       .addCase(fetchCustomers.rejected, (state, action) => {
  //         state.status = 'failed'
  //         state.error = action.error.message || 'Failed to fetch customers'
  //       })
  //   },
})

export default customerSlice.reducer
