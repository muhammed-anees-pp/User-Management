import './App.css'
import {BrowserRouter as Router,Routes,Route,Navigate} from 'react-router-dom'
import Login from './Pages/Login'
import Register from './Pages/Register'
import Admin from './Pages/Admin'
import { useEffect, useState } from 'react'
import Homepage from './Pages/Homepage'
import Profile from './Pages/Profile'
import { useDispatch, useSelector } from 'react-redux'
import { fetchCurrentUser } from './store/authSlice'



function App() {
  const { user, loading } = useSelector((state) => state.auth)
  const dispatch = useDispatch()

  useEffect(() => {
    dispatch(fetchCurrentUser())
  },[dispatch])
  
  return (
     <Router>
      <Routes>
        <Route path='/' element={user? (user.is_admin? <Navigate to='/admin' /> : <Homepage/>) : <Navigate to='/login'/>}/>
        <Route path='/login' element={<Login />} />
        <Route path='/register' element={<Register/>} />
        <Route path='/admin' element={user?.is_admin ? <Admin/> : <Navigate to='/' />} />
        <Route path='/profile' element={user? <Profile/> : <Navigate to='/login'/>}/>
      </Routes>
     </Router>
  )
}

export default App
