import { ValidationProps } from '../../Type/ComponentBasedType'

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
