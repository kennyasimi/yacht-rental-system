import React, { useState, useEffect } from 'react';
import { getUserProfile, updateUserProfile, deleteAccount } from '../../services/usersservices';
import { useNavigate } from 'react-router-dom';
import MainLayout from '../../components/publiclayout';
import { createPortal } from 'react-dom'

interface ProfileFormState {
  new_email: string;
  first_name: string;
  last_name: string;
  phone: string;
}

function ProfilePage() {
  const [isEditing, setIsEditing] = useState<boolean>(false);
  const [formData, setFormData] = useState<ProfileFormState>({
    new_email: '',
    first_name: '',
    last_name: '',
    phone: '',
  });
  const token = localStorage.getItem('token');
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleDeleteAccount = async () => {
    try {
      const accountDeletion = await deleteAccount(password, token || '');
      localStorage.removeItem('token');
      localStorage.removeItem('role');
      navigate('/');
      return accountDeletion
    } catch (error) {
      setError('Incorrect password');
    }
  };

  //modal that appears when deleting a user account
  const renderDeleteModal = () => {
    if (!showDeleteModal) return null;
    
    return createPortal(
      <div className="modal-overlay" onClick={() => setShowDeleteModal(false)}>
        <div className="modal-container delete-modal" onClick={(e) => e.stopPropagation()}>
          <h3 className="modal-title">Delete Account</h3>
          <p className="modal-message">This action cannot be undone.</p>
          
          <div className="form-group">
            <input
              type="password"
              placeholder="Enter password"
              value={password}
              onChange={(e) => {
                setPassword(e.target.value);
                setError('');
              }}
              className="form-input"
            />
          </div>
          
          <div className="modal-actions">
            <button 
              onClick={() => setShowDeleteModal(false)}
              className="btn btn-secondary"
            >
              Cancel
            </button>
            <button
              disabled={!password}
              onClick={handleDeleteAccount}
              className="btn btn-danger"
            >
              Delete Account
            </button>
          </div>
          
          {error && <p className="error-message">{error}</p>}
        </div>
      </div>,
      document.body
    );
  };

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const data = await getUserProfile(token!);
        setFormData({
          new_email: data.email || '', 
          first_name: data.first_name || '',
          last_name: data.last_name || '',
          phone: data.phone || '',
        });
      } catch (error) {
        console.error('Failed to load profile:', error);
      }
    };
    
    fetchUserData();
  }, []); 

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const token = localStorage.getItem('token');

    try {
      const response = await updateUserProfile(formData, token || '');
      if (response) {
        setIsEditing(false); 
        alert('Profile updated successfully!');
      }
    } catch (error) {
      console.error('Update failed:', error);
    }
  };

  return (
    <MainLayout>
      <div className="profile-page">
        <div className="profile-container">
          <div className="profile-header">
            <h1 className="profile-title">User Profile</h1>
            <p className="profile-subtitle">Manage your personal information</p>
          </div>

          <div className="profile-grid">
            {/* Sidebar */}
            <div className="profile-sidebar">
              <h3 className="profile-name">
                {formData.first_name} {formData.last_name}
              </h3>

              
            </div>

            {/* Profile Form */}
            <div className="profile-content">
              <div className="profile-info-card">
                <div className="profile-info-header">
                  <h2 className="profile-info-title">Personal Information</h2>
                  
                </div>

                <form onSubmit={handleSubmit} className="profile-edit-form">
                  <div className="form-group">
                    <label className="form-label">Email:</label>
                    <input
                      type="email"
                      name="new_email"
                      value={formData.new_email}
                      onChange={handleChange}
                      disabled={!isEditing}
                      className="form-input"
                    />
                  </div>

                  <div className="form-group">
                    <label className="form-label">First Name:</label>
                    <input
                      type="text"
                      name="first_name"
                      value={formData.first_name}
                      onChange={handleChange}
                      disabled={!isEditing}
                      className="form-input"
                    />
                  </div>

                  <div className="form-group">
                    <label className="form-label">Last Name:</label>
                    <input
                      type="text"
                      name="last_name"
                      value={formData.last_name}
                      onChange={handleChange}
                      disabled={!isEditing}
                      className="form-input"
                    />
                  </div>

                  <div className="form-group">
                    <label className="form-label">Phone:</label>
                    <input
                      type="text"
                      name="phone"
                      value={formData.phone}
                      onChange={handleChange}
                      disabled={!isEditing}
                      className="form-input"
                    />
                  </div>

                  {/* Conditional button rendering based on editing state */}
                  {isEditing && (
                    <div className="form-actions">
                      <button type="submit" className="btn btn-primary btn-save">
                        Save Changes
                      </button>
                      <button 
                        type="button" 
                        onClick={() => setIsEditing(false)}
                        className="btn btn-secondary"
                      >
                        Cancel
                      </button>
                    </div>
                  )}
                </form>

                {/* Delete Account Section */}
                <div className="profile-delete-section">
                  {!isEditing && (
                    <button 
                      type="button" 
                      onClick={() => setIsEditing(true)}
                      className="btn btn-primary btn-edit"
                    >
                      Edit Profile
                    </button>
                  )}
                  <button  
                    className="btn btn-primary btn-edit"
                    onClick={() => navigate("/changepassword") }
                    >
                    Change Password
                  </button>
                  <button
                    type="button"
                    onClick={() => setShowDeleteModal(true)}
                    className="btn btn-danger btn-delete"
                  >
                    Delete Account
                  </button>
                  <p className="delete-warning">
                    Warning: This action cannot be undone
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      {renderDeleteModal()}
    </MainLayout>
  );
}

export default ProfilePage;