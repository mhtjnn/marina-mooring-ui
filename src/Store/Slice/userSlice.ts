import { createSlice, PayloadAction } from '@reduxjs/toolkit'
import { RootState } from '../Store'
import { InitialState } from '../../Type/CommonType'
import { UserData } from '../../Type/ApiTypes'

export const userSlice = createSlice({
  name: 'user',
  initialState: {} as InitialState,
  reducers: {
    setUserData: (state, action: PayloadAction<UserData>) => {
      const data = action.payload
      state.userData = data
    },
    setToken: (state, action: PayloadAction<string>) => {
      const data = action.payload
      state.token = data
    },
    setOpen: (state, action: PayloadAction<boolean>) => {
      state.isOpen = action.payload
    },
    toggleSidebar: (state) => {
      state.sidebar.isOpen = !state.sidebar.isOpen
    },
    setCustomerId: (state, action: PayloadAction<string>) => {
      state.customerId = action.payload
    },
    setCustomerName: (state, action: PayloadAction<string>) => {
      state.customerName = action.payload
    },
    setLogout: () => {
      return {} as InitialState
    },
  },
})

export const {
  setLogout,
  setUserData,
  setOpen,
  toggleSidebar,
  setToken,
  setCustomerId,
  setCustomerName,
} = userSlice.actions

export const selectSidebar = (state: RootState) => state.user.sidebar
export const selectCustomerId = (state: RootState) => state.user.customerId
export const selectCustomerName = (state: RootState) => state.user.customerName
export const selectUserRole = (state: RootState) => state.user.userData?.role?.id

export default userSlice.reducer
