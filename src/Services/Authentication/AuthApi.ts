import { userApi } from "../UserApi";
import {
  ForgotPasswordPayload,
  LoginPayload,
  ResetPasswordPayload,
  SignUpPayload,
  UserLoginPayload,
} from "../../Type/ApiTypes";

const authApi = userApi.injectEndpoints({
  endpoints: (builder: any) => ({
    userLogin: builder.mutation({
      query: (payload: UserLoginPayload) => ({
        url: "api/v1/user/",
        method: "POST",
        body: payload,
      }),
    }),

    login: builder.mutation({
      query: (payload: LoginPayload) => ({
        url: "api/v1/auth/login",
        method: "POST",
        body: payload,
      }),
    }),

    signup: builder.mutation({
      query: (payload: SignUpPayload) => ({
        url: "v1/mmm/employees/saveEmployee",
        method: "POST",
        body: payload,
      }),
    }),

    getEmployee: builder.mutation({
      query: () => ({
        url: "api/v1/users",
        method: "GET",
      }),
    }),

    forgotPassword: builder.mutation({
      query: (payload: ForgotPasswordPayload) => ({
        url: "api/v1/auth/forgetPassword",
        method: "POST",
        body: payload,
      }),
    }),

    resetPassword: builder.mutation({
      query: ({
        payload,
        token,
      }: {
        payload: ResetPasswordPayload;
        token: string;
      }) => ({
        url: "api/v1/auth/resetPassword",
        method: "POST",
        body: payload,
        params: { token },
      }),
    }),

    validateEmail: builder.mutation({
      query: ({ token }: { token: string }) => ({
        url: "api/v1/auth/resetPassword",
        method: "GET",
        params: { token },
      }),
    }),
  }),
});

export const {
  useLoginMutation,
  useSignupMutation,
  useForgotPasswordMutation,
  useResetPasswordMutation,
  useGetEmployeeMutation,
  useValidateEmailMutation,
} = authApi;
