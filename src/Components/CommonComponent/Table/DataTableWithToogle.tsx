import React from 'react'
import { DataTable } from 'primereact/datatable'
import { Column } from 'primereact/column'
import { RowExpansionDemoProps } from '../../../Type/Components/TableTypes'
const DataTableWithToogle: React.FC<RowExpansionDemoProps> = ({
  data,
  rowExpansionTemplate,
  dataKey,
  tableStyle,
  columns,
  expandedRows,
  onRowToggle,
}) => {
  const generateRandomKey = () => {
    return Math.random().toString(36).substring(7)
  }
  return (
    <DataTable
      value={data}
      expandedRows={expandedRows}
      onRowToggle={onRowToggle}
      rowExpansionTemplate={rowExpansionTemplate}
      dataKey={dataKey}
      tableStyle={tableStyle}>
      {columns.map((col) => (
        <Column
          key={generateRandomKey()}
          field={col.field}
          header={col.header}
          style={col.style}
          expander={col.expander}
        />
      ))}
    </DataTable>
  )
}

export default DataTableWithToogle
