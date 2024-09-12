import React from 'react'
import { render } from '@testing-library/react'
import AddBoatyards from './AddBoatyards'

describe('AddBoatyards', () => {
  it('renders input fields with labels', () => {
    const { getByText } = render(
      <AddBoatyards
        customerData={undefined}
        editMode={false}
        closeModal={function (): void {
          throw new Error('Function not implemented.')
        }}
        boatYardData={function (): void {
          throw new Error('Function not implemented.')
        }}
        setModalVisible={function (value: React.SetStateAction<boolean>): void {
          throw new Error('Function not implemented.')
        }}
      />,
    )
    expect(getByText('Boatyard ID')).toBeInTheDocument()
    expect(getByText('Main Contact')).toBeInTheDocument()
    expect(getByText('Email Address')).toBeInTheDocument()
    expect(getByText('Phone')).toBeInTheDocument()
  })

  it('renders datatable with correct headers', () => {
    const { getByText } = render(
      <AddBoatyards
        customerData={undefined}
        editMode={false}
        closeModal={function (): void {
          throw new Error('Function not implemented.')
        }}
        boatYardData={function (): void {
          throw new Error('Function not implemented.')
        }}
        setModalVisible={function (value: React.SetStateAction<boolean>): void {
          throw new Error('Function not implemented.')
        }}
      />,
    )
    expect(getByText('Existing Sites')).toBeInTheDocument()
  })

  it('renders add new button', () => {
    const { getByText } = render(
      <AddBoatyards
        customerData={undefined}
        editMode={false}
        closeModal={function (): void {
          throw new Error('Function not implemented.')
        }}
        boatYardData={function (): void {
          throw new Error('Function not implemented.')
        }}
        setModalVisible={function (value: React.SetStateAction<boolean>): void {
          throw new Error('Function not implemented.')
        }}
      />,
    )
    expect(getByText('ADD NEW')).toBeInTheDocument()
  })

  it('renders save and back buttons', () => {
    const { getByText } = render(
      <AddBoatyards
        customerData={undefined}
        editMode={false}
        closeModal={function (): void {
          throw new Error('Function not implemented.')
        }}
        boatYardData={function (): void {
          throw new Error('Function not implemented.')
        }}
        setModalVisible={function (value: React.SetStateAction<boolean>): void {
          throw new Error('Function not implemented.')
        }}
      />,
    )
    expect(getByText('Save')).toBeInTheDocument()
    expect(getByText('Back')).toBeInTheDocument()
  })

  it('renders plus icon with correct attributes', () => {
    const { getByAltText } = render(
      <AddBoatyards
        customerData={undefined}
        editMode={false}
        closeModal={function (): void {
          throw new Error('Function not implemented.')
        }}
        boatYardData={function (): void {
          throw new Error('Function not implemented.')
        }}
        setModalVisible={function (value: React.SetStateAction<boolean>): void {
          throw new Error('Function not implemented.')
        }}
      />,
    )
    const plusIcon = getByAltText('icon')
    expect(plusIcon).toBeInTheDocument()
    expect(plusIcon).toHaveAttribute('src', '/assets/images/plus.png')
    expect(plusIcon).toHaveClass('w-3 mr-1')
    expect(plusIcon).toHaveStyle('color: black')
    expect(plusIcon).toHaveStyle('font-weight: bolder')
  })
})
