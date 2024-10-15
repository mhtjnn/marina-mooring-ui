import React from 'react'
import { render, screen, waitFor } from '@testing-library/react'
import Vendors from './Vendors'
import { Provider } from 'react-redux'
import { store } from '../../../Store/Store'
import { BrowserRouter } from 'react-router-dom'
import { JSX } from 'react/jsx-runtime'

const renderWithProvider = (
  ui: string | number | boolean | JSX.Element | Iterable<React.ReactNode> | null | undefined,
) => {
  return render(
    <Provider store={store}>
      <BrowserRouter>{ui}</BrowserRouter>
    </Provider>,
  )
}
const columnStyle = {
  backgroundColor: '#00426F',
  color: '#FFFFFF',
  fontWeight: '700',
  fontSize: '12px',
}
const VendorColumns = [
  {
    id: 'vendorName',
    label: 'Vendor Name',
    style: {
      ...columnStyle,
      borderTopLeftRadius: '10px',
    },
  },
  {
    id: 'companyPhoneNumber',
    label: 'Phone Number',
    style: columnStyle,
    className: 'phone',
  },
  {
    id: 'companyEmail',
    label: 'Email Address',
    style: columnStyle,
    className: 'email',
  },
  {
    id: 'inventoryItems',
    label: 'Inventory Items',
    style: columnStyle,
  },
]

describe('Vendors Component', () => {
  it('renders the component with header and search input', () => {
    renderWithProvider(<Vendors />)
    expect(screen.getByText('MOORMANAGE/Vendor')).toBeInTheDocument()
  })

  it('renders headers correctly in DataTable', () => {
    renderWithProvider(<Vendors />)
    VendorColumns.forEach((column) => {
      const headerElement = screen.getByText(column.label)
      expect(headerElement).toBeInTheDocument()
    })
  })

  it('renders "ADD NEW" button', () => {
    renderWithProvider(<Vendors />)
    const addButton = screen.getByText('ADD NEW')
    expect(addButton).toBeInTheDocument()
  })

  it('should renders InputTextWithHeader', () => {
    renderWithProvider(<Vendors />)

    const toCalendar = screen.getByPlaceholderText('Search')
    expect(toCalendar).toBeInTheDocument()
  })

  test('renders DataTable ', async () => {
    renderWithProvider(<Vendors />)
    await waitFor(() => {
      const dataTable = screen.getByTestId('customer')
      expect(dataTable).toBeInTheDocument()
    })
  })

  test('renders progress ', async () => {
    renderWithProvider(<Vendors />)
    await waitFor(() => {
      const dataTable = screen.getByTestId('progress')
      expect(dataTable).toBeInTheDocument()
    })
  })

  it('should renders DataTable paginator  ', () => {
    renderWithProvider(<Vendors />)
    const technician = screen.getByTestId('PaginatorOne')
    expect(technician).toBeInTheDocument()
  })
})
