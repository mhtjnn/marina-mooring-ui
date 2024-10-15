import React from 'react'
import { fireEvent, render, screen } from '@testing-library/react'
import { Provider } from 'react-redux'
import { store } from '../../../Store/Store'
import Boatyards from './Boatyards'

describe('Boatyards components', () => {
  it('should render text with header', () => {
    render(
      <Provider store={store}>
        <Boatyards />
      </Provider>,
    )
    const textField = screen.getByPlaceholderText('Search by name, ID,address...')
    expect(textField).toBeInTheDocument()
  })

  it('should render the "ADD NEW" button and click it', () => {
    render(
      <Provider store={store}>
        <Boatyards />
      </Provider>,
    )
    const addNewButton = screen.getByText('ADD NEW')
    fireEvent.click(addNewButton)
    expect(addNewButton).toBeInTheDocument()
  })

  it('should render "Mooring Inventoried"', () => {
    render(
      <Provider store={store}>
        <Boatyards />
      </Provider>,
    )
    const textField = screen.getByText('Mooring Inventoried')
    expect(textField).toBeInTheDocument()
  })

  it('should render "Boatyard GPS Coordinates"', () => {
    render(
      <Provider store={store}>
        <Boatyards />
      </Provider>,
    )
    const textField = screen.getByText('Boatyard GPS Coordinates')
    expect(textField).toBeInTheDocument()
  })

  it('should render "123 Elm St"', () => {
    render(
      <Provider store={store}>
        <Boatyards />
      </Provider>,
    )
    const textField = screen.getByText('123 Elm St')
    expect(textField).toBeInTheDocument()
  })

  it('should render the DataTable', () => {
    render(
      <Provider store={store}>
        <Boatyards />
      </Provider>,
    )
    const dataTable = screen.getByTestId('dataTable')
    expect(dataTable).toBeInTheDocument()
  })

  it('should render the custom modal', () => {
    render(
      <Provider store={store}>
        <Boatyards />
      </Provider>,
    )
    const customModal = screen.getByTestId('customModal')
    expect(customModal).toBeInTheDocument()
  })

  it('should render "Boatyards Detail" component', () => {
    render(
      <Provider store={store}>
        <Boatyards />
      </Provider>,
    )
    expect(screen.getByText('Boatyards Detail')).toBeInTheDocument()
  })

  it('should render "Address"', () => {
    render(
      <Provider store={store}>
        <Boatyards />
      </Provider>,
    )
    const textField = screen.getByText('Address')
    expect(textField).toBeInTheDocument()
  })

  it('should render the DataTable with test ID "customer-admin-users-table"', () => {
    render(
      <Provider store={store}>
        <Boatyards />
      </Provider>,
    )
    const dataTable = screen.getByTestId('customer-admin-users-table')
    expect(dataTable).toBeInTheDocument()
  })
})
