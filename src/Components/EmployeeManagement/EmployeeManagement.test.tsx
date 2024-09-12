
import { render, screen, fireEvent } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import EmployeeManagement from './EmployeeManagement';

describe('EmployeeManagement Component', () => {
    it('should render the EmployeeManagement component', () => {
        render(
            <BrowserRouter>
                <EmployeeManagement />
            </BrowserRouter>
        );
        const headingElement = screen.getByText(/Employee/i);
        expect(headingElement).toBeInTheDocument();

        const selectElement = screen.getByRole('combobox');
        expect(selectElement).toBeInTheDocument();

        const loginButton = screen.getByRole('button', { name: /Login/i });
        expect(loginButton).toBeInTheDocument();
    });

    it('should navigate to /login when Admin is selected and Login button is clicked', () => {
        render(
            <BrowserRouter>
                <EmployeeManagement />
            </BrowserRouter>
        );

        const selectElement = screen.getByRole('combobox');
        fireEvent.change(selectElement, { target: { value: 'admin' } });

        const loginButton = screen.getByRole('button', { name: /Login/i });
        fireEvent.click(loginButton);

        expect(window.location.pathname).toEqual('/login');
    });

    it('should navigate to /login when Customer is selected and Login button is clicked', () => {
          render(
            <BrowserRouter>
                <EmployeeManagement />
            </BrowserRouter>
        );

        const selectElement =screen.getByRole('combobox');
        fireEvent.change(selectElement, { target: { value: 'customer' } });

        const loginButton =screen.getByRole('button', { name: /Login/i });
        fireEvent.click(loginButton);

        expect(window.location.pathname).toEqual('/login');
    });
});




