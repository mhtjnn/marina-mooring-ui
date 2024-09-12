import { createSlice, PayloadAction } from '@reduxjs/toolkit'
import { RootState } from '../Store'
import { UserData } from '../../Type/ApiTypes'
import { InitialState } from '../../Type/CommonType'

export const userSlice = createSlice({
  name: 'user',
  initialState: {} as InitialState,
  reducers: {
    setUserData: (state, action: PayloadAction<UserData>) => {
      const data = action.payload
      state.userData = data
    },
    setLogout: () => {
      return {} as InitialState
    },
  },
})

export const { setLogout, setUserData } = userSlice.actions
export default userSlice.reducer
export const token = (state: RootState) => state?.user?.token
