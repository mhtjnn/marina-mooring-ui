import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import './EmployeeManagement.css'

const EmployeeManagement = () => {
  const [user, setUser] = useState('admin')
  const navigate = useNavigate()

  const handleSelect = (e) => {
    setUser(e.target.value)
  }

  const handleClick = () => {
    if (user === 'admin') {
      navigate('/login')
    } else if (user === 'customer') {
      navigate('/login')
    }
  }

  return (
    <div className="main-Container-emp">
      <div className="EmployeeLogin">
        <h1>Employee</h1>
        <select name="" id="" className="select" value={user} onChange={handleSelect}>
          <option value="admin">Admin</option>
          <option value="customer">Customer</option>
        </select>
        <div className="btn">
          <button onClick={handleClick}>Login</button>
        </div>
      </div>
    </div>
  )
}

export default EmployeeManagement
