import { useSelector } from 'react-redux'
import { selectUserRole } from '../../../Store/Slice/userSlice'

const SidebarMenu = () => {
  const role = useSelector(selectUserRole)
  let link
  let adminSubcategories

  switch (role) {
    case 2:
      link = '/permission'
      adminSubcategories = [
        {
          icon: '/assets/images/permission.svg',
          name: 'Users',
          link: '/permission',
        },
        {
          icon: '/assets/images/settings.svg',
          name: 'Settings',
          link: '/settings',
        },
      ]
      break

    default:
      link = '/customerAdmin'
      adminSubcategories = [
        {
          icon: '/assets/images/customerOwner.svg',
          name: 'Companies',
          link: '/customerAdmin',
        },
        {
          icon: '/assets/images/settings.svg',
          name: 'Settings',
          link: '/settings',
        },
      ]
      break
  }

  const moorPay = {
    icon: '/assets/images/moorpay.svg',
    name: 'MOORPAY',
    link: 'moorpay/accountReceivable',
    subcategories: [
      {
        icon: '/assets/images/accReceivable.svg',
        name: 'Account Receivable',
        link: 'moorpay/accountReceivable',
      },
      // {
      //   icon: '/assets/images/accPayable.svg',
      //   name: 'Account Payable',
      //   link: 'moorpay/accountPayable',
      // },
    ],
  }

  const moorServeMenu = {
    icon: '/assets/images/moorserve.svg',
    name: 'MOORSERVE',
    link: 'moorserve/workOrders',
    subcategories: [
      {
        icon: '/assets/images/forms.svg',
        name: 'Work Orders',
        link: 'moorserve/workOrders',
      },
      {
        icon: '/assets/images/estimates.svg',
        name: 'Estimates',
        link: 'moorserve/estimates',
      },
      {
        icon: '/assets/images/forms.svg',
        name: 'Forms',
        link: 'moorserve/forms',
      },
    ],
  }

  let menu = []

  if (role === 4) {
    // If role is TECHNICIAN, only show MOORSERVE
    menu = [moorServeMenu]
  } else if (role === 3) {
    // If role is FINANCE, only show MOORPAY
    menu = [moorPay]
  } else {
    menu = [
      {
        icon: '/assets/images/dashboard.svg',
        name: 'DASHBOARD',
        link: '/dashboard',
      },
      {
        icon: '/assets/images/ship.svg',
        name: 'MOORMANAGE',
        link: 'moormanage/customer',
        subcategories: [
          {
            icon: '/assets/images/customer.svg',
            name: 'Customer',
            link: 'moormanage/customer',
          },
          {
            icon: '/assets/images/moorings.svg',
            name: 'Moorings',
            link: 'moormanage/mooring',
          },
          {
            icon: '/assets/images/vendor.svg',
            name: 'Vendors',
            link: 'moormanage/vendors',
          },
          {
            icon: '/assets/images/technician.svg',
            name: 'Technicians',
            link: 'moormanage/technicians',
          },
          {
            icon: '/assets/images/boatYard.svg',
            name: 'Boatyards',
            link: 'moormanage/Boatyards',
          },
          {
            icon: '/assets/images/serviceAreaIcon.svg',
            name: 'Service Area',
            link: 'moormanage/serviceArea',
          },
        ],
      },
      {
        icon: '/assets/images/moorpay.svg',
        name: 'MOORPAY',
        link: 'moorpay/accountReceivable',
        subcategories: [
          {
            icon: '/assets/images/accReceivable.svg',
            name: 'Account Receivable',
            link: 'moorpay/accountReceivable',
          },
          // {
          //   icon: '/assets/images/accPayable.svg',
          //   name: 'Account Payable',
          //   link: 'moorpay/accountPayable',
          // },
        ],
      },
      {
        icon: '/assets/images/moorserve.svg',
        name: 'MOORSERVE',
        link: 'moorserve/workOrders',
        subcategories: [
          {
            icon: '/assets/images/forms.svg',
            name: 'Work Orders',
            link: 'moorserve/workOrders',
          },
          {
            icon: '/assets/images/estimates.svg',
            name: 'Estimates',
            link: 'moorserve/estimates',
          },
          {
            icon: '/assets/images/forms.svg',
            name: 'Forms',
            link: 'moorserve/forms',
          },
        ],
      },
      // {
      //   icon: '/assets/images/estimates.svg',
      //   name: 'REPORT',
      //   link: '/reports',
      // },
    ]
  }

  // Only add ADMIN TOOLS section if user is not FINANCE or TECHNICIAN
  if (role !== 3 && role !== 4) {
    menu.push({
      icon: '/assets/images/tools.svg',
      name: 'ADMIN TOOLS',
      link: link,
      subcategories: adminSubcategories,
    })
  }

  return menu
}

export default SidebarMenu
