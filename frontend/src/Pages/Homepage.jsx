import React from 'react'
import { useNavigate } from 'react-router-dom'

function Homepage() {
    const navigate = useNavigate()
  return (
    <div className='home-container'>
        <h1>Welcome to Homepage</h1>
        <button onClick={()=> navigate('/profile')}>View Profile</button>
    </div>
  )
}

export default Homepage