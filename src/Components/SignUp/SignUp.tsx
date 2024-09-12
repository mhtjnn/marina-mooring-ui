import './SignUp.css'
import { FaFacebook } from 'react-icons/fa'
import { FcGoogle } from 'react-icons/fc'
import { Link } from 'react-router-dom'
import { SignUpPayload, SignUpResponse } from '../../Type/ApiTypes'
import { useState, ChangeEvent, FormEvent, useRef } from 'react'
import { Toast } from 'primereact/toast'
import { useSignupMutation } from '../../Services/Authentication/AuthApi'

const SignUp = () => {
  const [signupPayload, setSignupPayload] = useState<SignUpPayload>({
    firstname: '',
    lastname: '',
    email: '',
    password: '',
    phoneNumber: '',
  })

  const { firstname, lastname, email, password, phoneNumber } = signupPayload

  const [signup] = useSignupMutation()
  const toast = useRef<any>(undefined)
  const inputChangeHandler = (e: ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setSignupPayload((prevState) => ({
      ...prevState,
      [name]: value,
    }))

    // Validation for email
    if (name === 'email') {
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
      if (!emailRegex.test(value)) {
        toast.current?.show({
          severity: 'error',
          summary: 'Invalid Email',
          detail: 'Please enter a valid email address',
        })
      }
    }

    // Validation for phone number
    if (name === 'phoneNumber') {
      const phoneRegex = /^\d{10}$/
      if (!phoneRegex.test(value)) {
        toast.current?.show({
          severity: 'error',
          summary: 'Invalid Phone Number',
          detail: 'Please enter a valid 10-digit phone number',
        })
      }
    }
  }

  const signUpHandler = async (e: FormEvent) => {
    e.preventDefault()
    try {
      const response = await signup(signupPayload)
      const { data } = response as SignUpResponse
      if (data?.status === 200) {
        setSignupPayload({
          firstname: '',
          lastname: '',
          email: '',
          password: '',
          phoneNumber: '',
        })
        toast.current?.show({
          severity: 'success',
          summary: data.message,
        })
      }
    } catch (error) {
      console.error('Error occurred during signup:', error)
    }
  }

  return (
    <div className="main-container">
      <form onSubmit={signUpHandler}>
        <div className="container">
          <div className="signUp_Form">
            <h1>SignUp</h1>
            <div className="input">
              <div className="firstName">
                <input
                  type="text"
                  placeholder="First Name"
                  name="firstname"
                  value={firstname}
                  required
                  onChange={inputChangeHandler}
                />
              </div>
              <div className="lastName">
                <input
                  type="text"
                  placeholder="Last Name"
                  name="lastname"
                  value={lastname}
                  required
                  onChange={inputChangeHandler}
                />
              </div>
              <div className="contact">
                <input
                  type="text"
                  placeholder="Contact No."
                  name="phoneNumber"
                  value={phoneNumber}
                  required
                  onChange={inputChangeHandler}
                />
              </div>
              <div className="text">
                <input
                  type="email"
                  placeholder="Email"
                  id="email"
                  name="email"
                  value={email}
                  required
                  onChange={inputChangeHandler}
                />
              </div>
              <div className="password">
                <input
                  type="password"
                  placeholder="Password"
                  value={password}
                  name="password"
                  required
                  onChange={inputChangeHandler}
                />
              </div>
            </div>
            <div className="signUp-btn">
              <button type="submit">SignUp</button>
              <p style={{ fontSize: '0.90rem' }}>
                Already have an account?
                <Link to="/login">
                  {' '}
                  <span style={{ color: 'blue', cursor: 'pointer' }}>Login</span>
                </Link>
              </p>
            </div>
            <div className="other">
              <hr />
            </div>
            <div className="btn-Container">
              <div className="btn-facebook">
                <button>
                  <div className="iconFacebook">
                    <FaFacebook fontSize={20} />
                    <span style={{ marginLeft: '4rem' }}>Login with Facebook</span>
                  </div>
                </button>
              </div>
              <div className="btn-google">
                <button>
                  <div className="iconGoogle">
                    <FcGoogle fontSize={20} />
                    <span style={{ marginLeft: '4rem' }}>Login with Google</span>
                  </div>
                </button>
              </div>
            </div>
          </div>
        </div>
      </form>
      <Toast ref={toast}></Toast>
    </div>
  )
}

export default SignUp
