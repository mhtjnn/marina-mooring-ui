import { Button } from 'primereact/button'
import { Password } from 'primereact/password'
import { ProgressSpinner } from 'primereact/progressspinner'
import React, { useEffect, useRef, useState } from 'react'
import { useUpdateUserMutation } from '../../Services/AdminTools/AdminToolsApi'
import { ResetModalProps } from '../../Type/ComponentBasedType'
import { ErrorResponse, ResetPasswordResponse, SaveUserResponse } from '../../Type/ApiTypes'
import { Toast } from 'primereact/toast'
import { useResetPasswordMutation } from '../../Services/Authentication/AuthApi'

const ResetPassword: React.FC<ResetModalProps> = ({
  isResetModalOpen,
  customerId,
  isLoggedInUser,
}) => {
  const [isLoading, setIsLoading] = useState(false)
  const [editCustomer] = useUpdateUserMutation()
  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [errorMessage, setErrorMessage] = useState<string>()
  const [firstErrorField, setFirstErrorField] = useState('')
  const [fieldErrors, setFieldErrors] = useState<{ [key: string]: string }>({})
  const toastRef = useRef<Toast>(null)
  const tokenFromUrl = localStorage.getItem('token')
  const [resetPassword] = useResetPasswordMutation()
  const [passwordCriteria, setPasswordCriteria] = useState({
    uppercase: false,
    lowercase: false,
    number: false,
    specialChar: false,
    length: false,
  })

  const validatePassword = (password: string) => {
    const hasUppercase = /[A-Z]/.test(password)
    const hasLowercase = /[a-z]/.test(password)
    const hasNumber = /\d/.test(password)
    const hasSpecialChar = /[@$!%*?&]/.test(password)
    const hasMinLength = password.length >= 10

    setPasswordCriteria({
      uppercase: hasUppercase,
      lowercase: hasLowercase,
      number: hasNumber,
      specialChar: hasSpecialChar,
      length: hasMinLength,
    })

    return hasUppercase && hasLowercase && hasNumber && hasSpecialChar && hasMinLength
  }

  const validateFields = () => {
    const errors: { [key: string]: string } = {}
    let firstError = ''
    if (!password) errors.password = 'Password is required'
    if (errors.password && !firstError) firstError = 'password'
    if (!confirmPassword) errors.confirmPassword = 'Confirm Password is required'
    if (password !== confirmPassword) errors.confirmPassword = 'Passwords do not match'
    if (errors.confirmPassword && !firstError) firstError = 'confirmPassword'
    setFirstErrorField(firstError)
    return errors
  }

  const handleInputChange = (fieldName: string, value: any) => {
    switch (fieldName) {
      case 'password':
        setPassword(value)
        setErrorMessage('')
        validatePassword(value)
        handleFocus()
        break
      case 'confirmPassword':
        setConfirmPassword(value)
        break
      default:
        break
    }
    setFieldErrors((prevErrors) => ({ ...prevErrors, [fieldName]: '' }))
  }
  const handleBlur = () => {
    const passwordMessage = document.getElementById('password-message')
    if (passwordMessage) passwordMessage.style.display = 'none'
  }
  const handleFocus = () => {
    const passwordMessage = document.getElementById('password-message')
    if (passwordMessage) {
      passwordMessage.style.display = 'block'
      passwordMessage.scrollIntoView({ behavior: 'smooth' })
    }
  }

  const handleResetPassword = async () => {
    const errors = validateFields()
    if (Object.keys(errors).length > 0) {
      setFieldErrors(errors)
      return
    }
    setIsLoading(true)
    const resetPassPayload = {
      newPassword: btoa(password), // Encoding password using btoa
      confirmPassword: btoa(password),
    }
    setIsLoading(true)
    try {
      const response = await resetPassword({
        token: tokenFromUrl,
        payload: resetPassPayload,
      }).unwrap()
      const { status, message } = response as ResetPasswordResponse
      if (status === 200) {
        setIsLoading(false)
        toastRef?.current?.show({
          severity: 'success',
          summary: 'Success',
          detail: message,
          life: 3000,
        })
        isResetModalOpen()
      } else {
        setIsLoading(false)
        toastRef?.current?.show({
          severity: 'error',
          summary: 'Error',
          detail: message,
          life: 3000,
        })
      }
    } catch (error: any) {
      setIsLoading(false)
      console.error('Error occurred during password reset:', error)
    }
  }

  const handleSave = async () => {
    const errors = validateFields()
    if (Object.keys(errors).length > 0) {
      setFieldErrors(errors)
      return
    }
    setIsLoading(true)
    const encodedPassword = btoa(password)
    try {
      const editUserPayload = {
        password: encodedPassword,
        confirmPassword: encodedPassword,
        firstName: customerId?.firstName,
        lastName: customerId?.lastName,
        email: customerId.email,
      }

      const response = await editCustomer({
        payload: editUserPayload,
        id: customerId?.id,
      }).unwrap()
      const { status, message } = response as SaveUserResponse
      if (status === 200 || status === 201) {
        setIsLoading(false)
        toastRef?.current?.show({
          severity: 'success',
          summary: 'Success',
          detail: 'Password Updated Successfully!!!',
          life: 3000,
        })
        isResetModalOpen()
      } else {
        setIsLoading(false)
        toastRef?.current?.show({
          severity: 'error',
          summary: 'Error',
          detail: message,
          life: 3000,
        })
      }
    } catch (error) {
      const { message, data } = error as ErrorResponse
      setIsLoading(false)
      toastRef?.current?.show({
        severity: 'error',
        summary: 'Error',
        detail: message || data?.message,
        life: 3000,
      })
    }
  }

  return (
    <>
      <Toast ref={toastRef} />
      <div
        className={`bg-white rounded-xl p-8  left-420 gap-6 h-auto ${isLoading ? 'blur-screen' : ''}`}>
        <div className="flex flex-col items-center">
          <div className="p-input-icon-left">
            <div>
              <div
                className="card flex justify-content-center"
                style={{ position: 'relative', width: '100%' }}>
                <Password
                  type={'text'}
                  name="password"
                  value={password}
                  onChange={(e) => handleInputChange('password', e.target.value)}
                  //    onKeyUp={handleKeyUp}
                  onBlur={handleBlur}
                  feedback={false}
                  toggleMask
                  disabled={isLoading}
                  placeholder={isLoading ? 'Loading...' : 'New Password'}
                  style={{
                    padding: '0 2rem 0 3rem',
                    border:
                      fieldErrors.password || errorMessage ? '1px solid red' : '1px solid #D5E1EA',
                    fontSize: '18px',
                    color: '#00426F',
                    borderRadius: '10px',
                    width: '500px',
                    height: '60px',
                  }}
                />
                <img
                  src="/assets/images/key.png"
                  alt="Key Icon"
                  className="p-clickable"
                  style={{
                    position: 'absolute',
                    left: '13px',
                    top: '55%',
                    transform: 'translateY(-50%)',
                    width: '22px',
                    height: '20px',
                    pointerEvents: 'none',
                  }}
                />
              </div>
              <p className=" w-48" id="password">
                {fieldErrors.password || errorMessage ? (
                  <small className="p-error">
                    {fieldErrors.password}
                    {errorMessage}
                  </small>
                ) : (
                  ''
                )}
              </p>
            </div>
            <div
              style={{ width: '230px', fontSize: '14px' }}
              id="password-message"
              className="mt-2 hidden ">
              <h3 className="font-medium text-sm text-[#000000] flex justify-center mr-3">
                PASSWORD MUST CONTAIN:
              </h3>
              <div className="flex items-center gap-6 p-1 mt-2">
                {passwordCriteria.uppercase ? (
                  <img src={'/assets/images/check-mark.png'} alt="icon" className="w-4" />
                ) : (
                  <img src={'/assets/images/close.png'} alt="icon" className="w-3 " />
                )}
                <p
                  className={`password-message-item ${passwordCriteria.uppercase ? 'text-green-500' : 'text-red-500'}`}>
                  At least <span className="font-[500]"> one uppercase letter</span>
                </p>
              </div>

              <div className="flex items-center gap-6 p-1 ">
                {passwordCriteria.lowercase ? (
                  <img src={'/assets/images/check-mark.png'} alt="icon" className="w-4" />
                ) : (
                  <img src={'/assets/images/close.png'} alt="icon" className="w-3 " />
                )}

                <p
                  className={`password-message-item ${passwordCriteria.lowercase ? 'text-green-500' : 'text-red-500'}`}>
                  At least <span className="font-[500]">one lowercase letter</span>
                </p>
              </div>
              <div className="flex items-center gap-6 p-1 ">
                {passwordCriteria.number ? (
                  <img src={'/assets/images/check-mark.png'} alt="icon" className="w-4" />
                ) : (
                  <img src={'/assets/images/close.png'} alt="icon" className="w-3 " />
                )}
                <p
                  className={`password-message-item ${passwordCriteria.number ? 'text-green-500' : 'text-red-500'}`}>
                  At least<span className="font-[500]">one number</span>
                </p>
              </div>

              <div className="flex items-center gap-6 p-1 ">
                {passwordCriteria.specialChar ? (
                  <img src={'/assets/images/check-mark.png'} alt="icon" className="w-4" />
                ) : (
                  <img src={'/assets/images/close.png'} alt="icon" className="w-3 " />
                )}
                <p
                  className={`password-message-item ${passwordCriteria.specialChar ? 'text-green-500' : 'text-red-500'}`}>
                  At least<span className="font-[500]">one special character</span>
                </p>
              </div>
              <div className="flex items-center gap-6 p-1 ">
                {passwordCriteria.length ? (
                  <img src={'/assets/images/check-mark.png'} alt="icon" className="w-4" />
                ) : (
                  <img src={'/assets/images/close.png'} alt="icon" className="w-3 " />
                )}
                <p
                  className={`password-message-item ${passwordCriteria.length ? 'text-green-500' : 'text-red-500'}`}>
                  At least <span className="font-[500]">10 characters</span>
                </p>
              </div>
            </div>
          </div>

          {isLoading && (
            <ProgressSpinner
              style={{
                position: 'absolute',
                top: '50%',
                left: '50%',
                transform: 'translate(-50%, -50%)',
                width: '50px',
                height: '50px',
              }}
              strokeWidth="4"
            />
          )}

          <div className="p-input-icon-left">
            <div
              className="card flex justify-content-center mb-5"
              style={{ position: 'relative', width: '100%' }}>
              <Password
                type={'text'}
                name="password"
                value={confirmPassword}
                onChange={(e) => handleInputChange('confirmPassword', e.target.value)}
                // onKeyUp={handleKeyUp}
                feedback={false}
                toggleMask
                disabled={isLoading}
                placeholder={isLoading ? 'Loading...' : 'Confirm Password'}
                style={{
                  padding: '0 2rem 0 3rem',
                  border: fieldErrors.confirmPassword ? '1px solid red' : '1px solid #D5E1EA',
                  fontSize: '18px',
                  color: '#00426F',
                  borderRadius: '10px',
                  width: '500px',
                  height: '60px',
                  marginTop: '2rem',
                }}
              />
              <img
                src="/assets/images/key.png"
                alt="Key Icon"
                className="p-clickable"
                style={{
                  position: 'absolute',
                  left: '13px',
                  top: '70%',
                  transform: 'translateY(-50%)',
                  width: '22px',
                  height: '20px',
                  pointerEvents: 'none',
                }}
              />
            </div>
            {fieldErrors.confirmPassword && (
              <small className="p-error" id="confirmPassword">
                {fieldErrors.confirmPassword}
              </small>
            )}
          </div>
        </div>
      </div>
      <div
        className="flex gap-6 bottom-2 absolute left-7"
        style={{
          width: '100%',
          height: '80px',
          backgroundColor: 'white',
          padding: '0 12px',
          bottom: '0px',
        }}>
        <Button
          onClick={() => {
            isLoggedInUser ? handleResetPassword() : handleSave()
          }}
          label={'Save'}
          style={{
            width: '100px',
            height: '42px',
            border: 'none',
            backgroundColor: '#007bff',
            color: 'white',
            borderRadius: '0.50rem',
            marginTop: '10px',
          }}
        />
        <Button
          onClick={() => {
            isResetModalOpen()
          }}
          label={'Back'}
          text={true}
          style={{
            backgroundColor: 'white',
            color: '#000000',
            border: 'none',
            width: '89px',
            height: '42px',
            marginTop: '10px',
          }}
        />
      </div>
    </>
  )
}

export default ResetPassword
