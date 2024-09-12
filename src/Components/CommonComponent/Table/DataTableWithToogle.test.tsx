
import { render, screen } from '@testing-library/react';
import DataTableWithToogle from './DataTableWithToogle';
describe('DataTableComponent', () => {
    const columns = [
        { field: 'id', header: 'ID', style: { width: '8rem', backgroundColor: "#F2F2F2", fontSize: "0.80rem", color: "black", fontWeight: "bold" } },
        { field: 'name', header: 'Name', expander: undefined, style: { width: '8rem', backgroundColor: "#F2F2F2", fontSize: "0.80rem", color: "black", fontWeight: "bold" } },
        { field: 'noOfBoatYards', header: 'No.of Boatyards', expander: undefined, style: { width: '24rem', backgroundColor: "#F2F2F2", fontSize: "0.80rem", color: "black", fontWeight: "bold" } },
        { field: 'totalMooringInventoried', header: 'Total Mooring Inventoried', expander: undefined, style: { width: '28rem', backgroundColor: "#F2F2F2", fontSize: "0.80rem", color: "black", fontWeight: "bold" } },


    ];

    const data = [{ id: 1, name: 'John Doe' }, { id: 2, name: 'Jane Doe' }];
    it('renders table header', () => {
        render(
            <DataTableWithToogle
                data={data}
                columns={columns}
            />
        );

        columns.forEach((column) => {
            expect(screen.getByText(column.header)).toBeInTheDocument();
        });

        data.forEach((item) => {
            expect(screen.getByText(item.id.toString())).toBeInTheDocument();
            expect(screen.getByText(item.name)).toBeInTheDocument();

        });
    });


});






