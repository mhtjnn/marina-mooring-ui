import React from 'react'
import ForgotPassword from './Components/ForgotPassword/ForgotPassword'
import Dashboard from './Components/Dashboard/Dashboard'
import LoginMain from './Components/Login/LoginMain'
import ResetPassword from './Components/ResetPassword/ResetPassword'
import SignUp from './Components/SignUp/SignUp'
import AdminLayout from './Components/Layout/Admin/AdminLayout'
import Moorings from './Components/Moormanage/Moorings/Moorings'
import Vendors from './Components/Moormanage/Vendors/Vendors'
import Moormanage from './Components/Moormanage/MoorManage'
import Moorpay from './Components/Moorpay/MoorPay'
import Technicians from './Components/Moormanage/Technicians/Technicians'
import Boatyards from './Components/Moormanage/Boatyards/Boatyards'
import Reports from './Components/Moormanage/Reports/Reports'
import AccountPayable from './Components/Moorpay/AccountPayable/AccountPayable'
import AccountRecievable from './Components/Moorpay/AccountReceivable/AccountRecievable'
import ReportsMoorpay from './Components/Moorpay/Reports/Reports'
import MoorServe from './Components/Moorserve/MoorServe'
import WorkOrders from './Components/Moorserve/WorkOrders/workOrders'
import Estimates from './Components/Moorserve/Estimates/Estimates'
import TimeCards from './Components/Moorserve/TimeCards/TimeCards'
import Forms from './Components/Moorserve/Forms/Forms'
import ReportsMoorserve from './Components/Moorserve/Reports/ReportsMoorserve'
import Customer from './Components/Moormanage/Customer/Customer'
import Permission from './Components/AdminTools/CustomerAdmin'
import Admin from './Components/EmployeeManagement/Admin'

const routes = [
  {
    path: '',
    element: <LoginMain />,
  },
  {
    path: 'login',
    element: <LoginMain />,
  },
  {
    path: 'signup',
    element: <SignUp />,
  },
  {
    path: 'resetPassword',
    element: <ResetPassword />,
  },
  {
    path: 'forgotPassword',
    element: <ForgotPassword />,
  },
  {
    path: 'admin/login',
    element: <Admin />,
    children: [
      {
        path: 'permisiion',
        element: <Permission />,
      },
    ],
  },

  {
    path: '',
    element: <AdminLayout />,
    children: [
      {
        path: 'dashboard',
        element: <Dashboard />,
      },
      {
        path: 'moormanage',
        element: <Moormanage />,
        children: [
          {
            path: 'customer',
            element: <Customer />,
          },
          {
            path: 'mooring',
            element: <Moorings />,
          },
          {
            path: 'vendors',
            element: <Vendors />,
          },
          {
            path: 'technicians',
            element: <Technicians />,
          },
          {
            path: 'boatyards',
            element: <Boatyards />,
          },
          {
            path: 'reports',
            element: <Reports />,
          },
        ],
      },
      {
        path: 'moorpay',
        element: <Moorpay />,
        children: [
          {
            path: 'accountReceivable',
            element: <AccountRecievable />,
          },
          {
            path: 'accountPayable',
            element: <AccountPayable />,
          },
          {
            path: 'reports',
            element: <ReportsMoorpay />,
          },
        ],
      },
      {
        path: 'moorserve',
        element: <MoorServe />,
        children: [
          {
            path: 'workOrders',
            element: <WorkOrders/>,
          },
          {
            path: 'estimates',
            element: <Estimates />,
          },
          {
            path: 'timeCards',
            element: <TimeCards />,
          },
          {
            path: 'forms',
            element: <Forms />,
          },
          {
            path: 'reports',
            element: <ReportsMoorserve />,
          },
        ],
      },
      {
        path: 'customerAdmin',
        element: <Permission />,
      },
    ],
  },
]

export default routes
