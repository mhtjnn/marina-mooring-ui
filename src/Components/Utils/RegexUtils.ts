import { FieldErrors, FormData, ValidationProps } from '../../Type/CommonType'
import { WorkOrderValidationProps } from '../../Type/ComponentBasedType'

export const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
export const PASSWORD_REGEX = /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[a-zA-Z]).{8,}$/
export const NAME_REGEX = /^[a-zA-Z ]+$/
export const NUMBER_REGEX = /^\d+$/
export const PHONE_REGEX = /^.{10}$|^.{12}$/
export const formatPhoneNumber = (value: string) => {
  value = value.replace(/\D/g, '')
  if (value.length <= 3) {
    return value
  } else if (value.length <= 6) {
    return `${value.slice(0, 3)}-${value.slice(3)}`
  } else {
    return `${value.slice(0, 3)}-${value.slice(3, 6)}-${value.slice(6, 10)}`
  }
}
export const validateFields = ({
  firstName,
  lastName,
  checkedMooring,
  mooringNumber,
  mooringStatus,
  validationRules,
  setFieldErrors,
  setFirstErrorField,
}: ValidationProps) => {
  const errors: { [key: string]: string } = {}
  let firstError = ''
  const { NAME_REGEX } = validationRules
  if (!firstName) {
    errors.firstName = 'First name is required'
    firstError = 'firstName'
  } else if (!NAME_REGEX.test(firstName)) {
    errors.firstName = 'First name must only contain letters'
    firstError = 'firstName'
  } else if (firstName.length < 3) {
    errors.firstName = 'First name must be at least 3 characters long'
    firstError = 'firstName'
  }
  if (!lastName) {
    errors.lastName = 'Last name is required'
    if (!firstError) firstError = 'lastName'
  } else if (!NAME_REGEX.test(lastName)) {
    errors.lastName = 'Last name must only contain letters'
    firstError = 'lastName'
  } else if (lastName.length < 3) {
    errors.lastName = 'Last name must be at least 3 characters long'
    firstError = 'lastName'
  }
  if (checkedMooring) {
    if (!mooringNumber) {
      errors.mooringNumber = 'Mooring Number is required'
    }
    if (!mooringStatus) {
      errors.mooringStatus = 'Mooring Status is required'
    }
  }
  setFirstErrorField(firstError)
  setFieldErrors(errors)

  return errors
}

export const validateFieldsForMoorings = (
  formData: FormData,
  setFirstErrorField: (field: string) => void,
  setFieldErrors: (errors: FieldErrors) => void,
): FieldErrors => {
  const alphanumericRegex = /^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d]+$/
  const errors: FieldErrors = {}
  let firstError = ''

  if (!formData.customerName) {
    errors.customerName = 'Customer Name is required'
    if (!firstError) firstError = 'customerName'
  }

  if (!formData.mooringNumber) {
    errors.mooringNumber = 'Mooring Number is required'
    if (!firstError) firstError = 'mooringNumber'
  }
  if (!formData.mooringStatus) {
    errors.mooringStatus = 'Mooring Status is required'
    if (!firstError) firstError = 'mooringStatus'
  }

  setFirstErrorField(firstError)
  setFieldErrors(errors)

  return errors
}

export const workOrderValidateFields = ({
  workOrder,
  setErrorMessage,
}: WorkOrderValidationProps) => {
  const errors: { [key: string]: string } = {}
  if (!workOrder.customerName) {
    errors.customerName = 'Customer Name is required'
  }
  if (!workOrder.workOrderStatus) {
    errors.workOrderStatus = 'Status is required'
  }
  setErrorMessage(errors)
  return errors
}
