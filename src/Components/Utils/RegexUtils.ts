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

interface ValidationProps {
  firstName: string
  lastName: string
  checkedMooring: boolean
  mooringNumber?: string
  mooringStatus?: string
  validationRules: {
    NAME_REGEX: RegExp
  }
  setFieldErrors: (errors: { [key: string]: string }) => void
  setFirstErrorField: (field: string) => void
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
