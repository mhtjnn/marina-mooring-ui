import { ColumnBodyOptions, ColumnHeaderOptions } from 'primereact/column'
import { textColors } from '../../Components/Utils/Properties'
import { CSSProperties } from 'react'
import {
  DataTableExpandedRows,
  DataTableRowClickEvent,
  DataTableRowData,
  DataTableRowExpansionTemplate,
  DataTableRowToggleEvent,
  DataTableSelectionSingleChangeEvent,
  DataTableStateEvent,
  DataTableValueArray,
} from 'primereact/datatable'
import { PaginatorTemplate } from 'primereact/paginator'

export type TableBodyType =
  | React.ReactNode
  | ((data?: any, options?: ColumnBodyOptions) => React.ReactNode)

export interface TableColumnProps {
  className?: string
  id: string
  label?: String
  style?: React.CSSProperties | undefined
  body?: TableBodyType
}

export interface DataTableProps {
  data?: any[]
  rows?: number | undefined;
  first?: number | undefined;
  totalRecords?: number | undefined;
  paginator?: boolean;
  onPage?(event: DataTableStateEvent): void;
  onPage?(event: DataTableStateEvent): void;
  paginatorTemplate?: PaginatorTemplate | undefined;
  scrollable?: boolean
  columns?: TableColumnProps[]
  tableStyle?: React.CSSProperties | undefined
  style?: React.CSSProperties | undefined
  header?: any
  actionButtons?: ActionButtonColumnProps
  onRowClick?: (event: DataTableRowClickEvent) => void
  rowStyle?: (rowData: any) => React.CSSProperties
  selectedRow?: (event: DataTableRowClickEvent) => void
  rowClassName?: (event: DataTableRowClickEvent) => void
  selectionMode?: 'single' | 'radiobutton'
  selection?: any[number]
  metaKeySelection?: boolean | undefined
  onSelectionChange?(event: DataTableSelectionSingleChangeEvent<any>): void
  dataKey?: string
  multiple?: boolean
  emptyMessage?: string | React.ReactNode | ((frozen: boolean) => React.ReactNode) | undefined
  rowsPerPageOptions?: any[]
  sortable?: boolean
}

export interface ButtonProps {
  underline?: boolean
  color?: keyof typeof textColors
  padding?: string
  filled?: boolean
  disabled?: boolean
  hidden?: boolean
  onClick?: (data?: any) => void
  label: string
  fontWeight?: number
  style?: React.CSSProperties | undefined
}

// Can be defined single in future
export interface ActionButtonColumnProps {
  headerStyle: CSSProperties | undefined
  header?: React.ReactNode | ((options: ColumnHeaderOptions) => React.ReactNode)
  buttons?: ButtonProps[]
  style?: React.CSSProperties | undefined
  onRowClick?: (event: DataTableRowClickEvent) => void
}

export interface Order {
  id: string
  productCode: string
  date: string
  amount: number
  quantity: number
  customer: string
  status: string
}

export interface Product {
  id: string
  code: string
  name: string
  description: string
  image: string
  price: number
  category: string
  quantity: number
  inventoryStatus: string
  rating: number
  orders?: Order[]
}

//DataTableWithToogle
export interface RowColumn {
  expander?: boolean | ((data: any, options: ColumnBodyOptions) => boolean)
  field: string
  header: string

  style?: React.CSSProperties
}
export interface RowExpansionDemoProps {
  data: any[]
  rowExpansionTemplate?(
    data: DataTableRowData<any>,
    options: DataTableRowExpansionTemplate,
  ): React.ReactNode
  dataKey?: string | undefined
  tableStyle?: React.CSSProperties
  selectionMode?: 'single' | 'radiobutton'
  columns: RowColumn[]
  selection?: any[number]
  onRowClick?: (event: DataTableRowClickEvent) => void
  rowStyle?: (rowData: any) => React.CSSProperties
  expandedRows?: DataTableValueArray | DataTableExpandedRows | undefined
  onSelectionChange?(event: DataTableSelectionSingleChangeEvent<any>): void
  onRowToggle?(event: DataTableRowToggleEvent): void
  emptyMessage?: string | React.ReactNode | ((frozen: boolean) => React.ReactNode) | undefined
}
