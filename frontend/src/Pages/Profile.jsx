import api from '../api/axios'
import { useDispatch, useSelector } from 'react-redux'
import './Profile.css'
import { logout, fetchCurrentUser } from '../store/authSlice'
import { useNavigate } from 'react-router-dom'
import { useState } from 'react'

function Profile() {
    const { user, loading } = useSelector((state) => state.auth)
    const [selectedImage, setSelectedImage] = useState(null)
    const [imagePreview, setImagePreview] = useState(null)
    const [uploadLoading, setUploadLoading] = useState(false)
    const [uploadError, setUploadError] = useState('')
    const dispatch = useDispatch()
    const navigate = useNavigate()

    const imageUrl = user?.profile_image?.startsWith('http') 
        ? user.profile_image 
        : user?.profile_image 
            ? `http://127.0.0.1:8000${user.profile_image}`
            : null

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

    const handleImageChange = (e) => {
        const file = e.target.files[0]
        if (file) {
            // Validate file type and size
            if (!file.type.startsWith('image/')) {
                setUploadError('Please select an image file')
                return
            }
            if (file.size > 5 * 1024 * 1024) { // 5MB limit
                setUploadError('Image size should be less than 5MB')
                return
            }
            setSelectedImage(file)
            setUploadError('')
            // Create preview URL
            const reader = new FileReader()
            reader.onload = (e) => {
                setImagePreview(e.target.result)
            }
            reader.readAsDataURL(file)
        }
    }

    const handleImageUpload = async () => {
        if (!selectedImage) {
            setUploadError('Please select an image first')
            return
        }

        setUploadLoading(true)
        setUploadError('')

        try {
            const formData = new FormData()
            formData.append('profile_image', selectedImage)

            await api.patch('users/me/profile-image/', formData, {
                headers: {
                    'Content-Type': 'multipart/form-data',
                },
            })

            // Refresh user data to get the updated profile image
            dispatch(fetchCurrentUser())
            alert('Profile image updated successfully!')
            setSelectedImage(null)
            setImagePreview(null)

        } catch (error) {
            setUploadError('Failed to upload image. Please try again.')
            console.error('Image upload error:', error)
        } finally {
            setUploadLoading(false)
        }
    }

    const handleRemoveImage = async () => {
        if (!window.confirm('Are you sure you want to remove your profile image?')) {
            return
        }

        try {
            await api.delete('users/me/profile-image/')
            // Refresh user data
            dispatch(fetchCurrentUser())
            alert('Profile image removed successfully!')
        } catch (error) {
            setUploadError('Failed to remove image. Please try again.')
            console.error('Image removal error:', error)
        }
    }

    const handleCancelUpload = () => {
        setSelectedImage(null)
        setImagePreview(null)
        setUploadError('')
    }

    return (
        <div className="profile-container">
            <h1>User Profile</h1>
            <div className="profile-card">
                <div className="profile-image-section">
                    {/* Show preview if available, otherwise show current image or placeholder */}
                    {imagePreview ? (
                        <img src={imagePreview} alt="Preview" className="profile-img preview"/>              
                    ) : imageUrl ? (
                        <img src={imageUrl} alt={user.username} className="profile-img"/>              
                    ) : (
                        <div className="profile-placeholder">
                            No Image
                        </div>
                    )}
                    
                    {/* Show preview indicator */}
                    {imagePreview && (
                        <div className="preview-indicator">
                            Preview - Not Saved Yet
                        </div>
                    )}
                    
                    <div className="profile-image-actions">
                        {!imagePreview ? (
                            // Normal state - no preview (show upload/change button)
                            <>
                                <input 
                                    type="file" 
                                    id="profile-image-input"
                                    accept="image/*"
                                    onChange={handleImageChange}
                                    style={{ display: 'none' }}
                                />
                                <label htmlFor="profile-image-input" className="image-action-btn">
                                    {user.profile_image ? 'Change Photo' : 'Upload Photo'}
                                </label>
                                
                                {user.profile_image && (
                                    <button 
                                        onClick={handleRemoveImage}
                                        className="image-action-btn danger"
                                    >
                                        Remove Photo
                                    </button>
                                )}
                            </>
                        ) : (
                            // Preview state - show save/cancel buttons
                            <>
                                <button 
                                    onClick={handleImageUpload} 
                                    disabled={uploadLoading}
                                    className="image-action-btn primary"
                                >
                                    {uploadLoading ? 'Uploading...' : 'Save Photo'}
                                </button>
                                
                                <button 
                                    onClick={handleCancelUpload}
                                    disabled={uploadLoading}
                                    className="image-action-btn danger"
                                >
                                    Cancel
                                </button>
                            </>
                        )}
                    </div>
                    
                    {selectedImage && !uploadLoading && (
                        <p className="selected-image-name">Selected: {selectedImage.name}</p>
                    )}
                </div>
                
                <h2>{user.username}</h2>
                <p>Email: {user.email}</p>
                {uploadError && <p style={{ color: 'red' }}>{uploadError}</p>}
                <button onClick={handleLogout} className='logout-btn'>Logout</button>
            </div>
        </div>   
    )
}

export default Profile