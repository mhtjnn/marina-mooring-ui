
interface ValidationProps {
    firstName: string;
    lastName: string;
    checkedMooring: boolean;
    mooringNumber?: string;
    mooringStatus?: string;
    validationRules: {
      NAME_REGEX: RegExp;
    };
    setFieldErrors: (errors: { [key: string]: string }) => void;
    setFirstErrorField: (field: string) => void;
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
    const errors: { [key: string]: string } = {};
    let firstError = '';
    const { NAME_REGEX } = validationRules;
    if (!firstName) {
      errors.firstName = 'First name is required';
      firstError = 'firstName';
    } else if (!NAME_REGEX.test(firstName)) {
      errors.firstName = 'First name must only contain letters';
      firstError = 'firstName';
    } else if (firstName.length < 3) {
      errors.firstName = 'First name must be at least 3 characters long';
      firstError = 'firstName';
    }
    if (!lastName) {
      errors.lastName = 'Last name is required';
      if (!firstError) firstError = 'lastName';
    } else if (!NAME_REGEX.test(lastName)) {
      errors.lastName = 'Last name must only contain letters';
      firstError = 'lastName';
    } else if (lastName.length < 3) {
      errors.lastName = 'Last name must be at least 3 characters long';
      firstError = 'lastName';
    }
    if (checkedMooring) {
      if (!mooringNumber) {
        errors.mooringNumber = 'Mooring Number is required';
      }
      if (!mooringStatus) {
        errors.mooringStatus = 'Mooring Status is required';
      }
    }
    setFirstErrorField(firstError);
    setFieldErrors(errors);
  
    return errors;
  };




  export const formatDate = (date: any) => {
    if (!date) return null
    const d = new Date(date)
    const month = ('0' + (d.getMonth() + 1)).slice(-2)
    const day = ('0' + d.getDate()).slice(-2)
    const year = d.getFullYear()
    return `${month}/${day}/${year}`
  }



  