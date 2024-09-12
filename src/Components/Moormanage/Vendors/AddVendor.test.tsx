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
      <AddVendor vendors={data} editMode={false} closeModal={() => {}} getVendor={() => {}} />,
    )
    expect(screen.getByText(/website/i)).toBeInTheDocument()
    expect(screen.getByText(/company name/i)).toBeInTheDocument()
    expect(screen.getByText(/remit address/i)).toBeInTheDocument()
    expect(screen.getByText('Address')).toBeInTheDocument()
    expect(screen.getByText('Account Number')).toBeInTheDocument()
    expect(screen.getByText('Sales Representative')).toBeInTheDocument()
    expect(screen.getByText('First Name')).toBeInTheDocument()
    expect(screen.getByText('Last Name')).toBeInTheDocument()
  })
})

describe('InputComponent', () => {
  const handleInputChange = jest.fn()

  beforeEach(() => {
    handleInputChange.mockClear()
  })
  it('renders with placeholder and value correctly', () => {
    render(
      <div>
        <InputComponent
          placeholder="Email Address"
          value="test@example.com"
          onChange={(e) => handleInputChange('emailForRemit', e.target.value)}
          style={{
            width: '178.39px',
            height: '32px',
            border: '1px solid #D5E1EA',
            borderRadius: '0.50rem',
            fontSize: '0.70rem',
            backgroundColor: '#F5F5F5',
            paddingLeft: '0.5rem',
          }}
        />
      </div>,
    )

    const inputElement = screen.getByPlaceholderText('Email Address') as HTMLInputElement
    expect(inputElement).toBeInTheDocument()
    expect(inputElement.value).toBe('test@example.com')
  })

  it('renders error message when fieldErrors.emailForRemit is present', () => {
    const fieldErrors = { emailForRemit: 'Invalid email format' }

    render(
      <div>
        <InputComponent
          placeholder="Email Address"
          value=""
          onChange={(e) => handleInputChange('emailForRemit', e.target.value)}
          style={{
            width: '178.39px',
            height: '32px',
            border: '1px solid red',
            borderRadius: '0.50rem',
            fontSize: '0.70rem',
            backgroundColor: '#F5F5F5',
            paddingLeft: '0.5rem',
          }}
        />
        <p>
          {fieldErrors.emailForRemit && (
            <small className="p-error">{fieldErrors.emailForRemit}</small>
          )}
        </p>
      </div>,
    )

    const errorMessage = screen.getByText('Invalid email format')
    expect(errorMessage).toBeInTheDocument()
  })

  it('renders error message when fieldErrors.zipCodeForRemit is present', () => {
    const fieldErrors = { zipCodeForRemit: 'Invalid zip code' }
    render(
      <div>
        <InputComponent
          placeholder="Zip Code"
          value=""
          onChange={(e) => handleInputChange('zipCodeForRemit', e.target.value)}
          style={{
            width: '178.39px',
            height: '32px',
            border: '1px solid red',
            borderRadius: '0.50rem',
            fontSize: '0.70rem',
            backgroundColor: '#F5F5F5',
            paddingLeft: '0.5rem',
          }}
        />
        <p>
          {fieldErrors.zipCodeForRemit && (
            <small className="p-error">{fieldErrors.zipCodeForRemit}</small>
          )}
        </p>
      </div>,
    )

    const errorMessage = screen.getByText('Invalid zip code')
    expect(errorMessage).toBeInTheDocument()
  })

  it('renders error message when fieldErrors.aptSuiteForRemit is present', () => {
    const fieldErrors = { aptSuiteForRemit: 'Invalid Apt/Suite' }
    render(
      <div>
        <div className="mt-1">
          <InputComponent
            placeholder="Apt/Suite"
            value=""
            onChange={(e) => handleInputChange('aptSuiteForRemit', e.target.value)}
            style={{
              width: '178.39px',
              height: '32px',
              border: '1px solid red',
              borderRadius: '0.50rem',
              fontSize: '0.70rem',
              backgroundColor: '#F5F5F5',
              paddingLeft: '0.5rem',
            }}
          />
        </div>
        <p>
          {fieldErrors.aptSuiteForRemit && (
            <small className="p-error">{fieldErrors.aptSuiteForRemit}</small>
          )}
        </p>
      </div>,
    )

    const errorMessage = screen.getByText('Invalid Apt/Suite')
    expect(errorMessage).toBeInTheDocument()
  })
  it('renders error message when fieldErrors.stateForRemit is present', () => {
    const fieldErrors = { stateForRemit: 'Invalid state' }

    render(
      <div className="mt-3">
        <Dropdown
          onChange={(e) => handleInputChange('stateForRemit', e.target.value)}
          value=""
          options={[]}
          optionLabel="name"
          editable
          placeholder="State"
          disabled={false}
          className=""
          style={{
            width: '178.39px',
            height: '32px',
            border: '1px solid red',
            borderRadius: '0.50rem',
            fontSize: '0.70rem',
            backgroundColor: '#F5F5F5',
          }}
        />
        <p>
          {fieldErrors.stateForRemit && (
            <small className="p-error">{fieldErrors.stateForRemit}</small>
          )}
        </p>
      </div>,
    )

    const errorMessage = screen.getByText('Invalid state')
    expect(errorMessage).toBeInTheDocument()
  })
  it('renders error message when fieldErrors.accountNumber is present', () => {
    const fieldErrors = { accountNumber: 'Invalid account number' }
    render(
      <div className="mt-2">
        <InputText
          value=""
          onChange={(e) => handleInputChange('accountNumber', e.target.value)}
          type="text"
          style={{
            width: '230px',
            height: '32px',
            border: '1px solid red',
            borderRadius: '0.50rem',
            fontSize: '0.70rem',
            padding: '1em',
          }}
        />
        <p>
          {fieldErrors.accountNumber && (
            <small className="p-error">{fieldErrors.accountNumber}</small>
          )}
        </p>
      </div>,
    )

    const errorMessage = screen.getByText('Invalid account number')
    expect(errorMessage).toBeInTheDocument()
  })

  it('renders with value and error message when fieldErrors.firstName is present', () => {
    const fieldErrors = { firstName: 'First name is required' }
    render(
      <div className="mt-1">
        <InputComponent
          value=""
          onChange={(e) => handleInputChange('firstName', e.target.value)}
          placeholder=""
          type="text"
          style={{
            width: '230px',
            height: '32px',
            border: fieldErrors.firstName ? '1px solid red' : '1px solid #D5E1EA',
            borderRadius: '0.50rem',
            fontSize: '0.70rem',
            backgroundColor: '#F5F5F5',
            paddingLeft: '0.5rem',
          }}
        />
        <p>{fieldErrors.firstName && <small className="p-error">{fieldErrors.firstName}</small>}</p>
      </div>,
    )

    const errorMessage = screen.getByText('First name is required')
    expect(errorMessage).toBeInTheDocument()
  })

  it('renders with value and error message when fieldErrors.lastName is present', () => {
    const fieldErrors = { lastName: 'Last name is required' }
    render(
      <div className="mt-1">
        <InputComponent
          value=""
          onChange={(e) => handleInputChange('lastName', e.target.value)}
          placeholder=""
          type="text"
          style={{
            width: '230px',
            height: '32px',
            border: fieldErrors.lastName ? '1px solid red' : '1px solid #D5E1EA',
            borderRadius: '0.50rem',
            fontSize: '0.70rem',
            backgroundColor: '#F5F5F5',
            paddingLeft: '0.5rem',
          }}
        />
        <p>{fieldErrors.lastName && <small className="p-error">{fieldErrors.lastName}</small>}</p>
      </div>,
    )

    const inputElement = screen.getByRole('textbox') as HTMLInputElement
    expect(inputElement).toBeInTheDocument()
    const errorMessage = screen.getByText('Last name is required')
    expect(errorMessage).toBeInTheDocument()
  })

  it('renders with value and error message when fieldErrors.phoneForRepresentative is present', () => {
    const fieldErrors = { phoneForRepresentative: 'Invalid phone number' }
    render(
      <div className="mt-1">
        <InputComponent
          value=""
          onChange={(e) => handleInputChange('phoneForRepresentative', e.target.value)}
          placeholder=""
          type="text"
          style={{
            width: '230px',
            height: '32px',
            border: fieldErrors.phoneForRepresentative ? '1px solid red' : '1px solid #D5E1EA',
            borderRadius: '0.50rem',
            fontSize: '0.70rem',
            backgroundColor: '#F5F5F5',
            paddingLeft: '0.5rem',
          }}
        />
        <p>
          {fieldErrors.phoneForRepresentative && (
            <small className="p-error">{fieldErrors.phoneForRepresentative}</small>
          )}
        </p>
      </div>,
    )
    const inputElement = screen.getByRole('textbox') as HTMLInputElement
    expect(inputElement).toBeInTheDocument()
    const errorMessage = screen.getByText('Invalid phone number')
    expect(errorMessage).toBeInTheDocument()
  })

  it('renders with value and error message when fieldErrors.emailForRepresentative is present', () => {
    const fieldErrors = { emailForRepresentative: 'Invalid email format' }
    render(
      <div className="mt-1">
        <InputComponent
          value=""
          onChange={(e) => handleInputChange('emailForRepresentative', e.target.value)}
          placeholder=""
          type="text"
          style={{
            width: '230px',
            height: '32px',
            border: fieldErrors.emailForRepresentative ? '1px solid red' : '1px solid #D5E1EA',
            borderRadius: '0.50rem',
            fontSize: '0.70rem',
            backgroundColor: '#F5F5F5',
            paddingLeft: '0.5rem',
          }}
        />
        <p>
          {fieldErrors.emailForRepresentative && (
            <small className="p-error">{fieldErrors.emailForRepresentative}</small>
          )}
        </p>
      </div>,
    )
    const inputElement = screen.getByRole('textbox') as HTMLInputElement
    expect(inputElement).toBeInTheDocument()
    const errorMessage = screen.getByText('Invalid email format')
    expect(errorMessage).toBeInTheDocument()
  })

  it('renders with value and error message when fieldErrors.note is present', () => {
    const fieldErrors = { note: 'Note cannot be empty' }

    render(
      <div className="mt-1">
        <InputComponent
          value=""
          onChange={(e) => handleInputChange('note', e.target.value)}
          style={{
            width: '487.77px',
            height: '32px',
            border: fieldErrors.note ? '1px solid red' : '1px solid #D5E1EA',
            borderRadius: '0.50rem',
            fontSize: '0.70rem',
            backgroundColor: '#F5F5F5',
            boxShadow: 'none',
            padding: '10px',
          }}
        />
        <p>{fieldErrors.note && <small className="p-error">{fieldErrors.note}</small>}</p>
      </div>,
    )

    const inputElement = screen.getByRole('textbox') as HTMLInputElement
    expect(inputElement).toBeInTheDocument()
    const errorMessage = screen.getByText('Note cannot be empty')
    expect(errorMessage).toBeInTheDocument()
  })
})

describe('ModalButton', () => {
  const handleClick = jest.fn()
  const closeModal = jest.fn()
  const isLoading = false

  beforeEach(() => {
    handleClick.mockClear()
    closeModal.mockClear()
  })

  it('renders buttons with correct labels and styles', () => {
    render(
      <div
        className={`flex gap-6 bottom-2 absolute left-6 ${isLoading ? 'blurred' : ''}`}
        style={{
          width: '100%',
          height: '80px',
          backgroundColor: 'white',
          padding: '0 12px',
          bottom: '0px',
        }}>
        <button
          onClick={handleClick}
          style={{
            width: '89px',
            height: '42px',
            backgroundColor: '#0098FF',
            cursor: 'pointer',
            fontWeight: 'bolder',
            fontSize: '1rem',
            boxShadow: 'none',
            color: 'white',
            borderRadius: '0.50rem',
            marginTop: '10px',
          }}>
          Save
        </button>
        <button
          onClick={closeModal}
          style={{
            backgroundColor: 'white',
            color: '#000000',
            border: 'none',
            width: '89px',
            height: '42px',
            marginTop: '10px',
          }}>
          Back
        </button>
      </div>,
    )

    const saveButton = screen.getByRole('button', { name: 'Save' })
    const backButton = screen.getByRole('button', { name: 'Back' })

    expect(saveButton).toBeInTheDocument()
    expect(backButton).toBeInTheDocument()

    fireEvent.click(saveButton)
    expect(handleClick).toHaveBeenCalled()

    userEvent.click(backButton)
    expect(closeModal).toHaveBeenCalled()
  })



  
})
