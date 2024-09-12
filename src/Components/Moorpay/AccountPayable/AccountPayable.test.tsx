import { render, screen } from '@testing-library/react'
import AccountPayable from './AccountPayable'

describe('AccountPayable component', () => {
  it('renders Account Payable header', () => {
    render(<AccountPayable />)
    const headerElement = screen.getByText(/DownLoad Excel/i)
    expect(headerElement).toBeInTheDocument()
  })

  it('should render the text in the AccountPayableComponents', () => {
    render(<AccountPayable />)
    const headerElement = screen.getByText('Account Payable')
    expect(headerElement).toBeInTheDocument()
  })

  it('should render the text in the AccountPayableComponents', () => {
    render(<AccountPayable />)
    const headerElement = screen.getByText('View All')
    expect(headerElement).toBeInTheDocument()
  })

  it('should render the text in the AccountPayableComponents', () => {
    render(<AccountPayable />)
    const headerElement = screen.getByText('Moormanage/Account Payable')
    expect(headerElement).toBeInTheDocument()
  })

  test('renders headers correctly in DataTable', () => {
    render(<AccountPayable />)

    const headers = [
      'invoice',
      'Mooring Number',
      'Customer Name',
      'Technician name',
      'Services',
      'Time',
      'Amount',
      'Actions',
    ]

    headers.forEach((headerText) => {
      const headerElement = screen.getByText(headerText)
      expect(headerElement).toBeInTheDocument()
    })
  })

  test('renders data correctly in DataTable', () => {
    render(<AccountPayable />)

    const boatData = [
      {
        invoice: '#425',
        mooringid: '#6658',
        name: 'John Smith',
        technicianName: 'jim Carry',
        services: 'Regular Services',
        time: '2hrs',
        amount: '$12',
      },
      {
        invoice: '#426',
        mooringid: '#6659',
        name: 'Jane Doe',
        technicianName: 'jimmy Carry',
        services: 'Premium Services',
        time: '1hr',
        amount: '$15',
      },
    ]

    setTimeout(() => {
      boatData.forEach((row) => {
        Object.values(row).forEach((cellText) => {
          const cellElement = screen.getByText(cellText)
          expect(cellElement).toBeInTheDocument()
        })
      })
    }, 2000)
  })
})
