import { render, screen, waitFor } from '@testing-library/react'
import Technicians from './Technicians'
import { Provider } from 'react-redux'
import { store } from '../../../Store/Store'

describe('Technician Components', () => {
  it('renders Customer component correctly', () => {
    render(
      <Provider store={store}>
        <Technicians />
      </Provider>,
    )
    expect(screen.getByText('MOORMANAGE/Technicians')).toBeInTheDocument()
  })

  it('should render the text in the TechnicianPage', () => {
    render(
      <Provider store={store}>
        <Technicians />
      </Provider>,
    )
    expect(screen.getByText('Filter order by Date')).toBeInTheDocument()
  })

  it('renders BiCalendarAlt components ', () => {
    render(
      <Provider store={store}>
        <Technicians />
      </Provider>,
    )
    const timeline = screen.getByTestId('BiCalendarAlt')

    expect(timeline).toBeInTheDocument()
  })

  it('renders BiCalendarAlt components ', () => {
    render(
      <Provider store={store}>
        <Technicians />
      </Provider>,
    )
    const timeline2 = screen.getByTestId('BiCalendarAltTwo')
    expect(timeline2).toBeInTheDocument()
  })

  it('renders ProgressSpinner in the  components ', () => {
    render(
      <Provider store={store}>
        <Technicians />
      </Provider>,
    )
    const progress = screen.getByTestId('progress')
    expect(progress).toBeInTheDocument()
  })

  it('renders ProgressSpinner in the  components ', () => {
    render(
      <Provider store={store}>
        <Technicians />
      </Provider>,
    )
    const progress = screen.getByTestId('progressTwo')
    expect(progress).toBeInTheDocument()
  })

  it('should renders InputTextWithHeader', () => {
    render(
      <Provider store={store}>
        <Technicians />
      </Provider>,
    )

    const toCalendar = screen.getByPlaceholderText('Search by name, ID...')
    expect(toCalendar).toBeInTheDocument()
  })

  it('should renders TechnicainDataTable components ', () => {
    render(
      <Provider store={store}>
        <Technicians />
      </Provider>,
    )
    const technician = screen.getByTestId('technician-data')
    expect(technician).toBeInTheDocument()
  })

  it('should renders TechnicainDataTable paginator  ', () => {
    render(
      <Provider store={store}>
        <Technicians />
      </Provider>,
    )
    const technician = screen.getByTestId('Paginator')
    expect(technician).toBeInTheDocument()
  })


  it('should renders TechnicainDataTable paginator  ', () => {
    render(
      <Provider store={store}>
        <Technicians />
      </Provider>,
    )
    const technician = screen.getByTestId('PaginatorOne')
    expect(technician).toBeInTheDocument()
  })

  it('should renders WorkOrderDataTable paginator  ', () => {
    render(
      <Provider store={store}>
        <Technicians />
      </Provider>,
    )
    const technician = screen.getByTestId('Paginator')
    expect(technician).toBeInTheDocument()
  })

  it('renders Technicians component and checks TechnicianTableColumn configuration', () => {
    render(
      <Provider store={store}>
        <Technicians />
      </Provider>,
    )

    // Check the columns configuration
    const columnHeaders = ['ID', 'Technicians Name', 'Open Work Orders', 'Completed Jobs']

    columnHeaders.forEach((header) => {
      const columnElements = screen.getAllByText(header)
      expect(columnElements.length).toBeGreaterThan(0)

      columnElements.forEach((element) => {
        expect(element).toBeInTheDocument()
      })
    })
  })

  it('renders WorkOrders component and checks WorkOrdersColumn configuration', () => {
    render(
      <Provider store={store}>
        <Technicians />
      </Provider>,
    )

    // Check the columns configuration
    const columnHeaders = ['ID', 'Mooring', 'Customer Name', 'Due Date']

    columnHeaders.forEach((header) => {
      const columnElements = screen.getAllByText(header)
      expect(columnElements.length).toBeGreaterThan(0)

      columnElements.forEach((element) => {
        expect(element).toBeInTheDocument()
      })
    })
  })

  test('renders SelectButton with options', async () => {
    render(
      <Provider store={store}>
        <Technicians />
      </Provider>,
    )

    await waitFor(() => {
      const selectButton = screen.getByTestId('selectButton')
      expect(selectButton).toBeInTheDocument()
    })
  })

  test('renders DataTable WorkOrder', async () => {
    render(
      <Provider store={store}>
        <Technicians />
      </Provider>,
    )

    await waitFor(() => {
      const selectButton = screen.getByTestId('workOrder')
      expect(selectButton).toBeInTheDocument()
    })
  })




})
