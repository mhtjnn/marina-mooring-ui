import LoginForm from './LoginForm'

const LoginMain = () => {
  const Label = 'Login'
  const typeEmail = 'email'
  const typePass = 'password'

  return (
    <div>
      <LoginForm Label={Label} showSinUp={false} typeEmail={typeEmail} typePass={typePass} />
    </div>
  )
}

export default LoginMain
