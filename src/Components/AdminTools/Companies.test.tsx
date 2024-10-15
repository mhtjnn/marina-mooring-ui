import { render, fireEvent, screen } from '@testing-library/react'
import { Provider } from 'react-redux'
import { store } from '../../Store/Store'
import { ReactNode } from 'react'
import { JSX } from 'react/jsx-runtime'
// import Companies from './Companies'
import CustomerOwner from './Companies'

// import { render } from "@testing-library/react";

const renderWithProvider = (
  ui: string | number | boolean | JSX.Element | Iterable<ReactNode> | null | undefined,
) => {
  return render(<Provider store={store}>{ui}</Provider>)
}

const columnStyle = {
  borderBottom: '1px solid #D5E1EA',
  backgroundColor: '#FFFFFF',
  color: '#000000',
  fontWeight: 700,
}

const customerOwnerTableColumn = [
  {
    id: 'id',
    label: 'ID',
    style: { ...columnStyle, width: '4vw' },
  },
  {
    id: 'name',
    label: 'Name',
    style: { ...columnStyle, width: '10vw' },
  },
  {
    id: 'phoneNumber',
    label: 'Phone',
    style: { ...columnStyle, width: '10vw' },
  },
]

describe('Companies component', () => {
  it('should be render in the Company Page ', () => {
    renderWithProvider(<CustomerOwner />)
    const headerText = screen.getByText(/Moormanage\/Permission/i)
    expect(headerText).toBeInTheDocument()
  })

  // it('renders search input and search icon', () => {
  //   renderWithProvider(<CustomerOwner/>)
  //   const searchInput = screen.getByPlaceholderText('Search by name, ID, phone no....')
  //   expect(searchInput).toBeInTheDocument()
  // })

  // it('updates search input value on change', () => {
  //   renderWithProvider(<CustomerOwner/>)
  //   const searchInput = screen.getByPlaceholderText(
  //     'Search by name, ID, Email, Role, phone no...',
  //   ) as HTMLInputElement
  //   fireEvent.change(searchInput, { target: { value: 'test search' } })
  //   expect(searchInput.value).toBe('test search')
  // })

  // it('renders "ADD NEW" button', () => {
  //   renderWithProvider(<CustomerOwner/>)
  //   const addButton = screen.getByText('ADD NEW')
  //   expect(addButton).toBeInTheDocument()
  // })

  // it('renders modal with header text when "ADD NEW" button is clicked', () => {
  //   renderWithProvider(<CustomerOwner/>)
  //   const addButton = screen.getByText('ADD NEW')
  //   fireEvent.click(addButton)
  //   const modalHeader = screen.getByText('New User')
  //   expect(modalHeader).toBeInTheDocument()
  // })

  // it('renders icon within the "ADD NEW" button', () => {
  //   renderWithProvider(<CustomerOwner />)
  //   const iconImage = screen.getByAltText('icon')
  //   expect(iconImage).toBeInTheDocument()
  //   expect(iconImage).toHaveAttribute('src', '/assets/images/Plus.png')
  //   expect(iconImage).toHaveClass('w-3.8 h-3.8')
  // })

  // it('renders progress Spinner in the component', () => {
  //   renderWithProvider(<CustomerOwner />)
  //   const emptyMessage = screen.getByTestId('progress')
  //   expect(emptyMessage).toBeInTheDocument()
  // })

  // it('renders the Paginator component with correct props and styles', () => {
  //   renderWithProvider(<CustomerOwner />)
  //   const firstPageButton = screen.getByRole('button', { name: /First Page/i })
  //   const prevPageButton = screen.getByRole('button', { name: /Previous Page/i })
  //   const nextPageButton = screen.getByRole('button', { name: /Next Page/i })
  //   const lastPageButton = screen.getByRole('button', { name: /Last Page/i })
  //   expect(firstPageButton).toBeInTheDocument()
  //   expect(prevPageButton).toBeInTheDocument()
  //   expect(nextPageButton).toBeInTheDocument()
  //   expect(lastPageButton).toBeInTheDocument()

  //   const paginator = firstPageButton.closest('div')
  //   expect(paginator).toHaveStyle('position: sticky')
  //   expect(paginator).toHaveStyle('bottom: 0')
  //   expect(paginator).toHaveStyle('z-index: 1')
  //   expect(paginator).toHaveStyle('background-color: white')
  //   expect(paginator).toHaveStyle('border-top: 1px solid #D5E1EA')
  //   expect(paginator).toHaveStyle('padding: 0.5rem')
  //   expect(paginator).toHaveStyle( 'marginBottom:-20px')
  // })

  // it('renders the customer admin data container', () => {
  //   renderWithProvider(<CustomerOwner />)
  //   const container = screen.getByTestId('customerData')
  //   expect(container).toBeInTheDocument()
  // })

  // it('renders the customer admin data container', () => {
  //   renderWithProvider(<CustomerOwner />)
  //   const container = screen.getByTestId('customerDataAdmin')
  //   expect(container).toBeInTheDocument()
  // })

  it('renders headers correctly in DataTable', async () => {
    renderWithProvider(<CustomerOwner />)
    for (const column of customerOwnerTableColumn) {
      const headerElement = await screen.findByText(column.label)
      expect(headerElement).toBeInTheDocument()
    }
  })
})
