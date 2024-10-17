import { userApi } from '../UserApi'
import {
  AddUserPayload,
  ForgotPasswordPayload,
  LoginPayload,
  ResetPasswordPayload,
  SignUpPayload,
  imageDataPayload,
} from '../../Type/ApiTypes'

const authApi = userApi.injectEndpoints({
  endpoints: (builder: any) => ({
    addUser: builder.mutation({
      query: ({
        payload,
        customerAdminId,
      }: {
        payload: AddUserPayload
        customerAdminId: number
      }) => ({
        url: 'api/v1/user/',
        method: 'POST',
        body: payload,
        params: { customerAdminId },
      }),
    }),

    login: builder.mutation({
      query: (payload: LoginPayload) => ({
        url: 'api/v1/auth/login',
        method: 'POST',
        body: payload,
      }),
      extraOptions: { requiresAuth: false },
    }),

    signup: builder.mutation({
      query: (payload: SignUpPayload) => ({
        url: 'v1/mmm/employees/saveEmployee',
        method: 'POST',
        body: payload,
      }),
    }),

    forgotPassword: builder.mutation({
      query: (payload: ForgotPasswordPayload) => ({
        url: 'api/v1/auth/forgetPassword',
        method: 'POST',
        body: payload,
      }),
    }),

    resetPassword: builder.mutation({
      query: ({ payload, token }: { payload: ResetPasswordPayload; token: string }) => ({
        url: 'api/v1/auth/resetPassword',
        method: 'POST',
        body: payload,
        params: { token },
      }),
    }),

    validateEmail: builder.mutation({
      query: ({ token }: { token: string }) => ({
        url: 'api/v1/auth/resetPassword',
        method: 'GET',
        params: { token },
      }),
    }),

    refreshToken: builder.mutation({
      query: ({ refreshToken }: { refreshToken: string }) => ({
        url: 'api/v1/auth/refresh',
        method: 'POST',
        params: { refreshToken },
      }),
    }),

    logout: builder.mutation({
      query: () => ({
        url: 'api/v1/auth/logout',
        method: 'POST',
      }),
    }),

    uploadProfileImage: builder.mutation({
      query: ({ payload, userId }: { payload: imageDataPayload; userId: number }) => ({
        url: `/api/v1/user/uploadImage/${userId}`,
        method: 'PUT',
        body: payload,
      }),
    }),
  }),
})

export const {
  useLoginMutation,
  useSignupMutation,
  useForgotPasswordMutation,
  useResetPasswordMutation,
  useValidateEmailMutation,
  useRefreshTokenMutation,
  useLogoutMutation,
  useUploadProfileImageMutation,
} = authApi
