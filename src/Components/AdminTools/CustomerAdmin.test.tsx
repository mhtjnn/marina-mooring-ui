import { render, fireEvent, screen } from '@testing-library/react'
import Permission from './CustomerAdmin'
describe('Permission component', () => {
  test('renders header text', () => {
    render(<Permission />)
    const headerText = screen.getByText(/Moormanage\/Permission/i)
    expect(headerText).toBeInTheDocument()
  })
  it('renders add new button', () => {
    render(<Permission />)
    const addButton = screen.getByText(/ADD NEW/i)
    expect(addButton).toBeInTheDocument()
  })
  it('clicking add new button opens modal', () => {
    render(<Permission />)
    const addButton = screen.getByText(/ADD NEW/i)
    fireEvent.click(addButton)
    const modalTitle = screen.getByText(/New User/i)
    expect(modalTitle).toBeInTheDocument()
  })
  it('modal closes when closed button is clicked', () => {
    render(<Permission />)
    const addButton = screen.getByText(/ADD NEW/i)
    fireEvent.click(addButton)

    const modalTitle = screen.getByText(/New User/i)
    expect(modalTitle).toBeInTheDocument()
  })
  test('renders Customers-admins table', () => {
    render(<Permission />)
    const customersAdminsTable = screen.getByText(/Customers-admins/i)
    expect(customersAdminsTable).toBeInTheDocument()
  })
  it('renders Customer-adminUsers table', () => {
    render(<Permission />)
    const customerAdminUsersTable = screen.getByText(/Customer-adminUsers/i)
    expect(customerAdminUsersTable).toBeInTheDocument()
  })
  it('renders Customers-admins table', () => {
    render(<Permission />)
    const customersAdminsHeaderText = screen.getByText(/Customers-admins/i)
    expect(customersAdminsHeaderText).toBeInTheDocument()
  })
  it('renders Customer-adminUsers table', () => {
    render(<Permission />)
    const customerAdminUsersHeaderText = screen.getByText(/Customer-adminUsers/i)
    expect(customerAdminUsersHeaderText).toBeInTheDocument()
  })
  it('renders Customer-adminUsers table', () => {
    render(<Permission />)
    const dataTable = screen.getByTestId('customer-admin-data')
    expect(dataTable).toBeInTheDocument()
  })
  it('renders Customer-adminUsers table', () => {
    render(<Permission />)
    const dataTable = screen.getByTestId('customer-admin-users-table')
    expect(dataTable).toBeInTheDocument()
  })
})
