
import { render, screen } from '@testing-library/react';
import DataTableComponent from './DataTableComponent';



describe('DataTableComponent', () => {
    const columns = [
        { id: 'id', label: 'ID', },
        { id: 'name', label: 'Name', },
    ];

    const actionButtons = {
        header: 'Actions',
        buttons: [{ label: 'Action 1', onClick: jest.fn() }],
        style: {},
        headerStyle: {},
    };

    const data = [{ id: 1, name: 'John Doe' }, { id: 2, name: 'Jane Doe' }];

    it('renders table header', () => {
        render(
            <DataTableComponent
                data={data}
                columns={columns}
                actionButtons={actionButtons}
                header="Table Header"
            />
        );

        
        expect(screen.getByText('Table Header')).toBeInTheDocument();
    });





});
