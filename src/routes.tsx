import Dashboard from './Components/Dashboard/Dashboard'
import ResetPassword from './Components/ResetPassword/ResetPassword'
import AdminLayout from './Components/Layout/Admin/AdminLayout'
import Moorings from './Components/Moormanage/Moorings/Moorings'
import Vendors from './Components/Moormanage/Vendors/Vendors'
import Moormanage from './Components/Moormanage/MoorManage'
import Moorpay from './Components/Moorpay/MoorPay'
import Technicians from './Components/Moormanage/Technicians/Technicians'
import Boatyards from './Components/Moormanage/Boatyards/Boatyards'
import AccountRecievable from './Components/Moorpay/AccountReceivable/AccountRecievable'
import MoorServe from './Components/Moorserve/MoorServe'
import WorkOrders from './Components/Moorserve/WorkOrders/workOrders'
import Estimates from './Components/Moorserve/Estimates/Estimates'
import Forms from './Components/Moorserve/Forms/Forms'
import Customer from './Components/Moormanage/Customer/Customer'
import Permission from './Components/AdminTools/Permission'
import LoginForm from './Components/Login/LoginForm'
import CustomerAdmin from './Components/AdminTools/Companies'
import InventoryDetails from './Components/Moormanage/Vendors/InventoryDetails'
import Settings from './Components/AdminTools/Settings'
import ServiceArea from './Components/Moormanage/ServiceArea/ServiceArea'
import ForgotPassword from './Components/ForgotPassword/ForgotPassword'

import AuthGuard from './ AuthGuard'
const routes = [
  {
    path: '',
    element: <LoginForm />,
  },
  {
    path: 'login',
    element: <LoginForm />,
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
    element: (
      <AuthGuard>
        <AdminLayout />
      </AuthGuard>
    ),
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
            path: 'inventoryDetails',
            element: <InventoryDetails />,
          },
          {
            path: 'technicians',
            element: <Technicians />,
          },
          {
            path: 'Boatyards',
            element: <Boatyards />,
          },
          {
            path: 'serviceArea',
            element: <ServiceArea />,
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
        ],
      },
      {
        path: 'moorserve',
        element: <MoorServe />,
        children: [
          {
            path: 'workOrders',
            element: <WorkOrders />,
          },
          {
            path: 'estimates',
            element: <Estimates />,
          },
          {
            path: 'forms',
            element: <Forms />,
          },
        ],
      },
      {
        path: 'customerAdmin',
        element: <CustomerAdmin />,
      },
      {
        path: 'permission',
        element: <Permission />,
      },
      {
        path: 'settings',
        element: <Settings />,
      },
    ],
  },
]

export default routes
