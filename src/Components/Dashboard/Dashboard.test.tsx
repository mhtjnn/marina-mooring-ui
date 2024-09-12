
import { render, screen } from '@testing-library/react';

import Dashboard from './Dashboard';

describe('Dashboard Component', () => {
    test('renders Dashboard title', () => {
        render(<Dashboard />);
        const titleElement = screen.getByText('Dashboard');
        expect(titleElement).toBeInTheDocument();
    });

    test('renders Boat Data DataTable Header', () => {
        render(<Dashboard />);
        const dataTableElement = screen.getByText('Moorings Due for Service');
        expect(dataTableElement).toBeInTheDocument();
    });


    test('renders Boat Data DataTable Header', () => {
        render(<Dashboard />);
        const dataTableElement = screen.getByText('View All');
        expect(dataTableElement).toBeInTheDocument();
    });


    test('renders DataTable with columns and data', () => {
        render(<Dashboard />);

        const dataTable = screen.getByRole('table');
        expect(dataTable).toBeInTheDocument();

        const idColumnHeader = screen.getByText('ID');
        expect(idColumnHeader).toBeInTheDocument();

     

    });



});
