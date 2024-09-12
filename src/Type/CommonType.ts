import { BoatYardData, UserData } from './ApiTypes'

export interface CityProps {
  name: string
  code: string
}

export interface DataProps {
  moorings: BoatYardData[]
}

export interface CustomerData {
  id: string
  name: string
  email: string
  phone: number
}

export interface CustomerProps {
  id: string
  name: string
  phone: string
  email: string
  address: string
}

export interface BillsData {
  id: number
  technician: string
  techniciansName: string
  dueDate: string
}

export interface InitialState {
  token: undefined | string
  userData: UserData | undefined
}

export interface FormFieldsProps {
  label: string
  value?: string
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void
  type?: string
}

export type NullableDateArray = (Date | null)[] | null

export interface Role {
  name: string
}

export interface Country {
  id: number
  name: string
  label: string
}

export interface State {
  id: number
  name: string
  label: string
}

