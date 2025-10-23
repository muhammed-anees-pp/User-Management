import React, { useEffect, useState } from 'react'
import api from '../api/axios'
import { registerUser } from '../store/authSlice'
import { useNavigate } from 'react-router-dom'
import { useDispatch, useSelector } from 'react-redux'

function Register() {
    const [username,setUsername] = useState('')
    const [email,setEmail] = useState('')
    const [password,setPassword] = useState('')
    const [profileImage,setProfileImage] = useState(null)
    const dispatch = useDispatch()
    const navigate = useNavigate()
    const { registerStatus, error, loading } = useSelector((state) => state.auth)

    useEffect(() => {
        if(registerStatus === 'success'){
            alert('User registered! Please Log In.')
            navigate('/login')
        }
    },[registerStatus])

    const handleRegister = (e) => {
        e.preventDefault()

        const formData = new FormData()
        formData.append('username',username)
        formData.append('email',email)
        formData.append('password',password)
        // if(profileImage){
        //     formData.append('profile_image', profileImage)
        // }
        dispatch(registerUser(formData))
        
    }
  return (
    <div className="form-container">
      <h2>Register</h2>
      <form onSubmit={handleRegister}>
        <input type="text" value={username} onChange={(e) => setUsername(e.target.value)} placeholder='Username' />
        <input type="text" value={email} onChange={(e) => setEmail(e.target.value)} placeholder='Email' />
        <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} placeholder='Password' />
        {/* <input type="file" onChange={(e) => setProfileImage(e.target.files[0])} /> */}
        <button type='submit' disabled={loading}>{loading? 'Registering...' : 'Register'}</button>
      </form>
      { error && <p style={{ color:'red'}}>{error}</p>}
      <p>Already Registered? <span className='link' onClick={()=> navigate('/login')}>Login</span></p>
    </div>
    
  )
}

export default Register