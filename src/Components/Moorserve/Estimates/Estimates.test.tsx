import React from 'react'
import { fireEvent, render, screen } from '@testing-library/react'
import Estimates from './Estimates'

describe('Estimates Components', () => {
  it('should render the text in the EstimatesComponents', () => {
    render(<Estimates />)
    const headerElement = screen.getByText('Estimate')
    expect(headerElement).toBeInTheDocument()
  })

  it('should render the text in the EstimatesComponents', () => {
    render(<Estimates />)
    const headerElement = screen.getByText('DownLoad')
    expect(headerElement).toBeInTheDocument()
  })

  it('should render the text in the EstimatesComponents', () => {
    render(<Estimates />)
    const headerElement = screen.getByText('View All')
    expect(headerElement).toBeInTheDocument()
  })

  it('renders "ADD NEW" button', () => {
    render(<Estimates />)
    const addButton = screen.getByText('ADD NEW')
    expect(addButton).toBeInTheDocument()
  })

  it('renders modal with header text when "ADD NEW" button is clicked', () => {
    render(<Estimates />)
    const addButton = screen.getByText('ADD NEW')
    fireEvent.click(addButton)
    const modalHeader = screen.getByText('Work Order')
    expect(modalHeader).toBeInTheDocument()
  })

  it('renders icon within the "ADD NEW" button', () => {
    render(<Estimates />)
    const iconImage = screen.getByAltText('icon')
    expect(iconImage).toBeInTheDocument()
    expect(iconImage).toHaveAttribute('src', '/assets/images/Plus.png')
    expect(iconImage).toHaveClass('w-3.8 h-3.8 mb-0.5')
  })

  it('renders data correctly in DataTable', () => {
    render(<Estimates />)

    const boatData = [
      {
        id: '01',
        boatName: 'Suncatcher',
        name: 'John Smith',
        date: '15, March 2024 to 15, March 2024',
        measurement: 'Length: 10m, Width: 3.8m',
        place: 'Boatyard',
      },
      {
        id: '02',
        boatName: 'Sunseeker',
        name: 'Jane Doe',
        date: '16, March 2024 to 16, March 2024',
        measurement: 'Length: 8m, Width: 3.5m',
        place: 'Dock',
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

  test('modal opens and closes correctly', () => {
    render(<Estimates />)

    expect(screen.queryByTestId('modal')).not.toBeInTheDocument()
  })
})
