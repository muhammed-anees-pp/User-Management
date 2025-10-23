import React, { useState } from 'react'
import api from '../api/axios'
import { useNavigate } from 'react-router-dom'
import { useDispatch, useSelector } from 'react-redux'
import { loginUser } from '../store/authSlice'

function Login() {
    const [username,setUsername] = useState('')
    const [password,setPassword] = useState('')
    const dispatch = useDispatch()
    const navigate = useNavigate()
    const { user, loading, error } = useSelector((state) => state.auth)

    const handleLogin = async (e) =>{
        e.preventDefault()
        const result = await dispatch(loginUser({ username, password }))
        if (loginUser.fulfilled.match(result)) {
            if (result.payload.is_admin){
                navigate('/admin')
            }else{
                navigate('/')
            }
        }    

    }


  return (
    <div className='form-container'>
      <h2>Login</h2>
      <form onSubmit={handleLogin}>
        <input value={username} onChange={(e) => setUsername(e.target.value)} placeholder='Username' type="text" />
        <input value={password} onChange={(e) => setPassword(e.target.value)} type="password" placeholder='Password'/>
        <button type='submit' disabled={loading}>{loading? 'Logging in..':'Login'}</button>
      </form>
      {error && <p style={{color:'red'}}>{error}</p>}
      <p>Don't Have an acoount? <span className='link' onClick={()=> navigate('/register')}>Register here</span></p>
    </div>
    
  )
}

export default Login