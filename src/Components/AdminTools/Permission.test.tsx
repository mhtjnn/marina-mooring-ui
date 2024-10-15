import { render, fireEvent, screen } from '@testing-library/react'
import Permission from './Permission'
import { Provider } from 'react-redux'
import { store } from '../../Store/Store'
import { ReactNode } from 'react'
import { JSX } from 'react/jsx-runtime'

const renderWithProvider = (
  ui: string | number | boolean | JSX.Element | Iterable<ReactNode> | null | undefined,
) => {
  return render(<Provider store={store}>{ui}</Provider>)
}

describe('Permission component', () => {
  it('should be render in the Permission Page ', () => {
    renderWithProvider(<Permission />)
    const headerText = screen.getByText(/Moormanage\/Permission/i)
    expect(headerText).toBeInTheDocument()
  })

  it('renders search input and search icon', () => {
    renderWithProvider(<Permission />)
    const searchInput = screen.getByPlaceholderText('Search by name, ID, Role, phone no...')
    expect(searchInput).toBeInTheDocument()
  })

  it('updates search input value on change', () => {
    renderWithProvider(<Permission />)
    const searchInput = screen.getByPlaceholderText(
      'Search by name, ID, Role, phone no...',
    ) as HTMLInputElement
    fireEvent.change(searchInput, { target: { value: 'test search' } })
    expect(searchInput.value).toBe('test search')
  })

  it('renders search icon', () => {
    renderWithProvider(<Permission />)
    const image = screen.getByAltText('Search Icon')
    expect(image).toBeInTheDocument()
    expect(image).toHaveAttribute('src', '/assets/images/Search.svg')
    expect(image).toHaveClass('p-clickable')
  })

  it('renders "ADD NEW" button', () => {
    renderWithProvider(<Permission />)
    const addButton = screen.getByText('ADD NEW')
    expect(addButton).toBeInTheDocument()
  })

  it('renders modal with header text when "ADD NEW" button is clicked', () => {
    renderWithProvider(<Permission />)
    const addButton = screen.getByText('ADD NEW')
    fireEvent.click(addButton)
    const modalHeader = screen.getByText('New User')
    expect(modalHeader).toBeInTheDocument()
  })

  it('renders icon within the "ADD NEW" button', () => {
    renderWithProvider(<Permission />)
    const iconImage = screen.getByAltText('icon')
    expect(iconImage).toBeInTheDocument()
    expect(iconImage).toHaveAttribute('src', '/assets/images/Plus.png')
    expect(iconImage).toHaveClass('w-3.8 h-3.8 mb-0.5')
  })

  it('renders the customer admin data container', () => {
    renderWithProvider(<Permission />)
    const container = screen.getByTestId('customer-admin-data')
    expect(container).toBeInTheDocument()
  })

  it('renders the DataTableComponent with empty message and loading spinner when data is empty and loading', () => {
    renderWithProvider(<Permission />)
    const emptyMessage = screen.getByText('{properties.noDataMessage}')
    expect(emptyMessage).toBeInTheDocument()
    const emptyImage = screen.getByAltText('Empty Data')
    expect(emptyImage).toBeInTheDocument()
    expect(emptyImage).toHaveAttribute('src', '/assets/images/empty.png')
    const loadingSpinner = screen.getByRole('progressbar')
    expect(loadingSpinner).toBeInTheDocument()
  })

  it('renders the Paginator component with correct props and styles', () => {
    renderWithProvider(<Permission />)
    const firstPageButton = screen.getByRole('button', { name: /First Page/i })
    const prevPageButton = screen.getByRole('button', { name: /Previous Page/i })
    const nextPageButton = screen.getByRole('button', { name: /Next Page/i })
    const lastPageButton = screen.getByRole('button', { name: /Last Page/i })
    expect(firstPageButton).toBeInTheDocument()
    expect(prevPageButton).toBeInTheDocument()
    expect(nextPageButton).toBeInTheDocument()
    expect(lastPageButton).toBeInTheDocument()

    const paginator = firstPageButton.closest('div')
    expect(paginator).toHaveStyle('position: sticky')
    expect(paginator).toHaveStyle('bottom: 0')
    expect(paginator).toHaveStyle('z-index: 1')
    expect(paginator).toHaveStyle('background-color: white')
    expect(paginator).toHaveStyle('border-top: 1px solid #D5E1EA')
    expect(paginator).toHaveStyle('padding: 0.5rem')
  })
})
