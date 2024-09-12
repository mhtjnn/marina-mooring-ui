import { useState, useRef } from 'react'
import { useNavigate } from 'react-router-dom'
import { ErrorResponseForgotPassword, validateEmailResponse } from '../../Type/ApiTypes'
import { Button } from 'primereact/button'
import { useForgotPasswordMutation } from '../../Services/Authentication/AuthApi'
import { InputText } from 'primereact/inputtext'
import './ForgotPassword.module.css'
import { ProgressSpinner } from 'primereact/progressspinner'
import { Toast } from 'primereact/toast'

const ForgotPassword = () => {
  const navigateToLoginPage = useNavigate()
  const [validateEmail] = useForgotPasswordMutation()
  const [email, setEmail] = useState('')
  const [errors, setErrors] = useState<any>([])
  const [message, setMessage] = useState<any>([])
  const [isLoading, setIsLoading] = useState(false)
  const toast = useRef<Toast>(null)

  const validateEmailHandler = async () => {
    if (email.length === 0) {
      setErrors('Email cannot be empty ')
      // toast.current?.show({
      //   severity: 'error',
      //   summary: 'Error',
      //   detail: 'Email cannot be empty',
      //   life: 3000,
      // })

      return
    }

    // const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    // if (!emailRegex.test(email.trim())) {
    //   toast.current?.show({
    //     severity: 'error',
    //     summary: 'Error',
    //     detail: 'Invalid email format',
    //     life: 3000,
    //   })
    //   return
    // }

    setIsLoading(true)
    try {
      const data = await validateEmail({ email }).unwrap()
      const { response, success } = data as validateEmailResponse
      if (success === true) {
        setMessage(response)
        setIsLoading(false)
      } else {
        setErrors(response)
      }
    } catch (error) {
      const { data } = error as ErrorResponseForgotPassword
      if (data) {
        const errorMessage = data?.response
        console.error('Error:', errorMessage)
        setErrors(errorMessage)
        setIsLoading(false)
      }
    }
    setEmail(' ')
  }

  const handleChange = (e: any) => {
    const { value: inputValue } = e.target
    setEmail(inputValue)
    setErrors('')
    setMessage('')
  }

  const handleKeyUp = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      validateEmailHandler()
    }
  }
  const handleSubmit = () => {
    validateEmailHandler()
  }

  return (
    <>
      <Toast ref={toast} />
      <div
        className="w-full h-screen flex justify-center items-center"
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

          <div className="flex flex-col justify-center text-center mt-[3rem]">
            {errors && (
              <div className="mb-4">
                <span className="text-red-500 text-sm">{errors}</span>
              </div>
            )}
            {message && (
              <div className="mb-4">
                <span className="text-green-500 text-sm">{message}</span>
              </div>
            )}
            <div className="flex flex-col gap-5">
              <div className="p-input-icon-left relative flex justify-center ">
                <div className="p-input-icon-left relative flex justify-center">
                  <InputText
                    style={{
                      width: '500px',
                      height: '60px',
                      padding: '0 4rem 0 3rem',
                      border: '1px solid #C5D9E0',
                      fontSize: '16px',
                      color: '#00426F',
                      borderRadius: '10px',
                    }}
                    value={email}
                    type="email"
                    placeholder="Enter Your registered email"
                    onChange={handleChange}
                    onKeyUp={handleKeyUp}
                  />
                  <img
                    src="/assets/images/envelope.png"
                    alt="Search Icon"
                    className="p-clickable"
                    style={{
                      position: 'absolute',
                      left: '10px',
                      top: '50%',
                      transform: 'translateY(-50%)',
                      width: '20px',
                      height: '15px',
                      color: '#00426f',
                      fontSize: '900',
                    }}
                  />
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

            <div
              className="flex mt-8 cursor-pointer"
              style={{
                width: '500px',
                height: '72px',
                top: '538px',
                left: ' 470px',
                gap: '0px',
                opacity: '0px',
                color: '#00426F',
                fontSize: '14px',
                lineHeight: '24px',
                textAlign: 'center',
              }}>
              <p>
                If you are having trouble logging in, please enter the email address registered with
                MOORFIND. If it is a valid email address, you will be sent an email allowing you to
                resest your password.
              </p>
            </div>
          </div>
          <div className="flex flex-col items-center mt-20">
            <Button
              style={{
                width: '500px',
                height: '60px',
                top: '687ps',
                gap: '0px',
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
              // onClick={() => {
              //   validateEmailHandler()
              // }}

              onClick={handleSubmit}>
              Submit
            </Button>
            <Button
              style={{
                width: '500px',
                height: '60px',
                padding: '0 4rem 0 3rem',
                fontSize: '22px',
                lineHeight: '25.78px',
                color: '#00426F',
                borderRadius: '10px',
                backgroundColor: '#F2F2F2 ',
                textAlign: 'center',
                display: 'flex',
                fontWeight: '500',
                justifyContent: 'center',
              }}
              className="mt-5"
              onClick={() => navigateToLoginPage('/Login')}>
              Back
            </Button>
          </div>
        </div>
      </div>
    </>
  )
}

export default ForgotPassword
