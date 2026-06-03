import React, { useState, useEffect } from 'react';
import { getUserProfile, updateUserProfile, deleteAccount } from '../../services/usersservices';
import { useNavigate, Link } from 'react-router-dom';
import MainLayout from '../../components/publiclayout';
import { createPortal } from 'react-dom'

interface ProfileFormState {
  new_email: string;
  first_name: string;
  last_name: string;
  phone: string;
}

function ProfilePage  ()  {
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
  const handleDeleteAccount =
  async () => {

    try {

      const accountDeletion =  await deleteAccount(password, token || '');
      localStorage.removeItem(
        'token',
      );
      localStorage.removeItem(
        'role',
      );
      navigate('/');
      return accountDeletion
    } catch (error) {
      setError(
        'Incorrect password',
      );
    }
};

//modal that appears when deleting a user account
{showDeleteModal && createPortal (
    <div>

      <h3>Delete Account</h3>

      <p>
        This action cannot be undone.
      </p>

      <input
        type="password"
        placeholder="Enter password"
        value={password}
        onChange={(e) => {
          setPassword(e.target.value);
          setError('');
        }} 
      />

      <button
        onClick={() =>
          setShowDeleteModal(false)
        }
      >
        Cancel
      </button>

      <button
          disabled={!password}
          onClick={handleDeleteAccount}
        >
          Delete Account
      </button>

      {error && (
      <p>{error}</p>
    )}

    </div>,
    document.body
  )
}



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

  const handleSubmit = async (e: React.SubmitEvent) => {
    e.preventDefault();
    const token = localStorage.getItem('token');

    try {
      const response  = await updateUserProfile(formData, token || '')

      if (response) {
        setIsEditing(false); 
        alert('Profile updated successfully!');
      }
    } catch (error) {
      console.error('Update failed:', error);
    }
  };

  console.log(showDeleteModal)

  return (

    <MainLayout>
      <div className="profile-container">
        <h2>User Profile</h2>
        <form onSubmit={handleSubmit}>
          <div>
            <label>Email:</label>
            <input
              type="email"
              name="new_email"
              value={formData.new_email}
              onChange={handleChange}
              disabled={!isEditing} // Fields remain locked until 'Edit' is clicked
            />
          </div>

          <div>
            <label>First Name:</label>
            <input
              type="text"
              name="first_name"
              value={formData.first_name}
              onChange={handleChange}
              disabled={!isEditing}
            />
          </div>

          <div>
            <label>Last Name:</label>
            <input
              type="text"
              name="last_name"
              value={formData.last_name}
              onChange={handleChange}
              disabled={!isEditing}
            />
          </div>

          <div>
            <label>Phone:</label>
            <input
              type="text"
              name="phone"
              value={formData.phone}
              onChange={handleChange}
              disabled={!isEditing}
            />
          </div>
          
          <Link to= "/changepassword">change password?</Link>

          {/* Conditional button rendering based on editing state */}
          {!isEditing ? (
            <button type="button" onClick={() => setIsEditing(true)}>
              Edit Credentials
            </button>
          ) : (
            <>
              <button type="submit">Save Changes</button>
              {/* Toggles editing mode back off if user clicks Cancel */}
              <button type="button" onClick={() => setIsEditing(false)}>
                Cancel
              </button>
            </>
          )}

          

          <button
              type="button"
              onClick={(e) => {
                  e.preventDefault(); // Stop any parent form submissions
                  setShowDeleteModal(true);
                }}
               >
              Delete Account
        </button>
        <p>Debug Status: {showDeleteModal ? "MODAL IS TRUE" : "MODAL IS FALSE"}</p>
        </form>
      </div>
    </MainLayout>
  );
};

export default ProfilePage;