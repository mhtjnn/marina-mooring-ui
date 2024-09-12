import { fireEvent, render, screen } from '@testing-library/react'
import Boatyards from './Boatyards'
import { Provider } from 'react-redux'
import { store } from '../../../Store/Store'
describe('Boatyards components', () => {
    it('renderTextWithHeader', () => {
        render(
            <Provider store={store}>
                <Boatyards />
            </Provider>
        )
        const textField = screen.getByPlaceholderText('Search by name, ID,address...')
        expect(textField).toBeInTheDocument()
    })
    it('should render the text in boatyards Component', () => {
        render(
            <Provider store={store}>
                <Boatyards />
            </Provider>
        )
        const addNewButton = screen.getByText('ADD NEW')
        fireEvent.click(addNewButton)
        expect(addNewButton).toBeInTheDocument()
    })
    it('should  render the text in boatyards Component', () => {
        render(
            <Provider store={store}>
                <Boatyards />
            </Provider>
        )
        const textField = screen.getByText('Mooring Inventoried')
        expect(textField).toBeInTheDocument()
    })
    it('should  render the text in boatyards Component', () => {
        render(
            <Provider store={store}>
                <Boatyards />
            </Provider>
        )
        const textField = screen.getByText('Boatyard GPS Coordinates')
        expect(textField).toBeInTheDocument()
    })
    it('should render the text in boatyards Component', () => {
        render(
            <Provider store={store}>
                <Boatyards />
            </Provider>
        )
        const textField = screen.getByText('123 Elm St')
        expect(textField).toBeInTheDocument()
    })
    it('should  render the DataTable in boatyards Component', () => {
        render(
            <Provider store={store}>
                <Boatyards />
            </Provider>
        )
        const textField = screen.getByTestId('dataTable')
        expect(textField).toBeInTheDocument()
    })
    it(' should render the customModal in boatyards Component', () => {
        render(
            <Provider store={store}>
                <Boatyards />
            </Provider>
        )
        const textField = screen.getByTestId('customModal')
        expect(textField).toBeInTheDocument()
    })
    it('should render Boatyards component', () => {
        render(
            <Provider store={store}>
                <Boatyards />
            </Provider>
        )
        expect(screen.getByText('Boatyards Detail')).toBeInTheDocument()
    })
    it('should render the text in boatyards Component', () => {
        render(
            <Provider store={store}>
                <Boatyards />
            </Provider>
        )
        const textField = screen.getByText('Address')
        expect(textField).toBeInTheDocument()
    })
    it('should  render the DataTable in boatyards Component', () => {
        render(
            <Provider store={store}>
                <Boatyards />
            </Provider>
        )
        const textField = screen.getByTestId('customer-admin-users-table')
        expect(textField).toBeInTheDocument()
    })

})
