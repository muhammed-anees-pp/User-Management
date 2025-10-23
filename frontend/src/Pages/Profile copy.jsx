import api from '../api/axios'
import { useDispatch, useSelector } from 'react-redux'
import './Profile.css'
import { logout } from '../store/authSlice'
import { useNavigate } from 'react-router-dom'

function Profile() {
    const { user, loading } = useSelector((state) => state.auth)
    const imageUrl = user.profile_image?.startsWith('http') ? user.profile_image : `http://127.0.0.1:8000${user.profile_image}`
    const dispatch = useDispatch()
    const navigate = useNavigate()

    if (loading && !user){
        return <p>Loading...</p>
    }

    if(!user){
        return <p>User not Found</p>
    }

    const handleLogout = () => {
        dispatch(logout())
        navigate('/login')
    }

  return (
    <div className="profile-container">
            <h1>User Profile</h1>
            <div className="profile-card">
                {user.profile_image && (
                    <img src={imageUrl} alt={user.username} className="profile-img"/>              
                )}
                <h2>{user.username}</h2>
                <p>Email: {user.email}</p>
                <button onClick={handleLogout} className='logout-btn'>Logout</button>
            </div>
        </div>   
  )
}

export default Profile