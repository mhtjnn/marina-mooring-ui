import React from 'react'
import { Column } from 'primereact/column'
import { DataTable } from 'primereact/datatable'
import { DataTableProps } from '../../../Type/Components/TableTypes'
import DataTableButton from './DataTableButton'

const DataTableComponent: React.FC<DataTableProps> = ({
  data = [],
  scrollable = true,
  columns,
  tableStyle = undefined,
  header,
  actionButtons,
}) => {
  const buttonBody = (rowData: any) => {
    return (
      <div className="flex ">
        <div className={'flex gap-4'}>
          {actionButtons?.buttons?.map((b) => (
            <DataTableButton
              data-testid="custom-element"
              onClick={() => b.onClick && b.onClick(rowData)}
              {...b}></DataTableButton>
          ))}
        </div>
      </div>
    )
  }

  return (
    <div className="card">
      <DataTable value={data} tableStyle={tableStyle} scrollable={scrollable} header={header}>
        {columns.map((d) => (
          <Column key={d.id} style={d.style} field={d.id} header={d.label} body={d.body} />
        ))}
        {actionButtons && (
          <Column
            header={actionButtons?.header}
            body={(rowData) => buttonBody(rowData)}
            style={actionButtons?.style}
            headerStyle={actionButtons?.headerStyle}></Column>
        )}
      </DataTable>
    </div>
  )
}

export default DataTableComponent
