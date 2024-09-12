import { render, screen } from '@testing-library/react'
import Customer from './Customer'
import { Provider } from 'react-redux'
import { store } from '../../../Store/Store'
import user from '@testing-library/user-event'

describe('Customer Component', () => {
  it('renders Customer component correctly', () => {
    render(
      <Provider store={store}>
        <Customer />
      </Provider>,
    )
    expect(screen.getByText('MOORMANAGE/Customer')).toBeInTheDocument()
  })

  it('should render  inpute  components', async () => {
    render(
      <Provider store={store}>
        <Customer />
      </Provider>,
    )

    const searchInput = screen.getByPlaceholderText(
      /Search by name, ID, mooring no, boat name, phone no.../i,
    )
    expect(searchInput).toBeInTheDocument()
  })

  it('renders headers correctly in DataTable', async () => {
    render(
      <Provider store={store}>
        <Customer />
      </Provider>,
    )

    const headers = ['ID', 'Name', 'Email', 'Phone']

    setTimeout(() => {
      headers.forEach((headerText) => {
        const headerElement = screen.getByText(headerText)
        expect(headerElement).toBeInTheDocument()
      })
    }, 2000)
  })

  it('should render  label text in customerComponents', async () => {
    render(
      <Provider store={store}>
        <Customer />
      </Provider>,
    )

    const searchInput = screen.getByText('ADD NEW')
    expect(searchInput).toBeInTheDocument()
  })

  it('renders Timeline components within specified structure', () => {
    render(
      <Provider store={store}>
        <Customer />
      </Provider>,
    )

    const timeline1 = screen.getByTestId('timeline1')
    const timeline2 = screen.getByTestId('timeline2')

    expect(timeline1).toBeInTheDocument()
    expect(timeline2).toBeInTheDocument()
  })

  it('renders FaCircle components within specified structure', () => {
    render(
      <Provider store={store}>
        <Customer />
      </Provider>,
    )

    const facircle = screen.getByTestId('Facircle')

    expect(facircle).toBeInTheDocument()
  })

  it('should render the text in the customerComponent', () => {
    render(
      <Provider store={store}>
        <Customer />
      </Provider>,
    )

    const facircle = screen.getByText(/Not in Use/i)

    expect(facircle).toBeInTheDocument()
  })

  it('renders FaEdit and RiDeleteBin5Fill components within specified structure', () => {
    render(
      <Provider store={store}>
        <Customer />
      </Provider>,
    )

    const faEdit = screen.getByTestId('FaEdit')
    expect(faEdit).toBeInTheDocument()

    const riDelete = screen.getByTestId('RiDeleteBin5Fill')
    expect(riDelete).toBeInTheDocument()
  })

  it('renders column headers correctly in DataTable', () => {
    render(
      <Provider store={store}>
        <Customer />
      </Provider>,
    )

    const headers = ['ID', 'Mooring Name', 'GPS Coordinate']

    headers.forEach((headerText) => {
      const headerElement = screen.getByText(headerText)
      expect(headerElement).toBeInTheDocument()
    })
  })

  it('test button on click', () => {
    render(
      <Provider store={store}>
        <Customer />
      </Provider>,
    )

    const addButton = screen.getByText('ADD NEW')
    user.click(addButton)

    expect(addButton).toBeInTheDocument()
  })
})
