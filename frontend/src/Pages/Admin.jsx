import React, {useEffect, useState} from 'react'
import api from '../api/axios'
import { useDispatch, useSelector } from 'react-redux'
import { fetchAllUsers } from '../store/authSlice'
import { logout } from '../store/authSlice'
import { useNavigate } from 'react-router-dom'
import './Admin.css'


function Admin() {
    const dispatch = useDispatch()
    const navigate = useNavigate()
    const { allUsers = [], loading, error} = useSelector((state) => state.auth)
    const [showAddForm,setShowAddForm] = useState(false)
    const [newUser,setNewUser] = useState({ username:'', email:'', password:'' })
    const [editUserId,setEditUserId] = useState(null)
    const [editForm, setEditForm] = useState({username:'', email:''})


    useEffect(() => {
        dispatch(fetchAllUsers())
    }, [dispatch])

    const handleAddUser = async (e) => {
      e.preventDefault()
      try {
        await api.post('/users/register/', newUser)
        setNewUser({ username:'', email:'', password:'' })
        dispatch(fetchAllUsers())
      } catch (error) {
        console.error(`Add user failed`, error)
        
      }
      setShowAddForm(false)
    }

    const handleDelete = async (id) => {
      if (!window.confirm('Are you sure you want to delete this User')) return
      try {
        await api.delete(`/users/${id}/`)
        dispatch(fetchAllUsers())
      } catch (error) {
        console.error('Delete Failed',error)
        
      }
    }

    const handleEdit = (user) => {
      setEditUserId(user.id)
      setEditForm({ username: user.username, email: user.email})
    }

    const handleUpdateUser = async (e) => {
      e.preventDefault()
      try {
        await api.patch(`/users/${editUserId}/`,editForm)
        setEditUserId(null)
        dispatch(fetchAllUsers())
      } catch (error) {
        console.error('Update Failed', error)
      }
    }

    const handleLogout = () => {
      dispatch(logout())
      navigate('/login')
    }

    if (loading && allUsers.length === 0){
        return <p>Loading..</p>
    }

    if (error){
        return <p style={{ color: 'red' }}>Error: {error}</p>
    }

  return (
    <div className="admin-container">
      <div className='admin-header'>
        <h1>Admin Dashboard</h1>
        <button className='logout-btn' onClick={handleLogout}>Admin Logout</button>
        
      </div>

      <h2>Manage Users</h2>
      <button className='add-user-toggle' onClick={() => setShowAddForm(!showAddForm)}>
        {showAddForm? 'Close':'Add User'}
      </button>

      {showAddForm && (
      <form className="add-user-form" onSubmit={handleAddUser}>
        <input type="text" placeholder='Username' value={newUser.username}
          onChange={(e) => setNewUser({...newUser,username:e.target.value})} required />

        <input type="text" placeholder='Email' value={newUser.email} 
          onChange={(e) => setNewUser( {...newUser,email:e.target.value } )} required />

        <input type="text" placeholder='Password' value={newUser.password}
          onChange={(e)=> setNewUser({...newUser,password:e.target.value})} required />
        <button type='submit' className="submit-user-btn">Save User</button>
      </form>
      )}

      
      
      <table className='user-table'>
        <thead>
          <tr>
            <th>ID</th>
            <th>Profile Image</th>
            <th>Username</th>
            <th>Email</th>
            <th>Admin?</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {allUsers.map(user => (
            <tr key={user.id}>
              <td>{user.id}</td>
              <td>
                {user.profile_image ? (
                  <img
                    src={user.profile_image.startsWith('http') ? user.profile_image : `http://127.0.0.1:8000${user.profile_image}`}
                    alt={user.username}
                    className='profile-img'
                  />
                ) : (
                  'No image'
                )}
              </td>
              <td>
                {editUserId === user.id ? (
                  <input
                    type="text"
                    value={editForm.username}
                    onChange={(e) => setEditForm({ ...editForm, username: e.target.value })}
                  />
                ) : (
                  user.username
                )}
              </td>
              <td>
                {editUserId === user.id ? (
                  <input
                    type="email"
                    value={editForm.email}
                    onChange={(e) => setEditForm({ ...editForm, email: e.target.value })}
                  />
                ) : (
                  user.email
                )}
              </td>
              <td>{user.is_admin ? 'Yes' : 'No'}</td>
              <td>
                {editUserId === user.id ? (
                  <>
                    <button onClick={handleUpdateUser}>Save</button>
                    <button onClick={() => setEditUserId(null)}>Cancel</button>
                  </>
                ) : (
                  <>
                    <button onClick={() => handleEdit(user)}>Edit</button>
                    <button onClick={() => handleDelete(user.id)}>Delete</button>
                  </>
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}


export default Admin