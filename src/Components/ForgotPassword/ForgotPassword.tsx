import React, { useState } from 'react'
import InputComponent from '../CommonComponent/InputComponent'
import { useNavigate } from 'react-router-dom'
import { ErrorResponseForgotPassword, validateEmailResponse } from '../../Type/ApiTypes'
import { Button } from 'primereact/button'
import { validateUserCredentials } from '../Utils/ValidateUserCredentials'
import { useForgotPasswordMutation } from '../../Services/Authentication/AuthApi'

const ForgotPassword = () => {
  const navigate = useNavigate()
  const navigateToLoginPage = useNavigate()
  const [validateEmail] = useForgotPasswordMutation()
  const [email, setEmail] = useState('')
  const [errors, setErrors] = useState<any>([])

  const validateEmailHandler = async () => {
    const message = validateUserCredentials(email, '', '')
    if (email.length === 0) {
      setErrors('Please enter your Registered Email')
      return
    }
    try {
      const data = await validateEmail({ email }).unwrap()

      const { response, success } = data as validateEmailResponse

      if (success === true) {
        navigate('/resetpass')
      } else {
        setErrors(response)
      }
    } catch (error) {
      const { data } = error as ErrorResponseForgotPassword
      if (data) {
        const errorMessage = data?.response
        console.error('Error:', errorMessage)
        setErrors(errorMessage)
      }
    }
    if (email) {
      setErrors(message)
    }

    setEmail(' ')
  }

  const handleChange = (e: any) => {
    const { value: inputValue } = e.target

    setEmail(inputValue)
  }

  return (
    <>
      <div className="w-full h-screen flex justify-center items-center">
        <div className="text-center">
          <div className="mb-4">
            <div>
              <img
                src="/assets/images/Moorfind.png"
                alt="Logo"
                className="w-full h-64 bg-black mb-5"
              />
            </div>
          </div>

          {errors && (
            <div className="mb-4">
              <span className=" mb-8 text-red-500">{errors}</span>
            </div>
          )}

          <div className="mb-4">
            <div className="p-input-icon-left">
              <InputComponent
                style={{
                  width: '40vw',
                  height: '6vh',
                  padding: '0 3rem',
                  border: '1px solid gray',
                  fontSize: '18px',
                }}
                value={email}
                type="email"
                placeholder="Enter Your Registered email"
                onChange={handleChange}
              />
            </div>
            <div className="flex  mt-8 cursor-pointer ">
              <p className="w-[42vw] text-xs font-bold">
                If you are having trouble logging in, please enter the email address registered with
                MOORFIND. If it is a valid email address, you will be sent an email allowing you to
                resest your password.
              </p>
            </div>
          </div>

          <Button
            style={{
              width: '10vw',
              height: '6vh',
              backgroundColor: 'black',
              color: 'white',
              border: '1px solid black',
              fontWeight: 'bold',
              fontSize: '1.50rem',
            }}
            label={'Submit'}
            onClick={() => {
              validateEmailHandler()
            }}
          />

          <div className="flex justify-center flex-col mt-4">
            <h1 className="cursor-pointer" onClick={() => navigateToLoginPage('/Login')}>
              Back
            </h1>
          </div>

          <div className="flex justify-center ">
            <span className="w-8 h-[0.50px] bg-black text-blue-700 flex justify-center"></span>
          </div>
        </div>
      </div>
    </>
  )
}

export default ForgotPassword
