import React from 'react'
import { fireEvent, render, screen, waitFor, within } from '@testing-library/react'
import Vendors from './Vendors'
import { Provider } from 'react-redux'
import { store } from '../../../Store/Store'
import { BrowserRouter } from 'react-router-dom'
import { JSX } from 'react/jsx-runtime'
import AddVendor from './AddVendor'
import { VendorPayload } from '../../../Type/ApiTypes'
import InputComponent from '../../CommonComponent/InputComponent'
import { Dropdown } from 'primereact/dropdown'
import { InputText } from 'primereact/inputtext'
import userEvent from '@testing-library/user-event'
import AddInventory from './AddInventory'

const renderWithProvider = (
  ui: string | number | boolean | JSX.Element | Iterable<React.ReactNode> | null | undefined,
) => {
  return render(
    <Provider store={store}>
      <BrowserRouter>{ui}</BrowserRouter>
    </Provider>,
  )
}

const data: any = {
  message: 'List of vendors in the database',
  status: 200,
  errorList: null,
  time: 1720524953679,
  currentSize: 1,
  totalSize: 1,
  content: [
    {
      id: 1,
      companyName: 'ghfh',
      companyPhoneNumber: '8585858585',
      website: 'https://www.w3schools.com/',
      street: 'fdgdf',
      aptSuite: 'fgdgdf',
      stateResponseDto: {
        id: 1,
        name: 'Alabama',
        label: 'Alabama',
      },
      countryResponseDto: {
        id: 1,
        name: 'Afghanistan',
        label: 'Afghanistan',
      },
      zipCode: '6545645',
      companyEmail: 'fdg@gmail.ocm',
      accountNumber: '654564645',
      remitStreet: 'gfdgfd',
      remitApt: 'gfdgfdg',
      remitStateResponseDto: {
        id: 1,
        name: 'Alabama',
        label: 'Alabama',
      },
      remitCountryResponseDto: {
        id: 1,
        name: 'Afghanistan',
        label: 'Afghanistan',
      },
      remitZipCode: '3546',
      remitEmailAddress: 'vbn@gmail.com',
      firstName: 'ghfh',
      lastName: 'fghfg',
      salesRepPhoneNumber: '8585858585',
      salesRepEmail: 'vbnv@gmail.com',
      salesRepNote: 'fdgfdgfdg',
      userId: 2,
      inventoryItems: 1,
    },
  ],
}

describe('Vendors Component', () => {
  it('renders the component with header and search input', () => {
    renderWithProvider(
      <AddInventory id={2} closeModal={()=>{} } getInventoryHandler={()=>{}} editMode={false} selectedInventory={undefined}/>,
    )
    // expect(screen.getByText(/website/i)).toBeInTheDocument()
    // expect(screen.getByText(/company name/i)).toBeInTheDocument()
    // expect(screen.getByText(/remit address/i)).toBeInTheDocument()
    // expect(screen.getByText('Address')).toBeInTheDocument()
    // expect(screen.getByText('Account Number')).toBeInTheDocument()
    // expect(screen.getByText('Sales Representative')).toBeInTheDocument()
    // expect(screen.getByText('First Name')).toBeInTheDocument()
    // expect(screen.getByText('Last Name')).toBeInTheDocument()
  })
})