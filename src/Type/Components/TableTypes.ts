import { ColumnBodyOptions, ColumnHeaderOptions } from 'primereact/column'
import { textColors } from '../../Components/Utils/Properties'
import { CSSProperties } from 'react'
import {
  DataTableExpandedRows,
  DataTableRowData,
  DataTableRowExpansionTemplate,
  DataTableRowToggleEvent,
  DataTableValueArray,
} from 'primereact/datatable'

export type TableBodyType =
  | React.ReactNode
  | ((data?: any, options?: ColumnBodyOptions) => React.ReactNode)

export interface TableColumnProps {
  id: string | undefined
  label: String
  style?: React.CSSProperties | undefined
  body?: TableBodyType
}

export interface DataTableProps {
  data?: any[]
  scrollable?: boolean
  columns: TableColumnProps[]
  tableStyle?: React.CSSProperties | undefined
  style?: React.CSSProperties | undefined
  header?: any
  actionButtons?: ActionButtonColumnProps
}

export interface ButtonProps {
  underline?: boolean
  color?: keyof typeof textColors
  filled?: boolean
  disabled?: boolean
  hidden?: boolean
  onClick?: (data?: any) => void
  label: string
}

// Can be defined single in future
export interface ActionButtonColumnProps {
  headerStyle: CSSProperties | undefined
  header?: React.ReactNode | ((options: ColumnHeaderOptions) => React.ReactNode)
  buttons?: ButtonProps[]
  style?: React.CSSProperties | undefined
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
  columns: RowColumn[]
  expandedRows?: DataTableValueArray | DataTableExpandedRows | undefined
  onRowToggle?(event: DataTableRowToggleEvent): void
}
