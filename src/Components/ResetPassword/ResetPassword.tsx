import { Button } from 'primereact/button'
import { InputText } from 'primereact/inputtext'
import { useResetPasswordMutation } from '../../Services/Authentication/AuthApi'
import { ResetPasswordResponse } from '../../Type/ApiTypes'
import { useState } from 'react'
import { useNavigate, useSearchParams } from 'react-router-dom'
import { ProgressSpinner } from 'primereact/progressspinner'
import './ResetPassword.css'
import { Toast } from 'primereact/toast'
import { Divider } from 'primereact/divider'
import { Password } from 'primereact/password'

const ResetPassword = () => {
  const [searchParams] = useSearchParams()
  const tokenFromUrl = searchParams.get('token')
  const [resetPassword] = useResetPasswordMutation()
  const [message, setMessage] = useState<string>('')
  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const navigateToLoginPage = useNavigate()
  const [passwordCriteria, setPasswordCriteria] = useState({
    uppercase: false,
    lowercase: false,
    number: false,
    specialChar: false,
    length: false,
  })
  const [isLoading, setIsLoading] = useState(false)

  const handleChange = (e: { target: { name: any; value: any } }) => {
    const { name, value } = e.target
    if (name === 'newPassword') {
      setPassword(value)
      // Check password criteria
      setPasswordCriteria({
        uppercase: /[A-Z]/.test(value),
        lowercase: /[a-z]/.test(value),
        number: /\d/.test(value),
        specialChar: /[!@#$%^&*(),.?":{}|<>]/.test(value),
        length: value.length >= 10,
      })

      // Check if all criteria are met
      const allCriteriaMet = Object.values(passwordCriteria).every((criteria) => criteria)
    } else if (name === 'confirmPassword') {
      setConfirmPassword(value)
    }
  }

  const handleResetPassword = async () => {
    if (!password || !confirmPassword) {
      setMessage('Both password fields are required.')
      return
    }

    if (password !== confirmPassword) {
      setMessage('Passwords do not match.')
      return
    }

    const resetPassPayload = {
      newPassword: btoa(password), // Encoding password using btoa
      confirmPassword: confirmPassword,
    }

    setIsLoading(true)
    try {
      const response = await resetPassword({
        token: tokenFromUrl,
        payload: resetPassPayload,
      }).unwrap()
      const { status, content, message } = response as ResetPasswordResponse
      if (status === 200) {
        setMessage('Password reset successfully.')
        navigateToLoginPage('/Login')
        setIsLoading(false)
      } else {
        setIsLoading(false)
        setMessage(message || 'Password reset failed.')
      }
    } catch (error: any) {
      setIsLoading(false)
      console.error('Error occurred during password reset:', error)
    }
  }

  const footer = (
    <>
      <Divider />
      <span className="mt-2">Suggestions</span>
      <ul className="pl-2 ml-2 mt-0 line-height-3">
        <li>* At least one lowercase</li>
        <li>* At least one uppercase</li>
        <li>* At least one numeric</li>
        <li>* Minimum 8 characters</li>
      </ul>
    </>
  )

  return (
    <>
      <div
        className="w-full h-screen flex justify-center items-center"
        id="message"
        style={{
          backgroundImage: "url('/assets/images/loginBackgroundImage.png')",
          backgroundSize: 'cover',
          backgroundPosition: 'center',
        }}>
        <div className="bg-white rounded-xl p-8 w-600 absolute top-227 left-420 gap-8 h-auto">
          <div className="text-center mt-[1rem]">
            <img
              src="/assets/images/moorfindLogo.png"
              alt="Logo"
              className="mx-auto w-60 h-14 mb-5 "
            />
          </div>
          <div className="flex flex-col justify-center text-center">
            <div className="flex flex-col gap-5 mt-20">
              {message && (
                <div className="flex justify-center">
                  <span className="text-red-500 text-sm break-words max-w-md overflow-wrap-normal">
                    {message}
                  </span>
                </div>
              )}
              <div>
                <div
                  className="card flex justify-content-center"
                  style={{ position: 'relative', width: '100%'}}
                  
                  >
                  <Password
                    placeholder="New Password"
                    name="newPassword"
                    type={'text'}
                    onChange={handleChange}
                    value={password}
                    footer={footer}
                    toggleMask
                    style={{
                      padding: '0 4rem 0 3rem',
                      border: '1px solid #C5D9E0',
                      fontSize: '16px',
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
                      left: '10px',
                      top: '50%',
                      transform: 'translateY(-50%)',
                      width: '20px',
                      height: '20px',
                      pointerEvents: 'none',
                    }}
                  />
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
              <div className="p-input-icon-left relative  flex justify-center">
                <div>
                  <div className="card flex justify-content-center">
                    <Password
                      placeholder="Confirm Password"
                      name="confirmPassword"
                      onChange={handleChange}
                      value={confirmPassword}
                      footer={footer}
                      toggleMask
                      style={{
                        padding: '0 4rem 0 3rem',
                        border: '1px solid #C5D9E0',
                        fontSize: '16px',
                        color: '#00426F',
                        borderRadius: '10px',
                        width: '500px',
                        height: '60px',
                      }}
                    />
                  </div>
                </div>
                <img
                  src="/assets/images/key.png"
                  alt="Key Icon"
                  className="p-clickable"
                  style={{
                    position: 'absolute',
                    left: '10px',
                    top: '50%',
                    transform: 'translateY(-50%)',
                    width: '20px',
                    height: '20px',
                  }}
                />
              </div>
            </div>
          </div>
          <div className="flex flex-col items-center mt-8">
            <Button
              style={{
                width: '500px',
                height: '60px',
                minHeight: '60px',
                padding: '0 4rem 0 3rem',
                border: '1px solid #C5D9E0',
                fontSize: '22px',
                lineHeight: '25.78px',
                color: '#FFFFFF',
                borderRadius: '10px',
                backgroundColor: '#0098FF',
                textAlign: 'center',
                display: 'flex',
                fontWeight: '500',
                justifyContent: 'center',
              }}
              onClick={handleResetPassword}>
              <p>Confirm</p>
            </Button>
            <Button
              style={{
                width: '500px',
                height: '60px',
                top: '20px',
                padding: '0 4rem 0 3rem',
                fontSize: '22px',
                lineHeight: '25.78px',
                color: '#00426F',
                borderRadius: '10px',
                backgroundColor: '#F2F2F2',
                textAlign: 'center',
                display: 'flex',
                fontWeight: '500',
                justifyContent: 'center',
                marginBottom: '30px',
              }}
              onClick={() => navigateToLoginPage('/Login')}>
              <p>Back</p>
            </Button>
          </div>
        </div>
      </div>
    </>
  )
}

export default ResetPassword
