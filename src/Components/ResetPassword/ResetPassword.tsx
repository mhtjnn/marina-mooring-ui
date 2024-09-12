import React from 'react'
import LoginForm from '../Login/LoginForm'

const ResetPassword = () => {
  return (
    <div>
      <LoginForm Label={'Confirm'} typeEmail={'password'} typePass={'password'} showSinUp={true} />
    </div>
  )
}

export default ResetPassword
